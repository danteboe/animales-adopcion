import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../locations/entities/location.entity';
import { User } from '../users/entities/user.entity';
import { Animal } from '../animals/entities/animal.entity';
import { AdoptionRequest } from '../adoption-requests/entities/adoption-request.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.getOrThrow('DB_HOST'),
        port: cfg.getOrThrow<number>('DB_PORT'),
        username: cfg.getOrThrow('DB_USER'),
        password: cfg.getOrThrow('DB_PASSWORD'),
        database: cfg.getOrThrow('DB_NAME'),
        entities: [Location, User, Animal, AdoptionRequest],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Location, User, Animal, AdoptionRequest]),
  ],
  providers: [SeederService],
})
export class SeederModule {}

