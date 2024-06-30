import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from '../src/app.module';
import { Category } from '../src/category/entities/category.entity';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Category>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get<Repository<Category>>(
      getRepositoryToken(Category),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/categories (POST)', async () => {
    const category = {
      name: 'Category 1',
    };

    return request(app.getHttpServer())
      .post('/categories')
      .send(category)
      .expect(201)
      .expect((response) => {
        expect(response.body).toMatchObject({
          name: category.name,
        });
      });
  });

  it('/categories (GET)', async () => {
    const count = await repository.count();
    const category = await repository.findOne({ where: { id: 1 } });

    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect((response) => {
        expect(response.body.length).toBe(count);
        expect(response.body[0]).toMatchObject({
          name: category.name,
        });
      });
  });

  it('/categories/:id (GET)', async () => {
    const category = {
      name: 'Category 1',
    };

    const savedCategory = await repository.save(category);

    return request(app.getHttpServer())
      .get(`/categories/${savedCategory.id}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          name: category.name,
        });
      });
  });

  it('/categories/:id (PUT)', async () => {
    const category = {
      name: 'Category 1',
    };

    const savedCategory = await repository.save(category);

    const updateData = {
      name: 'Updated Category',
    };

    return request(app.getHttpServer())
      .put(`/categories/${savedCategory.id}`)
      .send(updateData)
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          name: updateData.name,
        });
      });
  });

  it('/categories/:id (DELETE)', async () => {
    const category = {
      name: 'Category 1',
    };

    const savedCategory = await repository.save(category);

    return request(app.getHttpServer())
      .delete(`/categories/${savedCategory.id}`)
      .expect(200)
      .then(async () => {
        const deletedCategory = await repository.findOne({
          where: { id: savedCategory.id },
        });
        expect(deletedCategory.isDeleted).toBe(true);
      });
  });
});
