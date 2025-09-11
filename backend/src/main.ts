import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true, // throw error on unknown properties
      transform: true, // auto-transform payloads
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Next.js frontend URL
    credentials: true, // allow cookies/auth headers
  });

  // Use PORT from environment variables or fallback to 5000
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
