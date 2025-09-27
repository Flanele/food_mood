import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DbModule } from 'src/db/db.module';
import { UserProfileService } from './user-profile.service';

@Module({
  imports: [DbModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, UserProfileService]
})
export class UserModule {}
