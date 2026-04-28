import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './entities/animal.entity';
import { Location } from '../locations/entities/location.entity';
import { User } from '../users/entities/user.entity';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';

@Module({
  imports: [
    // Registra Animal + las entities de las FKs
    TypeOrmModule.forFeature([Animal, Location, User]),
  ],
  controllers: [AnimalsController],
  providers: [AnimalsService],
})
export class AnimalsModule {}
