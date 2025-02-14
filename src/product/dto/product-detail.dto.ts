export class ProductDetailDto {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  reviewCount: number;
  averageRating: string | null;
  isInWishlist: boolean;
  images: {
    imageUrl: string;
    altText: string;
    isMain: boolean;
  }[];
  features: {
    name: string;
    value: string;
  }[];
  category: string;
  reviews: {
    userName: string;
    comment: string;
    rating: number;
    images: {
      imageUrl: string;
    }[];
  }[];
  randomProducts: {
    id: number;
    name: string;
    price: number;
    imageUrl: string | null;
    altText: string | null;
    isInWishlist: boolean;
    reviewCount: number;
    averageRating: string | null;
    category: string;
  }[];
}