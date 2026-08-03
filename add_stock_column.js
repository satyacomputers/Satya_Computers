const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  try {
    await client.execute("ALTER TABLE Product ADD COLUMN stock INTEGER DEFAULT 0");
    console.log('Stock column added successfully');
  } catch (error) {
    console.error('Error adding column:', error.message);
  } finally {
    process.exit(0);
  }
}

main();
