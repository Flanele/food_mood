import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { PasswordService } from './password.service';
import { GoogleService } from './google.service';
import { AccountService } from 'src/account/account.service';
import { TokenService } from './tokenService';

@Injectable()
export class AuthService {
  constructor(
    private userServise: UserService,
    private passwordService: PasswordService,
    private googleService: GoogleService,
    private accountService: AccountService,
    private tokenService: TokenService,
  ) {}


  async signUpCredentials(email: string, password: string) {
    const user = await this.userServise.findByEmail(email);

    if (user) {
      throw new BadRequestException({ type: 'email-exists' });
    }

    const passwordHash = await this.passwordService.hash(password);
    const newUser = await this.userServise.create(email, passwordHash);

    return this.tokenService.pair(newUser.id, newUser.email);
  }

  async signInCredentials(email: string, password: string) {
    const user = await this.userServise.findByEmail(email);

    if (!user || !user.passwordHash) {
      throw new BadRequestException({ type: 'bad-credentials' });
    }

    const ok = await this.passwordService.verify(user.passwordHash, password);
    if (!ok) throw new BadRequestException({ type: 'bad-credentials' });

    return this.tokenService.pair(user.id, user.email);
  }

  async signWithGoogle(tokenID: string) {
    const payload = await this.googleService.verifyGoogleIdToken(tokenID);

    if (!payload) throw new BadRequestException({ type: 'incorrect-tokenID' });
    if (!payload.sub) throw new BadRequestException({ type: 'sub-missing' });
    if (!payload.email)
      throw new BadRequestException({ type: 'email-not-provided' });
    if (payload.email_verified === false)
      throw new UnauthorizedException({ type: 'email-not-verified' });

    const acc = await this.accountService.findByProviderAccount(
      'google',
      payload.sub,
    );

    if (acc) {
      const user = await this.userServise.findByID(acc.userId);
      if (!user) throw new UnauthorizedException({ type: 'user-not-found' });
      return await this.tokenService.pair(acc.userId, user.email);
    }

    let user = await this.userServise.findByEmail(payload.email);
    if (!user) {
      user = await this.userServise.create(payload.email);
    }

    await this.accountService.create(user.id, 'google', payload.sub);

    return this.tokenService.pair(user.id, user.email);
  }
}
