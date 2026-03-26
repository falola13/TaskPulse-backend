import { Module } from '@nestjs/common';
import { FocusSessionController } from './focus-session.controller';
import { FocusSessionService } from './focus-session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FocusSession } from './focus-session';
import { Task } from 'src/tasks/entities/tasks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FocusSession, Task])],
  controllers: [FocusSessionController],
  providers: [FocusSessionService],
})
export class FocusSessionModule {}
