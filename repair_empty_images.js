const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function repairEmptyImages() {
  try {
    const emptyRows = await client.execute('SELECT id, name, brand FROM "Product" WHERE image IS NULL OR image = \'\' OR image = \'{}\'');
    console.log(`Found ${emptyRows.rows.length} products with missing or empty image paths.`);

    const FALLBACK_IMAGE = '/products/dell_laptop_premium.png';

    for (const row of emptyRows.rows) {
      const brand = row.brand;
      const id = row.id;
      const name = row.name;

      // Map brand to default image
      let defaultImg = FALLBACK_IMAGE;
      if (brand === 'Apple') defaultImg = '/products/macbook_pro.png';
      else if (brand === 'Dell') defaultImg = '/products/dell_laptop_premium.png';
      else if (brand === 'HP') defaultImg = '/products/hp_prodesk_260_g3.png';
      else if (brand === 'Lenovo') defaultImg = '/products/lenovo_thinkpad_p53.png';

      console.log(`Repairing [${id}] ${name} -> ${defaultImg}`);
      
      await client.execute({
        sql: 'UPDATE "Product" SET image = ? WHERE id = ?',
        args: [defaultImg, id]
      });

      // Also ensure gallery isn't an empty string if it needs to be parsed as JSON
      await client.execute({
        sql: 'UPDATE "Product" SET gallery = ? WHERE id = ? AND (gallery IS NULL OR gallery = "")',
        args: [JSON.stringify([defaultImg]), id]
      });
    }
    
    console.log('Database image repair complete.');
  } catch (e) {
    console.error('Database repair failed:', e);
  }
}

repairEmptyImages();
