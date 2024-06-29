import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  findAll(): Promise<Campaign[]> {
    return this.campaignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Campaign> {
    return this.campaignService.findOne(id);
  }

  @Post()
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
  ): Promise<Campaign> {
    return this.campaignService.create(createCampaignDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    return this.campaignService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.campaignService.remove(id);
  }
}
