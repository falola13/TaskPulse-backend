import { Plan } from "src/plans/entities/plans.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum SubscriptionStatus {
    ACTIVE = 'active',
    CANCELED = 'canceled',
    PAST_DUE = 'past_due',
    PENDING = 'pending',
}

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(() => User, (user) => user.subscriptions, { eager: true })
    user: User;

    @ManyToOne(() => Plan, (plan) => plan.subscriptions, { eager: true })
    plan: Plan;

    @Column({
        type: 'enum',
        enum: SubscriptionStatus,
        default: SubscriptionStatus.PENDING,
    })
    status: SubscriptionStatus;

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    trialEndDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}