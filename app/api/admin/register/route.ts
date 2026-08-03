import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import { hash } from 'bcryptjs';

import { googleSheetsService } from '@/src/backend/services/googleSheetsService';

export async function POST(req: Request) {
  try {
    const { username, password, role, inviteCode } = await req.json();

    if (!username || !password || !role || !inviteCode) {
      return NextResponse.json({ error: 'All fields including invite code are required' }, { status: 400 });
    }

    // 0. Verify Invite Code from GlobalSettings
    const settings = await client.execute('SELECT inviteCode FROM "GlobalSettings" LIMIT 1');
    const validInviteCode = settings.rows[0]?.inviteCode || 'SATYA-ADMIN-2025';

    if (inviteCode !== validInviteCode) {
      return NextResponse.json({ error: 'Invalid administrative invite code. Access Denied.' }, { status: 403 });
    }

    // 1. Check if admin already exists using direct SQL
    const existing = await client.execute({
      sql: 'SELECT id FROM "Admin" WHERE username = ?',
      args: [username]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Admin identity already provisioned' }, { status: 400 });
    }

    // 2. Hash password
    const hashedPassword = await hash(password, 10);

    // 3. Create admin using direct SQL
    const id = Math.random().toString(36).substring(2, 11);
    await client.execute({
      sql: 'INSERT INTO "Admin" (id, username, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      args: [id, username, hashedPassword, role]
    });

    // 4. Create Audit Log
    const auditId = Math.random().toString(36).substring(2, 11);
    await client.execute({
      sql: 'INSERT INTO "AuditLog" (id, action, entity, entityId, adminId, details, createdAt) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      args: [auditId, 'ADMIN_REGISTRATION', 'Admin', id, 'SYSTEM', `New admin ${username} provisioned with role ${role}`]
    });

    // GOOGLE SHEETS LIVE SYNC
    await googleSheetsService.syncTeamMember({ username, role });

    return NextResponse.json({ message: 'Administrative profile provisioned successfully' });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
