import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import env from '../../config/env';
import { SERVER_URL_CONSTANTS } from '../constants';

export function setupSwagger(app: INestApplication): void {
  const isDevelopment = env.NODE_ENV === 'development';
  const serverUrl = isDevelopment
    ? SERVER_URL_CONSTANTS.DEVELOPMENT.BACKEND
    : SERVER_URL_CONSTANTS.PRODUCTION.BACKEND;

  const config = new DocumentBuilder()
    .setTitle('Calento.space API')
    .setVersion('1.0.0')
    .setDescription(
      `
  Calento.space - Smart Calendar Assistant API

  Manage your schedules, sync with Google Calendar, and automate your time management.

  Features:
  - Event management with recurring events support
  - Google Calendar bidirectional sync
  - Conflict detection and resolution
  - Availability management
  - Booking system
  - Real-time webhook notifications
  - Email notifications
  - Queue-based background processing
    `,
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer',
    )
    .addCookieAuth(
      'access_token',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'JWT token stored in HTTP-only cookie',
      },
      'cookie',
    )
    .addServer(SERVER_URL_CONSTANTS.DEVELOPMENT.BACKEND, 'Development server')
    .addServer(SERVER_URL_CONSTANTS.PRODUCTION.BACKEND, 'Production server')
    .addServer(serverUrl, `Current Environment (${env.NODE_ENV})`)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Calento.space API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
  });
}
