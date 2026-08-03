const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  try {
    const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables:', result.rows.map(r => r.name));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

main();
