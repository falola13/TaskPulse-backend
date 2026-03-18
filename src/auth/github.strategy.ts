import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifiedCallback } from 'passport-github2';
import { GoogleProfileDto } from './dto/google-profile.dto';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifiedCallback,
  ): Promise<any> {
    const { displayName, username, photos, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: displayName.split(' ')[0],
      lastName: displayName.split(' ')[1],
      picture: photos[0].value,
      providerId: profile.id,
      provider: 'github',
    };
    done(null, user);
  }
}
