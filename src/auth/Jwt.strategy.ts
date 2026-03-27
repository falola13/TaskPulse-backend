import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as cookie from 'cookie';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private ConfigService: ConfigService,
    private usersService: UsersService,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    const jwtSecret = ConfigService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req?.cookies?.access_token) return req.cookies.access_token;
          if (!req.headers.cookie) return null;
          const cookies = cookie.parse(req.headers.cookie);
          return cookies['access_token'] ?? null;
        },
      ]),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findOne({ where: { id: payload.id }, select: { email: true, role: true, id: true, firstName: true, lastName: true, imageUrl: true, isTwoFAEnabled: true } },);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // Keep both keys for compatibility across the codebase.
    return user;
  }
}
