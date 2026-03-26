import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FocusSessionService } from './focus-session.service';
import { AuthGuard } from '@nestjs/passport';
import { StartSessionDto } from './dto/start-session.dto';
import { Request } from 'express';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FocusSessionDto } from 'src/swagger/dto/focus-session.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { FocusSession } from './focus-session';
import { ApiResponseDto } from 'src/swagger/dto/users-response.dto';

@Controller('focus-session')
@ApiTags('focus-session')
export class FocusSessionController {
  constructor(private readonly focusSession: FocusSessionService) {}

  @Post('start')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiBody({ type: StartSessionDto })
  @ApiOkResponse({ type: FocusSessionDto })
  async startSession(
    @Body() dto: StartSessionDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    return await this.focusSession.start(dto, req.user.id);
  }

  @Patch(':id/end')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: FocusSessionDto })
  async endSession(
    @Param('id', ParseIntPipe) sessionId: number,
    @Req() req: Request & { user: { id: string } },
  ) {
    return await this.focusSession.end(sessionId, req.user.id);
  }

  @Get('current')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  async getCurrentSession(@Req() req: Request & { user: { id: string } }) {
    return await this.focusSession.getCurrentSession(req.user.id);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: ApiResponseDto(FocusSessionDto) })
  async getHistory(
    @Req() req: Request & { user: { id: string } },
    @Query() query: QueryDto,
  ) {
    return await this.focusSession.getHistory(req.user.id, query);
  }
}
