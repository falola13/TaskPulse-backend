import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFAService {
  generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `TaskPulse (${email})`,
    });

    return secret;
  }

  async generateQRCode(otpauthUrl: string) {
    return qrcode.toDataURL(otpauthUrl);
  }

  verifyCode(secret: string, code: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
  }
}
