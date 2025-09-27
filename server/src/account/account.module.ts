import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { DbModule } from 'src/db/db.module';

@Module({
  exports: [AccountService],
  imports: [DbModule],
  providers: [AccountService]
})
export class AccountModule {}
