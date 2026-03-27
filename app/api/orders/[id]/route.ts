import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Try B2B Order first
    let result = await client.execute({
      sql: 'SELECT * FROM "Order" WHERE orderId = ? LIMIT 1',
      args: [id],
    });

    if (result.rows.length > 0) {
      const order = result.rows[0];
      const statusMap: Record<string, string> = {
        'Pending': 'placed',
        'Processing': 'processing',
        'Shipped': 'transit',
        'In Transit': 'transit',
        'Delivered': 'delivered',
        'Cancelled': 'cancelled'
      };

      return NextResponse.json({
        orderId: String(order.orderId),
        status: String(order.status),
        displayStatus: statusMap[String(order.status)] || 'placed',
        companyName: String(order.companyName),
        contactPerson: String(order.contactPerson),
        createdAt: String(order.createdAt),
        updatedAt: String(order.updatedAt),
      });
    }

    // Try B2C CustomerOrder
    result = await client.execute({
      sql: 'SELECT * FROM "CustomerOrder" WHERE orderId = ? LIMIT 1',
      args: [id],
    });

    if (result.rows.length > 0) {
      const order = result.rows[0];
      const statusMap: Record<string, string> = {
        'Processing': 'processing',
        'Shipped': 'transit',
        'Delivered': 'delivered',
        'Cancelled': 'cancelled'
      };

      return NextResponse.json({
        orderId: String(order.orderId),
        status: String(order.orderStatus),
        displayStatus: statusMap[String(order.orderStatus)] || 'placed',
        companyName: String(order.customerName),
        contactPerson: String(order.customerName), // Use customer name as contact person
        createdAt: String(order.createdAt),
        updatedAt: String(order.updatedAt),
      });
    }

    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('API get order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
