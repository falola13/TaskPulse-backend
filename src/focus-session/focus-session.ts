import { Task } from 'src/tasks/entities/tasks.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum SessionType {
  PULSE = 'pulse',
  SHORT_BREAK = 'short_break',
  LONG_BREAK = 'long_break',
}
@Entity()
export class FocusSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: SessionType,
  })
  type: SessionType;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endTime: Date;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'int', nullable: true })
  expectedDuration: number;

  @Column({ type: 'uuid', nullable: true })
  taskId?: string;

  @ManyToOne(() => Task, (task) => task.session, { nullable: true })
  @JoinColumn({ name: 'taskId' })
  task: Task;
}
