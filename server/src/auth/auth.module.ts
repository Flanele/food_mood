import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { GoogleService } from './google.service';
import { CookieService } from './cookie-service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/users/user.module';
import { AccountModule } from 'src/account/account.module';
import { TokenService } from './tokenService';

@Module({
  exports: [AuthService],
  imports: [UserModule, AccountModule, JwtModule.register({
    global: true,
    secret: process.env.JWT_ACCESS_SECRET,
    signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' },
  }),],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, GoogleService, CookieService, TokenService]
})
export class AuthModule {}
