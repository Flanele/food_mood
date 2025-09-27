import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { DbModule } from 'src/db/db.module';
import { IngredientService } from './ingredients/ingredient.service';
import { UsdaService } from './usda/usda.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  exports: [RecipeService],
  imports: [DbModule, HttpModule.register({ timeout: 15000 })],
  controllers: [RecipeController],
  providers: [RecipeService, IngredientService, UsdaService],
})
export class RecipeModule {}
