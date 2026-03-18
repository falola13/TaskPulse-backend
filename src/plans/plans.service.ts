import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Plan } from './entities/plans.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlansService {
    constructor(@InjectRepository(Plan) private readonly planRepository: Repository<Plan>) {

    }


    async getPlans() {
        const plans = await this.planRepository.find()
        return {
            success: true,
            plans,
            message: 'Plans retrieved successfully'
        }
    }
}
