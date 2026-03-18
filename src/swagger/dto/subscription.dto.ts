import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionStatus } from 'src/subscriptions/entities/subscription.entity';
import { PlanDto } from './plan.dto';
import { UserPublicDto } from './user-public.dto';

export class SubscriptionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: SubscriptionStatus, example: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @ApiProperty({ example: '2026-03-18T12:34:56.000Z' })
  startDate: Date;

  @ApiPropertyOptional({ example: '2026-04-18T12:34:56.000Z' })
  endDate?: Date;

  @ApiPropertyOptional({ example: '2026-03-25T12:34:56.000Z' })
  trialEndDate?: Date;

  @ApiProperty({ example: '2026-03-18T12:34:56.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-18T12:34:56.000Z' })
  updatedAt: Date;

  @ApiPropertyOptional({ type: UserPublicDto })
  user?: UserPublicDto;

  @ApiPropertyOptional({ type: PlanDto })
  plan?: PlanDto;
}

