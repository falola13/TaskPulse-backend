import { UsersService } from 'src/users/users.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<{
    data: Omit<User, 'password'>;
    token: string;
    message: string;
  }> {
    const token = await this.authService.register(createUserDto);
    return token;
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: any,
  ): Promise<{
    data: Omit<User, 'password'>;
    token: string;
    message: string;
  }> {
    const token = await this.authService.login(loginDto);
    res.cookie('access_token', token.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path: '/',
    });
    return {
      message: 'Login successful',
      data: token.data,
      token: token.token,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async profile(@Req() req: any): Promise<{
    success: boolean;
    data: Omit<User, 'password'>;
    message: string;
  }> {
    const user = await this.userService.findUserByEmail(req.user.email);
    if (!user) {
      throw new Error('User profile not found');
    }
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      message: 'User profile retrieved successfully',
    };
  }

  // Logout
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: any): Promise<{
    message: string;
  }> {
    await res.clearCookie('access_token');
    return {
      message: 'Logout successful',
    };
  }
}
