import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetAllUsersQueryDto } from 'src/swagger/dto/get-all-users-query.dto';
import { GetAllUsersResponseDto } from 'src/swagger/dto/users-response.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('all')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles(Role.ADMIN)
    @ApiCookieAuth('access_token')
    @ApiOkResponse({ type: GetAllUsersResponseDto })
    async getAllUsers(@Query() query: GetAllUsersQueryDto) {
        return await this.usersService.getAllUsers(query)
    }
}
