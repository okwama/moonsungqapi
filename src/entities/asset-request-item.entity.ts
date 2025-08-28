import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { AssetRequest } from './asset-request.entity';

@Entity('asset_request_items')
@Index('AssetRequestItem_assetRequestId_fkey', ['assetRequestId'])
export class AssetRequestItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  assetRequestId: number;

  @Column()
  assetName: string;

  @Column()
  assetType: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'int', default: 0 })
  assignedQuantity: number;

  @Column({ type: 'int', default: 0 })
  returnedQuantity: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => AssetRequest, assetRequest => assetRequest.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assetRequestId' })
  assetRequest: AssetRequest;
}
