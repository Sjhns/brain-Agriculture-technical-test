import { PrismaClient } from '@prisma/client';
import { DocumentType, CropType } from '../src/common/domain/enums';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB Seed...');

  // Clean DB
  await prisma.farm.deleteMany();
  await prisma.producer.deleteMany();

  // Create a Producer
  const producer1 = await prisma.producer.create({
    data: {
      document: '60134443026', // valid mock CPF
      documentType: DocumentType.CPF,
      name: 'João Agricultor',
      farms: {
        create: [
          {
            name: 'Fazenda Esperança',
            city: 'Ribeirão Preto',
            state: 'SP',
            totalArea: 1000,
            arableArea: 600,
            vegetationArea: 400,
            plantedCrops: {
              create: [
                { season: '2023', cropType: CropType.SOYBEAN },
                { season: '2023', cropType: CropType.CORN },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`Created Producer: ${producer1.name}`);

  const producer2 = await prisma.producer.create({
    data: {
      document: '47960950000121', // valid mock CNPJ
      documentType: DocumentType.CNPJ,
      name: 'Agropecuária Sul',
      farms: {
        create: [
          {
            name: 'Propriedade Campos',
            city: 'Uberlândia',
            state: 'MG',
            totalArea: 5000,
            arableArea: 3500,
            vegetationArea: 1000,
            plantedCrops: {
              create: [
                { season: '2022', cropType: CropType.COFFEE },
                { season: '2023', cropType: CropType.SUGARCANE },
                { season: '2023', cropType: CropType.SOYBEAN },
              ],
            },
          },
        ],
      },
    },
  });
  console.log(`Created Producer: ${producer2.name}`);

  console.log('Seed finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
