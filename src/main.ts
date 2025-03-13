import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as os from 'os';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');

  await app.listen(port, '0.0.0.0');

  // Obtener la IP local
  const networkInterfaces = os.networkInterfaces();
  const addresses = Object.values(networkInterfaces)
    .flat()
    .filter((info) => info && info.family === 'IPv4' && !info.internal)
    .map((info) => info?.address);

  console.log(`🚀 Server running on:`);
  console.log(`   Local: http://localhost:${port}`);
  addresses.forEach((addr) => console.log(`   Network: http://${addr}:${port}`));
}

bootstrap();
