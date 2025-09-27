import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { PatchProfileDTO, ProfileDTO } from './dto';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userProfileService: UserProfileService) {}

  @Get('profile')
  @ApiOkResponse({ type: ProfileDTO })
  getMyProfile(@SessionInfo() session: GetSessionInfoDto) {
    return this.userProfileService.getProfile(session.id);
  }

  @Patch('profile')
  @ApiBody({ type: PatchProfileDTO })
  @ApiOkResponse({ type: ProfileDTO })
  async editProfile(
    @Body() dto: PatchProfileDTO,
    @SessionInfo() session: GetSessionInfoDto,
  ): Promise<ProfileDTO> {
    const updated = await this.userProfileService.editProfile(session.id, dto);
    return updated;
  }
}
