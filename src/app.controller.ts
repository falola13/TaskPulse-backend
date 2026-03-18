import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns a simple greeting message.',
    schema: { type: 'string', example: 'Welcome to my Pomodoro application!' },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
