// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ─── Cookie Parser ─────────────────────────────────────────────────────────
  app.use(cookieParser());

  // ─── CORS с поддержкой cookies ─────────────────────────────────────────────
 app.enableCors({
  origin: (origin, callback) => {
    const allowed = [
      'http://localhost:3000',
      'https://aviapilot-frontend.vercel.app',
    ];
    
    // Разрешаем все поддомены vercel.app
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

  // ─── Validation ────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
app.setGlobalPrefix('api'); 
  // ─── Swagger ───────────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('AviaPilot API')
    .setDescription('Pilot Management Platform API')
    .setVersion('1.0')
    .addCookieAuth('accessToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);


  
 await app.listen(process.env.PORT || 3001);
  logger.log('🚀 AviaPilot Backend running on http://localhost:3001');
  logger.log('📚 Swagger UI: http://localhost:3001/swagger');
}

bootstrap();
