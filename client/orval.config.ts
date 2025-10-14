const SCHEMA_PATH = './src/shared/api/schema.yaml';

const common = {
  client: 'axios',
  override: {
    mutator: { path: './src/shared/api/api-instance.ts', name: 'createInstance' },
  },
};

export default {
  auth: {
    input: { target: SCHEMA_PATH, filters: { tags: ['Auth'] } },
    output: { ...common, target: './src/shared/api/gen/auth.gen.ts' },
  },
  user: {
    input: { target: SCHEMA_PATH, filters: { tags: ['User'] } },
    output: { ...common, target: './src/shared/api/gen/user.gen.ts' },
  },
  recipes: {
    input: { target: SCHEMA_PATH, filters: { tags: ['Recipes'] } },
    output: { ...common, target: './src/shared/api/gen/recipes.gen.ts' },
  },
  ingredients: {
    input: { target: SCHEMA_PATH, filters: { tags: ['Ingredients'] } },
    output: { ...common, target: './src/shared/api/gen/ingredients.gen.ts' },
  },
  mealLogs: {
    input: { target: SCHEMA_PATH, filters: { tags: ['MealLogs'] } },
    output: { ...common, target: './src/shared/api/gen/meal-logs.gen.ts' },
  },
  analytics: {
    input: { target: SCHEMA_PATH, filters: { tags: ['Analytics'] } },
    output: { ...common, target: './src/shared/api/gen/analytics.gen.ts' },
  },
  recommendations: {
    input: { target: SCHEMA_PATH, filters: { tags: ['Recommendation'] } },
    output: { ...common, target: './src/shared/api/gen/recommendation.gen.ts' },
  },
};
