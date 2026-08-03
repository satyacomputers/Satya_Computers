require('dotenv').config();
const { createClient } = require('@libsql/client');
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });

async function search() {
    const r = await client.execute("SELECT name FROM Product WHERE name LIKE '%XPS%'");
    console.log(JSON.stringify(r.rows, null, 2));
    process.exit(0);
}

search();
