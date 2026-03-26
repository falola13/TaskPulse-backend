import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';
import { UserPublicDto } from './user-public.dto';
import { Type } from '@nestjs/common';

export class GetAllUsersResponseDto {
  @ApiProperty({ example: 'Users fetched successfully!!' })
  message: string;

  @ApiPropertyOptional({ type: UserPublicDto, isArray: true })
  data?: UserPublicDto[];

  @ApiPropertyOptional({ type: PaginationDto })
  pagination?: PaginationDto;
}

export const ApiResponseDto = <TModel extends Type<any>>(model: TModel) => {
  class ApiResponseDtoClass {
    @ApiProperty({ example: 'Request successful' })
    message: string;

    @ApiPropertyOptional({ type: model, isArray: true })
    data?: InstanceType<TModel>[];

    @ApiPropertyOptional({ type: PaginationDto })
    pagination?: PaginationDto;
  }

  return ApiResponseDtoClass;
};
