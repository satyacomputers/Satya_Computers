import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN || "";

async function run() {
  const client = createClient({ url, authToken });
  try {
    const res = await client.execute('SELECT "id", "name", "basePrice", "price" FROM "Product" LIMIT 5');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
