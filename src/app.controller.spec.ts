import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API info object', () => {
      expect(appController.getInfo()).toEqual({
        name: 'Brain Agriculture API',
        description: 'API para gerenciamento de produtores rurais, propriedades e culturas plantadas.',
        version: '1.0.0',
        status: 'online',
        documentation: '/api/docs',
      });
    });
  });
});
