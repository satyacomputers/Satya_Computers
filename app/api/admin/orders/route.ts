export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';

export async function GET() {
  try {
    const result = await client.execute('SELECT * FROM "Order" ORDER BY createdAt DESC');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Fetch orders error:', error.message || error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function DELETE(req: Request) {
  try {
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
