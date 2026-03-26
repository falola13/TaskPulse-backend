import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { StreakResponseDto } from './dto/streak-response.dto';
import { StreaksService } from './streaks.service';
import { StreakActivityResponseDto } from './dto/streak-activity-response.dto';

@Controller('streaks')
@ApiTags('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: StreakResponseDto })
  async getStreak(@GetUser() user: User) {
    return await this.streaksService.getStreak(user.id);
  }

  @Get('activity')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: StreakActivityResponseDto })
  async getActivity(@GetUser() user: User, @Query('days') days?: string) {
    return await this.streaksService.getActivity(user.id, Number(days) || 84);
  }
}
