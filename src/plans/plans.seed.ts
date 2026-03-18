import { DataSource } from "typeorm";
import { Plan, PlanInterval, PlanName } from "./entities/plans.entity";

export async function seedPlans(dataSource: DataSource) {
    const planRepository = dataSource.getRepository(Plan);
    const plans = [
        {
            name: PlanName.FREE,
            price: 0,
            interval: PlanInterval.MONTHLY,
            features: {
                maxTasks: 5,
                maxProjects: 1,
            },
        },
        {
            name: PlanName.PRO,
            price: 10,
            interval: PlanInterval.MONTHLY,
            features: {
                maxTasks: 20,
                maxProjects: 5,
            },
        },
        {
            name: PlanName.ENTERPRISE,
            price: 20,
            interval: PlanInterval.MONTHLY,
            features: {
                maxTasks: 100,
                maxProjects: 20,
            },
        },
    ];

    for (const plan of plans) {
        const exists = await planRepository.findOne({ where: { name: plan.name } });
        if (!exists) {
            await planRepository.save(planRepository.create(plan));
        }
    }
}