import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await client.execute({
      sql: 'DELETE FROM "Client" WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    console.error('Delete client error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await client.execute(`SELECT * FROM "Client" ORDER BY "order" ASC, createdAt DESC`);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Fetch clients error:', error.message || error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, logo, website, category } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const id = `client_${Date.now()}`;
    await client.execute({
      sql: `INSERT INTO "Client" (id, name, logo, website, category, "order", createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [id, name, logo || '', website || '', category || 'Corporate']
    });

    return NextResponse.json({ message: 'Client created successfully', id });
  } catch (error: any) {
    console.error('Create client error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
