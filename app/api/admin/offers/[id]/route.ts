import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await client.execute({
      sql: 'DELETE FROM "Offer" WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ message: 'Offer deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
    
    // Dynamically build the update query based on provided fields
    const fields = Object.keys(data);
    const setClause = fields.map(f => `"${f}" = ?`).join(', ');
    const args = [...Object.values(data), id];

    await client.execute({
      sql: `UPDATE "Offer" SET ${setClause} WHERE id = ?`,
      args: args as any[]
    });

    return NextResponse.json({ message: 'Offer updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
