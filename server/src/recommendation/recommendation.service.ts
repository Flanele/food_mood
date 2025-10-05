import { Injectable } from '@nestjs/common';
import { UserProfileService } from 'src/users/user-profile.service';
import {
  ExplainQueryDto,
  GetRecommendationsQueryDto,
  GetSimilarQueryDto,
} from './dto';
import { RecipeService } from 'src/recipe/recipe.service';
import {
  calculateIngredientSimilarity,
  isAllergySafe,
  isDietSafe,
} from './recommendation.helpers';
import { MealLogService } from 'src/meal-log/meal-log.service';
import { calcInfluence } from 'src/lib/utils/calc-influence';

@Injectable()
export class RecommendationService {
  constructor(
    private profileService: UserProfileService,
    private recipeService: RecipeService,
    private mealLogService: MealLogService,
  ) {}

  async getForYou(query: GetRecommendationsQueryDto, userId: number) {
    const { objective, limit = 12 } = query;

    const userProfile = await this.profileService.getProfile(userId);

    const prefs =
      typeof userProfile.prefs === 'string'
        ? JSON.parse(userProfile.prefs)
        : userProfile.prefs || {};

    const allRecipes = await this.recipeService.getAllNoLimit();

    const preferredRecipes = allRecipes.filter(
      (recipe) =>
        isDietSafe(recipe.ingredients, prefs.diet) &&
        isAllergySafe(recipe.ingredients, prefs.allergies),
    );

    const recipesToRank = preferredRecipes.length
      ? preferredRecipes
      : allRecipes;

    if (objective === 'balanced') {
      return {
        items: recipesToRank.slice(0, limit).map((r) => ({
          recipeId: r.id,
          title: r.title,
          picture_url: r.picture_url,
          score: 0.5, // базовый средний скор
          ingredients: r.ingredients.map((i) => i.name),
        })),
      };
    }

    const mealLogs = await this.mealLogService.findMany(
      { userProfileId: userId },
      { recipe: true },
    );

    const details = mealLogs.map((log) => ({
      metricValue: log.recipe.kcalPerServ * log.servings,
      mood: log.moodScore,
      energy: log.energyScore,
      sleep: log.sleepScore,
    }));

    const influence =
      calcInfluence(details, objective as 'mood' | 'energy' | 'sleep') ?? 0;

    const scoredRecipes = recipesToRank.map((recipe) => {
      const baseScore = 0.5;
      const nutrientEffect = recipe.kcalPerServ * influence * 0.001;
      const score = baseScore + nutrientEffect;

      return {
        recipeId: recipe.id,
        title: recipe.title,
        picture_url: recipe.picture_url,
        score: Number(score.toFixed(2)),
        ingredients: recipe.ingredients.map((i) => i.name),
      };
    });

    const items = scoredRecipes
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return { items };
  }
  

  async getSimilar(recipeId: number, query: GetSimilarQueryDto) {
    const { limit = 6 } = query;

    const recipe = await this.recipeService.getOneById(recipeId);
    const baseIngredients = recipe.ingredients.map(
      (ingredient) => ingredient.name,
    );

    const allRecipes = await this.recipeService.getAllNoLimit();

    const items = allRecipes
      .filter((otherRecipe) => otherRecipe.id !== recipeId)
      .map((otherRecipe) => {
        const otherIngredients = otherRecipe.ingredients.map(
          (ingredient) => ingredient.name,
        );
        const similarityScore = calculateIngredientSimilarity(
          baseIngredients,
          otherIngredients,
        );

        return {
          recipeId: otherRecipe.id,
          title: otherRecipe.title,
          picture_url: otherRecipe.picture_url,
          score: similarityScore,
          ingredients: otherIngredients,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return { items };
  }

  async explain(query: ExplainQueryDto, userId: number) {}
}
