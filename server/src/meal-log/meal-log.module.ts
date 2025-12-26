import { Module } from '@nestjs/common';
import { MealLogController } from './meal-log.controller';
import { MealLogService } from './meal-log.service';
import { DbModule } from 'src/db/db.module';
import { UserModule } from 'src/users/user.module';

@Module({
  exports: [MealLogService],
  imports: [DbModule, UserModule],
  controllers: [MealLogController],
  providers: [MealLogService]
})
export class MealLogModule {}
