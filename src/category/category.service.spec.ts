import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

describe('CategoryService', () => {
  let service: CategoryService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<Category>;

  const mockCategoryRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const category = {
    id: 1,
    name: 'Category 1',
    isDeleted: false,
  } as Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      mockCategoryRepository.find.mockResolvedValue([category]);

      const result = await service.findAll();
      expect(result).toEqual([category]);
      expect(mockCategoryRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(category);

      const result = await service.findOne(1);
      expect(result).toEqual(category);
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a category', async () => {
      const createDto: CreateCategoryDto = { name: 'New Category' };

      mockCategoryRepository.create.mockReturnValue(category);
      mockCategoryRepository.save.mockResolvedValue(category);

      const result = await service.create(createDto);
      expect(result).toEqual(category);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(category);
    });
  });

  describe('update', () => {
    it('should update and return the category', async () => {
      const updateDto: UpdateCategoryDto = {
        name: 'Updated Category',
      };

      mockCategoryRepository.findOne.mockResolvedValue(category);
      mockCategoryRepository.save.mockResolvedValue({
        ...category,
        ...updateDto,
      });

      const result = await service.update(1, updateDto);
      expect(result).toEqual({ ...category, ...updateDto });
      expect(mockCategoryRepository.save).toHaveBeenCalledWith({
        ...category,
        ...updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should soft delete the category', async () => {
      mockCategoryRepository.findOne.mockResolvedValue(category);
      mockCategoryRepository.save.mockResolvedValue({
        ...category,
        isDeleted: true,
      });

      await service.remove(1);
      expect(mockCategoryRepository.save).toHaveBeenCalledWith({
        ...category,
        isDeleted: true,
      });
    });
  });
});
