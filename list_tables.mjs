import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN || "";

async function run() {
  const client = createClient({ url, authToken });
  try {
    const res = await client.execute('SELECT name FROM sqlite_master WHERE type="table"');
    console.log('Tables:', res.rows.map(r => r.name).join(', '));
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
