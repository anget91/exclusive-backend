import { Module } from '@nestjs/common';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports :[DatabaseModule],
  controllers: [FeatureController],
  providers: [FeatureService],
})
export class FeatureModule {}
