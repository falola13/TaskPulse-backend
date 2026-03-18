import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';
import { UserPublicDto } from './user-public.dto';

export class GetAllUsersResponseDto {
  @ApiProperty({ example: 'Users fetched successfully!!' })
  message: string;

  @ApiPropertyOptional({ type: UserPublicDto, isArray: true })
  data?: UserPublicDto[];

  @ApiPropertyOptional({ type: PaginationDto })
  pagination?: PaginationDto;
}

