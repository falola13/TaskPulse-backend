import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Priority, TaskStatus } from '../entities/tasks.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ name: 'title', example: 'Task 1' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ name: 'duration', example: 25 })
  @IsInt()
  @IsOptional()
  duration?: number;

  @ApiProperty({ name: 'description', example: 'Task description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ name: 'priority', example: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiProperty({ name: 'status', example: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
