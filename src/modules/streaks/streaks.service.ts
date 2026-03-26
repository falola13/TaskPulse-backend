import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FocusSession, SessionType } from 'src/focus-session/focus-session';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(FocusSession)
    private readonly sessionsRepo: Repository<FocusSession>,
  ) {}

  private getDayKey(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  async getStreak(userId: string) {
    const sessions = await this.sessionsRepo.find({
      where: { userId, type: SessionType.PULSE, endTime: Not(IsNull()) },
      order: { startTime: 'ASC' },
    });

    const uniqueDays = Array.from(
      new Set(sessions.map((session) => this.getDayKey(new Date(session.startTime)))),
    );

    if (uniqueDays.length === 0) {
      return {
        message: 'Streak retrieved successfully',
        data: {
          currentStreakDays: 0,
          longestStreakDays: 0,
          totalActiveDays: 0,
          activeToday: false,
          lastActiveDate: null,
        },
      };
    }

    let longestStreakDays = 1;
    let currentRun = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(`${uniqueDays[i - 1]}T00:00:00.000Z`);
      const current = new Date(`${uniqueDays[i]}T00:00:00.000Z`);
      const diffDays = Math.round((+current - +prev) / 86400000);
      if (diffDays === 1) {
        currentRun += 1;
      } else {
        currentRun = 1;
      }
      if (currentRun > longestStreakDays) longestStreakDays = currentRun;
    }

    const todayKey = this.getDayKey(new Date());
    const activeToday = uniqueDays[uniqueDays.length - 1] === todayKey;
    const anchorDate = new Date(
      `${activeToday ? todayKey : uniqueDays[uniqueDays.length - 1]}T00:00:00.000Z`,
    );

    let currentStreakDays = 0;
    const daySet = new Set(uniqueDays);
    let cursor = new Date(anchorDate);
    while (daySet.has(this.getDayKey(cursor))) {
      currentStreakDays += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }

    return {
      message: 'Streak retrieved successfully',
      data: {
        currentStreakDays,
        longestStreakDays,
        totalActiveDays: uniqueDays.length,
        activeToday,
        lastActiveDate: uniqueDays[uniqueDays.length - 1],
      },
    };
  }

  async getActivity(userId: string, days = 84) {
    const clampedDays = Math.min(Math.max(days, 1), 365);
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - (clampedDays - 1));
    start.setHours(0, 0, 0, 0);

    const sessions = await this.sessionsRepo.find({
      where: { userId, type: SessionType.PULSE, endTime: Not(IsNull()) },
      order: { startTime: 'ASC' },
    });

    const map = new Map<string, number>();
    for (const session of sessions) {
      const date = new Date(session.startTime);
      if (date < start) continue;
      const key = this.getDayKey(date);
      map.set(key, (map.get(key) ?? 0) + 1);
    }

    const result: Array<{ date: string; count: number }> = [];
    for (let i = 0; i < clampedDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = this.getDayKey(d);
      result.push({ date: key, count: map.get(key) ?? 0 });
    }

    return {
      message: 'Streak activity retrieved successfully',
      data: {
        days: result,
      },
    };
  }
}
