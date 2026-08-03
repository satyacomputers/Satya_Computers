
const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function find() {
  const result = await client.execute("SELECT id, name FROM \"Product\" WHERE name LIKE '%HP%' OR name LIKE '%Dell%'");
  console.log('--- FOUND PRODUCTS ---');
  result.rows.forEach(p => console.log(`${p.id}: ${p.name}`));
}

find().catch(console.error);
