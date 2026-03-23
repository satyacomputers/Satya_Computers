const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN
});

async function run() {
  const result = await client.execute('SELECT id, name, image FROM Product LIMIT 10');
  console.log(JSON.stringify(result.rows, null, 2));
  process.exit(0);
}

run();
