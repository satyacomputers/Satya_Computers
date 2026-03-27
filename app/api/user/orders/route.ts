import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Fetch from CustomerOrder table
    const result = await client.execute({
      sql: 'SELECT * FROM "CustomerOrder" WHERE email = ? ORDER BY createdAt DESC',
      args: [email]
    });

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Fetch user orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
