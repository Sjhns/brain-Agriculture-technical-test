import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'Brain Agriculture API',
      description: 'API para gerenciamento de produtores rurais, propriedades e culturas plantadas.',
      version: '1.0.0',
      status: 'online',
      documentation: '/api/docs',
    };
  }
}
