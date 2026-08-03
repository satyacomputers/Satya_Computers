
const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function check() {
  const result = await client.execute('SELECT id, brand, name FROM "Product"');
  console.log('--- TURSO DB PRODUCTS ---');
  result.rows.forEach(p => {
    console.log(`ID: ${p.id} | Brand: ${p.brand} | Name: ${p.name}`);
  });
}

check().catch(e => {
  console.error(e);
});
