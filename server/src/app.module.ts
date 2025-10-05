import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { RecipeModule } from './recipe/recipe.module';
import { MealLogModule } from './meal-log/meal-log.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { RecommendationModule } from './recommendation/recommendation.module';


@Module({
  imports: [UserModule, AuthModule, AccountModule, RecipeModule, MealLogModule, AnalyticsModule, RecommendationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
