import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN || "";

async function run() {
  const client = createClient({ url, authToken });
  console.log('Connecting to:', url);

  try {
    console.log('Running CREATE TABLE...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "GlobalSettings" (
        "id" TEXT PRIMARY KEY,
        "gstPercentage" REAL DEFAULT 0,
        "shippingCharges" REAL DEFAULT 0,
        "discountPercentage" REAL DEFAULT 0,
        "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('CREATE Table success. Checking for existing row...');
    const result = await client.execute("SELECT count(*) as count FROM 'GlobalSettings'");
    console.log('Row count:', result.rows[0].count);
    
    if (Number(result.rows[0].count) === 0) {
      console.log('Inserting default row...');
      await client.execute("INSERT INTO GlobalSettings (id, gstPercentage, shippingCharges, discountPercentage) VALUES ('settings', 18, 0, 0)");
    }
    
    console.log('Settings ready.');
  } catch (error) {
    console.error('Detailed Error:', error);
  }
}

run();
