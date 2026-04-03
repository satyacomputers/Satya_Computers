require('dotenv').config();
const { createClient } = require('@libsql/client');

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function restore() {
  const products = [
    {
      id: "SC-DEL-5430",
      name: "DELL LATITUDE 5430",
      brand: "Dell",
      processor: "i5 12th Gen",
      ram: "8GB",
      storage: "256GB SSD",
      display: "14\" FHD",
      price: 35000,
      stock: 90,
      image: "/products/dell_latitude_5430.png",
      isFeatured: 1
    },
    {
      id: "SC-HP-260G3",
      name: "HP PRODESK 260 G3 TINY CPU",
      brand: "HP",
      processor: "i5 7th Gen",
      ram: "8GB",
      storage: "256GB SSD",
      display: "N/A",
      price: 13000,
      stock: 80,
      image: "/products/hp_prodesk_260_g3.png",
      isFeatured: 1
    },
    {
      id: "SC-HP-430G3",
      name: "HP 430 G3",
      brand: "HP",
      processor: "i5 6th Gen",
      ram: "8GB",
      storage: "128GB SSD",
      display: "13.3\" FHD",
      price: 13000,
      stock: 48,
      image: "/products/hp_430_g3.png",
      isFeatured: 1
    },
    {
      id: "SC-HP-445G6",
      name: "HP PROBOOK 445-G6 AMD RYZEN 5",
      brand: "HP",
      processor: "AMD Ryzen 5",
      ram: "8GB",
      storage: "256GB SSD",
      display: "14\" FHD",
      price: 17000,
      stock: 50,
      image: "/products/hp_probook_445_g6.png",
      isFeatured: 1
    },
    {
      id: "SC-LEN-P53",
      name: "LENOVO THINKPAD P53 (4GB GRAPHICS)",
      brand: "Lenovo",
      processor: "i7 9th Gen",
      ram: "16GB",
      storage: "512GB SSD",
      display: "15.6\" FHD",
      price: 37000,
      stock: 56,
      image: "/products/lenovo_thinkpad_p53.png",
      isFeatured: 1
    }
  ];

  console.log('--- Committing High-Fidelity Assets To Registry ---');
  
  for (const p of products) {
    try {
      await client.execute({
        sql: `INSERT OR REPLACE INTO "Product" (
          id, name, brand, processor, ram, storage, display, price, stock, stockStatus, image, isFeatured, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        args: [
          p.id, p.name, p.brand, p.processor, p.ram, p.storage, p.display, 
          p.price, p.stock, 'In Stock', p.image, p.isFeatured
        ]
      });
      console.log(`[Provisioned] ${p.name} - ${p.stock} units`);
    } catch (err) {
      console.error(`[Error] Failed to provision ${p.name}:`, err.message);
    }
  }
  
  console.log('--- Registry Update Complete ---');
}

restore();
