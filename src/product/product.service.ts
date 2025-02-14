import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductService {
  constructor(private readonly db: DatabaseService) {}

  create(createProductDto: CreateProductDto): string {
    return 'This action adds a new product';
  }

  private async formatProducts(products: any[], userId?: string): Promise<any[]> {
    let user = null;
    if (userId) {
      user = await this.db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    return products.map((product) => {
      const mainImage = product.images?.find((image) => image.isMain);

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: mainImage ? mainImage.imageUrl : null,
        altText: mainImage ? mainImage.altText : null,
        isInWishlist: userId
          ? product.wishlist.some((wish) => wish.userId === userId)
          : false,
        reviewCount: product.reviews ? product.reviews.length : 0,
        averageRating: product.reviews && product.reviews.length
          ? (
              product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              product.reviews.length
            ).toFixed(1)
          : null,
      };
    });
  }

  async findAll(userId?: string): Promise<any[]> {
    const products = await this.db.product.findMany({
      include: {
        images: true,
        wishlist: true,
        reviews: true,
      },
    });

    return this.formatProducts(products, userId);
  }

  async findRandom(userId: string): Promise<any[]> {
    const products = await this.findAll(userId);
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }

  async findOne(id: number, userId? : string): Promise<any> {
    const product = await this.db.product.findUnique({
      where: { id },
      include: {
        images: true,
        reviews: true,
        category: true,
        features: {
          include: {
            feature: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const categoryId = product.category.id;

    const randomProducts = await this.RandomByCategory(categoryId, userId);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      images: product.images.map((image) => ({
        imageUrl: image.imageUrl,
        altText: image.altText,
        isMain: image.isMain,
      })),
      randomProducts: randomProducts
    };
  }

  update(id: number, updateProductDto: UpdateProductDto): string {
    return `This action updates a #${id} product`;
  }

  async RandomByCategory(categoryId: number, userId?: string): Promise<any[]> {
    const products = await this.db.product.findMany({
      where: {
        categoryId,
      },
      take: 4,
      include: {
        images: true,
        wishlist: true,
        reviews: true,
      },
    });

    return this.formatProducts(products, userId);
  }

  remove(id: number): string {
    return `This action removes a #${id} product`;
  }
}
