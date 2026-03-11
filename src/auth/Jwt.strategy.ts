import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as cookie from 'cookie';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private ConfigService: ConfigService) {
    const jwtSecret = ConfigService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (!req.headers.cookie) return null;
          const cookies = cookie.parse(req.headers.cookie);
          return cookies['access_token'] ?? null;
        },
      ]),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.id, email: payload.email };
  }
}
