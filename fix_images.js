const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const IMAGE_MAP = {
  'Apple': 'macbook_pro.png',
  'Dell': 'dell_laptop_premium.png',
  'HP': 'razer_laptop_premium.png', // Fallback
  'Lenovo': 'thinkpad_x1.png',
  'ASUS': 'rog_strix.png',
  'Acer': 'acer_laptop_premium.png',
  'Razer': 'razer_laptop_premium.png'
};

async function fixImages() {
  try {
    const products = await client.execute('SELECT id, name, brand FROM "Product"');
    console.log(`Checking ${products.rows.length} products...`);

    for (const row of products.rows) {
      const brand = row.brand;
      const id = row.id;
      const newImage = `/products/${IMAGE_MAP[brand] || 'dell_laptop_premium.png'}`;
      
      await client.execute({
        sql: 'UPDATE "Product" SET image = ? WHERE id = ?',
        args: [newImage, id]
      });
      console.log(`Updated ${row.name} -> ${newImage}`);
    }
    console.log('Finished image repair.');
  } catch (e) {
    console.error(e);
  }
}

fixImages();
