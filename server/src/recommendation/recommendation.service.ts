import { Injectable } from '@nestjs/common';
import { UserProfileService } from 'src/users/user-profile.service';
import {
  ExplainQueryDto,
  ExplainRecommendationDto,
  GetRecommendationsQueryDto,
  GetSimilarQueryDto,
} from './dto';
import { RecipeService } from 'src/recipe/recipe.service';
import { isAllergySafe, isDietSafe } from './helpers/diet-check';
import { MealLogService } from 'src/meal-log/meal-log.service';
import { calcInfluence } from 'src/lib/utils/calc-influence';
import { calculateIngredientSimilarity } from './helpers/calcIngredientSimilarity';
import { Prisma } from 'generated/prisma';
import { isProfileSimilar } from './helpers/isProfileSimilar';
import { getAge } from 'src/lib/utils/get-age';
import { pickScoreForObjective } from './helpers/pickSroceObjective';
import { getConsumedIngredientGrams } from './helpers/getConsumedIngredientGrams';
import { LogLite, RecipeLite } from './recommendation.types';
import { computeNutrientsObjective } from './helpers/computeNutrientsObjective';
import { computeAffinityForRecipe } from './helpers/computeAffinityForRecipe';
import { pickPeerScore } from './helpers/pickPeerScore';
import { computeFinalScoreWithPrefs } from './helpers/computeFinalScoreWithPrefs';
import { buildExplainReasons } from './helpers/buildExplainReasons';

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

    const mealLogs = await this.mealLogService.findMany({
      userProfileId: userId,
    });

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

  async getPeers(query: GetRecommendationsQueryDto, userId: number) {
    const { objective = 'balanced', limit = 12 } = query;

    const me = await this.profileService.getProfile(userId);
    const where: Prisma.UserProfileWhereInput = { userId: { not: userId } };

    const select: Prisma.UserProfileSelect = { id: true };

    if (me?.birthDate) select.birthDate = true;
    if (me?.sex) select.sex = true;
    if (me?.bmi != null) select.bmi = true;

    const peersProfiles = await this.profileService.returnAllProfiles(
      where,
      select,
    );

    const myShape = {
      age: me?.birthDate ? getAge(me.birthDate) : null,
      sex: me?.sex ?? null,
      bmi: typeof me?.bmi === 'number' ? me!.bmi : null,
    };

    const similarProfileIds = peersProfiles
      .filter((p) => isProfileSimilar(myShape, p))
      .map((p) => p.id);

    if (!similarProfileIds.length) return { items: [] };

    const peerLogs = await this.mealLogService.findManyWithSelect(
      { userProfileId: { in: similarProfileIds } },
      { recipeId: true, moodScore: true, energyScore: true, sleepScore: true },
    );

    const VOTE_STEP = 0.1;
    const voteCountByRecipeId = new Map<number, number>();
    const scoreByRecipeId = new Map<number, number>();

    for (const log of peerLogs) {
      const value = pickScoreForObjective(log, objective);
      if (value == null) continue;

      let vote = 0;
      if (value >= 7) vote = +VOTE_STEP;
      else if (value <= 4) vote = -VOTE_STEP;
      else continue;

      scoreByRecipeId.set(
        log.recipeId,
        (scoreByRecipeId.get(log.recipeId) ?? 0) + vote,
      );
      voteCountByRecipeId.set(
        log.recipeId,
        (voteCountByRecipeId.get(log.recipeId) ?? 0) + 1,
      );
    }

    const MIN_VOTES_PER_RECIPE = 2;
    const topRecipeIds = Array.from(scoreByRecipeId.entries())
      .filter(
        ([recipeId]) =>
          (voteCountByRecipeId.get(recipeId) ?? 0) >= MIN_VOTES_PER_RECIPE,
      )
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([recipeId]) => recipeId);

    if (!topRecipeIds.length) return { items: [] };

    const recipes = await this.recipeService.getAllNoLimit({
      id: { in: topRecipeIds },
    });

    const items = recipes
      .map((recipe) => ({
        recipeId: recipe.id,
        title: recipe.title,
        picture_url: recipe.picture_url,
        score: Number((scoreByRecipeId.get(recipe.id) ?? 0).toFixed(2)),
        ingredients: recipe.ingredients.map((i) => i.name),
      }))
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

  async explain(
    recipeId: number,
    query: ExplainQueryDto,
    userId: number,
  ): Promise<ExplainRecommendationDto> {
    const { objective = 'balanced' } = query;

    const recipe = await this.recipeService.getOneById(recipeId);
    const profile = await this.profileService.getProfile(userId);
    const prefs =
      typeof profile.prefs === 'string'
        ? JSON.parse(profile.prefs)
        : profile.prefs || {};

    const userLogs = await this.mealLogService.findMany({
      userProfileId: userId,
    });

    const okDiet = isDietSafe(recipe.ingredients, prefs?.diet);
    const okAll = isAllergySafe(recipe.ingredients, prefs?.allergies);

    const details = userLogs.map((log) => ({
      metricValue: log.recipe.kcalPerServ * log.servings,
      mood: log.moodScore,
      energy: log.energyScore,
      sleep: log.sleepScore,
    }));

    const influence =
      objective === 'balanced' ? 0 : (calcInfluence(details, objective) ?? 0);
    const nutrientsObjective =
      objective === 'balanced'
        ? 0
        : computeNutrientsObjective(recipe.kcalPerServ, influence);

    const gramsByIngredient = getConsumedIngredientGrams(
      userLogs as unknown as LogLite[],
    );
    const { affinity, hits: affinityHits } = computeAffinityForRecipe(
      {
        kcalPerServ: recipe.kcalPerServ,
        ingredients: recipe.ingredients,
      } as RecipeLite,
      gramsByIngredient,
    );

    const peers = await this.getPeers(
      { objective, limit: 50 } as GetRecommendationsQueryDto,
      userId,
    );
    const profileSimilarity = pickPeerScore(peers.items, recipeId);

    const base = 0.5;
    const { score, prefsContribution } = computeFinalScoreWithPrefs(
      base,
      { nutrientsObjective, affinity, profileSimilarity },
      okDiet,
      okAll,
    );

    const reasons = buildExplainReasons(
      objective,
      nutrientsObjective,
      prefs,
      okDiet,
      okAll,
      affinityHits,
      profileSimilarity,
    );

    return {
      recipeId: recipe.id,
      score,
      breakdown: {
        affinity,
        prefs: prefsContribution,
        nutrientsObjective,
        profileSimilarity,
      },
      reasons,
    };
  }
}
