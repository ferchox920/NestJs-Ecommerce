import { UserEntity } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne,  PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;
  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;

  @ManyToOne(()=>UserEntity,(user)=>user.categories)
  addedBy:UserEntity
}
