
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany();
  console.log('--- DB PRODUCTS ---');
  products.forEach(p => {
    console.log(`ID: ${p.id} | Brand: ${p.brand} | Name: ${p.name}`);
  });
  await prisma.$disconnect();
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
