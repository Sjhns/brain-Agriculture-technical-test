import { DocumentType, CropType } from '../../src/common/domain/enums';

// Mock de payload correto criando Produtor
export const mockValidProducerDto = {
  document: '61554477050', // CPF válido fornecido pelo user
  documentType: DocumentType.CPF,
  name: 'John Doe Mock Struct',
  farms: [
    {
      name: 'Farm Mocked',
      city: 'Test City',
      state: 'SP',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 40, // 100 <= 100 OK
      plantedCrops: [
        {
          season: '2023',
          cropType: CropType.SOYBEAN,
        },
      ],
    },
  ],
};

// Mock de payload incorreto (áreas da fazenda)
export const mockInvalidAreaProducerDto = {
  ...mockValidProducerDto,
  name: 'Invalid Area Mock',
  farms: [
    {
      ...mockValidProducerDto.farms[0],
      arableArea: 80,
      vegetationArea: 50, // 130 > 100 BAD
    },
  ],
};

// Mock de payload incorreto (CPF)
export const mockInvalidCpfProducerDto = {
  ...mockValidProducerDto,
  document: '11111111111', // CPF sempre falha modulo 11
  name: 'Invalid CPF Mock',
};

// Mock de Resposta Simulada do Prisma
export const mockProducerServiceResponse = {
  id: 'e2e-mock-uuid-1234',
  ...mockValidProducerDto,
  createdAt: new Date(),
  updatedAt: new Date(),
};
