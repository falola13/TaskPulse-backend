import { Controller, Get, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PlansResponseDto } from 'src/swagger/dto/plans-response.dto';

@Controller('plans')
@ApiTags('plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiCookieAuth('access_token')
    @ApiOkResponse({ type: PlansResponseDto })
    async getPlans() {
        return await this.plansService.getPlans()
    }

}
