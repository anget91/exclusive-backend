import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { ProductModule } from 'src/product/product.module';
import { CategoryModule } from 'src/category/category.module';
import { ReviewModule } from 'src/review/review.module';
import { WishlistModule } from 'src/wishlist/wishlist.module';
import { FeatureModule } from 'src/feature/feature.module';
import { CartModule } from 'src/cart/cart.module';
import { DiscountModule } from 'src/discount/discount.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [UserModule, ProductModule, CategoryModule, ReviewModule, WishlistModule, FeatureModule,CartModule,DiscountModule, OrderModule,ReviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
