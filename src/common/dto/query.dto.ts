import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({ example: '10', description: 'Max users per page' })
  @IsOptional()
  @IsString()
  limit?: string;

  @ApiPropertyOptional({ example: '1', description: 'Page number (1-based)' })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({ example: 'john', description: 'Search by email/name' })
  @IsOptional()
  @IsString()
  search?: string;
}
