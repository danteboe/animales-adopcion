import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';
import { User } from '../../users/entities/user.entity';

@Entity('adoption_requests')
export class AdoptionRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'pendiente' })
  status: string; // 'pendiente' | 'aprobada' | 'rechazada'

  @Column({ length: 500, nullable: true })
  message: string;

  // ManyToOne → User (quien solicita la adopción)
  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  // ManyToOne → Animal (el animal que se quiere adoptar)
  @ManyToOne(() => Animal, { eager: true, nullable: false })
  @JoinColumn({ name: 'animalId' })
  animal: Animal;

  @CreateDateColumn()
  createdAt: Date;
}

