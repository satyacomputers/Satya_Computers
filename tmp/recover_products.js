require('dotenv').config();
const { createClient } = require('@libsql/client');
const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });

async function recover() {
    const r = await client.execute('SELECT products FROM "CustomerOrder"');
    const seen = new Set();
    const products = [];
    
    r.rows.forEach(row => {
        try {
            const items = JSON.parse(row.products);
            items.forEach(item => {
                if (!seen.has(item.name)) {
                    seen.add(item.name);
                    products.push(item);
                }
            });
        } catch (e) {}
    });
    
    console.log(JSON.stringify(products, null, 2));
    process.exit(0);
}

recover();
