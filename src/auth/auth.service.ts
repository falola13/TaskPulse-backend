import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Role, User } from 'src/users/entities/user.entity';
import { TwoFAService } from './2fa.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly twoFAService: TwoFAService,
  ) { }

  private getCookieOptions(maxAge: number) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieDomain = process.env.COOKIE_DOMAIN;

    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
      maxAge,
      path: '/',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    };
  }

  async register(createUserDto: CreateUserDto) {
    // encrypt the user password here
    // For example, using bcrypt
    const hashedPassword = await bcrypt.hashSync(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const user = await this.usersService.createUser(createUserDto);
    // const subscription = await this.
    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return {
      data: this.wrap(user),
      token: token,
      message: 'Login Successful',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email, true);
    // compare the user password with the hashed password

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const userPassword = await bcrypt.compare(
      loginDto.password,
      user?.password,
    );

    if (!userPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      data: this.wrap(user),
      token: this.jwtService.sign({ id: user.id, email: user.email }),
      message: 'Login Successful',
    };
  }
  async socialLogin(user: User & { picture: string }) {
    let existingUser = await this.usersService.findUserByEmail(user.email);
    if (!existingUser) {
      existingUser = await this.usersService.createUser({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: '',
        imageUrl: user.picture,
      });

      return {
        data: this.wrap(existingUser),
        token: this.jwtService.sign({
          id: existingUser.id,
          email: existingUser.email,
        }),
        message: 'Login Successful',
      };
    }
    // if (existingUser) {
    return {
      data: this.wrap(existingUser),
      token: this.jwtService.sign({
        id: existingUser.id,
        email: existingUser.email,
      }),
      message: 'Login Successful',
    };
    // }
  }

  async generateTwoFactorAuthSecret(user: User) {
    const secret = this.twoFAService.generateSecret(user.email);
    await this.usersService.setTwoFASecret(user.id, secret.base32);
    if (!secret.otpauth_url) {
      throw new Error('Failed to generate 2FA secret');
    }
    const qrCode = await this.twoFAService.generateQRCode(secret.otpauth_url);
    return { qrCode, secret: secret.base32 };
  }

  async verifyTwoFactorAuthCode(user: User, code: string, res: any) {
    const existingUser = await this.usersService.findUserById(user.id);
    if (!existingUser || !existingUser.twoFactorSecret) {
      throw new UnauthorizedException('2FA not set up for this user');
    }
    const verified = this.twoFAService.verifyCode(
      existingUser.twoFactorSecret,
      code,
    );

    if (!verified) {
      throw new UnauthorizedException('Invalid 2FA code');
    }
    const payload = { id: existingUser.id, email: existingUser.email };
    const token = this.generateJwtToken(payload);
    res.cookie('access_token', token, this.getCookieOptions(24 * 60 * 60 * 1000));
    res.clearCookie('pending_user', this.getCookieOptions(0));
    return {
      message: '2FA verification successful',
      success: true,
    };
  }

  async enableTwoFactorAuth(user: User, code: string) {
    const existingUser = await this.usersService.findUserByEmail(user.email);
    if (!existingUser || !existingUser.twoFactorSecret) {
      throw new NotFoundException('2FA not set up for this user');
    }
    const verified = this.twoFAService.verifyCode(
      existingUser.twoFactorSecret,
      code,
    );

    if (!verified) {
      throw new NotFoundException('Invalid 2FA code');
    }
    await this.usersService.enableTwoFA(existingUser.id);

    return {
      message: '2FA enabled successfully',
      success: true,
    };
  }
  async disableTwoFactorAuth(user: User) {
    const existingUser = await this.usersService.findUserByEmail(user.email);
    if (!existingUser || !existingUser.twoFactorSecret) {
      throw new NotFoundException('2FA not set up for this user');
    }

    await this.usersService.disableTwoFA(existingUser.id);

    return {
      message: '2FA disabled successfully',
      success: true,
    };
  }

  generateJwtToken(payload: { id: string; email: string }): string {
    return this.jwtService.sign(payload);
  }
  private wrap(data: User): {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isTwoFAEnabled: boolean;
    role: Role
  } {
    return {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      isTwoFAEnabled: data.isTwoFAEnabled,
      role: data.role
    };
  }
}
