import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AppModule } from '../src/app.module';
import { Campaign } from '../src/campaign/entities/campaign.entity';

describe('CampaignController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Campaign>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = moduleFixture.get<Repository<Campaign>>(
      getRepositoryToken(Campaign),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/campaigns (POST)', async () => {
    const campaign = {
      nome: 'Campaign 1',
      categoryId: 1,
      dataInicio: '2024-08-08T23:59:59.999Z',
      dataFim: '2024-09-08T23:59:59.999Z',
    };

    return request(app.getHttpServer())
      .post('/campaigns')
      .send(campaign)
      .expect(201)
      .expect((response) => {
        expect(response.body).toMatchObject({
          nome: campaign.nome,
          category: { id: campaign.categoryId },
        });
      });
  });

  it('/campaigns (GET)', async () => {
    const campaigns = await repository.findAndCount({
      where: { isDeleted: false },
    });

    return request(app.getHttpServer())
      .get('/campaigns')
      .expect(200)
      .expect((response) => {
        expect(response.body.length).toBe(campaigns[1]);
        expect(response.body[0]).toMatchObject({
          nome: campaigns[0][1].nome,
        });
      });
  });

  it('/campaigns/:id (GET)', async () => {
    const campaign = {
      nome: 'Campaign 1',
      categoryId: 1,
      dataInicio: new Date(),
      dataFim: new Date(Date.now() + 10000),
    };

    const savedCampaign = await repository.save(campaign);

    return request(app.getHttpServer())
      .get(`/campaigns/${savedCampaign.id}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          nome: campaign.nome,
        });
      });
  });

  it('/campaigns/:id (PUT)', async () => {
    const campaign = {
      nome: 'Campaign 1',
      categoryId: 1,
      dataInicio: new Date(),
      dataFim: new Date(Date.now() + 10000),
    };

    const savedCampaign = await repository.save(campaign);

    const updateData = {
      nome: 'Updated Campaign',
    };

    return request(app.getHttpServer())
      .put(`/campaigns/${savedCampaign.id}`)
      .send(updateData)
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          nome: updateData.nome,
        });
      });
  });

  it('/campaigns/:id (DELETE)', async () => {
    const campaign = {
      nome: 'Campaign 1',
      categoryId: 1,
      dataInicio: new Date(),
      dataFim: new Date(Date.now() + 10000),
    };

    const savedCampaign = await repository.save(campaign);

    return request(app.getHttpServer())
      .delete(`/campaigns/${savedCampaign.id}`)
      .expect(200)
      .then(async () => {
        const deletedCampaign = await repository.findOne({
          where: { id: savedCampaign.id },
        });
        expect(deletedCampaign.isDeleted).toBe(true);
      });
  });
});
