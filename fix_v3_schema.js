const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  try {
    console.log('--- SCHEMA UPGRADE START ---');
    await client.execute('ALTER TABLE "Product" ADD COLUMN category TEXT DEFAULT "Laptop"');
    console.log('Added category to Product.');
    await client.execute('ALTER TABLE "Product" ADD COLUMN os TEXT');
    console.log('Added os to Product (if missing).');
    await client.execute('ALTER TABLE "Product" ADD COLUMN warranty TEXT');
    console.log('Added warranty to Product (if missing).');
    console.log('--- SCHEMA UPGRADE COMPLETE ---');
  } catch (err) {
    if (err.message.includes('duplicate column name')) {
      console.log('Schema was already patched.');
    } else {
      console.error('UPGRADE FAILURE:', err);
    }
  } finally {
    process.exit(0);
  }
}

main();
