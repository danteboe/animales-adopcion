import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAnimalDto {
  @IsString()
  nombre: string;

  @IsString()
  especie: string;

  @IsInt()
  @Min(0)
  edad: number;

  @IsString()
  @MinLength(10)
  descripcion: string;

  @IsOptional()
  @IsIn(['disponible', 'adoptado'])
  estado?: string;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsEmail()
  contacto: string;

  // FKs opcionales — UUIDs de relaciones
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @IsOptional()
  @IsUUID()
  registeredById?: string;
}
