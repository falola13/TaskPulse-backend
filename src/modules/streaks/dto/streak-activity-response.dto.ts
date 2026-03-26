import { ApiProperty } from '@nestjs/swagger';

export class StreakActivityDayDto {
  @ApiProperty({ example: '2026-03-25' })
  date: string;

  @ApiProperty({ example: 3, description: 'Number of ended pulse sessions for this date.' })
  count: number;
}

export class StreakActivityResponseDto {
  @ApiProperty({ type: StreakActivityDayDto, isArray: true })
  days: StreakActivityDayDto[];
}
