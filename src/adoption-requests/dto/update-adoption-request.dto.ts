import { IsIn } from 'class-validator';

export class UpdateAdoptionRequestDto {
  @IsIn(['aprobada', 'rechazada'])
  status: string;
}

