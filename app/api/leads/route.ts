import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';
import { libsql as client } from '@/lib/prisma';

const SHEET_ID = '1eVxxvP5u5DO1-OJCb3cpPadwXi-GHI27v0qxMAmwTo4';

// Sheet GIDs (tab names confirmed from spreadsheet)
const GID_LEADS = '0';         // Sheet1 — Leads / B2C data
const GID_COD = '397977923';   // COD sheet — raw COD orders

// ── Status definitions: each entry maps a canonical key → aliases (case-insensitive substrings) ──
const STATUS_DEFS: { key: string; aliases: string[] }[] = [
  { key: 'Shared Details',                 aliases: ['shared details'] },
  { key: 'Visit Store',                    aliases: ['visit store'] },
  { key: 'Busy',                           aliases: ['busy'] },
  { key: 'Avaiable for COD',               aliases: ['avaiable for cod', 'available for cod', 'available cod', 'avaiable cod'] },
  { key: 'Store Visit Today',              aliases: ['store visit today'] },
  { key: 'Store Visit Tomorrow',           aliases: ['store visit tomorrow'] },
  { key: 'Store Visit Day after Tomorrow', aliases: ['store visit day after tomorrow'] },
  { key: 'Call back',                      aliases: ['call back', 'callback'] },
  { key: 'Shared Location',               aliases: ['shared location'] },
  { key: 'Not answering',                  aliases: ['not answering'] },
  { key: 'Not working',                    aliases: ['not working'] },
  { key: 'Not interested',                 aliases: ['not interested'] },
  { key: 'Asking for rent',               aliases: ['asking for rent'] },
  { key: 'Purchased',                      aliases: ['purchased'] },
  { key: 'Switch off',                     aliases: ['switchoff', 'switch off'] },
];

const TEAM = ['Ramya', 'Sandeep', 'Kishore'] as const;
type TeamMember = typeof TEAM[number];

