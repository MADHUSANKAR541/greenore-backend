import { Module } from '@nestjs/common';
import { OptimizeController } from './optimize.controller';
import { OptimizeService } from './optimize.service';

@Module({
  controllers: [OptimizeController],
  providers: [OptimizeService],
  exports: [OptimizeService],
})
export class OptimizeModule {}

