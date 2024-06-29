import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreateCampaignDto } from 'src/campaign/dto/create-campaign.dto';
import { CampaignService } from './campaign.service';
import { Campaign } from './entities/campaign.entity';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
  ): Promise<Campaign> {
    return this.campaignService.create(createCampaignDto);
  }

  @Get()
  findAll(): Promise<Campaign[]> {
    return this.campaignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Campaign> {
    return this.campaignService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() campaign: Partial<Campaign>,
  ): Promise<Campaign> {
    return this.campaignService.update(id, campaign);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.campaignService.remove(id);
  }
}
