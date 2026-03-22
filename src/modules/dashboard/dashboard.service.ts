import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    // 1. Total de fazendas cadastradas
    const totalFarms = await this.prisma.farm.count();

    // 2. Total de hectares registrados (área total) e uso do solo
    const areaStats = await this.prisma.farm.aggregate({
      _sum: {
        totalArea: true,
        arableArea: true,
        vegetationArea: true,
      },
    });

    // 3. Gráficos de pizza: Por estado
    const farmsByState = await this.prisma.farm.groupBy({
      by: ['state'],
      _count: {
        state: true,
      },
      orderBy: {
        _count: {
          state: 'desc',
        },
      },
    });

    // 4. Gráficos de pizza: Por cultura plantada
    const cropsByType = await this.prisma.plantedCrop.groupBy({
      by: ['cropType'],
      _count: {
        cropType: true,
      },
      orderBy: {
        _count: {
          cropType: 'desc',
        },
      },
    });

    return {
      totalFarms,
      totalHectares: areaStats._sum.totalArea || 0,
      charts: {
        farmsByState: farmsByState.map(f => ({
          state: f.state,
          count: f._count.state,
        })),
        cropsByType: cropsByType.map(c => ({
          crop: c.cropType,
          count: c._count.cropType,
        })),
        landUse: {
          arableArea: areaStats._sum.arableArea || 0,
          vegetationArea: areaStats._sum.vegetationArea || 0,
        },
      },
    };
  }
}
