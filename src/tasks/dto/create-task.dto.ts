import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Priority, TaskStatus } from '../entities/tasks.entity';

export class CreateTaskDto {
  @ApiProperty({ name: 'title', example: 'Task 1' })
  @IsString()
  title: string;

  @ApiProperty({ name: 'duration', example: 25 })
  @IsInt()
  duration: number;

  @ApiProperty({ name: 'description', example: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ name: 'priority', example: Priority.MEDIUM })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;
}
