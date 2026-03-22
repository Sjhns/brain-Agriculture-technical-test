import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { vi } from 'vitest';
import { App } from 'supertest/types';
import { mockValidProducerDto, mockInvalidAreaProducerDto, mockInvalidCpfProducerDto } from './mocks/producer.mock';

describe('ProducersController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService = {
    producer: {
      create: vi.fn(),
      findMany: vi.fn().mockResolvedValue([{ id: '1', name: 'Mock Producer' }]),
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/producers (POST) - blocks invalid farm area', () => {
    return request(app.getHttpServer())
      .post('/producers')
      .send(mockInvalidAreaProducerDto)
      .expect(400);
  });

  it('/producers (POST) - blocks invalid CPF', () => {
    return request(app.getHttpServer())
      .post('/producers')
      .send(mockInvalidCpfProducerDto)
      .expect(400);
  });

  it('/producers (GET) - lists producers', () => {
    return request(app.getHttpServer())
      .get('/producers')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([{ id: '1', name: 'Mock Producer' }]);
      });
  });
});
