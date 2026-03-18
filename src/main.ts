import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { seedPlans } from './plans/plans.seed';
import { setupSwagger } from './swagger/swagger.setup';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  const dataSource = app.get(DataSource);
  await seedPlans(dataSource);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
