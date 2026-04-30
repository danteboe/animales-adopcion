import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateAdoptionRequestDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  animalId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}

