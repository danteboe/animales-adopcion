import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; // nombre del refugio

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phone: string;

  // Un refugio puede tener muchos animales
  @OneToMany(() => Animal, (animal) => animal.location)
  animals: Animal[];

  @CreateDateColumn()
  createdAt: Date;
}