// ── Normalise any date string → YYYY-MM-DD for consistent comparison ──────────────────────────
// Handles: YYYY-MM-DD, M/D/YYYY, D/M/YYYY, DD-MM-YYYY and ambiguous slash formats.
function normalizeDateToYMD(dStr: string): string | null {
  if (!dStr) return null;
  const s = dStr.trim();

  // YYYY-MM-DD (from input[type=date])
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number);
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  // Slash-separated: M/D/YYYY or D/M/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const parts = s.split('/').map(Number);
    const year = parts[2];
    let month: number, day: number;
    if (parts[0] > 12) {
      // First part > 12 → must be DD/MM/YYYY
      day = parts[0]; month = parts[1];
    } else if (parts[1] > 12) {
      // Second part > 12 → must be MM/DD/YYYY where DD > 12
      month = parts[0]; day = parts[1];
    } else {
      // Ambiguous: sheet data uses M/D/YYYY (e.g. 8/1/2026 = Aug 1)
      month = parts[0]; day = parts[1];
    }
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  // DD-MM-YYYY
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(s)) {
    const parts = s.split('-').map(Number);
    let day = parts[0], month = parts[1];
    const year = parts[2];
    if (parts[0] > 12) { day = parts[0]; month = parts[1]; }
    else if (parts[1] > 12) { day = parts[1]; month = parts[0]; }
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const ts = Date.parse(s);
  if (!isNaN(ts)) {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return null;
}

// ── Match all canonical statuses that apply to a raw status cell ──────────────────────────────
// Supports multi-tag values like "Shared Details, Shared Location"
function matchStatuses(rawStatus: string): string[] {
  if (!rawStatus) return [];
  const s = rawStatus.toLowerCase().trim();
  const matched: string[] = [];
  for (const def of STATUS_DEFS) {
    if (def.aliases.some(alias => s.includes(alias))) {
      matched.push(def.key);
    }
  }
  return matched;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const fromLeadDateParam = url.searchParams.get('fromLeadDate');  // YYYY-MM-DD
    const toLeadDateParam   = url.searchParams.get('toLeadDate');    // YYYY-MM-DD
    const fromCodDateParam  = url.searchParams.get('fromCodDate');   // YYYY-MM-DD
    const toCodDateParam    = url.searchParams.get('toCodDate');     // YYYY-MM-DD

    // Fetch both sheets concurrently
    const [responseLeads, responseCod] = await Promise.all([
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_LEADS}`, { cache: 'no-store' }),
      fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_COD}`,   { cache: 'no-store' }),
    ]);

    // ── LEADS (Sheet1) ────────────────────────────────────────────────────────
    type StatusRecord = { total: number; Ramya: number; Sandeep: number; Kishore: number };
    let metrics = {
      total: 0,
      teamTotal: { Ramya: 0, Sandeep: 0, Kishore: 0 } as Record<string, number>,
      statuses: {} as Record<string, StatusRecord>,
    };
    let rawLeads: any[] = [];
    let availableDates: string[] = [];

    if (responseLeads.ok) {
      const csvText = await responseLeads.text();

      // Parse as raw rows (no column mapping) because the first column header is blank
      const rawRows: string[][] = parse(csvText, {
        columns: false,
        skip_empty_lines: true,
        trim: true,
      }) as string[][];

      // Row 0 is the header: ['', 'Customer Name', 'Mobile Number ', 'Status', 'Remarks ', 'Names', '']
      // Data starts at row 1: [date, customerName, mobileNumber, status, remarks, agentName, '']
      const dataRows = rawRows.slice(1);

      const leads = dataRows.map((r: string[]) => ({
        date:         r[0] || '',
        customerName: r[1] || '',
        mobileNumber: r[2] || '',
        status:       r[3] || '',
        remarks:      r[4] || '',
        assignedTo:   r[5] || '',
      })).filter((l: any) => l.date); // Keep all rows that have a date (matches Google Sheets counting)

      rawLeads = leads;
      availableDates = Array.from(new Set(
        leads.map((l: any) => normalizeDateToYMD(l.date)).filter(Boolean)
      )) as string[];

      const fromYMD = normalizeDateToYMD(fromLeadDateParam || '');
      const toYMD   = normalizeDateToYMD(toLeadDateParam   || '');

      const filteredLeads = leads.filter((l: any) => {
        if (fromYMD || toYMD) {
          const ymd = normalizeDateToYMD(l.date);
          if (!ymd) return false;
          if (fromYMD && ymd < fromYMD) return false;
          if (toYMD   && ymd > toYMD)   return false;
        }
        return true;
      });

      // Initialise all status buckets
      metrics.statuses = STATUS_DEFS.reduce((acc, def) => {
        acc[def.key] = { total: 0, Ramya: 0, Sandeep: 0, Kishore: 0 };
        return acc;
      }, {} as typeof metrics.statuses);

      filteredLeads.forEach((lead: any) => {
        metrics.total++;
        const assigned = (lead.assignedTo || '').trim();
        const matchedAgent = TEAM.find(t => t.toLowerCase() === assigned.toLowerCase()) as TeamMember | undefined;
        if (matchedAgent) metrics.teamTotal[matchedAgent]++;

        const matchedStatuses = matchStatuses(lead.status);
        matchedStatuses.forEach(key => {
          if (metrics.statuses[key]) {
            metrics.statuses[key].total++;
            if (matchedAgent) {
              (metrics.statuses[key] as any)[matchedAgent]++;
            }
          }
        });
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
      const records: any[] = parse(csvText, { columns: true, skip_empty_lines: true, trim: true });

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

      codAvailableDates = Array.from(new Set(
        parsedRows.map((r: any) => normalizeDateToYMD(r.date)).filter(Boolean)
      )) as string[];

      const fromCodYMD = normalizeDateToYMD(fromCodDateParam || '');
      const toCodYMD   = normalizeDateToYMD(toCodDateParam   || '');

      const filteredCodRowsForMetrics = parsedRows.filter((r: any) => {
        if (fromCodYMD || toCodYMD) {
          const ymd = normalizeDateToYMD(r.date);
          if (!ymd) return false;
          if (fromCodYMD && ymd < fromCodYMD) return false;
          if (toCodYMD   && ymd > toCodYMD)   return false;
        }
        return true;
      });

      filteredCodRowsForMetrics.forEach((r: any) => {
        const s = r.status?.trim();
        const name = r.names?.trim();

        const cardKey = ['Order Placed', 'Delivered', 'Cancelled'].find(k => k.toLowerCase() === s?.toLowerCase());
        if (cardKey) {
          const card = codMetrics.cards[cardKey as keyof typeof codMetrics.cards];
          card.count++;
          const matched = TEAM.find(t => name?.toLowerCase().includes(t.toLowerCase()));
          if (matched) card[matched as TeamMember]++;
        }
      });

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
