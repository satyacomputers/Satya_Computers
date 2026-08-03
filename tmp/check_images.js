require('dotenv').config();
const { createClient } = require('@libsql/client');
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
client.execute("SELECT name, image FROM Product WHERE name LIKE '%HP 430%' ").then(r => {
  console.log(JSON.stringify(r.rows, null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
