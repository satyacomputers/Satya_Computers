
const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function run() {
  const result = await client.execute('SELECT id, name, brand FROM "Product"');
  console.log('--- DB DATA START ---');
  for (const row of result.rows) {
    if (row.brand.toLowerCase().includes('hp') || row.brand.toLowerCase().includes('dell') || row.brand.toLowerCase().includes('apple')) {
      console.log(`{ id: "${row.id}", name: "${row.name}", brand: "${row.brand.toUpperCase()}" }`);
    }
  }
  console.log('--- DB DATA END ---');
}

run().catch(console.error);
