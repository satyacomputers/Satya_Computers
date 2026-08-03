const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const parts = [
    {
      name: 'Samsung 990 Pro 1TB NVMe Gen4 SSD',
      brand: 'Samsung',
      processor: 'Pascal Controller',
      ram: '1GB LPDDR4',
      storage: '1TB NVMe',
      display: 'N/A',
      price: 9500,
      stockStatus: 'In Stock',
      image: '/products/samsung-990-pro.png',
      description: 'The ultimate NVMe Gen4 SSD for high-performance workstations.'
    },
    {
      name: 'Crucial 16GB DDR5 5600MHz Laptop RAM',
      brand: 'Crucial',
      processor: 'SO-DIMM',
      ram: '16GB',
      storage: '5600MHz',
      display: 'N/A',
      price: 5200,
      stockStatus: 'In Stock',
      image: '/products/crucial-ram.png',
      description: 'High-speed DDR5 memory for the latest laptop platforms.'
    },
    {
      name: 'Dell Latitude 63Wh Original Battery',
      brand: 'Dell',
      processor: 'Li-ion',
      ram: '63Wh',
      storage: '4-Cell',
      display: 'N/A',
      price: 4500,
      stockStatus: 'In Stock',
      image: '/products/dell-battery.png',
      description: 'Genuine Dell replacement battery for Latitude series.'
    }
  ];

  for (const part of parts) {
    await prisma.product.upsert({
      where: { id: part.name.replace(/\s+/g, '-').toLowerCase() },
      update: part,
      create: {
        id: part.name.replace(/\s+/g, '-').toLowerCase(),
        ...part
      }
    });
    console.log(`Upserted: ${part.name}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
