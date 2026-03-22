import { NestFactory } from '@nestjs/core';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Logger
  app.useLogger(app.get(Logger));

  // Segurança e Middlewares
  app.use(helmet());
  app.enableCors();

  // Prefixo Global
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  // Habilita Graceful Shutdown (Tratamento seguro de encerramento de processos em nuvem/Docker)
  app.enableShutdownHooks();

  // Validação e Transformação de Entrada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtro Global de Exceções
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configuração da Documentação Swagger
  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription('API para gerenciamento de produtores rurais, propriedades e culturas plantadas')
    .setVersion('1.0')
    .addTag('producers')
    .addTag('dashboard')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
