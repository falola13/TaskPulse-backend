import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/swagger/dto/users-response.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Priority, TaskStatus } from './entities/tasks.entity';

@Controller('tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: TaskResponseDto })
  async create(@GetUser() user: User, @Body() body: CreateTaskDto) {
    return await this.tasksService.create(user.id, body);
  }

  @Get('')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: ApiResponseDto(TaskResponseDto), isArray: true })
  async getTasks(
    @GetUser() user: User,
    @Query()
    query?: QueryDto & {
      withDeleted?: boolean;
      status?: TaskStatus;
      priority?: Priority;
    },
  ) {
    return await this.tasksService.getTasks(user.id, query);
  }
  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: ApiResponseDto(TaskResponseDto), isArray: true })
  async getTaskById(@GetUser() user: User, @Param('id') id: string) {
    return await this.tasksService.getTaskById(user.id, id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: ApiResponseDto(TaskResponseDto) })
  async updateTask(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ) {
    return await this.tasksService.updateTask(user.id, id, body);
  }
  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiCookieAuth('access_token')
  @ApiOkResponse({ type: ApiResponseDto(TaskResponseDto) })
  async deleteTask(@GetUser() user: User, @Param('id') id: string) {
    return await this.tasksService.deleteTask(user.id, id);
  }
}
