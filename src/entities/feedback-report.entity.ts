import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SalesRep } from './sales-rep.entity';
import { Clients } from './clients.entity';

@Entity('FeedbackReport')
export class FeedbackReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'comment', nullable: true })
  comment: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'clientId' })
  clientId: number;

  @Column({ name: 'userId' })
  userId: number;

  @ManyToOne(() => SalesRep)
  @JoinColumn({ name: 'userId' })
  user: SalesRep;

  @ManyToOne(() => Clients)
  @JoinColumn({ name: 'clientId' })
  client: Clients;
} 