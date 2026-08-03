import 'dotenv/config';
import prisma from './lib/prisma';
import { products } from './data/products';

async function main() {
  console.log('Seeding products...');
  
  for (const p of products) {
    try {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {
          name: p.name,
          brand: p.brand,
          processor: p.specs?.processor || 'N/A',
          ram: p.specs?.ram || 'N/A',
          storage: p.specs?.storage || 'N/A',
          display: p.specs?.screen || 'N/A',
          price: p.price,
          image: p.image,
          description: p.description,
          stockStatus: 'In Stock'
        },
        create: {
          id: p.id,
          name: p.name,
          brand: p.brand,
          processor: p.specs?.processor || 'N/A',
          ram: p.specs?.ram || 'N/A',
          storage: p.specs?.storage || 'N/A',
          display: p.specs?.screen || 'N/A',
          price: p.price,
          image: p.image,
          description: p.description,
          stockStatus: 'In Stock'
        }
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Failed to seed ${p.name}:`, err.message);
      } else {
        console.error(`Failed to seed ${p.name}:`, err);
      }
    }
  }
  
  const count = await prisma.product.count();
  console.log(`Seeding complete. Total products in DB: ${count}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
