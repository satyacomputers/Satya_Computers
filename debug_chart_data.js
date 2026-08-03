const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  try {
    const result = await client.execute(`
      SELECT 
        createdAt,
        strftime('%W', createdAt) as week_num
      FROM "Order" 
      LIMIT 10
    `);
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (e) {
    console.error(e);
  }
}

main();
