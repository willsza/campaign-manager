import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignModule } from './campaign/campaign.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'campaign_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CampaignModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
