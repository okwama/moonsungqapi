import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Clients } from './clients.entity';
import { Product } from '../products/entities/product.entity';

@Entity('OutletQuantity')
@Index('idx_client_product', ['clientId', 'productId'])
export class OutletQuantity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Clients, client => client.id)
  @JoinColumn({ name: 'clientId' })
  client: Clients;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;
}

