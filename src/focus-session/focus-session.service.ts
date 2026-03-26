import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StartSessionDto } from './dto/start-session.dto';
import { FocusSession, SessionType } from './focus-session';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { QueryDto } from 'src/common/dto/query.dto';

import { Task, TaskStatus } from 'src/tasks/entities/tasks.entity';

const SESSION_DURATIONS = {
  [SessionType.PULSE]: 25 * 60,
  [SessionType.SHORT_BREAK]: 5 * 60,
  [SessionType.LONG_BREAK]: 15 * 60,
};

@Injectable()
export class FocusSessionService {
  constructor(
    @InjectRepository(FocusSession)
    private readonly sessionRepo: Repository<FocusSession>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async start(dto: StartSessionDto, userId: string): Promise<FocusSession> {
    const activeSession = await this.sessionRepo.findOne({
      where: { userId, endTime: IsNull() },
      order: { startTime: 'DESC' },
    });
    if (activeSession) {
      const now = new Date();
      activeSession.endTime = now;
      activeSession.duration = Math.floor(
        (+now - +activeSession.startTime) / 1000,
      );
      await this.sessionRepo.save(activeSession);
    }

    if (dto.type === SessionType.PULSE && dto.taskId) {
      const task = await this.taskRepo.findOne({
        where: { id: dto.taskId, userId },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (task.status === TaskStatus.COMPLETED) {
        throw new BadRequestException(
          'Cannot start a pulse session for a completed task',
        );
      }

      if (task.status === TaskStatus.PENDING) {
        task.status = TaskStatus.IN_PROGRESS;
        await this.taskRepo.save(task);
      }
    }

    const expectedDuration = SESSION_DURATIONS[dto.type];
    const session = this.sessionRepo.create({
      userId,
      type: dto.type,
      startTime: new Date(),
      expectedDuration,
      taskId: dto.taskId !== undefined ? dto.taskId : undefined,
    });
    return await this.sessionRepo.save(session);
  }

  async end(sessionId: number, userId: string): Promise<FocusSession> {
    const session = await this.sessionRepo.findOne({
      where: { id: sessionId, userId },
      order: { startTime: 'DESC' },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.endTime) {
      throw new ForbiddenException('Session already ended');
    }
    const endTime = new Date();
    session.endTime = endTime;
    session.duration = Math.floor((+endTime - +session.startTime) / 1000);
    const saved = await this.sessionRepo.save(session);

    // Auto-sync task status by accumulated pulse focus time.
    if (saved.type === SessionType.PULSE && saved.taskId) {
      const task = await this.taskRepo.findOne({
        where: { id: saved.taskId, userId },
      });
      if (task && task.status !== TaskStatus.COMPLETED) {
        const completedPulseSessions = await this.sessionRepo.find({
          where: {
            userId,
            taskId: saved.taskId,
            type: SessionType.PULSE,
            endTime: Not(IsNull()),
          },
        });

        const totalFocusedSeconds = completedPulseSessions.reduce(
          (acc, item) => acc + (item.duration ?? 0),
          0,
        );
        const plannedSeconds = task.duration * 60;

        if (totalFocusedSeconds >= plannedSeconds) {
          task.status = TaskStatus.COMPLETED;
          await this.taskRepo.save(task);
        } else if (task.status === TaskStatus.PENDING) {
          task.status = TaskStatus.IN_PROGRESS;
          await this.taskRepo.save(task);
        }
      }
    }

    return saved;
  }

  async getCurrentSession(userId: string): Promise<FocusSession> {
    const session = await this.sessionRepo.findOne({
      where: { userId, endTime: IsNull() },
      order: { startTime: 'DESC' },
    });
    if (!session) {
      throw new NotFoundException('No active session found');
    }
    return session;
  }
  async getHistory(userId: string, query: QueryDto) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const [sessions, total] = await this.sessionRepo.findAndCount({
      where: { userId, endTime: Not(IsNull()) },
      order: { startTime: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (total === 0) {
      return {
        message: 'No sessions found',
        data: [],
        pagination: {
          page: page,
          limit: limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
    return {
      message: 'success',
      data: sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
