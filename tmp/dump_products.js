require('dotenv').config();
const { createClient } = require('@libsql/client');

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url: url || "",
  authToken: authToken,
});

async function main() {
  const result = await client.execute('SELECT * FROM Product');
  console.log(JSON.stringify(result.rows, null, 2));
}

main().catch(console.error);
