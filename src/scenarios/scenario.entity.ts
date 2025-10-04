import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ScenarioStatus {
  DRAFT = 'draft',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('scenarios')
export class Scenario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ScenarioStatus,
    default: ScenarioStatus.DRAFT,
  })
  status: ScenarioStatus;

  @Column({ type: 'json', nullable: true })
  material: any;

  @Column({ type: 'json', nullable: true })
  route: any;

  @Column({ type: 'json', nullable: true })
  energy: any;

  @Column({ type: 'json', nullable: true })
  transport: any;

  @Column({ type: 'json', nullable: true })
  endOfLife: any;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'float', default: 0 })
  circularityScore: number;

  @Column({ type: 'float', default: 0 })
  carbonFootprint: number;

  @Column({ type: 'float', default: 0 })
  energyConsumption: number;

  @Column({ type: 'float', default: 0 })
  waterConsumption: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastRunAt: Date;
}
