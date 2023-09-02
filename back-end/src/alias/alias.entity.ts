// alias.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('aliases')
export class Alias {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  real_email: string;

  @Column()
  alias_email: string;

  @Column({ type: 'boolean', default: true })
  enable: boolean;
}
