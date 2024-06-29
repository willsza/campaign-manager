import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../category/entities/category.entity';
import { ValidationException } from '../common/exceptions/business.exception';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';
import { CampaignStatus } from './enums/status.enum';

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
    const { categoryId, dataInicio, dataFim, ...campaignData } =
      createCampaignDto;

    if (new Date(dataInicio) < new Date()) {
      throw new ValidationException(
        'Data de início não pode ser menor que a data atual.',
      );
    }

    if (new Date(dataFim) <= new Date(dataInicio)) {
      throw new ValidationException(
        'Data de término não pode ser menor ou igual a data de início.',
      );
    }

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
    const { dataInicio, dataFim } = updateCampaignDto;

    if (dataInicio < new Date()) {
      throw new Error('Data de início não pode ser menor que a data atual.');
    }

    if (dataFim <= dataInicio) {
      throw new Error(
        'Data de fim não pode ser menor ou igual a data de início.',
      );
    }

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

  @Cron(CronExpression.EVERY_MINUTE)
  async updateAllCampaignStatuses(): Promise<void> {
    const campaigns = await this.campaignRepository.find({
      where: { isDeleted: false },
    });

    const now = new Date();

    for (const campaign of campaigns) {
      if (
        new Date(campaign.dataFim) < now &&
        campaign.status !== CampaignStatus.EXPIRADA
      ) {
        campaign.status = CampaignStatus.EXPIRADA;
      }
    }

    await this.campaignRepository.save(campaigns);
  }
}
