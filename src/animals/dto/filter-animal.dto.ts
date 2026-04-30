import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterAnimalDto {
  @IsOptional()
  @IsString()
  especie?: string;

  @IsOptional()
  @IsIn(['disponible', 'adoptado'])
  estado?: string;
}
