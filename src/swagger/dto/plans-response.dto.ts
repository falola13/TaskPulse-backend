import { ApiProperty } from '@nestjs/swagger';
import { PlanDto } from './plan.dto';

export class PlansResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: PlanDto, isArray: true })
  plans: PlanDto[];

  @ApiProperty({ example: 'Plans retrieved successfully' })
  message: string;
}

