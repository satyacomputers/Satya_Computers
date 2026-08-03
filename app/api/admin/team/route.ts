import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Direct SQL query using LibSQL client
    const result = await client.execute({
      sql: 'SELECT id, username, role, createdAt FROM "Admin" ORDER BY createdAt DESC',
      args: []
    });

    // Formatting consistent with UI expectations
    const admins = result.rows.map((row: any) => ({
      id: row.id,
      username: row.username,
      role: row.role,
      createdAt: row.createdAt
    }));

    return NextResponse.json(admins);
  } catch (error: any) {
    console.error('Fetch team error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
