import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';
import { ProductDetailDto } from './dto/product-detail.dto';

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
        price: product.price.toNumber(),
        imageUrl: mainImage ? mainImage.imageUrl : null,
        altText: mainImage ? mainImage.altText : null,
        isInWishlist: userId
          ? product.wishlist.some((wish) => wish.userId === userId)
          : false,
        reviewCount: product.reviews ? product.reviews.length : 0,
        averageRating:
          product.reviews && product.reviews.length
            ? (
                product.reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0,
                ) / product.reviews.length
              ).toFixed(1)
            : null,
        category: product.category.name,
      };
    });
  }

  async findAll(userId?: string): Promise<any[]> {
    const products = await this.db.product.findMany({
      include: {
        images: true,
        wishlist: true,
        reviews: true,
        category: true,
      },
    });

    return this.formatProducts(products, userId);
  }

  async findRandom(userId: string): Promise<any[]> {
    const products = await this.findAll(userId);
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }

  async findOne(productId: number, userId?: string): Promise<ProductDetailDto> {
    const product = await this.db.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        reviews: true,
        wishlist: true,
        features: {
          include: {
            feature: true,
          },
        },
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const reviews = await this.db.review.findMany({
      where: { productId: productId },
      include: {
        user: true,
        images: true,
      },
    });
    const features = await this.db.featureProduct.findMany({
      where: { productId: productId },
      include: {
        feature: true,
      },
    });

    let randomProducts = await this.findByCategory(
      product.category.id,
      productId,
      userId,
    );
    randomProducts = randomProducts.sort(() => 0.5 - Math.random()).slice(0, 4);

    return {
      id: product.id,
      name: product.name,
      price: product.price.toNumber(),
      description: product.description,
      stock: product.stock,
      reviewCount: product.reviews ? product.reviews.length : 0,
      averageRating:
        product.reviews && product.reviews.length
          ? (
              product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              product.reviews.length
            ).toFixed(1)
          : null,
      isInWishlist: userId
        ? product.wishlist.some((wish) => wish.userId === userId)
        : false,
      images: product.images.map((image) => ({
        imageUrl: image.imageUrl,
        altText: image.altText,
        isMain: image.isMain,
      })),
      features: features.map((feature) => ({
        name: feature.feature.name,
        value: feature.value,
      })),
      category: product.category.name,
      reviews: reviews.map((review) => ({
        userName: review.user.name,
        comment: review.comment,
        rating: review.rating,
        images: review.images.map((image) => ({
          imageUrl: image.imageUrl,
        })),
      })),
      randomProducts: randomProducts.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images?.find((image) => image.isMain)?.imageUrl || null,
        altText: product.images?.find((image) => image.isMain)?.altText || null,
        isInWishlist: userId ? product.wishlist.some((wish) => wish.userId === userId) : false,
        reviewCount: product.reviews ? product.reviews.length : 0,
        averageRating: product.reviews && product.reviews.length
          ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
          : null,
        category: product.category.name,
      })),
    };
  }

  update(id: number, updateProductDto: UpdateProductDto): string {
    return `This action updates a #${id} product`;
  }

  async findByCategory(
    categoryId: number,
    excludeProductId?: number,
    userId?: string,
  ): Promise<any[]> {
    const whereClause: any = { categoryId: categoryId };
    if (excludeProductId) {
      whereClause.id = { not: excludeProductId };
    }

    const products = await this.db.product.findMany({
      where: whereClause,
      include: {
        images: true,
        wishlist: true,
        reviews: true,
        category: true,
      },
    });

    return this.formatProducts(products, userId);
  }

  remove(id: number): string {
    return `This action removes a #${id} product`;
  }
}
