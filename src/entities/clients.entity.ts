import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { JourneyPlan } from '../journey-plans/entities/journey-plan.entity';
import { UpliftSale } from './uplift-sale.entity';
import { SalesRep } from './sales-rep.entity';

@Entity('Clients')
@Index('Clients_countryId_fkey', ['countryId'])
@Index('idx_country_status_route', ['countryId', 'status', 'route_id'])
@Index('idx_salesRepId', ['salesRepId'])
export class Clients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'float', nullable: true })
  latitude: number;

  @Column({ type: 'float', nullable: true })
  longitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 2, nullable: true })
  balance: number;

  @Column({ nullable: true })
  email: string;

  @Column()
  region_id: number;

  @Column()
  region: string;

  @Column({ nullable: true })
  route_id: number;

  @Column({ nullable: true })
  route_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  route_id_update: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  route_name_update: string;

  @Column()
  contact: string;

  @Column({ nullable: true })
  tax_pin: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 0 })
  status: number;

  @Column({ nullable: true })
  client_type: number;

  @Column({ nullable: true })
  outlet_account: number;

  @Column()
  countryId: number;

  @Column({ nullable: true })
  added_by: number;

  @Column({ nullable: true })
  salesRepId: number;

  @ManyToOne(() => SalesRep, { nullable: true })
  @JoinColumn({ name: 'added_by' })
  addedByUser: SalesRep;

  @ManyToOne(() => SalesRep, { nullable: true })
  @JoinColumn({ name: 'salesRepId' })
  salesRep: SalesRep;

  @Column({ type: 'timestamp', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => JourneyPlan, journeyPlan => journeyPlan.client)
  journeyPlans: JourneyPlan[];

  @OneToMany(() => UpliftSale, upliftSale => upliftSale.client)
  upliftSales: UpliftSale[];
} 