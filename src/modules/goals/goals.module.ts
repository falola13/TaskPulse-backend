import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goals.entity';
import { FocusSession } from 'src/focus-session/focus-session';

@Module({
  imports: [TypeOrmModule.forFeature([Goal, FocusSession])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalsModule {}
