import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/users/entities/user.entity';

export class UserPublicDto {
  @ApiProperty({ example: '7f2c7c0b-8a8a-4f3f-9f0b-6d6d6a1a2b3c' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Jane' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  imageUrl?: string;

  @ApiProperty({ example: true })
  isTwoFAEnabled: boolean;

  @ApiProperty({ enum: Role, example: Role.USER })
  role: Role;
}

