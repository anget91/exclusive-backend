import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ReviewService } from 'src/review/review.service';
import { FeatureService } from 'src/feature/feature.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService, ReviewService,FeatureService],
})
export class ProductModule {}
