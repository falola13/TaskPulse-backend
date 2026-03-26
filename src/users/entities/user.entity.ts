import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { Task } from 'src/tasks/entities/tasks.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true, select: false })
  twoFactorSecret?: string;

  @Column({ default: false })
  isTwoFAEnabled: boolean;

  @OneToMany(() => Subscription, (subscription) => subscription.user, {
    cascade: true,
  })
  subscriptions: Subscription[];

  @OneToMany(() => Task, (task) => task.userId, { cascade: true })
  tasks: Task[];
}
