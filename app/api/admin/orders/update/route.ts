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
        status = CASE WHEN ? IS NULL THEN status ELSE ? END,
        companyName = CASE WHEN ? IS NULL THEN companyName ELSE ? END,
        contactPerson = CASE WHEN ? IS NULL THEN contactPerson ELSE ? END,
        email = CASE WHEN ? IS NULL THEN email ELSE ? END,
        phone = CASE WHEN ? IS NULL THEN phone ELSE ? END,
        totalUnits = CASE WHEN ? IS NULL THEN totalUnits ELSE ? END,
        estimatedValue = CASE WHEN ? IS NULL THEN estimatedValue ELSE ? END,
        updatedAt = CURRENT_TIMESTAMP 
        WHERE id = ?`,
      args: [
        status || null, status || null,
        companyName || null, companyName || null,
        contactPerson || null, contactPerson || null,
        email || null, email || null,
        phone || null, phone || null,
        totalUnits !== undefined ? parseInt(totalUnits.toString()) : null, totalUnits !== undefined ? parseInt(totalUnits.toString()) : null,
        estimatedValue !== undefined ? parseFloat(estimatedValue.toString()) : null, estimatedValue !== undefined ? parseFloat(estimatedValue.toString()) : null,
        id
      ]
    });

    return NextResponse.json({ message: 'Order protocol synchronized successfully' });
  } catch (error: any) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
