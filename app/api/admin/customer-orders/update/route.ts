import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const { id, orderStatus, paymentStatus } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    if (orderStatus && paymentStatus) {
       await client.execute({
         sql: `UPDATE "CustomerOrder" SET orderStatus = ?, paymentStatus = ?, updatedAt = datetime('now') WHERE id = ?`,
         args: [orderStatus, paymentStatus, id]
       });
    } else if (orderStatus) {
       await client.execute({
         sql: `UPDATE "CustomerOrder" SET orderStatus = ?, updatedAt = datetime('now') WHERE id = ?`,
         args: [orderStatus, id]
       });
    } else if (paymentStatus) {
       await client.execute({
         sql: `UPDATE "CustomerOrder" SET paymentStatus = ?, updatedAt = datetime('now') WHERE id = ?`,
         args: [paymentStatus, id]
       });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update customer order error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
