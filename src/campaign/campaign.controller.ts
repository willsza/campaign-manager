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
import { Campaign } from './entities/campaign.entity';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  create(@Body() campaign: Partial<Campaign>): Promise<Campaign> {
    return this.campaignService.create(campaign);
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
