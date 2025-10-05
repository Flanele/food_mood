import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { UserModule } from 'src/users/user.module';
import { RecipeModule } from 'src/recipe/recipe.module';
import { MealLogModule } from 'src/meal-log/meal-log.module';

@Module({
  exports: [RecommendationService],
  imports: [MealLogModule, UserModule, RecipeModule],
  controllers: [RecommendationController],
  providers: [RecommendationService],
})
export class RecommendationModule {}
