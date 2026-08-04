import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { libsql as client } from '@/lib/prisma';

const SHEET_ID = '1eVxxvP5u5DO1-OJCb3cpPadwXi-GHI27v0qxMAmwTo4';

// Sheet GIDs (tab names confirmed from spreadsheet)
const GID_LEADS = '0';         // Sheet1 — Leads / B2C data
const GID_COD = '397977923';   // COD sheet — raw COD orders

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const fromLeadDateParam = url.searchParams.get('fromLeadDate');  // YYYY-MM-DD
    const toLeadDateParam   = url.searchParams.get('toLeadDate');    // YYYY-MM-DD
    const fromCodDateParam  = url.searchParams.get('fromCodDate');   // YYYY-MM-DD
    const toCodDateParam    = url.searchParams.get('toCodDate');     // YYYY-MM-DD

    // Helper: normalise any date string to midnight timestamp
    // Handles: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, MM/DD/YYYY
    const toMidnight = (dStr: string): number | null => {
      if (!dStr) return null;
      const s = dStr.trim();

      // YYYY-MM-DD (from input[type=date])
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const [y, m, d] = s.split('-').map(Number);
        return new Date(y, m - 1, d).getTime();
      }

      // MM/DD/YYYY (COD sheet format — confirmed from data)
      // We distinguish MM/DD/YYYY vs DD/MM/YYYY by checking if first part > 12 → DD first
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
        const parts = s.split('/').map(Number);
        // If first part > 12 → must be DD/MM/YYYY
        if (parts[0] > 12) {
          return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
        }
        // Otherwise treat as MM/DD/YYYY (COD sheet uses this)
        return new Date(parts[2], parts[0] - 1, parts[1]).getTime();
      }

      // DD-MM-YYYY
      if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(s)) {
        const parts = s.split('-').map(Number);
        return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
      }

      const ts = Date.parse(s);
      return isNaN(ts) ? null : ts;
    };

    // Fetch both sheets concurrently
    const [responseLeads, responseCod] = await Promise.all([
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_LEADS}`, { cache: 'no-store' }),
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_COD}`,   { cache: 'no-store' }),
    ]);

    // ── LEADS (Sheet1) ────────────────────────────────────────────────────────
    let metrics = {
      total: 0,
      teamTotal: { Ramya: 0, Sandeep: 0, Kishore: 0 },
      statuses: {} as Record<string, { total: number; Ramya: number; Sandeep: number; Kishore: number }>,
    };
    let rawLeads: any[] = [];
    let availableDates: string[] = [];

    if (responseLeads.ok) {
      const csvText = await responseLeads.text();
      const records = parse(csvText, { columns: true, skip_empty_lines: true, trim: true });

      const leads = records.map((r: any) => ({
        date:         r['Date'] || '',
        customerName: r['Customer Name'] || '',
        mobileNumber: r['Mobile Number '] || r['Mobile Number'] || '',
        status:       r['Status'] || 'New Lead',
        remarks:      r['Remarks '] || r['Remarks'] || '',
        assignedTo:   r['Names'] || 'Unassigned',
      })).filter((l: any) => l.customerName && (l.date || l.mobileNumber));

      rawLeads = leads;
      availableDates = Array.from(new Set(leads.map((l: any) => l.date).filter(Boolean))) as string[];

      const fromTs = toMidnight(fromLeadDateParam || '');
      const toTs   = toMidnight(toLeadDateParam   || '');

      const filteredLeads = leads.filter((l: any) => {
        if (fromTs || toTs) {
          const ts = toMidnight(l.date);
          if (!ts) return false;
          if (fromTs && ts < fromTs) return false;
          if (toTs   && ts > toTs)   return false;
        }
        return true;
      });

      const statusKeys = [
        'Shared Details', 'Visit Store', 'Busy', 'Avaiable for COD', 'Store Visit Today',
        'Store Visit Tomorrow', 'Store Visit Day after Tomorrow', 'Call back',
        'Shared Location', 'Not answering', 'Not working', 'Not interested',
      ];
      const team = ['Ramya', 'Sandeep', 'Kishore'];

      metrics.statuses = statusKeys.reduce((acc, k) => {
        acc[k] = { total: 0, Ramya: 0, Sandeep: 0, Kishore: 0 };
        return acc;
      }, {} as typeof metrics.statuses);

      filteredLeads.forEach((lead: any) => {
        metrics.total++;
        const assigned = lead.assignedTo;
        if (team.includes(assigned)) metrics.teamTotal[assigned as keyof typeof metrics.teamTotal]++;

        const mk = statusKeys.find(k => k.toLowerCase() === lead.status.toLowerCase());
        if (mk) {
          metrics.statuses[mk].total++;
          if (team.includes(assigned)) metrics.statuses[mk][assigned as keyof typeof metrics.teamTotal]++;
        }
      });
    }

    // ── COD SHEET (raw orders) ────────────────────────────────────────────────
    let codSheet3Rows: any[] = [];
    let codAvailableDates: string[] = [];
    let codMetrics = {
      selectedDate: '',
      availableDates: [] as string[],
      cards: {
        'Order Placed': { count: 0, Ramya: 0, Sandeep: 0, Kishore: 0 },
        'Delivered':    { count: 0, Ramya: 0, Sandeep: 0, Kishore: 0 },
        'Cancelled':    { count: 0, Ramya: 0, Sandeep: 0, Kishore: 0 },
      },
    };

    if (responseCod.ok) {
      const csvText = await responseCod.text();
      const records = parse(csvText, { columns: true, skip_empty_lines: true, trim: true });

      const parsedRows = records.map((r: any) => ({
        date:         r['Date'] || '',
        orderId:      r['OrderID'] || '',
        wayBillNumber: r['Way Bill Number'] || '',
        customerName: r['Customer Name'] || '',
        mobileNumber: r['Mobile Number '] || r['Mobile Number'] || '',
        address:      r['Address'] || '',
        weight:       r['Weight'] || '',
        cost:         r['Cost'] || '',
        status:       r['Status'] || '',
        deliveryDate: r['Delievery Date '] || r['Delievery Date'] || r['Delivery Date '] || r['Delivery Date'] || '',
        names:        r['Names'] || '—',
      })).filter((r: any) => r.customerName || r.orderId);

      codAvailableDates = Array.from(new Set(parsedRows.map((r: any) => r.date).filter(Boolean))) as string[];

      const fromTs = toMidnight(fromCodDateParam || '');
      const toTs   = toMidnight(toCodDateParam   || '');

      const filteredCodRowsForMetrics = parsedRows.filter((r: any) => {
        if (fromTs || toTs) {
          const ts = toMidnight(r.date);
          if (!ts) return false;
          if (fromTs && ts < fromTs) return false;
          if (toTs   && ts > toTs)   return false;
        }
        return true;
      });

      // Build COD summary cards from the SAME filtered rows
      const team = ['Ramya', 'Sandeep', 'Kishore'];
      filteredCodRowsForMetrics.forEach((r: any) => {
        const s = r.status?.trim();
        const name = r.names?.trim();

        const cardKey = ['Order Placed', 'Delivered', 'Cancelled'].find(k => k.toLowerCase() === s?.toLowerCase());
        if (cardKey) {
          const card = codMetrics.cards[cardKey as keyof typeof codMetrics.cards];
          card.count++;
          const matched = team.find(t => name?.toLowerCase().includes(t.toLowerCase()));
          if (matched) card[matched as 'Ramya' | 'Sandeep' | 'Kishore']++;
        }
      });

      // Provide ALL rows to the frontend for the ledger
      codSheet3Rows = parsedRows;

      codMetrics.availableDates = codAvailableDates;
    }

    // Fetch COD orders from the website database (B2C orders table)
    let codOrders: any[] = [];
    try {
      const codQueryResult = await client.execute('SELECT * FROM "CustomerOrder" WHERE paymentMethod = \'COD\' ORDER BY createdAt DESC');
      codOrders = codQueryResult.rows;
    } catch (_) {
      codOrders = [];
    }

    return NextResponse.json({
      metrics,
      codMetrics,
      codSheet3Rows,
      codAvailableDates,
      codOrders,
      availableDates,
    });
  } catch (error: any) {
    console.error('Error in leads API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
