import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { googleSheetsService } from '@/src/backend/services/googleSheetsService';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await client.execute('SELECT * FROM OfflineBill ORDER BY createdAt DESC LIMIT 50');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Fetch billing error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { 
      customerName, 
      customerPhone, 
      items, 
      subtotal, 
      gstRate, 
      gstAmount, 
      totalAmount, 
      status, 
      transactionId 
    } = body;

    const id = `bill_${Date.now()}`;
    const billId = `SC-BILL-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${new Date().getFullYear()}`;

    // Ensure table exists (fail-safe)
    await client.execute(`CREATE TABLE IF NOT EXISTS OfflineBill (
      id TEXT PRIMARY KEY, 
      billId TEXT, 
      customerName TEXT, 
      customerPhone TEXT, 
      items TEXT, 
      subtotal REAL, 
      gstRate REAL, 
      gstAmount REAL, 
      totalAmount REAL, 
      status TEXT, 
      transactionId TEXT, 
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await client.execute({
      sql: `INSERT INTO OfflineBill (
        id, billId, customerName, customerPhone, items, subtotal, gstRate, gstAmount, totalAmount, status, transactionId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, billId, customerName || 'Walk-in Customer', customerPhone || '', 
        JSON.stringify(items), subtotal, gstRate, gstAmount, totalAmount, 
        status || 'Unpaid', transactionId || null
      ]
    });

    // GOOGLE SHEETS LIVE SYNC (POS BILL)
    await googleSheetsService.syncB2COrder({ id, billId, customerName, customerPhone, totalAmount, status: status || 'Unpaid', paymentMethod: 'POS-CASH/UPI' });

    return NextResponse.json({ message: 'Bill Synchronized', id, billId });
  } catch (error: any) {
    console.error('Billing creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal failure during billing' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, transactionId, status } = await req.json();

    await client.execute({
      sql: 'UPDATE OfflineBill SET transactionId = ?, status = ? WHERE id = ?',
      args: [transactionId, status, id]
    });

    return NextResponse.json({ message: 'Ledger Updated' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Update failure' }, { status: 500 });
  }
}
