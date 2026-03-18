import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plans.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan])
  ],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule { }
