import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCampaignDto: UpdateCampaignDto,
  // ) {
  //   return this.campaignService.update(+id, updateCampaignDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(+id);
  }
}
