import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";

import { googleSheetsService } from '@/src/backend/services/googleSheetsService';

export async function GET() {
  try {
    const result = await client.execute('SELECT * FROM "Announcement" ORDER BY createdAt DESC');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Fetch announcements error:', error.message || error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, type, status, date } = await req.json();
    const id = Math.random().toString(36).substring(2, 11);

    await client.execute({
      sql: 'INSERT INTO "Announcement" (id, title, type, status, date, createdAt) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      args: [id, title, type, status || 'Live', date]
    });

    // GOOGLE SHEETS LIVE SYNC
    await googleSheetsService.syncAnnouncement({ id, title, type, status: status || 'Live' });

    return NextResponse.json({ message: 'Broadcast initiated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
