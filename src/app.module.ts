import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ScenariosModule } from './scenarios/scenarios.module';
import { EstimateModule } from './estimate/estimate.module';
import { CalculateModule } from './calculate/calculate.module';
import { OptimizeModule } from './optimize/optimize.module';
import { ReportModule } from './report/report.module';
import { FactorsModule } from './factors/factors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/greenore'),
    AuthModule,
    ProjectsModule,
    ScenariosModule,
    EstimateModule,
    CalculateModule,
    OptimizeModule,
    ReportModule,
    FactorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}