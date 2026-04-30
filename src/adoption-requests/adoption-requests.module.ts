import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptionRequest } from './entities/adoption-request.entity';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/entities/user.entity';
import { AdoptionRequestsService } from './adoption-requests.service';
import { AdoptionRequestsController } from './adoption-requests.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdoptionRequest, Animal, User]),
  ],
  controllers: [AdoptionRequestsController],
  providers: [AdoptionRequestsService],
})
export class AdoptionRequestsModule {}

