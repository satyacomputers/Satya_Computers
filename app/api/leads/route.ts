import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { libsql as client } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get('date');

    // 1. Fetch Google Sheets metrics for top cards
    const response = await fetch('https://docs.google.com/spreadsheets/d/1eVxxvP5u5DO1-OJCb3cpPadwXi-GHI27v0qxMAmwTo4/export?format=csv&gid=0', { cache: 'no-store' });
    let metrics = {
      total: 0,
      teamTotal: { Ramya: 0, Sandeep: 0, Kishore: 0 },
      statuses: {} as any
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

      const filteredLeads = dateParam ? leads.filter((l: any) => l.date === dateParam) : leads;

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

    // 2. Fetch actual B2C COD Orders from Website Admin Database (CustomerOrder table)
    const codQueryResult = await client.execute('SELECT * FROM "CustomerOrder" WHERE paymentMethod = \'COD\' ORDER BY createdAt DESC');
    const codOrders = codQueryResult.rows;

    // Extract unique available dates dynamically from Google Sheets
    const availableDates = Array.from(
      new Set(rawLeads.map((l: any) => l.date).filter(Boolean))
    );

    return NextResponse.json({
      metrics,
      codOrders,
      availableDates
    });
  } catch (error: any) {
    console.error('Error in leads API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
