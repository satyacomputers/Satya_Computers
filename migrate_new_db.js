const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

async function run() {
  console.log('Initializing schema on: ' + process.env.DATABASE_URL);
  const tables = [
    `CREATE TABLE IF NOT EXISTS Product (
        id TEXT PRIMARY KEY, 
        name TEXT NOT NULL, 
        brand TEXT NOT NULL, 
        category TEXT DEFAULT 'Laptop', 
        processor TEXT NOT NULL, 
        ram TEXT NOT NULL, 
        storage TEXT NOT NULL, 
        display TEXT, 
        os TEXT, 
        price REAL NOT NULL, 
        bulkPrice5_10 REAL, 
        bulkPrice11_25 REAL, 
        bulkPrice26Plus REAL, 
        minOrderQty INTEGER DEFAULT 1, 
        stockStatus TEXT DEFAULT 'In Stock', 
        image TEXT, 
        description TEXT, 
        isFeatured INTEGER DEFAULT 0, 
        warranty TEXT, 
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Category (
        id TEXT PRIMARY KEY, 
        name TEXT UNIQUE NOT NULL, 
        description TEXT, 
        image TEXT, 
        slug TEXT UNIQUE NOT NULL, 
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS "Order" (
        id TEXT PRIMARY KEY, 
        orderId TEXT UNIQUE NOT NULL, 
        companyName TEXT NOT NULL, 
        contactPerson TEXT NOT NULL, 
        email TEXT NOT NULL, 
        phone TEXT NOT NULL, 
        products TEXT NOT NULL, 
        totalUnits INTEGER NOT NULL, 
        estimatedValue REAL NOT NULL, 
        status TEXT DEFAULT 'Pending', 
        notes TEXT, 
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Offer (
        id TEXT PRIMARY KEY, 
        type TEXT NOT NULL, 
        title TEXT NOT NULL, 
        description TEXT, 
        code TEXT, 
        discount REAL, 
        minOrder INTEGER, 
        expiryDate DATETIME, 
        isActive INTEGER DEFAULT 1, 
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Announcement (
        id TEXT PRIMARY KEY, 
        title TEXT NOT NULL, 
        type TEXT NOT NULL, 
        status TEXT DEFAULT 'Live', 
        date TEXT NOT NULL, 
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Admin (
        id TEXT PRIMARY KEY, 
        username TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL, 
        role TEXT DEFAULT 'admin', 
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS TeamMember (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        image TEXT,
        bio TEXT,
        email TEXT,
        linkedin TEXT,
        "order" INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS Client (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        logo TEXT,
        website TEXT,
        category TEXT,
        "order" INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS ContactMessage (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'New',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];

  for (const sql of tables) {
    try {
      await client.execute(sql);
      console.log('Migrated table');
    } catch (e) {
      console.error('Error migrating: ' + e.message);
    }
  }
  
  // Seed Admin
  try {
      await client.execute({
          sql: 'INSERT INTO Admin (id, username, password, role) VALUES (?, ?, ?, ?)',
          args: ['admin_1', 'satya_computers', '$2b$10$OnUlOciLZy7c7PvQ2hMgqebds8MGkFp/mxi2Oroe4f/zZe2YXLpZi', 'admin']
      });
      console.log('Admin seeded.');
  } catch (e) {}

  console.log('Schema migration complete.');
}

run();
