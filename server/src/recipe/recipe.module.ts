import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { DbModule } from 'src/db/db.module';
import { IngredientModule } from 'src/ingredient/ingredient.module';
import { UserModule } from 'src/users/user.module';
import { FilesService } from 'src/files/files.service';

@Module({
  exports: [RecipeService],
  imports: [
    DbModule,
    IngredientModule,
    UserModule
  ],
  controllers: [RecipeController],
  providers: [RecipeService, FilesService],
})
export class RecipeModule {}
