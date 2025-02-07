import { PrismaClient } from '@prisma/client';
import { categories } from './seed/categories';
import { products } from './seed/products';

const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: categories,
  });

  await prisma.product.createMany({
    data: products,
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
