import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Plan } from 'src/plans/entities/plans.entity';
import { UsersService } from 'src/users/users.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription) private readonly subscriptionRepository: Repository<Subscription>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Plan) private readonly planRepository: Repository<Plan>
    ) { }

    async createSubscription(id: string, body: CreateSubscriptionDto) {
        const { planId } = body
        const user = await this.userRepository.findOne({
            where: { id }, select: {
                id: true,
                email: true
            }
        })
        if (!user) {
            throw new NotFoundException('No User found')
        }

        const subscriptions = await this.subscriptionRepository.findOne({ where: { user: { id } } })
        if (subscriptions) {
            throw new NotFoundException('User already has a subscription')
        }

        const plan = await this.planRepository.findOne({ where: { id: planId } })
        if (!plan) {
            throw new NotFoundException('Plan not found')
        }

        const subscription = this.subscriptionRepository.create({
            user,
            plan,
            status: SubscriptionStatus.ACTIVE,
            startDate: new Date(),
            endDate: new Date(),
            trialEndDate: new Date(),
        })

        return this.subscriptionRepository.save(subscription);
    }

    async getSubscription(id: string) {
        const user = await this.userRepository.findOne({
            where: { id }, relations: {
                subscriptions: {
                    plan: true

                }
            }
        })
        if (!user) {
            throw new NotFoundException('User not found.')
        }
        return user.subscriptions


    }
}
