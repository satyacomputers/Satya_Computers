require('dotenv').config();
const { createClient } = require('@libsql/client');
const crypto = require('crypto');

const client = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });

const manualProducts = [
  {
    name: 'Dell XPS 14 9440',
    brand: 'Dell',
    category: 'ultrabook',
    processor: 'Intel Core Ultra 7 155H',
    ram: '32GB LPDDR5x',
    storage: '1TB NVMe Gen4',
    display: '14.5" 3.2K OLED Touch',
    os: 'Windows 11 Pro',
    price: 185000,
    image: '/products/dell-xps-14-9440.png',
    description: 'The pinnacle of Dell engineering. Featuring the new infinity-edge OLED display and AI-powered performance.'
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    brand: 'Lenovo',
    category: 'business',
    processor: 'Intel Core i7-1365U vPro',
    ram: '16GB LPDDR5',
    storage: '512GB NVMe Gen4',
    display: '14" 2.8K OLED',
    os: 'Windows 11 Pro',
    price: 145000,
    image: '/products/thinkpad_x1.png',
    description: 'Legendary durability and performance. Optimized for elite business professionals with enterprise-grade security.'
  },
  {
    name: 'Apple MacBook Pro 14 (M3 Max)',
    brand: 'Apple',
    category: 'ultrabook',
    processor: 'Apple M3 Max (14-core)',
    ram: '36GB Unified Memory',
    storage: '1TB SSD',
    display: '14" Liquid Retina XDR',
    os: 'macOS Sonoma',
    price: 299900,
    image: '/products/macbook_pro.png',
    description: 'Extreme performance for pro workflows. The most advanced laptop for developers and creators.'
  },
  {
    name: 'Razer Blade 16 (2024)',
    brand: 'Razer',
    category: 'gaming',
    processor: 'Intel Core i9-14900HX',
    ram: '32GB DDR5',
    storage: '2TB NVMe Gen4',
    display: '16" Mini-LED Dual-Mode',
    os: 'Windows 11 Home',
    price: 385000,
    image: '/products/razer_laptop_premium.png',
    description: 'The worlds first dual-mode Mini-LED display. Uncompromising gaming performance in a sleek aluminum chassis.'
  },
  {
    name: 'ASUS ROG Strix G16',
    brand: 'ASUS',
    category: 'gaming',
    processor: 'Intel Core i9-13980HX',
    ram: '16GB DDR5',
    storage: '1TB NVMe Gen4',
    display: '16" QHD+ 240Hz Nebula',
    os: 'Windows 11 Home',
    price: 165000,
    image: '/products/rog_strix.png',
    description: 'Dominate the battlefield. High-refresh display and advanced Tri-Fan cooling system for consistent performance.'
  },
  {
    name: 'Acer Predator Helios 16',
    brand: 'Acer',
    category: 'gaming',
    processor: 'Intel Core i7-13700HX',
    ram: '16GB DDR5',
    storage: '1TB NVMe Gen4',
    display: '16" WQXGA 240Hz',
    os: 'Windows 11 Home',
    price: 125000,
    image: '/products/acer_laptop_premium.png',
    description: 'Battle-ready performance. Featuring superior thermal management and a high-fidelity gaming display.'
  },
  {
    name: 'Lenovo Thinkpad E495 AMD Ryzen 5',
    brand: 'Lenovo',
    category: 'business',
    processor: 'AMD Ryzen 5 3500U',
    ram: '16GB DDR4',
    storage: '512GB SSD',
    display: '14" FHD IPS',
    os: 'Windows 11 Pro',
    price: 32000,
    image: '/products/tp_4.png',
    description: 'Reliable business performance with AMD Ryzen power. Perfect choice for versatile workplace productivity.'
  }
];

async function restore() {
  console.log('RESTORING MANUAL INVENTORY... High-Fidelity Precision Protocol Active.');
  
  for (const p of manualProducts) {
    const productId = `p_${crypto.randomBytes(6).toString('hex')}`;
    const bulk5 = Math.round(p.price * 0.95);
    const bulk11 = Math.round(p.price * 0.9);
    const bulk26 = Math.round(p.price * 0.85);

    await client.execute({
      sql: `INSERT INTO Product (
        id, name, brand, category, processor, ram, storage, display, os, 
        price, bulkPrice5_10, bulkPrice11_25, bulkPrice26Plus, 
        stock, stockStatus, image, description, isFeatured, warranty, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [
        productId, p.name, p.brand, p.category, p.processor, p.ram, p.storage, p.display, p.os,
        p.price, bulk5, bulk11, bulk26,
        120, 'In Stock', p.image, p.description, 1, '1 Year',
      ]
    });
    console.log(`Restored: ${p.name}`);
  }
  
  console.log('RESTORATION COMPLETE. 7 manual products integrated into the high-performance catalog.');
  process.exit(0);
}

restore();
