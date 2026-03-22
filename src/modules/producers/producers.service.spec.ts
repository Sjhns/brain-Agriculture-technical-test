import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { ProducersService } from './producers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { DocumentType } from '../../common/domain/enums';

describe('ProducersService', () => {
  let service: ProducersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    // Mock the Prisma service methods
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        {
          provide: PrismaService,
          useValue: {
            producer: {
              findUnique: vi.fn(),
              create: vi.fn(),
              findMany: vi.fn(),
              update: vi.fn(),
              delete: vi.fn(),
            },
            $transaction: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create producer', () => {
    it('should throw BadRequestException if arable + vegetation area > total area', async () => {
      const createDto = {
        document: '60134443026',
        documentType: DocumentType.CPF,
        name: 'John Doe',
        farms: [
          {
            name: 'Farm 1',
            city: 'City A',
            state: 'ST',
            totalArea: 100,
            arableArea: 60,
            vegetationArea: 50, // 110 > 100
            plantedCrops: [],
          },
        ],
      };

      await expect(service.create(createDto as any)).rejects.toThrow(BadRequestException);
    });

    it('should create producer if farms areas are valid', async () => {
      const createDto = {
        document: '60134443026',
        documentType: DocumentType.CPF,
        name: 'John Doe',
        farms: [
          {
            name: 'Farm 1',
            city: 'City A',
            state: 'ST',
            totalArea: 100,
            arableArea: 50,
            vegetationArea: 40, // 90 <= 100
            plantedCrops: [],
          },
        ],
      };

      vi.spyOn(prismaService.producer, 'findUnique').mockResolvedValue(null);
      vi.spyOn(prismaService.producer, 'create').mockResolvedValue({ id: '1', ...createDto, createdAt: new Date(), updatedAt: new Date() } as any);

      const result = await service.create(createDto as any);
      expect(result).toHaveProperty('id', '1');
      expect(prismaService.producer.create).toHaveBeenCalled();
    });
  });
});
