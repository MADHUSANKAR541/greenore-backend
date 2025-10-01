import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ScenariosController } from './scenarios.controller';
import { ScenariosService } from './scenarios.service';
import { ScenarioProcessor } from './scenario.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'scenario-processing',
    }),
  ],
  controllers: [ScenariosController],
  providers: [ScenariosService, ScenarioProcessor],
  exports: [ScenariosService],
})
export class ScenariosModule {}
