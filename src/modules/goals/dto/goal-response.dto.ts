import { ApiProperty } from '@nestjs/swagger';

export class GoalResponseDto {
  @ApiProperty({ example: 'goal-uuid' })
  id: string;

  @ApiProperty({ example: 'user-uuid' })
  userId: string;

  @ApiProperty({ example: 4 })
  dailySessionTarget: number;

  @ApiProperty({ example: 120, description: 'Minutes' })
  dailyFocusTarget: number;

  @ApiProperty({ example: 600, description: 'Minutes' })
  weeklyFocusTarget: number;

  @ApiProperty({ example: 2 })
  todayCompletedSessions: number;

  @ApiProperty({ example: 75, description: 'Minutes' })
  todayFocusedMinutes: number;

  @ApiProperty({ example: 280, description: 'Minutes' })
  weekFocusedMinutes: number;

  @ApiProperty({ example: 62 })
  dailyFocusProgressPercent: number;

  @ApiProperty({ example: 46 })
  weeklyFocusProgressPercent: number;
}
