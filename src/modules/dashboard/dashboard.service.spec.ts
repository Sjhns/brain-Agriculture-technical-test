import { Test, TestingModule } from '@nestjs/testing';
import { vi } from 'vitest';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: {
            farm: {
              count: vi.fn(),
              aggregate: vi.fn(),
              groupBy: vi.fn(),
            },
            plantedCrop: {
              groupBy: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return aggregated dashboard data', async () => {
    vi.spyOn(prisma.farm, 'count').mockResolvedValue(10);
    vi.spyOn(prisma.farm, 'aggregate').mockResolvedValue({
      _sum: { totalArea: 1000, arableArea: 600, vegetationArea: 400 },
    } as any);
    vi.spyOn(prisma.farm, 'groupBy').mockResolvedValue([
      { state: 'SP', _count: { state: 6 } },
      { state: 'MT', _count: { state: 4 } },
    ] as any);
    vi.spyOn(prisma.plantedCrop, 'groupBy').mockResolvedValue([
      { cropType: 'SOYBEAN', _count: { cropType: 7 } },
      { cropType: 'CORN', _count: { cropType: 3 } },
    ] as any);

    const result = await service.getDashboardData();

    expect(result.totalFarms).toBe(10);
    expect(result.totalHectares).toBe(1000);
    expect(result.charts.landUse.arableArea).toBe(600);
    expect(result.charts.farmsByState[0].state).toBe('SP');
    expect(result.charts.cropsByType[0].crop).toBe('SOYBEAN');
  });
});
