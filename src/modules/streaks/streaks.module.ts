import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FocusSession } from 'src/focus-session/focus-session';
import { StreaksController } from './streaks.controller';
import { StreaksService } from './streaks.service';

@Module({
  imports: [TypeOrmModule.forFeature([FocusSession])],
  providers: [StreaksService],
  controllers: [StreaksController],
})
export class StreaksModule {}
