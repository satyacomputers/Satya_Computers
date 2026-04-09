require('dotenv').config();
console.log('DB URL:', process.env.DATABASE_URL ? 'PRESENT' : 'MISSING');
console.log('ADMIN_USERNAME:', process.env.ADMIN_USERNAME ? 'PRESENT' : 'MISSING');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'PRESENT' : 'MISSING');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

const { createClient } = require('@libsql/client');
const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function test() {
  try {
    const result = await client.execute('SELECT 1');
    console.log('DB Connection: SUCCESS');
  } catch (err) {
    console.log('DB Connection: FAILED', err.message);
  }
}
test();
