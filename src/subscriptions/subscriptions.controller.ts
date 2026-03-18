import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SubscriptionDto } from 'src/swagger/dto/subscription.dto';

@Controller('subscriptions')
@ApiTags('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiCookieAuth('access_token')
    @ApiOkResponse({ type: SubscriptionDto })
    async createSubscription(@GetUser() user: User, @Body() body: CreateSubscriptionDto) {
        return await this.subscriptionsService.createSubscription(user.id, body)
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiCookieAuth('access_token')
    @ApiOkResponse({ type: SubscriptionDto, isArray: true })
    async getSubscription(@GetUser() user: User) {
        return await this.subscriptionsService.getSubscription(user.id)
    }
}
