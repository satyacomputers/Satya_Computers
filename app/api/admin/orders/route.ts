export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { googleSheetsService } from '@/src/backend/services/googleSheetsService';

export async function GET() {
  try {
    const result = await client.execute('SELECT * FROM "Order" ORDER BY createdAt DESC');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Fetch orders error:', error.message || error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Identity Verification Required' }, { status: 401 });
    }

    const { 
      companyName, 
      contactPerson, 
      email, 
      phone, 
      totalUnits, 
      estimatedValue 
    } = await req.json();

    if (!companyName || !contactPerson) {
      return NextResponse.json({ error: 'Core Identity Fields Required' }, { status: 400 });
    }

    const id = `id_${Math.random().toString(36).substring(2, 10)}`;
    const orderId = `SATYA-B2B-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${new Date().getFullYear()}`;
    const status = 'Pending';

    await client.execute({
      sql: `INSERT INTO "Order" (
        id, 
        orderId, 
        companyName, 
        contactPerson, 
        email, 
        phone, 
        totalUnits, 
        estimatedValue, 
        status, 
        createdAt, 
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        id, 
        orderId, 
        companyName, 
        contactPerson, 
        email || null, 
        phone || null, 
        totalUnits ? parseInt(totalUnits.toString()) : 0, 
        estimatedValue ? parseFloat(estimatedValue.toString()) : 0, 
        status
      ]
    });

    // GOOGLE SHEETS LIVE SYNC (ADMIN PROTOCOL)
    await googleSheetsService.syncB2BOrder({ 
      orderId, 
      fullName: companyName, 
      customerPhone: phone || 'B2B ACCOUNT', 
      totalAmount: estimatedValue, 
      status: status, 
      paymentMethod: 'B2B-NET/UPI',
      address: `Admin Log: ${contactPerson}`
    });

    return NextResponse.json({ 
      message: 'New protocol initialized successfully',
      id,
      orderId 
    });
  } catch (error: any) {
    console.error('Initialization error:', error);
    return NextResponse.json({ error: 'Internal failure during initialization' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Identity Verification Required' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
       return NextResponse.json({ error: 'Identity ID Required' }, { status: 400 });
    }

    await client.execute({
      sql: 'DELETE FROM "Order" WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ message: 'Order protocol terminated' });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal failure during deletion' }, { status: 500 });
  }
}
