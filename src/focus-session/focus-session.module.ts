import { Module } from '@nestjs/common';
import { FocusSessionController } from './focus-session.controller';
import { FocusSessionService } from './focus-session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FocusSession } from './focus-session';

@Module({
  imports: [TypeOrmModule.forFeature([FocusSession])],
  controllers: [FocusSessionController],
  providers: [FocusSessionService]
})
export class FocusSessionModule { }
