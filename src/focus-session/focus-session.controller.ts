import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FocusSessionService } from './focus-session.service';
import { AuthGuard } from '@nestjs/passport';
import { StartSessionDto } from './dto/start-session.dto';
import { Request } from 'express';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FocusSessionDto } from 'src/swagger/dto/focus-session.dto';

@Controller('focus-session')
@ApiTags('focus-session')
export class FocusSessionController {
    constructor(private readonly focusSession: FocusSessionService) { }

    @Post('start')
    @UseGuards(AuthGuard('jwt'))
    @ApiCookieAuth('access_token')
    @ApiOkResponse({ type: FocusSessionDto })
    async startSession(@Body() dto: StartSessionDto, @Req() req: any) {
        return await this.focusSession.start(dto, req.user.id)
    }
}
