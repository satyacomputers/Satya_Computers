const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  console.log('Creating tables...');

  try {
    // Create User table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT UNIQUE NOT NULL,
        "password" TEXT NOT NULL,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('User table created.');

    // Create TeamMember table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "TeamMember" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "image" TEXT,
        "bio" TEXT,
        "email" TEXT,
        "linkedin" TEXT,
        "order" INTEGER DEFAULT 0,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('TeamMember table created.');

    // Create Client table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Client" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "logo" TEXT,
        "website" TEXT,
        "category" TEXT,
        "order" INTEGER DEFAULT 0,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Client table created.');

    // Create Category table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT UNIQUE NOT NULL,
        "description" TEXT,
        "image" TEXT,
        "slug" TEXT UNIQUE NOT NULL,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Category table created.');

    // Create ContactMessage table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "ContactMessage" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "subject" TEXT,
        "message" TEXT NOT NULL,
        "status" TEXT DEFAULT 'New',
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('ContactMessage table created.');

    console.log('All tables created successfully.');

  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    process.exit(0);
  }
}

main();
