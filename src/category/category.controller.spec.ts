import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';

describe('CategoryController', () => {
  let controller: CategoryController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: CategoryService;

  const mockCategoryService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const category = {
    id: 1,
    name: 'Category 1',
    isDeleted: false,
  } as Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      mockCategoryService.findAll.mockResolvedValue([category]);

      const result = await controller.findAll();
      expect(result).toEqual([category]);
      expect(mockCategoryService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      mockCategoryService.findOne.mockResolvedValue(category);

      const result = await controller.findOne(1);
      expect(result).toEqual(category);
      expect(mockCategoryService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoryService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a category', async () => {
      const createDto: CreateCategoryDto = { name: 'New Category' };

      mockCategoryService.create.mockResolvedValue(category);

      const result = await controller.create(createDto);
      expect(result).toEqual(category);
      expect(mockCategoryService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the category', async () => {
      const updateDto: Partial<CreateCategoryDto> = {
        name: 'Updated Category',
      };

      mockCategoryService.update.mockResolvedValue({
        ...category,
        ...updateDto,
      });

      const result = await controller.update(1, updateDto);
      expect(result).toEqual({ ...category, ...updateDto });
      expect(mockCategoryService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove the category', async () => {
      mockCategoryService.remove.mockResolvedValue(undefined);

      await expect(controller.remove(1)).resolves.toBeUndefined();
      expect(mockCategoryService.remove).toHaveBeenCalledWith(1);
    });
  });
});
