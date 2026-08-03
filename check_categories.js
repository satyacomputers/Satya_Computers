const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

async function main() {
  try {
    const result = await client.execute('SELECT category, COUNT(*) as count FROM "Product" GROUP BY category');
    console.log('Category Counts:', JSON.stringify(result.rows, null, 2));
    
    // Also check first 5 products to see their category names
    const products = await client.execute('SELECT name, category FROM "Product" LIMIT 5');
    console.log('Sample Products:', JSON.stringify(products.rows, null, 2));
  } catch (error) {
    console.error(error);
  }
}

main();
