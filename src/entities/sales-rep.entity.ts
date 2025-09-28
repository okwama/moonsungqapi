import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { JourneyPlan } from '../journey-plans/entities/journey-plan.entity';
import { LoginHistory } from './login-history.entity';
import * as bcrypt from 'bcryptjs';
import { Clients } from './clients.entity';
import { Role } from './role.entity';

@Entity('SalesRep')
@Index('idx_status_role', ['status', 'role'])
@Index('idx_location', ['countryId', 'region_id', 'route_id'])
@Index('idx_manager', ['managerId'])
@Index('SalesRep_countryId_fkey', ['countryId'])
@Index('idx_phone_status', ['phoneNumber', 'status']) // Optimized for login queries
@Index('idx_phone_unique', ['phoneNumber'], { unique: true }) // Ensure phone uniqueness
export class SalesRep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column()
  countryId: number;

  @Column()
  country: string;

  @Column()
  region_id: number;

  @Column()
  region: string;

  @Column({ type: 'varchar', length: 100 })
  route_id: number;

  @Column({ type: 'varchar', length: 100 })
  route: string;

  @Column()
  route_id_update: number;

  @Column({ type: 'varchar', length: 100 })
  route_name_update: string;

  @Column()
  visits_targets: number;

  @Column()
  new_clients: number;

  @Column({ name: 'role_id', nullable: true })
  roleId: number;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column()
  manager_type: number;

  @Column({ nullable: true, default: 0 })
  status: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  retail_manager: number;

  @Column()
  key_channel_manager: number;

  @Column()
  distribution_manager: number;

  @Column({ nullable: true, default: '' })
  photoUrl: string;

  @Column({ nullable: true })
  managerId: number;

  @OneToMany(() => JourneyPlan, journeyPlan => journeyPlan.user)
  journeyPlans: JourneyPlan[];

  @OneToMany(() => LoginHistory, loginHistory => loginHistory.SalesRep)
  LoginHistory: LoginHistory[];

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
} 