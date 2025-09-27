import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [UserModule, AuthModule, AccountModule, RecipeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
