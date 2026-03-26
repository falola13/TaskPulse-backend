import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['userId'], { unique: true })
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'int', default: 1 })
  dailySessionTarget: number;

  @Column({ type: 'int', default: 60 })
  dailyFocusTarget: number;

  @Column({ type: 'int', default: 300 })
  weeklyFocusTarget: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
