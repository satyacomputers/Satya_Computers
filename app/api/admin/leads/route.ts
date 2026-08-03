import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get('date'); // e.g., '31/07/2026'

    // Fetch Sheet 1 (Raw Leads)
    const response = await fetch('https://docs.google.com/spreadsheets/d/1eVxxvP5u5DO1-OJCb3cpPadwXi-GHI27v0qxMAmwTo4/export?format=csv&gid=0', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch from Google Sheets');
    }

    const csvText = await response.text();
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // Normalize keys
    const leads = records.map((r: any) => ({
      date: r['Date'] || '',
      customerName: r['Customer Name'] || '',
      mobileNumber: r['Mobile Number '] || r['Mobile Number'] || '',
      status: r['Status'] || '',
      remarks: r['Remarks '] || r['Remarks'] || '',
      assignedTo: r['Names'] || ''
    })).filter((l: any) => l.date && l.customerName); // Only genuine leads

    // Filter by date if provided
    const filteredLeads = dateParam ? leads.filter((l: any) => l.date === dateParam) : leads;

    // Calculate metrics matching Sheet 2 logic
    const statusKeys = [
      'Shared Details', 'Visit Store', 'Busy', 'Avaiable for COD', 'Store Visit Today',
      'Store Visit Tomorrow', 'Store Visit Day after Tomorrow', 'Call back',
      'Shared Location', 'Not answering', 'Not working', 'Not interested'
    ];

    const team = ['Ramya', 'Sandeep', 'Kishore'];
    
    // Total count object
    const metrics = {
      total: 0,
      teamTotal: { Ramya: 0, Sandeep: 0, Kishore: 0 },
      statuses: statusKeys.reduce((acc, curr) => {
        acc[curr] = { total: 0, Ramya: 0, Sandeep: 0, Kishore: 0 };
        return acc;
      }, {} as Record<string, { total: number; Ramya: number; Sandeep: number; Kishore: number }>)
    };

    filteredLeads.forEach((lead: any) => {
      metrics.total++;
      
      const assigned = lead.assignedTo;
      const status = lead.status; 

      if (team.includes(assigned)) {
        metrics.teamTotal[assigned as keyof typeof metrics.teamTotal]++;
      }

      // Match status flexibly
      const matchedStatusKey = statusKeys.find(k => k.toLowerCase() === status.toLowerCase());
      
      if (matchedStatusKey) {
        metrics.statuses[matchedStatusKey].total++;
        if (team.includes(assigned)) {
          metrics.statuses[matchedStatusKey][assigned as keyof typeof metrics.teamTotal]++;
        }
      }
    });

    // Get COD Leads
    const codLeads = filteredLeads.filter((l: any) => l.status.toLowerCase() === 'avaiable for cod' || l.status.toLowerCase() === 'available for cod');

    return NextResponse.json({
      metrics,
      codLeads
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
