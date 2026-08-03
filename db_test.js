const { createClient } = require('@libsql/client');
require('dotenv').config();

async function test() {
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  try {
    console.log('Attempting DB connection...');
    const result = await client.execute('SELECT 1');
    console.log('Connection Successful:', result);
  } catch (e) {
    console.error('Connection Failed:', e);
  }
}

test();
