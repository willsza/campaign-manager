import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
  ) {}

  create(campaign: Partial<Campaign>): Promise<Campaign> {
    const newCampaign = this.campaignRepository.create(campaign);
    return this.campaignRepository.save(newCampaign);
  }

  findAll() {
    return `This action returns all campaign`;
  }

  findOne(id: number) {
    return `This action returns a #${id} campaign`;
  }

  // update(id: number, updateCampaignDto: UpdateCampaignDto) {
  //   return `This action updates a #${id} campaign`;
  // }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }
}
