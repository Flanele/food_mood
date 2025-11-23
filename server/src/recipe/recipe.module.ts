import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { DbModule } from 'src/db/db.module';
import { IngredientModule } from 'src/ingredient/ingredient.module';
import { UserModule } from 'src/users/user.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  exports: [RecipeService],
  imports: [DbModule, IngredientModule, UserModule, FilesModule],
  controllers: [RecipeController],
  providers: [RecipeService],
})
export class RecipeModule {}
