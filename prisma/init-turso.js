const { createClient } = require('@libsql/client');

const url = 'libsql://satyacomputer-venky214.aws-ap-south-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM2ODMxOTAsImlkIjoiMDE5Y2Y3YmYtZTkwMS03NjYyLThkNzktMjU1NjQ4NWVjYWUxIiwicmlkIjoiNTE3YjBkNmUtN2M5Mi00NmM1LWI4ZjUtYzA3ZmE4ODU1MmZiIn0.HffDHocx5v1gYuIRIsy_k9Bd_eJyTTRGE-UNw6gKdvFN12dD2JxVxTkDzNq9ouW96YKW7qAZCqyET2ZVc3D1Cg';

const client = createClient({ url, authToken });

const queries = [
  `CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "processor" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "display" TEXT,
    "os" TEXT,
    "price" REAL NOT NULL,
    "bulkPrice5_10" REAL,
    "bulkPrice11_25" REAL,
    "bulkPrice26Plus" REAL,
    "minOrderQty" INTEGER NOT NULL DEFAULT 1,
    "stockStatus" TEXT NOT NULL DEFAULT 'In Stock',
    "image" TEXT,
    "description" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "warranty" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "totalUnits" INTEGER NOT NULL,
    "estimatedValue" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS "Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "discount" REAL,
    "minOrder" INTEGER,
    "expiryDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `DROP TABLE IF EXISTS "Admin";`,
  `CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderId_key" ON "Order"("orderId");`
];

async function main() {
  console.log('Connecting to Turso...');
  for (const query of queries) {
    try {
      await client.execute(query);
      console.log('Executed query successfully.');
    } catch (err) {
      console.error('Error executing query:', err.message);
    }
  }
  console.log('Database setup complete.');
  process.exit(0);
}

main();
