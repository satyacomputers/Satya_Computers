const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL.replace('file:', 'file:./'), // Fix for local relative path
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function seedInternalParts() {
  const parts = [
    {
      id: 'part-001',
      name: 'Samsung 990 Pro 1TB NVMe Gen4',
      brand: 'Samsung',
      processor: 'Gen4 Controller',
      ram: '1GB Cache',
      storage: '1TB',
      price: 9500,
      description: 'Ultra-fast Gen4 NVMe SSD for enterprise workloads and high-performance gaming. Speeds up to 7450MB/s.',
      image: '/parts/ssd.png' // I will mention I added these
    },
    {
      id: 'part-002',
      name: 'Crucial 16GB DDR5 5600MHz Laptop RAM',
      brand: 'Crucial',
      processor: 'N/A',
      ram: '16GB',
      storage: 'DDR5',
      price: 5200,
      description: 'High-speed professional DDR5 memory for next-generation laptops. Enhanced efficiency and multitasking.',
      image: '/parts/ram.png'
    },
    {
       id: 'part-003',
       name: 'OEM Latitude 5420 High-Capacity Battery',
       brand: 'Dell',
       processor: '4-Cell',
       ram: '63Wh',
       storage: 'Li-ion',
       price: 4500,
       description: 'Original equipment manufacturer certified battery for Dell Latitude series. Maximum cycle life.',
       image: '/parts/battery.png'
    }
  ];

  for (const part of parts) {
    await client.execute({
      sql: `INSERT INTO "Product" (id, name, brand, processor, ram, storage, price, description, image, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [part.id, part.name, part.brand, part.processor, part.ram, part.storage, part.price, part.description, part.image]
    });
    console.log(`Added ${part.name}`);
  }
}

seedInternalParts().catch(console.error);
