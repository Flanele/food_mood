import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  ExplainQueryDto,
  ExplainRecommendationDto,
  GetRecommendationsDto,
  GetRecommendationsQueryDto,
  GetSimilarQueryDto,
} from './dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';

@Controller('recommendation')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get('/for-you')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Personalized recipe recommendations for the current user',
    type: GetRecommendationsDto,
  })
  getForYou(
    @Query() query: GetRecommendationsQueryDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.recommendationService.getForYou(query, session.id);
  }

  @Get('/peers')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Recipes liked by similar users (peer-based ranking)',
    type: GetRecommendationsDto,
  })
  getPeers(
    @Query() query: GetRecommendationsQueryDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.recommendationService.getPeers(query, session.id);
  }


  @Get('similar/:recipeId')
  @ApiOkResponse({
    description:
      'Recipes similar to the given one (ingredients/macros similarity)',
    type: GetRecommendationsDto,
  })
  getSimilar(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Query() query: GetSimilarQueryDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.recommendationService.getSimilar(recipeId, query);
  }

  @Get('explain/:recipId')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description:
      'Explain the score for a given recipe (reasons and score breakdown)',
    type: ExplainRecommendationDto,
  })
  explain(
    @Param('recipId', ParseIntPipe) recipeId: number,
    @Query() query: ExplainQueryDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.recommendationService.explain(recipeId, query, session.id);
  }
}
