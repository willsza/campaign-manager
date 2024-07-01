import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CampaignModule } from './campaign/campaign.module';
import { CampaignService } from './campaign/campaign.service';
import { CategoryModule } from './category/category.module';
import { CategoryService } from './category/category.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const categoryService = appContext
    .select(CategoryModule)
    .get(CategoryService);
  const campaignService = appContext
    .select(CampaignModule)
    .get(CampaignService);

  await categoryService.seed();
  await campaignService.seed();

  await appContext.close();
}

bootstrap();
