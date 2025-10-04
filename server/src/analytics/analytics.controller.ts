import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  GetAnalyticsByTimeDto,
  GetAnalyticsByTimeQueryDto,
  GetNutrientsScoreDto,
  GetNutrientsScoreQueryDto,
  GetTopIngredientsDto,
  GetTopIngredientsQueryDto,
} from './dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  constructor(private analyticService: AnalyticsService) {}

  @Get('/macros')
  @ApiOkResponse({
    description: 'Aggregated nutrition stats for a selected time period',
    type: GetAnalyticsByTimeDto,
  })
  getAnalyticsByTime(
    @Query() query: GetAnalyticsByTimeQueryDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.analyticService.getAnalyticsByTime(query, session.id);
  }

  @Get('/top-ingredients')
  @ApiOkResponse({
    description:
      'Most frequently used ingredients with their total usage and impact scores',
    type: GetTopIngredientsDto,
  })
  getTopIngredients(
    @Query() query: GetTopIngredientsQueryDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.analyticService.getTopIngredients(query, session.id);
  }

  @Get('/score')
  @ApiOkResponse({
    description:
      'Correlation between consumed nutrients and mood, energy, and sleep scores',
    type: GetNutrientsScoreDto,
  })
  getScoreCorrelationByMetric(
    @Query() query: GetNutrientsScoreQueryDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.analyticService.getScoreCorrelationByMetric(query, session.id);
  }
}
