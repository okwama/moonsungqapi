import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Clients } from './clients.entity';
import { SalesRep } from './sales-rep.entity';

@Entity('ClientPayment')
@Index('idx_clientId', ['clientId'])
@Index('idx_salesrepId', ['salesrepId'])
export class ClientPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column()
  salesrepId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  payment_method: string;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Clients, client => client.id)
  @JoinColumn({ name: 'clientId' })
  client: Clients;

  @ManyToOne(() => SalesRep, salesRep => salesRep.id)
  @JoinColumn({ name: 'salesrepId' })
  salesRep: SalesRep;
}

