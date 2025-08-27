import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { SalesRep } from './sales-rep.entity';

@Entity('Token')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  token: string;

  @Column({ name: 'salesRepId' })
  salesRepId: number;

  @Column({ name: 'tokenType', type: 'varchar', length: 10, default: 'access' })
  tokenType: string; // 'access' or 'refresh'

  @Column({ name: 'expiresAt', type: 'datetime' })
  expiresAt: Date;

  @Column({ default: false })
  blacklisted: boolean;

  @Column({ name: 'lastUsedAt', type: 'datetime', nullable: true })
  lastUsedAt: Date;

  @CreateDateColumn({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @ManyToOne(() => SalesRep, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salesRepId' })
  salesRep: SalesRep;
}
