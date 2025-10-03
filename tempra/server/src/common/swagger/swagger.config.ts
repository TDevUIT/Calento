import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Calento.space API')
      .setDescription(`
  Calento.space - Smart Calendar Assistant API

  Manage your schedules, sync with Google Calendar, and automate your time management.

  Features:
  - Event management with recurring events support
  - Google Calendar bidirectional sync
  - Conflict detection and resolution
  - Availability management
  - Booking system
  - Real-time webhook notifications
    `)
    .addCookieAuth(
      'access_token',
      {
        type: 'apiKey',
        in: 'cookie',
        description: 'JWT token stored in HTTP-only cookie',
      },
      'cookie',
    )
    .addServer('http://localhost:8000', 'Development server')
    .addServer('https://api.calento.space', 'Production server')
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
