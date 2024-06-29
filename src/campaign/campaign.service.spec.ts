import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';
import { CampaignStatus } from './enums/status.enum';

describe('CampaignService', () => {
  let service: CampaignService;
  let campaignRepository: Repository<Campaign>;
  let categoryRepository: Repository<Category>;
  let campaignRepositories: Repository<Campaign[]>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        {
          provide: getRepositoryToken(Campaign),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
    campaignRepository = module.get<Repository<Campaign>>(
      getRepositoryToken(Campaign),
    );
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    campaignRepositories = module.get<Repository<Campaign[]>>(
      getRepositoryToken(Campaign),
    );
  });

  describe('findAll', () => {
    it('should return an array of campaigns', async () => {
      const campaigns = [{ id: 1, isDeleted: false }] as Campaign[];
      jest.spyOn(campaignRepository, 'find').mockResolvedValue(campaigns);

      expect(await service.findAll()).toEqual(campaigns);
    });
  });

  describe('findOne', () => {
    it('should return a campaign', async () => {
      const campaign = { id: 1, isDeleted: false } as Campaign;
      jest.spyOn(campaignRepository, 'findOne').mockResolvedValue(campaign);

      expect(await service.findOne(1)).toEqual(campaign);
    });

    it('should throw NotFoundException if campaign does not exist', async () => {
      jest.spyOn(campaignRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a campaign', async () => {
      const createDto = {
        categoryId: 1,
        dataInicio: new Date(Date.now() + 1000),
        dataFim: new Date(Date.now() + 10000),
        nome: 'Campaign',
      } as CreateCampaignDto;

      const category = { id: 1, name: 'Categoria 1' } as Category;
      const campaign = {
        id: 1,
        ...createDto,
        dataCadastro: new Date(),
        isDeleted: false,
        status: CampaignStatus.ATIVA,
        category,
      } as Campaign;

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);
      jest.spyOn(campaignRepository, 'create').mockReturnValue(campaign);
      jest.spyOn(campaignRepository, 'save').mockResolvedValue(campaign);

      expect(await service.create(createDto)).toEqual(campaign);
    });

    it('should throw ValidationException if dates are invalid', async () => {
      const createDto = {
        categoryId: 1,
        dataInicio: new Date(Date.now() - 10000),
        dataFim: new Date(),
        nome: 'Campaign',
      } as CreateCampaignDto;

      await expect(service.create(createDto)).rejects.toThrow(
        'Data de início não pode ser menor que a data atual.',
      );
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const createDto = {
        categoryId: 1,
        dataInicio: new Date(Date.now() + 1000),
        dataFim: new Date(Date.now() + 10000),
        nome: 'Campaign',
      } as CreateCampaignDto;

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a campaign', async () => {
      const updateDto = {
        dataInicio: new Date(Date.now() + 1000),
        dataFim: new Date(Date.now() + 10000),
        categoryId: 1,
      } as UpdateCampaignDto;

      const category = { id: 1 } as Category;
      const campaign = { id: 1, isDeleted: false, category } as Campaign;

      jest.spyOn(service, 'findOne').mockResolvedValue(campaign);
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);
      jest.spyOn(campaignRepository, 'save').mockResolvedValue(campaign);

      expect(await service.update(1, updateDto)).toEqual(campaign);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      const updateDto = {
        dataInicio: new Date(),
        dataFim: new Date(Date.now() + 10000),
        categoryId: 1,
      } as UpdateCampaignDto;

      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 1 } as Campaign);
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a campaign', async () => {
      const campaign = { id: 1, isDeleted: false } as Campaign;

      jest.spyOn(service, 'findOne').mockResolvedValue(campaign);
      jest.spyOn(campaignRepository, 'save').mockResolvedValue(campaign);

      await service.remove(1);
      expect(campaign.isDeleted).toBe(true);
    });
  });

  describe('updateAllCampaignStatuses', () => {
    it('should update status of expired campaigns', async () => {
      const category = { id: 1, name: 'Categoria 1' } as Category;
      const campaigns = [
        {
          id: 1,
          nome: 'Campaign 1',
          dataCadastro: new Date(),
          dataFim: new Date(Date.now() - 10000),
          status: CampaignStatus.ATIVA,
          isDeleted: false,
          category,
        } as Campaign,
        {
          id: 2,
          nome: 'Campaign 2',
          dataCadastro: new Date(),
          dataFim: new Date(Date.now() + 10000),
          status: CampaignStatus.ATIVA,
          isDeleted: false,
          category,
        } as Campaign,
      ] as Campaign[];

      jest.spyOn(campaignRepository, 'find').mockResolvedValue(campaigns);
      jest
        .spyOn(campaignRepositories, 'save')
        .mockImplementation(async (campaigns) => {
          return campaigns.map((campaign) => ({ ...campaign }));
        });

      await service.updateAllCampaignStatuses();

      expect(campaigns[0].status).toBe(CampaignStatus.EXPIRADA);
      expect(campaigns[1].status).toBe(CampaignStatus.ATIVA);
    });
  });
});
