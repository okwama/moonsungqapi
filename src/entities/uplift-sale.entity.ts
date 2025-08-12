import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { SalesRep } from './sales-rep.entity';
import { Clients } from './clients.entity';
import { UpliftSaleItem } from './uplift-sale-item.entity';

@Entity('UpliftSale')
@Index('UpliftSale_clientId_fkey', ['clientId'])
@Index('UpliftSale_userId_fkey', ['userId'])
export class UpliftSale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column()
  userId: number;

  @Column({ type: 'int', default: 1 }) // 0=voided, 1=active
  status: number;

  @Column({ type: 'float', default: 0 })
  totalAmount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'varchar', length: 119, default: '' })
  comment: string;

  @ManyToOne(() => Clients, clients => clients.upliftSales, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: Clients;

  @ManyToOne(() => SalesRep, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: SalesRep;

  @OneToMany(() => UpliftSaleItem, upliftSaleItem => upliftSaleItem.upliftSale)
  upliftSaleItems: UpliftSaleItem[];
} 