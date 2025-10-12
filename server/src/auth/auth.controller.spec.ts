import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CookieService } from './cookie-service';
import { TokenService } from './tokenService';
import { AuthGuard } from './auth.guard';
import { Provider } from './dto';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let cookieService: jest.Mocked<CookieService>;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signInCredentials: jest.fn(),
            signUpCredentials: jest.fn(),
            signWithGoogle: jest.fn(),
          },
        },
        {
          provide: CookieService,
          useValue: {
            setAccess: jest.fn(),
            setRefresh: jest.fn(),
            clearAll: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            verifyRefreshFromRequest: jest.fn(),
            pair: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    cookieService = module.get(CookieService);
    tokenService = module.get(TokenService);
  });

  describe('signIn', () => {
    it('calls authService.signInCredentials for Provider.Credentials', async () => {
      authService.signInCredentials.mockResolvedValue({
        accessToken: 'a1',
        refreshToken: 'r1',
      });
      const body = {
        provider: Provider.Credentials,
        email: 'a@b.c',
        password: '123',
      };
      const res: any = {};
      const result = await controller.signIn(body as any, res);

      expect(authService.signInCredentials).toHaveBeenCalledWith(
        'a@b.c',
        '123',
      );
      expect(cookieService.setAccess).toHaveBeenCalledWith(res, 'a1');
      expect(cookieService.setRefresh).toHaveBeenCalledWith(res, 'r1');
      expect(result).toEqual({ accessToken: 'a1' });
    });

    it('throws BadRequestException if missing email/password', async () => {
      await expect(
        controller.signIn({ provider: Provider.Credentials } as any, {} as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('signUp', () => {
    it('calls authService.signUpCredentials for Provider.Credentials', async () => {
      authService.signUpCredentials.mockResolvedValue({
        accessToken: 'a2',
        refreshToken: 'r2',
      });
      const body = {
        provider: Provider.Credentials,
        email: 'a@b.c',
        password: '123',
      };
      const res: any = {};
      const result = await controller.signUp(body as any, res);

      expect(authService.signUpCredentials).toHaveBeenCalledWith(
        'a@b.c',
        '123',
      );
      expect(cookieService.setAccess).toHaveBeenCalledWith(res, 'a2');
      expect(cookieService.setRefresh).toHaveBeenCalledWith(res, 'r2');
      expect(result).toEqual({ accessToken: 'a2' });
    });
  });

  describe('signOut', () => {
    it('clears all cookies', () => {
      const res: any = {};
      controller.signOut(res);
      expect(cookieService.clearAll).toHaveBeenCalledWith(res);
    });
  });

  describe('refresh', () => {
    it('verifies and refreshes tokens', async () => {
      tokenService.verifyRefreshFromRequest.mockResolvedValue({
        id: 1,
        email: 'a@b.c',
      });
      tokenService.pair.mockResolvedValue({
        accessToken: 'newA',
        refreshToken: 'newR',
      });
      const req: any = {};
      const res: any = {};

      const result = await controller.refresh(req, res);

      expect(tokenService.verifyRefreshFromRequest).toHaveBeenCalledWith(req);
      expect(tokenService.pair).toHaveBeenCalledWith(1, 'a@b.c');
      expect(cookieService.setAccess).toHaveBeenCalledWith(res, 'newA');
      expect(cookieService.setRefresh).toHaveBeenCalledWith(res, 'newR');
      expect(result).toEqual({ accessToken: 'newA' });
    });
  });

  describe('getSessionInfo', () => {
    it('returns session', () => {
      const session = { id: 5, email: 'a@b.c', iat: 1, exp: 2 };
      expect(controller.getSessionInfo(session as any)).toBe(session);
    });
  });
});
