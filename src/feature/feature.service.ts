import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FeatureService {
  constructor(private readonly db: DatabaseService) {}
  create(createFeatureDto: CreateFeatureDto) {
    return 'This action adds a new feature';
  }

  findAll() {
    return `This action returns all feature`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feature`;
  }
  async findByProductId(productId: number) {
    return this.db.featureProduct.findMany({
      where: { productId: productId },
      include: {
        feature: true,
      },
    });
  }

  update(id: number, updateFeatureDto: UpdateFeatureDto) {
    return `This action updates a #${id} feature`;
  }

  remove(id: number) {
    return `This action removes a #${id} feature`;
  }
}
