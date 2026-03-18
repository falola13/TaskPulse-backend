import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { SessionType } from '../focus-session';

export class StartSessionDto {
  @IsEnum(SessionType)
  type: SessionType;

  @IsOptional()
  @IsInt()
  taskId?: number;
}
