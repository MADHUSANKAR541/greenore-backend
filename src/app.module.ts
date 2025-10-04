import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
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
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'greenore',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-create tables in development
    }),
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