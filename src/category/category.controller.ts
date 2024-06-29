import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { Category } from 'src/category/entities/category.entity';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: Partial<CreateCategoryDto>,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
