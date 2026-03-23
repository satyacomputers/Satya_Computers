
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.product.count();
  console.log('Total Products in DB:', count);

  const hpProducts = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'HP' } },
        { brand: { contains: 'HP' } }
      ]
    }
  });

  console.log('HP Products found:', hpProducts.length);
  hpProducts.forEach(p => console.log(`- ${p.name} (ID: ${p.id})` ));

  await prisma.$disconnect();
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
