import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import {
  GetSessionInfoDto,
  Provider,
  SignInBodyDTO,
  SignUpBodyDTO,
} from './dto';
import { AuthService } from './auth.service';
import { CookieService } from './cookie-service';
import { AuthGuard } from './auth.guard';
import { SessionInfo } from './session-info.decorator';
import { TokenService } from './tokenService';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private tokenService: TokenService,
  ) {}

  @Post('sign-in')
  @ApiCreatedResponse()
  async signIn(
    @Body() body: SignInBodyDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    let tokens: { accessToken: string; refreshToken: string };

    switch (body.provider) {
      case Provider.Credentials: {
        if (!body.email || !body.password) {
          throw new BadRequestException('email/password required');
        }
        tokens = await this.authService.signInCredentials(
          body.email,
          body.password,
        );
        break;
      }
      case Provider.Google: {
        if (!body.idToken) {
          throw new BadRequestException('idToken required');
        }
        tokens = await this.authService.signWithGoogle(body.idToken);
        break;
      }
      default:
        throw new BadRequestException('Unsupported provider');
    }

    this.cookieService.setAccess(res, tokens.accessToken);
    this.cookieService.setRefresh(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async signUp(
    @Body() body: SignUpBodyDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    let tokens: { accessToken: string; refreshToken: string };

    switch (body.provider) {
      case Provider.Credentials: {
        if (!body.email || !body.password) {
          throw new BadRequestException('email/password required');
        }
        tokens = await this.authService.signUpCredentials(
          body.email,
          body.password,
        );
        break;
      }
      case Provider.Google: {
        if (!body.idToken) {
          throw new BadRequestException('idToken required');
        }
        tokens = await this.authService.signWithGoogle(body.idToken);
        break;
      }
      default:
        throw new BadRequestException('Unsupported provider');
    }

    this.cookieService.setAccess(res, tokens.accessToken);
    this.cookieService.setRefresh(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  signOut(@Res({ passthrough: true }) res: Response) {
    this.cookieService.clearAll(res);
  }

  @Get('session')
  @ApiOkResponse({ type: GetSessionInfoDto })
  @UseGuards(AuthGuard)
  getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {
    return session;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { id, email } = await this.tokenService.verifyRefreshFromRequest(req);

    const { accessToken, refreshToken } = await this.tokenService.pair(
      id,
      email,
    );

    this.cookieService.setAccess(res, accessToken);
    this.cookieService.setRefresh(res, refreshToken);

    return { accessToken };
  }
}
