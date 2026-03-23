
const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function find() {
  const result = await client.execute("SELECT id, name, price FROM \"Product\"");
  console.log(JSON.stringify(result.rows, null, 2));
}

find().catch(console.error);
