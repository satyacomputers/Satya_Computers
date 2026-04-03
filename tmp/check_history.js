require('dotenv').config();
const { createClient } = require('@libsql/client');
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });

async function findOrderedProducts() {
    const r = await client.execute('SELECT products FROM "CustomerOrder"');
    const names = new Set();
    r.rows.forEach(row => {
        try {
            const products = JSON.parse(row.products);
            products.forEach(p => names.add(p.name));
        } catch (e) {}
    });
    console.log(JSON.stringify(Array.from(names), null, 2));
    process.exit(0);
}

findOrderedProducts();
