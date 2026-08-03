import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    // Only allow authenticated admins to see other admins
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await client.execute('SELECT id, username, password, role, createdAt FROM "Admin" ORDER BY createdAt DESC');
    
    return NextResponse.json({ admins: result.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
