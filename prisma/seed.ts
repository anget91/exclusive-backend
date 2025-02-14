import { PrismaClient } from '@prisma/client';
import { categories } from './seed/categories';
import { products } from './seed/products';
import { users } from './seed/users';
import { productImages } from './seed/productimage';
import { reviews } from './seed/reviews';

const prisma = new PrismaClient();

async function main() {
  // Eliminar registros existentes
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.review.deleteMany();

  // Reiniciar el valor autoincrementable
  await prisma.$executeRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Product AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Category AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE ProductImage AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Review AUTO_INCREMENT = 1`;

  // Crear nuevos registros
  await prisma.user.createMany({
    data: users,
  });
  await prisma.category.createMany({
    data: categories,
  });
  await prisma.product.createMany({
    data: products,
  });
 
  await prisma.productImage.createMany({
    data: productImages,
  });
  await prisma.review.createMany({
    data: reviews,
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