export const mockDashboardPrismaResponse = {
  farmCount: 15,
  farmAggregate: {
    _sum: { totalArea: 1500, arableArea: 900, vegetationArea: 500 },
  },
  farmsByState: [
    { state: 'SP', _count: { state: 8 } },
    { state: 'MT', _count: { state: 7 } },
  ],
  cropsByType: [
    { cropType: 'SOYBEAN', _count: { cropType: 10 } },
    { cropType: 'CORN', _count: { cropType: 5 } },
  ],
};
