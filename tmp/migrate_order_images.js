require('dotenv').config();
const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });

async function migrate() {
    console.log('MIGRATING EXISTING CUSTOMER ORDERS... Image Resolution Protocol Active.');
    
    // 1. Get all products to build a name-to-image map
    const productResult = await client.execute('SELECT name, image FROM Product');
    const imageMap = {};
    productResult.rows.forEach(p => {
        imageMap[p.name.trim().toLowerCase()] = p.image;
    });

    // 2. Get all orders
    const orderResult = await client.execute('SELECT id, products FROM "CustomerOrder"');
    
    for (const row of orderResult.rows) {
        let products;
        try {
            products = JSON.parse(row.products);
        } catch (e) { continue; }

        let updated = false;
        const newProducts = products.map(p => {
            const key = p.name.trim().toLowerCase();
            if (imageMap[key] && p.image !== imageMap[key]) {
                console.log(`Fixing ${p.name}: ${p.image} -> ${imageMap[key]}`);
                updated = true;
                return { ...p, image: imageMap[key] };
            }
            return p;
        });

        if (updated) {
            await client.execute({
                sql: 'UPDATE "CustomerOrder" SET products = ?, updatedAt = datetime(\'now\') WHERE id = ?',
                args: [JSON.stringify(newProducts), row.id]
            });
        }
    }
    console.log('MIGRATION COMPLETE. All historical records synchronized.');
    process.exit(0);
}

migrate();
