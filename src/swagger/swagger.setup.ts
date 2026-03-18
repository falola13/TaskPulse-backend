import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorResponseDto } from './dto/error-response.dto';

export function setupSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('TaskPulse API')
    .setDescription('TaskPulse backend API documentation')
    .setVersion('1.0')
    // Your auth uses cookies; JwtStrategy extracts `access_token` from cookies.
    .addCookieAuth('access_token')
    // Global error responses to keep docs consistent and scalable.
    .addGlobalResponse({
      status: 400,
      description: 'Bad Request',
      type: ErrorResponseDto,
    })
    .addGlobalResponse({
      status: 401,
      description: 'Unauthorized',
      type: ErrorResponseDto,
    })
    .addGlobalResponse({
      status: 403,
      description: 'Forbidden',
      type: ErrorResponseDto,
    })
    .addGlobalResponse({
      status: 404,
      description: 'Not Found',
      type: ErrorResponseDto,
    })
    .addGlobalResponse({
      status: 500,
      description: 'Internal Server Error',
      type: ErrorResponseDto,
    })
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);
}

