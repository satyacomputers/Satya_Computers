import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Add this if you use next-auth
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    // Optional: Add authentication check here
    const result = await client.execute('SELECT * FROM "CustomerOrder" ORDER BY createdAt DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch customer orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch customer orders' }, { status: 500 });
  }
}
