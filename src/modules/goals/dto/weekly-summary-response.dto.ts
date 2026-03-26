import { ApiProperty } from '@nestjs/swagger';

export class WeeklySummaryDayDto {
  @ApiProperty({ example: '2026-03-23' })
  date: string;

  @ApiProperty({ example: 75, description: 'Minutes focused on this day.' })
  focusedMinutes: number;

  @ApiProperty({ example: 3 })
  sessionsCount: number;
}

export class WeeklySummaryResponseDto {
  @ApiProperty({ type: WeeklySummaryDayDto, isArray: true })
  days: WeeklySummaryDayDto[];

  @ApiProperty({ example: 120, description: 'Goal in minutes for each day.' })
  dailyFocusTarget: number;

  @ApiProperty({ example: 600, description: 'Goal in minutes for the full week.' })
  weeklyFocusTarget: number;
}
