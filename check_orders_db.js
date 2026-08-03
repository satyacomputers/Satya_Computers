const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  try {
    const allOrders = await client.execute('SELECT * FROM "CustomerOrder" ORDER BY createdAt DESC LIMIT 2');
    console.log('All Orders:');
    allOrders.rows.forEach(row => {
      console.log(JSON.stringify(row, null, 2));
    });
  } catch (e) {
    console.error(e);
  }
}

main();
