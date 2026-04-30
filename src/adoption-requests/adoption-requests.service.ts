import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdoptionRequest } from './entities/adoption-request.entity';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/entities/user.entity';
import { CreateAdoptionRequestDto } from './dto/create-adoption-request.dto';
import { UpdateAdoptionRequestDto } from './dto/update-adoption-request.dto';

@Injectable()
export class AdoptionRequestsService {
  private readonly logger = new Logger('AdoptionRequestsService');

  constructor(
    @InjectRepository(AdoptionRequest)
    private readonly requestRepo: Repository<AdoptionRequest>,
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateAdoptionRequestDto) {
    // 1. Verificar que el animal existe y está disponible
    const animal = await this.animalRepo.findOne({ where: { id: dto.animalId } });
    if (!animal)
      throw new NotFoundException(`Animal ${dto.animalId} no encontrado`);
    if (animal.estado === 'adoptado')
      throw new BadRequestException(
        'Este animal ya fue adoptado y no está disponible',
      );

    // 2. Verificar que el usuario existe
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user)
      throw new NotFoundException(`User ${dto.userId} no encontrado`);

    // 3. Evitar solicitudes duplicadas del mismo usuario para el mismo animal
    const existing = await this.requestRepo.findOne({
      where: { user: { id: dto.userId }, animal: { id: dto.animalId } },
    });
    if (existing)
      throw new BadRequestException(
        'Ya existe una solicitud pendiente para este animal',
      );

    const request = this.requestRepo.create({
      message: dto.message,
      user,
      animal,
    });
    return this.requestRepo.save(request);
  }

  async findAll() {
    return this.requestRepo.find();
  }

  async findOne(id: string) {
    const request = await this.requestRepo.findOne({ where: { id } });
    if (!request)
      throw new NotFoundException(`Solicitud ${id} no encontrada`);
    return request;
  }

  async updateStatus(id: string, dto: UpdateAdoptionRequestDto) {
    const request = await this.findOne(id);

    request.status = dto.status;

    // Regla de negocio: si se aprueba, el animal pasa a 'adoptado'
    if (dto.status === 'aprobada') {
      await this.animalRepo.update(request.animal.id, {
        estado: 'adoptado',
      });
    }

    return this.requestRepo.save(request);
  }

  async remove(id: string) {
    const request = await this.findOne(id);
    await this.requestRepo.remove(request);
    return { message: 'Solicitud eliminada' };
  }
}
