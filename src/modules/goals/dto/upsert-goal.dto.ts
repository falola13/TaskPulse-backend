import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpsertGoalDto {
  @ApiProperty({ example: 4, description: 'Daily completed pulse session target.' })
  @IsInt()
  @Min(1)
  dailySessionTarget: number;

  @ApiProperty({ example: 120, description: 'Daily focus target in minutes.' })
  @IsInt()
  @Min(1)
  dailyFocusTarget: number;

  @ApiProperty({ example: 600, description: 'Weekly focus target in minutes.' })
  @IsInt()
  @Min(1)
  weeklyFocusTarget: number;
}
