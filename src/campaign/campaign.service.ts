import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from 'src/category/entities/category.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

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

  async update(
    id: number,
    updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    const campaign = await this.findOne(id);

    if (updateCampaignDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateCampaignDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Categoria não encontrada.');
      }

      campaign.category = category;
    }

    Object.assign(campaign, updateCampaignDto);
    return this.campaignRepository.save(campaign);
  }

  async remove(id: number): Promise<void> {
    const campaign = await this.findOne(id);
    campaign.isDeleted = true;
    await this.campaignRepository.save(campaign);
  }
}
