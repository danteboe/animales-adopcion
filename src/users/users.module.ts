import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Animal } from '../animals/entities/animal.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    // Animal también se necesita para gestionar favoritos
    TypeOrmModule.forFeature([User, Animal]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
