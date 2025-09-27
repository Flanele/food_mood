import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CookieService } from './cookie-service';
import { Request } from 'express';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
  ) {}


  private signAccess(userId: number, email: string) {
    return this.jwt.signAsync({ id: userId, email }); 
  }

  private signRefresh(userId: number, email: string) {
    return this.jwt.signAsync(
      { id: userId, email: email },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
      },
    );
  }

   async pair(userId: number, email: string) {
    const accessToken = await this.signAccess(userId, email);
    const refreshToken = await this.signRefresh(userId, email);

    return { accessToken, refreshToken };
  }

  async verifyRefreshFromRequest(req: Request) {
    const token = req.cookies?.[CookieService.refreshKey];

    if (!token) throw new UnauthorizedException({ type: 'refresh-missing' });

    try {
      const payload = await this.jwt.verifyAsync<{ id: number, email: string }>(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return payload; // { id, email }
    } catch {
      throw new UnauthorizedException({ type: 'refresh-invalid' });
    }
  }
}
