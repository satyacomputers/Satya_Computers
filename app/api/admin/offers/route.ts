import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";

import { googleSheetsService } from '@/src/backend/services/googleSheetsService';

export async function GET() {
  try {
    const result = await client.execute('SELECT * FROM "Offer" ORDER BY createdAt DESC');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Fetch offers error:', error.message || error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, title, description, code, discount, expiryDate } = await req.json();
    const id = Math.random().toString(36).substring(2, 11);

    await client.execute({
      sql: 'INSERT INTO "Offer" (id, type, title, description, code, discount, expiryDate, isActive, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)',
      args: [id, type, title, description, code, parseFloat(discount), expiryDate]
    });

    // GOOGLE SHEETS LIVE SYNC
    await googleSheetsService.syncOffer({ id, title, code, discount, isActive: true });

    return NextResponse.json({ message: 'Offer created' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
