import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserPublicDto } from './user-public.dto';

export class AuthRegisterResponseDto {
  @ApiProperty({ type: UserPublicDto })
  data: UserPublicDto;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token: string;

  @ApiProperty({ example: 'Login Successful' })
  message: string;
}

export class AuthLoginResponseDto {
  @ApiProperty({ example: 'Login Successful' })
  message: string;

  @ApiPropertyOptional({ example: true })
  twoFaRequired?: boolean;

  @ApiPropertyOptional({ type: UserPublicDto })
  data?: UserPublicDto;

  @ApiPropertyOptional({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  token?: string;
}

export class AuthProfileResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: UserPublicDto })
  data: UserPublicDto;

  @ApiProperty({ example: 'User profile retrieved successfully' })
  message: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Logout successful' })
  message: string;
}

export class TwoFactorSecretResponseDto {
  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgo...' })
  qrCode: string;

  @ApiProperty({ example: 'JBSWY3DPEHPK3PXP' })
  secret: string;
}

export class TwoFactorActionResponseDto {
  @ApiProperty({ example: '2FA enabled successfully' })
  message: string;

  @ApiProperty({ example: true })
  success: boolean;
}

