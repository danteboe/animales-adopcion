import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger('LocationsService');

  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
  ) {}

  async create(dto: CreateLocationDto) {
    try {
      const loc = this.locationRepo.create(dto);
      return await this.locationRepo.save(loc);
    } catch (err) {
      this.handleError(err);
    }
  }

  async findAll() {
    return this.locationRepo.find({ relations: ['animals'] });
  }

  async findOne(id: string) {
    const loc = await this.locationRepo.findOne({
      where: { id },
      relations: ['animals'],
    });
    if (!loc) throw new NotFoundException(`Location ${id} no encontrada`);
    return loc;
  }

  async update(id: string, dto: UpdateLocationDto) {
    const loc = await this.findOne(id);
    this.locationRepo.merge(loc, dto);
    return this.locationRepo.save(loc);
  }

  async remove(id: string) {
    const loc = await this.findOne(id);
    await this.locationRepo.remove(loc);
    return { message: 'Refugio eliminado' };
  }

  private handleError(err: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.code === '23505')
      throw new BadRequestException(`Refugio duplicado: ${err.detail}`);
    throw new InternalServerErrorException('Error inesperado');
  }
}
