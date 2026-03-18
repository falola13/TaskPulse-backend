import { ApiProperty } from '@nestjs/swagger';
import { PlanInterval } from 'src/plans/entities/plans.entity';

export class PlanDto {
  @ApiProperty({ example: '8e0f6c1d-7c2b-4a0d-9b8c-6f1b0d2d3e4f' })
  id: string;

  @ApiProperty({ example: 'Pro' })
  name: string;

  @ApiProperty({ example: 19.99 })
  price: number;

  @ApiProperty({ enum: PlanInterval, example: PlanInterval.MONTHLY })
  interval: PlanInterval | string;

  @ApiProperty({ example: { tasks: 1000, teams: 5 } })
  features: Record<string, any>;
}

