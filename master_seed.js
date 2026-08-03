const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function main() {
  try {
    console.log('--- MASTER SEEDING PROTOCOL INITIATED ---');

    // 1. Purge existing ephemeral data (Safely)
    console.log('Cleaning existing tables...');
    await client.execute('DELETE FROM "Product"');
    await client.execute('DELETE FROM "Order"');
    await client.execute('DELETE FROM "Offer"');

    // 2. High-Fidelity Products Portfolio
    console.log('Rebuilding Product Portfolio...');
    const products = [
      ['p1', 'MacBook Pro 16 M3 Max', 'Apple', 'apple', 'M3 Max 16-Core', '64GB Unified', '2TB SSD', '16.2" Liquid Retina XDR', 349900.0, 'In Stock', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800', 'The ultimate workstation for creative professionals.', 1],
      ['p2', 'Dell XPS 15 9530', 'Dell', 'ultrabooks', 'Intel i9-13900H', '32GB DDR5', '1TB NVMe', '15.6" OLED 3.5K Touch', 225000.0, 'In Stock', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800', 'Stunning design meet performance powerhouse.', 1],
      ['p3', 'Razer Blade 14 (2024)', 'Razer', 'gaming', 'AMD Ryzen 9 8945HS', '32GB DDR5', '1TB Gen4 SSD', '14" QHD+ 240Hz', 285000.0, 'Low Stock', 'https://images.unsplash.com/photo-1525547718571-039c476729a7?q=80&w=800', 'The most powerful 14-inch gaming laptop period.', 1],
      ['p4', 'ThinkPad X1 Carbon Gen 12', 'Lenovo', 'ultrabooks', 'Intel Ultra 7 155H', '32GB LPDDR5x', '1TB SSD', '14" 2.8K OLED', 195000.0, 'In Stock', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000', 'The legendary business ultrabook, refined for the AI era.', 1],
      ['p5', 'ASUS ROG Zephyrus G16', 'ASUS', 'gaming', 'Intel Ultra 9 185H', '32GB LPDDR5x', '1TB SSD', '16" 2.5K OLED 240Hz', 245000.0, 'In Stock', 'https://images.unsplash.com/photo-1624701928517-44c8ac49d93c?q=80&w=800', 'Sleek, powerful, and portable gaming excellence.', 1],
      ['p6', 'HP ZBook Studio G10', 'HP', 'workstations', 'Intel i9-13900H', '64GB DDR5', '2TB NVMe', '16" 4K DreamColor', 315000.0, 'In Stock', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800', 'Mobile workstation for professional visual effects.', 1],
      ['p7', 'Microsoft Surface Laptop Studio 2', 'Microsoft', 'convertibles', 'Intel i7-13700H', '32GB RAM', '1TB SSD', '14.4" PixelSense Flow', 265000.0, 'In Stock', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800', 'Versatile boundary-pushing 2-in-1 design.', 1],
      ['p8', 'Lenovo Yoga 9i Gen 8', 'Lenovo', 'convertibles', 'Intel i7-1360P', '16GB LPDDR5', '512GB SSD', '14" 2.8K OLED', 165000.0, 'In Stock', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800', 'The ultimate 2-in-1 entertainment experience.', 0]
    ];

    for (const p of products) {
      await client.execute({
        sql: `INSERT INTO "Product" (id, name, brand, category, processor, ram, storage, display, price, stockStatus, image, description, isFeatured, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        args: p
      });
    }

    // 3. Strategic Bulk Orders (Distribution over 4 weeks for charts)
    console.log('Establishing Transaction History...');
    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - (28 * 24 * 60 * 60 * 1000));
    
    // Helper to get random date in range
    const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().slice(0, 19).replace('T', ' ');

    const orders = [
      ['o1', 'ORD-5001', 'Tesla Micro-Grids', 'Elon Musk', 'elon@tesla.com', '+1 420-6900', 'Dell XPS x 20', 20, 4500000.0, 'Confirmed', getRandomDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), now)],
      ['o2', 'ORD-5002', 'SpaceX Satcom', 'Gwynne Shotwell', 'gwynne@spacex.com', '+1 310-5000', 'ThinkPad X1 x 50', 50, 9750000.0, 'Confirmed', getRandomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000))],
      ['o3', 'ORD-5003', 'Homi Bhabha Center', 'Dr. Vikram S.', 'vikram@hbni.res.in', '+91 22-2550', 'Workstations x 5', 5, 1250000.0, 'Pending', getRandomDate(new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000))],
      ['o4', 'ORD-5004', 'Infosys Tech Hub', 'Narayan Murthy', 'nm@infosys.com', '+91 80-2852', 'Laptops x 100', 100, 12000000.0, 'Confirmed', getRandomDate(new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000))],
      ['o5', 'ORD-5005', 'IIT Madras', 'Prof. Kamakoti', 'director@iitm.ac.in', '+91 44-2257', 'Gaming Assets x 10', 10, 2450000.0, 'Quote Sent', getRandomDate(new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000))],
      ['o6', 'ORD-5006', 'RazorPay Ops', 'Harshil Mathur', 'harshil@razorpay.com', '+91 80-4680', 'Apple M3 x 15', 15, 5248500.0, 'Delivered', getRandomDate(new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000))],
      ['o7', 'ORD-5007', 'Zomato HQ', 'Deepinder Goyal', 'dg@zomato.com', '+91 124-426', 'Mixer Spare Parts', 200, 450000.0, 'Confirmed', getRandomDate(fourWeeksAgo, new Date(now.getTime() - 26 * 24 * 60 * 60 * 1000))]
    ];

    for (const o of orders) {
      await client.execute({
        sql: `INSERT INTO "Order" (id, orderId, companyName, contactPerson, email, phone, products, totalUnits, estimatedValue, status, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        args: o
      });
    }

    // 4. Promotional Campaign Signatures
    console.log('Deploying Campaign Assets...');
    const offers = [
      ['off1', 'Flash', 'Spring Performance Surge', '20% off on all NVMe Storage Upgrades.', 'FAST20', 20.0, 1, '2026-04-01 00:00:00', 1],
      ['off2', 'Promo', 'Enterprise Loyalty Bonus', 'Fixed rebate for bulk orders exceeding 50 units.', 'ELITE50', 15.0, 50, '2026-05-15 00:00:00', 1],
      ['off3', 'Seasonal', 'Back to University Ops', 'Student discount for verified academic accounts.', 'LEARN10', 10.0, 1, '2026-08-30 00:00:00', 0]
    ];

    for (const off of offers) {
      await client.execute({
        sql: `INSERT INTO "Offer" (id, type, title, description, code, discount, minOrder, expiryDate, isActive, createdAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        args: off
      });
    }

    console.log('--- MASTER SEEDING PROTOCOL COMPLETE ---');
    console.log('Dashboard Telemetry Sync: READY');
  } catch (err) {
    console.error('SEED FAILURE:', err);
  } finally {
    process.exit(0);
  }
}

main();
