import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleService {
  private google = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor() {}

  async verifyGoogleIdToken(idToken: string) {
    const ticket = await this.google.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub) throw new UnauthorizedException('google-token-invalid');
    if (!payload.email) throw new UnauthorizedException('google-email-missing');
    if (payload.email_verified === false)
      throw new UnauthorizedException('google-email-not-verified');
    return payload;
  }
}
