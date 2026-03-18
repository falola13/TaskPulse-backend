import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
export enum PlanName {
    FREE = 'Free',
    PRO = 'Pro',
    ENTERPRISE = 'Enterprise'
}

export enum PlanInterval {
    MONTHLY = 'monthly',
    YEARLY = 'yearly'
}




@Entity('plans')
export class Plan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string; // Free, Pro, Enterprise

    @Column({ type: 'decimal', default: 0 })
    price: number;

    @Column({ default: 'monthly' })
    interval: 'monthly' | 'yearly';

    @Column({ type: 'json', nullable: true })
    features: Record<string, any>;

    @OneToMany(() => Subscription, (sub) => sub.plan)
    subscriptions: Subscription[];
}