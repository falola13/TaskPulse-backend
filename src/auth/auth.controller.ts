import { UsersService } from 'src/users/users.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorator/get-user.decorator';
import { TwoFaGuard } from './guard/twofa.guard';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthLoginResponseDto,
  AuthProfileResponseDto,
  AuthRegisterResponseDto,
  LogoutResponseDto,
  TwoFactorActionResponseDto,
  TwoFactorSecretResponseDto,
} from 'src/swagger/dto/auth-response.dto';
import { TwoFactorCodeDto } from 'src/swagger/dto/two-factor-code.dto';
import { buildAuthCookieOptions } from 'src/common/utils/cookie-options';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  private getFrontendRedirectBase(): string {
    const configured = process.env.FRONTEND_URL || process.env.CORS_ORIGIN;
    if (!configured) return 'http://localhost:3000';

    const first = configured.split(',')[0]?.trim();
    return first || 'http://localhost:3000';
  }

  @Post('register')
  @ApiOkResponse({ type: AuthRegisterResponseDto })
  async register(@Body() createUserDto: CreateUserDto) {
    const token = await this.authService.register(createUserDto);
    return token;
  }

  @Post('login')
  @ApiOkResponse({ type: AuthLoginResponseDto })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const token = await this.authService.login(loginDto);
    if (token.data?.isTwoFAEnabled) {
      res.cookie(
        'pending_user',
        token.data.id,
        buildAuthCookieOptions(5 * 60 * 1000),
      );
      return {
        message: '2FA is enabled, please verify your code',
        twoFaRequired: true,
      };
    }
    res.cookie(
      'access_token',
      token.token,
      buildAuthCookieOptions(24 * 60 * 60 * 1000),
    );
    return {
      message: 'Login successful',
      data: token.data,
      token: token.token,
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: AuthProfileResponseDto })
  async profile(@Req() req: any) {
    const user = await this.userService.findUserByEmail(req.user.email);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        isTwoFAEnabled: user.isTwoFAEnabled,
        role: user.role,
      },
      message: 'User profile retrieved successfully',
    };
  }

  // Logout
  @Post('logout')
  @ApiOkResponse({ type: LogoutResponseDto })
  async logout(@Res({ passthrough: true }) res: any): Promise<{
    message: string;
  }> {
    await res.clearCookie('access_token', buildAuthCookieOptions(0));
    return {
      message: 'Logout successful',
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiResponse({ status: 302, description: 'Redirect to Google OAuth' })
  async googleAuth(@Req() req: any): Promise<void> {
    // Initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiResponse({
    status: 302,
    description: 'Redirect back to frontend after Google OAuth',
  })
  async googleAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ): Promise<{ message: string; token: string }> {
    // Handles the callback from Google OAuth
    const user = req.user;
    const tokenData = await this.authService.socialLogin(user);
    res.cookie(
      'access_token',
      tokenData?.token,
      buildAuthCookieOptions(24 * 60 * 60 * 1000),
    );
    // if (body.redirect_uri) {
    const frontendUrl = this.getFrontendRedirectBase();
    return res.redirect(
      `${frontendUrl}/dashboard?token=${tokenData?.token}&message=${encodeURIComponent(tokenData?.message)}`,
    );
  }
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiQuery({ name: 'redirect_uri', required: false, type: String })
  @ApiResponse({ status: 302, description: 'Redirect to GitHub OAuth' })
  async githubAuth(
    @Query('redirect_uri') redirect_uri: string,
    @Req() req: any,
  ): Promise<void> {
    // Initiates the Google OAuth flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiResponse({
    status: 302,
    description: 'Redirect back to frontend after GitHub OAuth',
  })
  async githubCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ): Promise<{ message: string; token: string }> {
    // Handles the callback from Google OAuth

    const user = req.user;
    const tokenData = await this.authService.socialLogin(user);
    res.cookie(
      'access_token',
      tokenData?.token,
      buildAuthCookieOptions(24 * 60 * 60 * 1000),
    );
    const frontendUrl = this.getFrontendRedirectBase();

    return res.redirect(
      `${frontendUrl}/dashboard?token=${tokenData?.token}&message=${encodeURIComponent(tokenData?.message)}`,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/generate')
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: TwoFactorSecretResponseDto })
  async generateTwoFactorAuthSecret(@Req() req: { user: User }) {
    return await this.authService.generateTwoFactorAuthSecret(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/enable')
  @ApiCookieAuth('access_token')
  @ApiBody({ type: TwoFactorCodeDto })
  @ApiOkResponse({ type: TwoFactorActionResponseDto })
  async enableTwoFactorAuth(
    @GetUser() user: User,
    @Body() dto: TwoFactorCodeDto,
  ) {
    return await this.authService.enableTwoFactorAuth(user, dto.code);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/disable')
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: TwoFactorActionResponseDto })
  async disableTwoFactorAuth(@GetUser() user: User) {
    return await this.authService.disableTwoFactorAuth(user);
  }

  @UseGuards(TwoFaGuard)
  @Post('2fa/verify')
  @ApiCookieAuth('access_token')
  @ApiBody({ type: TwoFactorCodeDto })
  @ApiOkResponse({ type: TwoFactorActionResponseDto })
  async verifyTwoFactorAuthCode(
    @Req() req: { user: User },
    @Body() dto: TwoFactorCodeDto,
    @Res({ passthrough: true }) res: any,
  ) {
    return await this.authService.verifyTwoFactorAuthCode(
      req.user,
      dto.code,
      res,
    );
  }
}
