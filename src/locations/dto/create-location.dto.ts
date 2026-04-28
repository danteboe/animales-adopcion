import { IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  phone?: string;
}