import { Module } from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import { DbModule } from 'src/db/db.module';
import { UsdaService } from './usda/usda.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  exports: [IngredientService, UsdaService],
  imports: [DbModule, HttpModule.register({ timeout: 55000 })],
  controllers: [IngredientController],
  providers: [IngredientService, UsdaService],
})
export class IngredientModule {}
