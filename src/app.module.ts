import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FocusSessionModule } from './focus-session/focus-session.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PlansModule } from './plans/plans.module';
import { TasksModule } from './tasks/tasks.module';
import { GoalsModule } from './modules/goals/goals.module';
import { StreaksModule } from './modules/streaks/streaks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available across all modules
      envFilePath: '.env', // Double-check this matches your file name
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // set to false in production
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    FocusSessionModule,
    SubscriptionsModule,
    PlansModule,
    TasksModule,
    GoalsModule,
    StreaksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
