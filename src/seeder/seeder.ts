import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const logger = new Logger('Seeder');
  const app = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    const seeder = app.get(SeederService);
    if (process.argv.includes('--fresh')) {
      logger.warn('Modo --fresh: limpiando tablas antes de sembrar');
      await seeder.clearAndSeed();
    } else {
      await seeder.seed();
    }
  } catch (err) {
    logger.error('Error durante el seed', err);
    process.exit(1);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
