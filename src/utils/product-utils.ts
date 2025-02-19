import { NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ProductDetailDto } from 'src/product/dto/product-detail.dto';

export async function formatProducts(
  db: DatabaseService,
  products: any[],
  userId?: string,
): Promise<any[]> {
  let user = null;
  if (userId) {
    user = await db.user.findUnique({
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
        ? product.wishlist?.some((wish) => wish.userId === userId) || false
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


export function formatProductDetail(
  product: any,
  reviews: any[],
  features: any[],
  randomProducts: any[],
  userId?: string,
): ProductDetailDto {
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
      imageUrl:
        product.images?.find((image) => image.isMain)?.imageUrl || null,
      altText: product.images?.find((image) => image.isMain)?.altText || null,
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
    })),
  };
}