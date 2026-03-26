import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { SessionType } from '../focus-session';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartSessionDto {
  @ApiProperty({ enum: SessionType, example: SessionType.PULSE })
  @IsEnum(SessionType)
  type: SessionType;

  @ApiPropertyOptional({
    nullable: true,
    example: '7f2c7c0b-8a8a-4f3f-9f0b-6d6d6a1a2b3c',
  })
  @IsOptional()
  @IsUUID()
  taskId?: string;
}
