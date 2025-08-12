import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SalesRep } from './sales-rep.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 119 })
  name: string;

  @OneToMany(() => SalesRep, salesRep => salesRep.role)
  salesReps: SalesRep[];
}
