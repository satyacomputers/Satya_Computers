import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await client.execute('SELECT * FROM "CustomerOrder" ORDER BY createdAt DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch customer orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch customer orders' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { paymentStatus, orderStatus } = await req.json();

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    if (paymentStatus) {
      await client.execute({
        sql: 'UPDATE "CustomerOrder" SET paymentStatus = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        args: [paymentStatus, id]
      });
    }

    if (orderStatus) {
      await client.execute({
        sql: 'UPDATE "CustomerOrder" SET orderStatus = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
        args: [orderStatus, id]
      });
    }

    return NextResponse.json({ success: true, message: 'Status updated successfully' });
  } catch (error: any) {
    console.error('Order Patch Failure:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await client.execute({
      sql: 'DELETE FROM "CustomerOrder" WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true, message: 'Registry purged' });
  } catch (error: any) {
    console.error('Order Purge Failure:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
