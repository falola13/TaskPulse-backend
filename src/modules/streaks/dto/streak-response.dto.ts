import { ApiProperty } from '@nestjs/swagger';

export class StreakResponseDto {
  @ApiProperty({ example: 4 })
  currentStreakDays: number;

  @ApiProperty({ example: 9 })
  longestStreakDays: number;

  @ApiProperty({ example: 27 })
  totalActiveDays: number;

  @ApiProperty({ example: true })
  activeToday: boolean;

  @ApiProperty({ example: '2026-03-26', nullable: true })
  lastActiveDate: string | null;
}
