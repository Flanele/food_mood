import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtService } from '@nestjs/jwt';
import { CookieService } from './cookie-service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest() as Request;
    const token = req.cookies[CookieService.accessKey];

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const sessionInfo = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      req['session'] = sessionInfo;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
