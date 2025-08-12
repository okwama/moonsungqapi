import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { SampleRequest } from './sample-request.entity';
import { Product } from '../products/entities/product.entity';

@Entity('sample_request_item')
@Index('SampleRequestItem_sampleRequestId_fkey', ['sampleRequestId'])
@Index('SampleRequestItem_productId_fkey', ['productId'])
export class SampleRequestItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sampleRequestId: number;

  @Column()
  productId: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Product, product => product.sampleRequestItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => SampleRequest, sampleRequest => sampleRequest.sampleRequestItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sampleRequestId' })
  sampleRequest: SampleRequest;
}
