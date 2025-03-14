import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DatabaseService } from 'src/database/database.service';
import { ProductDetailDto } from './dto/product-detail.dto';
import {
  formatProducts,
  formatProductDetail,
  formatProductsWithDiscount,
} from 'src/utils/product-utils';
import { ReviewService } from 'src/review/review.service';
import { FeatureService } from 'src/feature/feature.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly db: DatabaseService,
    private readonly reviewService: ReviewService,
    private readonly featureService: FeatureService,
  ) {}

  create(createProductDto: CreateProductDto): string {
    return 'This action adds a new product';
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

    return formatProducts(this.db, products, userId);
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

    const reviews = await this.reviewService.findByProductId(productId);
    const features = await this.featureService.findByProductId(productId);

    let randomProducts = await this.findByCategory(
      product.category.id,
      userId,
      productId,
    );
    randomProducts = randomProducts.sort(() => 0.5 - Math.random()).slice(0, 4);

    return formatProductDetail(
      product,
      reviews,
      features,
      randomProducts,
      userId,
    );
  }

  update(id: number, updateProductDto: UpdateProductDto): string {
    return `This action updates a #${id} product`;
  }

  async findByCategory(
    categoryId: number,
    userId?: string,
    excludeProductId?: number,
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

    return formatProducts(this.db, products, userId);
  }

  remove(id: number): string {
    return `This action removes a #${id} product`;
  }

  async findNewProducts(userId?: string): Promise<any[]> {
    const products = await this.db.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 4,
      include: {
        images: true,
        wishlist: true,
        reviews: true,
        category: true,
      },
    });

    return formatProducts(this.db, products, userId);
  }
  async findFlashSales(
    userId?: string,
  ): Promise<{ products: any[]; maxDiscountTime: string | null }> {
    const now = new Date(); // Fecha y hora actual

    const products = await this.db.product.findMany({
      where: {
        discount: {
          some: {
            startDate: { lte: now }, // Solo traer descuentos que ya comenzaron
            endDate: { gt: now }, // Solo traer descuentos vigentes
          },
        },
      },
      include: {
        images: true,
        wishlist: true,
        reviews: true,
        category: true,
        discount: true,
      },
      take: 10,
    });

    if (products.length === 0) {
      return { products: [], maxDiscountTime: null };
    }

    // Ordenar productos por fecha de finalización del descuento en orden ascendente
    products.sort(
      (a, b) =>
        new Date(a.discount[0].endDate).getTime() -
        new Date(b.discount[0].endDate).getTime(),
    );

    const formattedProducts = await formatProductsWithDiscount(
      this.db,
      products,
      userId,
    );

    // Obtener la fecha de finalización del último descuento activo
    const maxDiscountTime = new Date(
      products[products.length - 1].discount[0].endDate,
    ).toISOString();

    return { products: formattedProducts, maxDiscountTime };
  }
}
