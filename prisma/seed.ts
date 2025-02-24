import { PrismaClient } from '@prisma/client';
import { categories } from './seed/categories';
import { products } from './seed/products';
import { users } from './seed/users';
import { productImages } from './seed/productimage';
import { reviews } from './seed/reviews';
import { wishlist } from './seed/wishlist';
import { reviewImages } from './seed/reviewImages';
import { features } from './seed/features';
import { productFeatures } from './seed/productFeatures';
import { hashPassword } from '../src/utils/password-hash';

const prisma = new PrismaClient();

async function main() {
  // Eliminar registros existentes
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.reviewImage.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.featureProduct.deleteMany();

  // Reiniciar el valor autoincrementable
  await prisma.$executeRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Product AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Category AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE ProductImage AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Review AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE wishlist AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE reviewImage AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE feature AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE featureProduct AUTO_INCREMENT = 1`;

  const resolvedUsers = await Promise.all(
    users.map(async (user) => ({
      ...user,
      passwordHash: await hashPassword(user.passwordHash),
    }))
  );
  await prisma.user.createMany({
    data: resolvedUsers,
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
  await prisma.wishlist.createMany({
    data: wishlist,
  });
  await prisma.reviewImage.createMany({
    data: reviewImages,
  });
  await prisma.feature.createMany({
    data: features,
  });
  await prisma.featureProduct.createMany({
    data: productFeatures,
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
