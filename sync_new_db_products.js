const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const crypto = require('crypto');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

async function run() {
  console.log('Importing products to: ' + process.env.DATABASE_URL);
  
  // 1. Sync from CSV (Append mode)

  // 2. Read CSV
  const csvPath = path.join(process.cwd(), 'public', 'products', 'products.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const rawPrice = parseInt(row['Price']) || 0;
    const baseName = row['Model'];
    
    let brand = 'Unknown';
    const bh = baseName.toUpperCase();
    if (bh.includes('DELL')) brand = 'Dell';
    else if (bh.includes('LENOVO') || bh.includes('THINKPAD')) brand = 'Lenovo';
    else if (bh.includes('HP')) brand = 'HP';
    else if (bh.includes('MACBOOK') || bh.includes('APPLE')) brand = 'Apple';
    else brand = 'Mixed';

    const category = brand === 'Apple' ? 'MacBook' : 'Laptop';
    const isFeatured = rawPrice >= 40000;
    // Enhanced Image Mapping Engine
    let imagePath = `/products/clean_${(i % 33) + 1}.png`;
    
    // Fix for corrupted downloads
    if (imagePath.includes('clean_5.png') || imagePath.includes('clean_6.png')) {
      imagePath = `/products/clean_1.png`; // Secure fallback
    }

    const availableFiles = fs.readdirSync(path.join(process.cwd(), 'public', 'products'));
    const modelSlug = baseName.toLowerCase()
      .replace(/  +/g, ' ')
      .replace(/ /g, '_')
      .replace(/\(/g, '')
      .replace(/\)/g, '')
      .replace(/-/g, '_');

    // Strategic Match Attempt
    const specificImage = availableFiles.find(f => {
      const fn = f.toLowerCase();
      // Match exactly or via fuzzy contains
      return fn === `${modelSlug}.png` || 
             (fn.includes(modelSlug) && fn.endsWith('.png')) || 
             (modelSlug.includes('latitude') && fn.includes(modelSlug.split('latitude')[1].trim().replace(/ /g, '_'))) ||
             (modelSlug.includes('thinkpad') && fn.includes(modelSlug.split('thinkpad')[1].trim().replace(/ /g, '_'))) ||
             (modelSlug.includes('probook') && fn.includes(modelSlug.split('probook')[1].trim().replace(/ /g, '_')));
    });

    if (specificImage) {
      imagePath = `/products/${specificImage}`;
    }

    const productId = `p_${crypto.randomBytes(6).toString('hex')}`;
    const description = `Premium refurbished ${brand} ${baseName}. Professionally inspected asset with ${row['RAM']} RAM and ${row['Storage']}GB SSD. Windows 11 Pro installed.`;
    const os = brand === 'Apple' ? 'macOS Sonoma' : 'Windows 11 Pro';

    await client.execute({
        sql: `INSERT INTO Product (id, name, brand, category, processor, ram, storage, display, os, price, bulkPrice5_10, bulkPrice11_25, bulkPrice26Plus, stockStatus, stock, image, description, isFeatured, warranty, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        args: [productId, baseName, brand, category, row['Configuration'] || 'Elite', row['RAM'] || '8GB', row['Storage'] ? `${row['Storage']}GB` : '256GB', row['Size'] ? `${row['Size']}"` : '14"', os, rawPrice, Math.round(rawPrice*0.95), Math.round(rawPrice*0.9), Math.round(rawPrice*0.85), 'In Stock', 120, imagePath, description, isFeatured ? 1 : 0, row['Warranty'] || '1 Year']
    });

    // Category
    try {
        const catSlug = category.toLowerCase();
        await client.execute({
            sql: 'INSERT OR IGNORE INTO Category (id, name, slug, image, createdAt, updatedAt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
            args: [`c_${catSlug}`, category, catSlug, imagePath]
        });
    } catch (ce) {}

    console.log(`Synced: ${baseName} -> ${imagePath}`);
  }

  console.log('Final Import Complete on NEW DB.');
}

run();
