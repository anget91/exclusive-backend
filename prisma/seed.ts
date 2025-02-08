import { PrismaClient } from '@prisma/client';
import { categories } from './seed/categories';
import { products } from './seed/products';
import { users } from './seed/users';

const prisma = new PrismaClient();

async function main() {
  // Eliminar registros existentes
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Reiniciar el valor autoincrementable
  await prisma.$executeRaw`ALTER TABLE User AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Product AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Category AUTO_INCREMENT = 1`;

  // Crear nuevos registros
  await prisma.user.createMany({
    data: users,
  });
  await prisma.category.createMany({
    data: categories,
  });

  for (const product of products) {
    const { images, reviews, ...productData } = product;
    const createdProduct = await prisma.product.create({
      data: productData,
    });

    if (images) {
      for (const image of images) {
        await prisma.productImage.create({
          data: {
            ...image,
            productId: createdProduct.id,
          },
        });
      }
    }

    if (reviews) {
      for (const review of reviews) {
        await prisma.review.create({
          data: {
            ...review,
            productId: createdProduct.id,
          },
        });
      }
    }

    // Agregar el producto "Smartphone XYZ" a la wishlist del usuario con UUID 3eaf7f26-ad02-46ac-b32a-3765018eaea1
    if (product.name === 'Smartphone XYZ') {
      await prisma.wishlist.create({
        data: {
          userId: '3eaf7f26-ad02-46ac-b32a-3765018eaea1',
          productId: createdProduct.id,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });