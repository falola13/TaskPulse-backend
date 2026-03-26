import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SessionType } from 'src/focus-session/focus-session';

export class FocusSessionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '7f2c7c0b-8a8a-4f3f-9f0b-6d6d6a1a2b3c' })
  userId: string;

  @ApiProperty({ enum: SessionType, example: SessionType.PULSE })
  type: SessionType;

  @ApiProperty({ example: '2026-03-18T12:34:56.000Z' })
  startTime: Date;

  @ApiPropertyOptional({ example: '2026-03-18T12:59:56.000Z' })
  endTime?: Date;

  @ApiPropertyOptional({ example: 1500 })
  duration?: number;

  @ApiProperty({ example: 1500 })
  expectedDuration: number;

  @ApiPropertyOptional({ example: '7f2c7c0b-8a8a-4f3f-9f0b-6d6d6a1a2b3c' })
  taskId?: string;
}
