import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const fields = Object.keys(updates);
    if (fields.length === 0) {
       return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const setClause = fields.map(field => `"${field}" = ?`).join(', ');
    const args = [...Object.values(updates), id];

    await client.execute({
      sql: `UPDATE "CustomerOrder" SET ${setClause}, updatedAt = datetime('now') WHERE id = ?`,
      args: args
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update customer order error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
