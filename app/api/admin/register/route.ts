import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { hash } from 'bcryptjs';

import { googleSheetsService } from '@/src/backend/services/googleSheetsService';

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json();

    if (!username || !password || !role) {
      return NextResponse.json({ error: 'Username, password and role are required' }, { status: 400 });
    }

    // 1. Check if admin already exists using direct SQL
    const existing = await client.execute({
      sql: 'SELECT id FROM "Admin" WHERE username = ?',
      args: [username]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    // 2. Hash password
    const hashedPassword = await hash(password, 10);

    // 3. Create admin using direct SQL
    const id = Math.random().toString(36).substring(2, 11);
    await client.execute({
      sql: 'INSERT INTO "Admin" (id, username, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      args: [id, username, hashedPassword, role]
    });

    // GOOGLE SHEETS LIVE SYNC
    await googleSheetsService.syncTeamMember({ username, role });

    return NextResponse.json({ message: 'Admin registered successfully' });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
