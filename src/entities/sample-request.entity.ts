import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Clients } from './clients.entity';
import { SalesRep } from './sales-rep.entity';
import { SampleRequestItem } from './sample-request-item.entity';

@Entity('sample_request')
@Index('SampleRequest_clientId_fkey', ['clientId'])
@Index('SampleRequest_userId_fkey', ['userId'])
export class SampleRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column()
  userId: number;

  @Column({ unique: true })
  requestNumber: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  requestDate: Date;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  approvedBy: number;

  @Column({ type: 'datetime', nullable: true })
  approvedAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ 
    type: 'datetime', 
    default: () => 'CURRENT_TIMESTAMP', 
    onUpdate: 'CURRENT_TIMESTAMP' 
  })
  updatedAt: Date;

  @ManyToOne(() => Clients, clients => clients.sampleRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: Clients;

  @ManyToOne(() => SalesRep, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: SalesRep;

  @OneToMany(() => SampleRequestItem, sampleRequestItem => sampleRequestItem.sampleRequest)
  sampleRequestItems: SampleRequestItem[];
}
