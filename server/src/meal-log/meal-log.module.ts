import { Module } from '@nestjs/common';
import { MealLogController } from './meal-log.controller';
import { MealLogService } from './meal-log.service';
import { DbModule } from 'src/db/db.module';

@Module({
  exports: [MealLogService],
  imports: [DbModule],
  controllers: [MealLogController],
  providers: [MealLogService]
})
export class MealLogModule {}
