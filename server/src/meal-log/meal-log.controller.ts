import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MealLogService } from './meal-log.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  AddMealLogDto,
  MealLogDto,
  MealLogListDto,
  PatchMealLogDto,
} from './dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';

@Controller('meal-logs')
@UseGuards(AuthGuard)
export class MealLogController {
  constructor(private mealLogService: MealLogService) {}

  @Post()
  @ApiCreatedResponse({ type: MealLogDto })
  addMealLog(
    @Body() dto: AddMealLogDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.mealLogService.addMealLog(dto, session.id);
  }

  @Get()
  @ApiOkResponse({ type: MealLogListDto })
  getAll(@SessionInfo() session: GetSessionInfoDto) {
    return this.mealLogService.getAll(session.id);
  }

  @Get('/:id')
  @ApiOkResponse({ type: MealLogDto })
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.mealLogService.getOne(id, session.id);
  }

  @Patch('/:id')
  @ApiOkResponse({ type: MealLogDto })
  patchMealLog(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PatchMealLogDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.mealLogService.patchMealLog(id, dto, session.id);
  }

  @Delete('/:id')
  @ApiOkResponse()
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return this.mealLogService.deleteOne(id, session.id);
  }
}
