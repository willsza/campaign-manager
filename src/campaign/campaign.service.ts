import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from 'src/category/entities/category.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { Campaign } from './entities/campaign.entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const { categoryId, ...campaignData } = createCampaignDto;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category || !categoryId) {
      throw new NotFoundException('Category not found');
    }

    const newCampaign = this.campaignRepository.create({
      ...campaignData,
      category,
    });
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

  async remove(id: number): Promise<void> {
    const campaign = await this.findOne(id);
    campaign.isDeleted = true;
    await this.campaignRepository.save(campaign);
  }
}
