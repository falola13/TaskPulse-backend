import { ApiProperty } from '@nestjs/swagger';
import { Priority, TaskStatus } from '../entities/tasks.entity';

export class TaskResponseDto {
  @ApiProperty({ example: '123' })
  id: string;
  @ApiProperty({ example: 'Task 1' })
  title: string;
  @ApiProperty({ example: 25 })
  duration: number;
  @ApiProperty({ example: Priority.MEDIUM })
  priority: Priority;
  @ApiProperty({ example: TaskStatus.PENDING })
  status: TaskStatus;
  @ApiProperty({ example: 'Task description' })
  description: string;
  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  createdAt: Date;
  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  updatedAt: Date;
  @ApiProperty({ example: '56545453' })
  userId: string;

  @ApiProperty({
    example: 1500,
    description:
      'Planned duration in seconds derived from task.duration (minutes).',
  })
  plannedDurationSeconds: number;

  @ApiProperty({
    example: 900,
    description: 'Total focused time in seconds from ended pulse sessions.',
  })
  actualDurationSeconds: number;

  @ApiProperty({
    example: 600,
    description:
      'Remaining planned time in seconds. Clamped to zero once over plan.',
  })
  remainingDurationSeconds: number;

  @ApiProperty({
    example: 60,
    description: 'Task progress percentage based on focused vs planned time.',
  })
  progressPercent: number;
}
