import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { DatabaseService } from 'src/database/database.service';
import { formatProducts } from 'src/utils/product-utils';

@Injectable()
export class WishlistService {
  constructor(private readonly db: DatabaseService) {}
  create(createWishlistDto: CreateWishlistDto) {
    return 'This action adds a new wishlist';
  }

  async findAll(userId?: string) {
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    const wishlistProducts = await this.db.wishlist.findMany({
      where: { userId: userId },
      include: {
        product: {
          include: {
            images: true,
            wishlist: true,
            reviews: true,
            category: true,
          },
        },
      },
    });
    const products = wishlistProducts.map(
      (wishlistItem) => wishlistItem.product,
    );
    return formatProducts(this.db, products, userId);
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
