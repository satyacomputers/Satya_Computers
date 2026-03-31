export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
