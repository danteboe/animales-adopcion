import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  // Animales que este usuario registró (OneToMany)
  @OneToMany(() => Animal, (animal) => animal.registeredBy)
  registeredAnimals: Animal[];

  // ⭐ ManyToMany — animales favoritos del usuario
  // @JoinTable va en el lado dueño de la relación (User)
  // TypeORM crea la tabla intermedia user_animal_favorites automáticamente
  @ManyToMany(() => Animal, (animal) => animal.interestedUsers)
  @JoinTable({ name: 'user_animal_favorites' })
  favorites: Animal[];

  @CreateDateColumn()
  createdAt: Date;
}