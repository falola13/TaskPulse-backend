import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { User } from 'src/users/entities/user.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { Plan } from 'src/plans/entities/plans.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User, Plan]), forwardRef(() => UsersModule),],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService]
})
export class SubscriptionsModule { }
