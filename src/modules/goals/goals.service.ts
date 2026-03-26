import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FocusSession, SessionType } from 'src/focus-session/focus-session';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { UpsertGoalDto } from './dto/upsert-goal.dto';
import { Goal } from './entities/goals.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalsRepo: Repository<Goal>,
    @InjectRepository(FocusSession)
    private readonly sessionsRepo: Repository<FocusSession>,
  ) {}

  private getDefaultGoal(userId: string): Goal {
    return this.goalsRepo.create({
      userId,
      dailySessionTarget: 1,
      dailyFocusTarget: 60,
      weeklyFocusTarget: 300,
    });
  }

  private getWeekBounds(reference = new Date()) {
    const startOfToday = new Date(reference);
    startOfToday.setHours(0, 0, 0, 0);
    const day = startOfToday.getDay();
    const diffToMonday = (day + 6) % 7;
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return { startOfWeek, endOfWeek };
  }

  private getDayKey(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private async getFocusProgress(userId: string) {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const day = startOfToday.getDay();
    const diffToMonday = (day + 6) % 7;
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);

    const todaySessions = await this.sessionsRepo.find({
      where: {
        userId,
        type: SessionType.PULSE,
        endTime: Not(IsNull()),
        startTime: Between(startOfToday, endOfToday),
      },
    });
    const weekSessions = await this.sessionsRepo.find({
      where: {
        userId,
        type: SessionType.PULSE,
        endTime: Not(IsNull()),
        startTime: Between(startOfWeek, endOfToday),
      },
    });

    const todayCompletedSessions = todaySessions.length;
    const todayFocusedMinutes = Math.round(
      todaySessions.reduce((acc, session) => acc + (session.duration ?? 0), 0) /
        60,
    );
    const weekFocusedMinutes = Math.round(
      weekSessions.reduce((acc, session) => acc + (session.duration ?? 0), 0) /
        60,
    );

    return { todayCompletedSessions, todayFocusedMinutes, weekFocusedMinutes };
  }

  private withProgress(
    goal: Goal,
    progress: Awaited<ReturnType<typeof this.getFocusProgress>>,
  ) {
    const dailyFocusProgressPercent =
      goal.dailyFocusTarget > 0
        ? Math.min(
            Math.round(
              (progress.todayFocusedMinutes / goal.dailyFocusTarget) * 100,
            ),
            100,
          )
        : 0;
    const weeklyFocusProgressPercent =
      goal.weeklyFocusTarget > 0
        ? Math.min(
            Math.round(
              (progress.weekFocusedMinutes / goal.weeklyFocusTarget) * 100,
            ),
            100,
          )
        : 0;

    return {
      ...goal,
      ...progress,
      dailyFocusProgressPercent,
      weeklyFocusProgressPercent,
    };
  }

  async getGoal(userId: string) {
    const goal =
      (await this.goalsRepo.findOne({ where: { userId } })) ??
      this.getDefaultGoal(userId);
    const progress = await this.getFocusProgress(userId);
    return {
      message: 'Goal retrieved successfully',
      data: this.withProgress(goal, progress),
    };
  }

  async upsertGoal(userId: string, body: UpsertGoalDto) {
    const existing = await this.goalsRepo.findOne({ where: { userId } });
    const goal = existing
      ? this.goalsRepo.merge(existing, body)
      : this.goalsRepo.create({ userId, ...body });

    const saved = await this.goalsRepo.save(goal);
    const progress = await this.getFocusProgress(userId);
    return {
      message: existing
        ? 'Goal updated successfully'
        : 'Goal created successfully',
      data: this.withProgress(saved, progress),
    };
  }

  async getWeeklySummary(userId: string) {
    const goal =
      (await this.goalsRepo.findOne({ where: { userId } })) ??
      this.getDefaultGoal(userId);
    const { startOfWeek, endOfWeek } = this.getWeekBounds();

    const weekSessions = await this.sessionsRepo.find({
      where: {
        userId,
        type: SessionType.PULSE,
        endTime: Not(IsNull()),
        startTime: Between(startOfWeek, endOfWeek),
      },
      order: { startTime: 'ASC' },
    });

    const map = new Map<
      string,
      { focusedMinutes: number; sessionsCount: number }
    >();
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      map.set(this.getDayKey(d), { focusedMinutes: 0, sessionsCount: 0 });
    }

    for (const session of weekSessions) {
      const key = this.getDayKey(new Date(session.startTime));
      const row = map.get(key);
      if (!row) continue;
      row.focusedMinutes += Math.round((session.duration ?? 0) / 60);
      row.sessionsCount += 1;
    }

    return {
      message: 'Weekly summary retrieved successfully',
      data: {
        days: Array.from(map.entries()).map(([date, value]) => ({
          date,
          ...value,
        })),
        dailyFocusTarget: goal.dailyFocusTarget,
        weeklyFocusTarget: goal.weeklyFocusTarget,
      },
    };
  }
}
