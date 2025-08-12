import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SalesRep } from './sales-rep.entity';
import { Clients } from './clients.entity';

@Entity('ProductReport')
export class ProductReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'productName', nullable: true })
  productName: string;

  @Column({ name: 'quantity', nullable: true })
  quantity: number;

  @Column({ name: 'comment', nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'clientId' })
  clientId: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ name: 'productId', nullable: true })
  productId: number;

  @ManyToOne(() => SalesRep)
  @JoinColumn({ name: 'userId' })
  user: SalesRep;

  @ManyToOne(() => Clients)
  @JoinColumn({ name: 'clientId' })
  client: Clients;
} 