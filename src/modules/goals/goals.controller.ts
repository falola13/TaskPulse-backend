import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { GoalResponseDto } from './dto/goal-response.dto';
import { UpsertGoalDto } from './dto/upsert-goal.dto';
import { GoalsService } from './goals.service';
import { WeeklySummaryResponseDto } from './dto/weekly-summary-response.dto';

@Controller('goals')
@ApiTags('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: GoalResponseDto })
  async getGoal(@GetUser() user: User) {
    return await this.goalsService.getGoal(user.id);
  }

  @Get('weekly-summary')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: WeeklySummaryResponseDto })
  async getWeeklySummary(@GetUser() user: User) {
    return await this.goalsService.getWeeklySummary(user.id);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: GoalResponseDto })
  async upsertGoal(@GetUser() user: User, @Body() body: UpsertGoalDto) {
    return await this.goalsService.upsertGoal(user.id, body);
  }
}
