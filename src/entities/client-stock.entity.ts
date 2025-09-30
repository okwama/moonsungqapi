import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Clients } from './clients.entity';
import { Product } from '../products/entities/product.entity';
import { SalesRep } from './sales-rep.entity';

@Entity('ClientStock')
@Index('idx_clientstock_client_product', ['clientId', 'productId'])
@Index('idx_clientstock_product', ['productId'])
export class ClientStock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'clientId', type: 'int' })
  clientId: number;

  @Column({ name: 'productId', type: 'int' })
  productId: number;

  @Column({ name: 'salesrepId', type: 'int' })
  salesrepId: number;

  @ManyToOne(() => Clients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: Clients;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => SalesRep, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salesrepId' })
  salesRep: SalesRep;
}
