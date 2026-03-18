import { Injectable } from '@nestjs/common';
import { StartSessionDto } from './dto/start-session.dto';
import { FocusSession } from './focus-session';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

const SESSION_DURATIONS = {
    PULSE: 25 * 60,
    SHORT_BREAK: 5 * 60,
    LONG_BREAK: 15 * 60
}

@Injectable()
export class FocusSessionService {
    constructor(@InjectRepository(FocusSession) private readonly sessionRepo: Repository<FocusSession>) { }

    async start(dto: StartSessionDto, userId: string): Promise<FocusSession> {
        const activeSession = await this.sessionRepo.findOne({
            where: { userId, endTime: IsNull() },
            order: { startTime: 'DESC' }
        })
        if (activeSession) {
            const now = new Date();
            activeSession.endTime = now
            activeSession.duration = Math.floor((+now - +activeSession.startTime) / 1000)
            await this.sessionRepo.save(activeSession)
        }

        const expectedDuration = SESSION_DURATIONS[dto.type]
        const session = this.sessionRepo.create({
            userId,
            type: dto.type,
            startTime: new Date(),
            expectedDuration,
            taskId: dto.taskId !== undefined ? dto.taskId : undefined
        })
        return await this.sessionRepo.save(session)
    }
}
