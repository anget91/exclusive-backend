import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductService {
  constructor(private readonly db: DatabaseService) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(userId?: string) {
    let user = null;
    if (userId) {
      user = await this.db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }
    }

    const products = await this.db.product.findMany({
      include: {
        images: true,
        wishlist: true,
        reviews: true,
      },
    });

    return products.map((product) => {
      const mainImage = product.images.find((image) => image.isMain);

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: mainImage ? mainImage.imageUrl : null,
        altText: mainImage ? mainImage.altText : null,
        isInWishlist: userId
          ? product.wishlist.some((wish) => wish.userId === userId)
          : false,
        reviewCount: product.reviews.length,
        averageRating: product.reviews.length
          ? (
              product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              product.reviews.length
            ).toFixed(1)
          : null,
      };
    });
  }

  async findRandom(userId: string) {
    const products = await this.findAll(userId);
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
