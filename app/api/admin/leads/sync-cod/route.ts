import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { customerName, phone, remarks, totalAmount = 0, address = 'Store / Phone Order' } = body;

    if (!customerName || !phone) {
      return NextResponse.json({ error: 'Customer Name and Phone are required' }, { status: 400 });
    }

    const orderId = `ORD-COD-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `cuid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const productsJson = JSON.stringify([
      { name: remarks || 'Lead Product (COD)', price: totalAmount, quantity: 1 }
    ]);

    await client.execute({
      sql: `INSERT INTO "CustomerOrder" 
            (id, orderId, customerName, email, phone, address, products, totalAmount, paymentMethod, paymentStatus, orderStatus, notes, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'COD', 'Pending', 'Processing', ?, datetime('now'), datetime('now'))`,
      args: [
        id,
        orderId,
        customerName,
        `${phone}@satyacomputers.in`,
        phone,
        address,
        productsJson,
        totalAmount,
        remarks || 'Synced from Google Sheets COD Leads'
      ]
    });

    return NextResponse.json({
      success: true,
      message: `COD Order ${orderId} created successfully!`,
      orderId
    });
  } catch (error: any) {
    console.error('Error syncing COD lead to CustomerOrder:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
