import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { PasswordService } from './password.service';
import { GoogleService } from './google.service';
import { AccountService } from 'src/account/account.service';
import { TokenService } from './tokenService';

type UserServiceMock = {
  findByEmail: jest.Mock;
  findByID: jest.Mock;
  create: jest.Mock;
};
type PasswordServiceMock = {
  hash: jest.Mock;
  verify: jest.Mock;
};
type GoogleServiceMock = {
  verifyGoogleIdToken: jest.Mock;
};
type AccountServiceMock = {
  findByProviderAccount: jest.Mock;
  create: jest.Mock;
};
type TokenServiceMock = {
  pair: jest.Mock;
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserServiceMock;
  let passwordService: PasswordServiceMock;
  let googleService: GoogleServiceMock;
  let accountService: AccountServiceMock;
  let tokenService: TokenServiceMock;

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      findByID: jest.fn(),
      create: jest.fn(),
    };
    passwordService = {
      hash: jest.fn(),
      verify: jest.fn(),
    };
    googleService = {
      verifyGoogleIdToken: jest.fn(),
    };
    accountService = {
      findByProviderAccount: jest.fn(),
      create: jest.fn(),
    };
    tokenService = {
      pair: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: PasswordService, useValue: passwordService },
        { provide: GoogleService, useValue: googleService },
        { provide: AccountService, useValue: accountService },
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();

    service = module.get(AuthService);
    jest.clearAllMocks();
  });

  // -------- signUpCredentials --------
  it('signUpCredentials: creates user and returns token pair', async () => {
    userService.findByEmail.mockResolvedValueOnce(null);
    passwordService.hash.mockResolvedValueOnce('hashed');
    userService.create.mockResolvedValueOnce({ id: 1, email: 'a@b.c' });
    tokenService.pair.mockResolvedValueOnce({
      accessToken: 'A',
      refreshToken: 'R',
    });

    const result = await service.signUpCredentials('a@b.c', 'pwd');

    expect(userService.findByEmail).toHaveBeenCalledWith('a@b.c');
    expect(passwordService.hash).toHaveBeenCalledWith('pwd');
    expect(userService.create).toHaveBeenCalledWith('a@b.c', 'hashed');
    expect(tokenService.pair).toHaveBeenCalledWith(1, 'a@b.c');
    expect(result).toEqual({ accessToken: 'A', refreshToken: 'R' });
  });

  it('signUpCredentials: throws if email exists', async () => {
    userService.findByEmail.mockResolvedValueOnce({ id: 2, email: 'a@b.c' });

    await expect(service.signUpCredentials('a@b.c', 'pwd')).rejects.toThrow(
      BadRequestException,
    );
  });

  // -------- signInCredentials --------
  it('signInCredentials: verifies password and returns token pair', async () => {
    userService.findByEmail.mockResolvedValueOnce({
      id: 1,
      email: 'a@b.c',
      passwordHash: 'hash',
    });
    passwordService.verify.mockResolvedValueOnce(true);
    tokenService.pair.mockResolvedValueOnce({
      accessToken: 'A',
      refreshToken: 'R',
    });

    const result = await service.signInCredentials('a@b.c', 'pwd');

    expect(passwordService.verify).toHaveBeenCalledWith('hash', 'pwd');
    expect(tokenService.pair).toHaveBeenCalledWith(1, 'a@b.c');
    expect(result).toEqual({ accessToken: 'A', refreshToken: 'R' });
  });

  it('signInCredentials: throws if password invalid', async () => {
    userService.findByEmail.mockResolvedValueOnce({
      id: 1,
      email: 'a@b.c',
      passwordHash: 'hash',
    });
    passwordService.verify.mockResolvedValueOnce(false);

    await expect(service.signInCredentials('a@b.c', 'bad')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('signInCredentials: throws if user not found', async () => {
    userService.findByEmail.mockResolvedValueOnce(null);
    await expect(service.signInCredentials('no@x.com', 'pwd')).rejects.toThrow(
      BadRequestException,
    );
  });

  // -------- signWithGoogle --------
  it('signWithGoogle: existing account → token pair', async () => {
    googleService.verifyGoogleIdToken.mockResolvedValueOnce({
      sub: 'g123',
      email: 'g@x.com',
      email_verified: true,
    });
    accountService.findByProviderAccount.mockResolvedValueOnce({ userId: 5 });
    userService.findByID.mockResolvedValueOnce({ id: 5, email: 'g@x.com' });
    tokenService.pair.mockResolvedValueOnce({
      accessToken: 'A',
      refreshToken: 'R',
    });

    const result = await service.signWithGoogle('token');

    expect(accountService.findByProviderAccount).toHaveBeenCalledWith(
      'google',
      'g123',
    );
    expect(userService.findByID).toHaveBeenCalledWith(5);
    expect(result).toEqual({ accessToken: 'A', refreshToken: 'R' });
  });

  it('signWithGoogle: new user flow → creates user & account', async () => {
    googleService.verifyGoogleIdToken.mockResolvedValueOnce({
      sub: 'g123',
      email: 'new@x.com',
      email_verified: true,
    });
    accountService.findByProviderAccount.mockResolvedValueOnce(null);
    userService.findByEmail.mockResolvedValueOnce(null);
    userService.create.mockResolvedValueOnce({ id: 7, email: 'new@x.com' });
    tokenService.pair.mockResolvedValueOnce({
      accessToken: 'A2',
      refreshToken: 'R2',
    });

    const result = await service.signWithGoogle('token');

    expect(userService.create).toHaveBeenCalledWith('new@x.com');
    expect(accountService.create).toHaveBeenCalledWith(7, 'google', 'g123');
    expect(result).toEqual({ accessToken: 'A2', refreshToken: 'R2' });
  });

  it('signWithGoogle: throws if email not verified', async () => {
    googleService.verifyGoogleIdToken.mockResolvedValueOnce({
      sub: 'g123',
      email: 'g@x.com',
      email_verified: false,
    });

    await expect(service.signWithGoogle('token')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('signWithGoogle: throws if payload is null', async () => {
    googleService.verifyGoogleIdToken.mockResolvedValueOnce(null);

    await expect(service.signWithGoogle('token')).rejects.toThrow(
      BadRequestException,
    );
  });
});
