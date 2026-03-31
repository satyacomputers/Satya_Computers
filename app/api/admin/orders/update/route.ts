import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      id, 
      status, 
      companyName, 
      contactPerson, 
      email, 
      phone, 
      totalUnits, 
      estimatedValue 
    } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await client.execute({
      sql: `UPDATE "Order" SET 
        status = COALESCE(?, status),
        companyName = COALESCE(?, companyName),
        contactPerson = COALESCE(?, contactPerson),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        totalUnits = COALESCE(?, totalUnits),
        estimatedValue = COALESCE(?, estimatedValue),
        updatedAt = CURRENT_TIMESTAMP 
        WHERE id = ?`,
      args: [
        status || null, 
        companyName || null, 
        contactPerson || null, 
        email || null, 
        phone || null, 
        totalUnits ? parseInt(totalUnits.toString()) : null,
        estimatedValue ? parseFloat(estimatedValue.toString()) : null,
        id
      ]
    });

    return NextResponse.json({ message: 'Order protocol synchronized successfully' });
  } catch (error: any) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
