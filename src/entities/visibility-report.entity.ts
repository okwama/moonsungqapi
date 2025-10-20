import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { SalesRep } from './sales-rep.entity';
import { Clients } from './clients.entity';
import { JourneyPlan } from '../journey-plans/entities/journey-plan.entity';

@Entity('VisibilityReport')
@Index('idx_visibility_report_journey_plan', ['journeyPlanId'])
@Index('idx_visibility_report_user_journey', ['userId', 'journeyPlanId'])
export class VisibilityReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'comment', nullable: true })
  comment: string;

  @Column({ name: 'imageUrl', nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @Column({ name: 'clientId' })
  clientId: number;

  @Column({ name: 'userId' })
  userId: number;

  // ✅ FIX: Added journeyPlanId to link reports to journey plans
  @Column({ name: 'journeyPlanId', nullable: true })
  journeyPlanId: number;

  @ManyToOne(() => SalesRep)
  @JoinColumn({ name: 'userId' })
  user: SalesRep;

  @ManyToOne(() => Clients)
  @JoinColumn({ name: 'clientId' })
  client: Clients;

  // ✅ FIX: Added relationship to JourneyPlan
  @ManyToOne(() => JourneyPlan, { nullable: true })
  @JoinColumn({ name: 'journeyPlanId' })
  journeyPlan: JourneyPlan;
} 