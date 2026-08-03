import { NextResponse } from 'next/server';
import { libsql as client } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const existing = await client.execute({
      sql: 'SELECT id FROM "User" WHERE email = ?',
      args: [email]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert user
    await client.execute({
      sql: 'INSERT INTO "User" (id, name, email, password) VALUES (?, ?, ?, ?)',
      args: [id, name, email, hashedPassword]
    });

    return NextResponse.json({ message: 'User registered successfully', name }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
