import { Injectable, NotFoundException } from '@nestjs/common';
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

  findAll(): Promise<Campaign[]> {
    return this.campaignRepository.find({ where: { isDeleted: false } });
  }

  async findOne(id: number): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });

    if (!campaign || campaign.isDeleted) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async update(id: number, campaign: Partial<Campaign>): Promise<Campaign> {
    await this.findOne(id);
    await this.campaignRepository.update(id, campaign);
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} campaign`;
  }
}
