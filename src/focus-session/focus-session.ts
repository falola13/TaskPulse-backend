import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'int', nullable: true })
  expectedDuration: number;

  @Column({ nullable: true })
  taskId?: number;
}
