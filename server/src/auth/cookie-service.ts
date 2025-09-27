import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  static accessKey  = 'access-token';
  static refreshKey = 'refresh-token';

  // dev: только httpOnly, SameSite=Lax, secure=false
  private opts(maxAgeMs: number) {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: false,
      path: '/',
      maxAge: maxAgeMs,
    };
  }

  setAccess(res: Response, token: string) {
    res.cookie(CookieService.accessKey, token, this.opts(15 * 60 * 1000)); // 15m
  }

  setRefresh(res: Response, token: string) {
    res.cookie(CookieService.refreshKey, token, this.opts(7 * 24 * 60 * 60 * 1000)); // 7d
  }

  clearAll(res: Response) {
    const base = { httpOnly: true, sameSite: 'lax' as const, secure: false, path: '/' };
    res.clearCookie(CookieService.accessKey, base);
    res.clearCookie(CookieService.refreshKey, base);
  }
}

