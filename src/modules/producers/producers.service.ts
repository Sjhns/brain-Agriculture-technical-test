import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { FarmAreaValidator } from '../../common/domain/validators/farm-area.validator';

@Injectable()
export class ProducersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProducerDto: CreateProducerDto) {
    const { farms, ...producerData } = createProducerDto;

    // Validate farm areas
    if (farms && farms.length > 0) {
      for (const farm of farms) {
        if (!FarmAreaValidator.isValidAreas(farm.totalArea, farm.arableArea, farm.vegetationArea)) {
          throw new BadRequestException(
            `Farm ${farm.name} has invalid areas. Arable + Vegetation cannot exceed Total Area.`,
          );
        }
      }
    }

    // Check if producer with same document already exists
    const existing = await this.prisma.producer.findUnique({
      where: { document: producerData.document },
    });
    if (existing) {
      throw new BadRequestException('A producer with this document already exists.');
    }

    return this.prisma.producer.create({
      data: {
        ...producerData,
        farms: {
          create: farms?.map(farm => ({
            name: farm.name,
            city: farm.city,
            state: farm.state,
            totalArea: farm.totalArea,
            arableArea: farm.arableArea,
            vegetationArea: farm.vegetationArea,
            plantedCrops: {
              create: farm.plantedCrops?.map(crop => ({
                season: crop.season,
                cropType: crop.cropType,
              })),
            },
          })),
        },
      },
      include: {
        farms: {
          include: { plantedCrops: true },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.producer.findMany({
      include: {
        farms: {
          include: { plantedCrops: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const producer = await this.prisma.producer.findUnique({
      where: { id },
      include: {
        farms: {
          include: { plantedCrops: true },
        },
      },
    });
    if (!producer) throw new NotFoundException('Producer not found');
    return producer;
  }

  async update(id: string, updateProducerDto: UpdateProducerDto) {
    // Check existence
    await this.findOne(id);

    // If updating farms directly, we need to handle relation updates separately, 
    // but a common pattern is to just replace them or handle them uniquely.
    // For simplicity in this test, we allow updating the producer's base data,
    // and if 'farms' are provided, we replace all farms (delete all existing, create new).
    const { farms, ...producerData } = updateProducerDto;

    if (farms) {
      for (const farm of farms) {
        if (!FarmAreaValidator.isValidAreas(farm.totalArea, farm.arableArea, farm.vegetationArea)) {
          throw new BadRequestException(
            `Farm ${farm.name} has invalid areas. Arable + Vegetation cannot exceed Total Area.`,
          );
        }
      }
    }

    // We can run a transaction to delete existing farms and recreate them
    return this.prisma.$transaction(async (tx) => {
      if (farms) {
        // Drop existing farms
        await tx.farm.deleteMany({
          where: { producerId: id },
        });
      }

      return tx.producer.update({
        where: { id },
        data: {
          ...producerData,
          ...(farms && {
            farms: {
              create: farms.map(farm => ({
                name: farm.name,
                city: farm.city,
                state: farm.state,
                totalArea: farm.totalArea,
                arableArea: farm.arableArea,
                vegetationArea: farm.vegetationArea,
                plantedCrops: {
                  create: farm.plantedCrops?.map(crop => ({
                    season: crop.season,
                    cropType: crop.cropType,
                  })),
                },
              })),
            },
          }),
        },
        include: {
          farms: {
            include: { plantedCrops: true },
          },
        },
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.producer.delete({
      where: { id },
    });
  }
}
