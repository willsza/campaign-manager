import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';
import { CampaignStatus } from './enums/status.enum';

describe('CampaignController', () => {
  let controller: CampaignController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: CampaignService;

  const mockCampaignService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const campaign = {
    id: 1,
    nome: 'Campaign 1',
    dataCadastro: new Date(),
    dataFim: new Date(Date.now() + 10000),
    status: CampaignStatus.ATIVA,
    isDeleted: false,
  } as Campaign;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignController],
      providers: [
        {
          provide: CampaignService,
          useValue: mockCampaignService,
        },
      ],
    }).compile();

    controller = module.get<CampaignController>(CampaignController);
    service = module.get<CampaignService>(CampaignService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of campaigns', async () => {
      mockCampaignService.findAll.mockResolvedValue([campaign]);

      const result = await controller.findAll();
      expect(result).toEqual([campaign]);
      expect(mockCampaignService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single campaign', async () => {
      mockCampaignService.findOne.mockResolvedValue(campaign);

      const result = await controller.findOne(1);
      expect(result).toEqual(campaign);
      expect(mockCampaignService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if campaign not found', async () => {
      mockCampaignService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a campaign', async () => {
      const createDto: CreateCampaignDto = {
        nome: 'New Campaign',
        categoryId: 1,
        dataInicio: new Date(),
        dataFim: new Date(Date.now() + 10000),
      };

      mockCampaignService.create.mockResolvedValue(campaign);

      const result = await controller.create(createDto);
      expect(result).toEqual(campaign);
      expect(mockCampaignService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the campaign', async () => {
      const updateDto: UpdateCampaignDto = {
        nome: 'Updated Campaign',
        dataFim: new Date(Date.now() + 20000),
      };

      mockCampaignService.update.mockResolvedValue(campaign);

      const result = await controller.update(1, updateDto);
      expect(result).toEqual(campaign);
      expect(mockCampaignService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove the campaign', async () => {
      mockCampaignService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(1)).resolves.toBeUndefined();
      expect(mockCampaignService.remove).toHaveBeenCalledWith(1);
    });
  });
});
