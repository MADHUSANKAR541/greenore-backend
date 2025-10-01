import { Module } from '@nestjs/common';
import { FactorsController } from './factors.controller';
import { FactorsService } from './factors.service';

@Module({
  controllers: [FactorsController],
  providers: [FactorsService],
  exports: [FactorsService],
})
export class FactorsModule {}

