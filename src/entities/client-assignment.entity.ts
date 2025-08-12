import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Clients } from './clients.entity';
import { SalesRep } from './sales-rep.entity';

@Entity('ClientAssignment')
@Index('ClientAssignment_outletId_salesRepId_key', ['outletId', 'salesRepId'], { unique: true })
@Index('ClientAssignment_salesRepId_idx', ['salesRepId'])
@Index('ClientAssignment_outletId_idx', ['outletId'])
export class ClientAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  outletId: number;

  @Column()
  salesRepId: number;

  @Column({ type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' })
  assignedAt: Date;

  @Column({ default: 'active' })
  status: string;

  @ManyToOne(() => Clients, client => client.id)
  @JoinColumn({ name: 'outletId' })
  outlet: Clients;

  @ManyToOne(() => SalesRep, salesRep => salesRep.id)
  @JoinColumn({ name: 'salesRepId' })
  salesRep: SalesRep;
}
