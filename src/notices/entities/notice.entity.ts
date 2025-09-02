import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('NoticeBoard')
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'country_id', type: 'int', nullable: true })
  countryId: number | null;

  @Column({ name: 'status', type: 'tinyint', nullable: true, default: 0 })
  status?: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
} 