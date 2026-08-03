import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { libsql as client } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const leadDateParam = url.searchParams.get('leadDate') || url.searchParams.get('date');
    const codDateParam = url.searchParams.get('codDate');

    // 1. Fetch Google Sheets metrics for top cards (Sheet1 / gid=0)
    const response = await fetch('https://docs.google.com/spreadsheets/d/1eVxxvP5u5DO1-OJCb3cpPadwXi-GHI27v0qxMAmwTo4/export?format=csv&gid=0', { cache: 'no-store' });
    
    // 1b. Fetch Google Sheets metrics for COD cards (Sheet4 / gid=1176644556)
    const responseSheet4 = await fetch('https://docs.google.com/spreadsheets/d/1eVxxvP5u5DO1-OJCb3cpPadwXi-GHI27v0qxMAmwTo4/export?format=csv&gid=1176644556', { cache: 'no-store' });

    let metrics = {
      total: 0,
      teamTotal: { Ramya: 0, Sandeep: 0, Kishore: 0 },
      statuses: {} as any
    };

    let codMetrics = {
      selectedDate: '',
      availableDates: [] as string[],
      cards: {
        'Order Placed': { count: 0, Ramya: 0, Sandeep: 0, Kishore: 0 },
        'Delivered': { count: 0, Ramya: 0, Sandeep: 0, Kishore: 0 },
        'Cancelled': { count: 0, Ramya: 0, Sandeep: 0, Kishore: 0 }
      }
    };

    let rawLeads: any[] = [];

    if (response.ok) {
      const csvText = await response.text();
      const records = parse(csvText, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      const leads = records.map((r: any) => ({
        date: r['Date'] || '',
        customerName: r['Customer Name'] || '',
        mobileNumber: r['Mobile Number '] || r['Mobile Number'] || '',
        status: r['Status'] || 'New Lead',
        remarks: r['Remarks '] || r['Remarks'] || '',
        assignedTo: r['Names'] || 'Unassigned'
      })).filter((l: any) => l.customerName && (l.date || l.mobileNumber));

      rawLeads = leads;

      const filteredLeads = leadDateParam ? leads.filter((l: any) => l.date === leadDateParam) : leads;

      const statusKeys = [
        'Shared Details', 'Visit Store', 'Busy', 'Avaiable for COD', 'Store Visit Today',
        'Store Visit Tomorrow', 'Store Visit Day after Tomorrow', 'Call back',
        'Shared Location', 'Not answering', 'Not working', 'Not interested'
      ];

      const team = ['Ramya', 'Sandeep', 'Kishore'];

      metrics.statuses = statusKeys.reduce((acc, curr) => {
        acc[curr] = { total: 0, Ramya: 0, Sandeep: 0, Kishore: 0 };
        return acc;
      }, {} as Record<string, { total: number; Ramya: number; Sandeep: number; Kishore: number }>);

      filteredLeads.forEach((lead: any) => {
        metrics.total++;
        const assigned = lead.assignedTo;
        const status = lead.status;

        if (team.includes(assigned)) {
          metrics.teamTotal[assigned as keyof typeof metrics.teamTotal]++;
        }

        const matchedStatusKey = statusKeys.find(k => k.toLowerCase() === status.toLowerCase());
        if (matchedStatusKey) {
          metrics.statuses[matchedStatusKey].total++;
          if (team.includes(assigned)) {
            metrics.statuses[matchedStatusKey][assigned as keyof typeof metrics.teamTotal]++;
          }
        }
      });
    }

    if (responseSheet4.ok) {
      const sheet4CsvText = await responseSheet4.text();
      const sheet4Lines = sheet4CsvText.split('\n').map(line => line.split(','));

      // Check header and rows for Sheet4
      // Row 0: Lead,Count,Ramya,Sandeep,Kishore,,,,Select Date,2026-08-03
      if (sheet4Lines[0] && sheet4Lines[0].length >= 10) {
        codMetrics.selectedDate = sheet4Lines[0][9]?.trim() || '';
      }

      sheet4Lines.forEach(row => {
        const leadName = row[0]?.trim();
        if (leadName && ['Order Placed', 'Delivered', 'Cancelled'].includes(leadName)) {
          codMetrics.cards[leadName as 'Order Placed' | 'Delivered' | 'Cancelled'] = {
            count: parseInt(row[1]?.trim() || '0', 10) || 0,
            Ramya: parseInt(row[2]?.trim() || '0', 10) || 0,
            Sandeep: parseInt(row[3]?.trim() || '0', 10) || 0,
            Kishore: parseInt(row[4]?.trim() || '0', 10) || 0,
          };
        }
      });
    }

    // 1c. Fetch Google Sheets metrics for COD Table (Sheet3 / gid=397977923)
    const responseSheet3 = await fetch('https://docs.google.com/spreadsheets/d/1eVxxvP5u5DO1-OJCb3cpPadwXi-GHI27v0qxMAmwTo4/export?format=csv&gid=397977923', { cache: 'no-store' });

    let codSheet3Rows: any[] = [];
    let codAvailableDates: string[] = [];

    if (responseSheet3.ok) {
      const sheet3CsvText = await responseSheet3.text();
      const records3 = parse(sheet3CsvText, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      const parsedRows = records3.map((r: any) => ({
        date: r['Date'] || '',
        orderId: r['OrderID'] || '',
        wayBillNumber: r['Way Bill Number'] || '',
        customerName: r['Customer Name'] || '',
        mobileNumber: r['Mobile Number '] || r['Mobile Number'] || '',
        address: r['Address'] || '',
        cost: r['Cost'] || '',
        status: r['Status'] || '',
        deliveryDate: r['Delievery Date '] || r['Delievery Date'] || r['Delivery Date '] || r['Delivery Date'] || '',
        names: r['Names'] || r['Assigned To'] || '—'
      })).filter((r: any) => r.customerName || r.orderId || r.mobileNumber);

      codAvailableDates = Array.from(new Set(parsedRows.map((r: any) => r.date).filter(Boolean))) as string[];

      codSheet3Rows = codDateParam 
        ? parsedRows.filter((r: any) => r.date === codDateParam)
        : parsedRows;
    }

    // 2. Fetch actual B2C COD Orders from Website Admin Database (CustomerOrder table)
    const codQueryResult = await client.execute('SELECT * FROM "CustomerOrder" WHERE paymentMethod = \'COD\' ORDER BY createdAt DESC');
    const codOrders = codQueryResult.rows;

    // Extract unique available dates dynamically from Google Sheets
    const availableDates = Array.from(
      new Set(rawLeads.map((l: any) => l.date).filter(Boolean))
    );
    codMetrics.availableDates = availableDates;

    return NextResponse.json({
      metrics,
      codMetrics,
      codSheet3Rows,
      codAvailableDates,
      codOrders,
      availableDates
    });
  } catch (error: any) {
    console.error('Error in leads API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
