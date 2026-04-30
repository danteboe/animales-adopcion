import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalsModule } from './animals/animals.module';
import { LocationsModule } from './locations/locations.module';
import { UsersModule } from './users/users.module';
import { AdoptionRequestsModule } from './adoption-requests/adoption-requests.module';

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
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    AnimalsModule,
    LocationsModule,
    UsersModule,
    AdoptionRequestsModule,
  ],
})
export class AppModule {}
