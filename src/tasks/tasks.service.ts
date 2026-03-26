import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Priority, Task, TaskStatus } from './entities/tasks.entity';
import { SessionType } from 'src/focus-session/focus-session';
import { Like, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private withTimeMetrics(task: Task) {
    const plannedDurationSeconds = task.duration * 60;
    const actualDurationSeconds = (task.session ?? []).reduce(
      (total, session) => {
        if (
          session.type !== SessionType.PULSE ||
          !session.endTime ||
          session.duration == null
        ) {
          return total;
        }
        return total + session.duration;
      },
      0,
    );
    const remainingDurationSeconds = Math.max(
      plannedDurationSeconds - actualDurationSeconds,
      0,
    );
    const progressPercent =
      plannedDurationSeconds > 0
        ? Math.min(
            Math.round((actualDurationSeconds / plannedDurationSeconds) * 100),
            100,
          )
        : 0;

    return {
      ...task,
      plannedDurationSeconds,
      actualDurationSeconds,
      remainingDurationSeconds,
      progressPercent,
    };
  }

  async create(userId: string, body: CreateTaskDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const task = this.taskRepository.create(body);
    task.status = TaskStatus.PENDING;
    task.userId = userId;
    const savedTask = await this.taskRepository.save(task);
    return {
      message: 'Task created successfully',
      data: this.withTimeMetrics(savedTask),
    };
  }

  async getTasks(
    userId: string,
    query?: QueryDto & {
      withDeleted?: boolean;
      status?: TaskStatus;
      priority?: Priority;
    },
  ) {
    const limit = Number(query?.limit) || 10;
    const page = Number(query?.page) || 1;
    const search = query?.search || '';
    const baseWhere: any = { userId };

    if (query?.status) baseWhere.status = query.status;
    if (query?.priority) baseWhere.priority = query.priority;

    let where: any;
    if (search) {
      where = [
        { ...baseWhere, title: Like(`%${search}%`) },
        { ...baseWhere, description: Like(`%${search}%`) },
      ];
    } else {
      where = baseWhere;
    }

    const [tasks, total] = await this.taskRepository.findAndCount({
      where,
      withDeleted: query?.withDeleted ?? false,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        user: false,
      },
      order: { createdAt: 'DESC' },
    });
    if (total === 0) {
      return {
        message: 'No tasks found',
        tasks: [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
    return {
      message: 'Tasks retrieved successfully',
      tasks: tasks.map((task) => this.withTimeMetrics(task)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async getTaskById(userId: string, id: string) {
    const task = await this.taskRepository.findOne({
      where: { id: id, userId: userId },
      relations: {
        user: true,
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return {
      message: 'Task retrieved successfully',
      data: this.withTimeMetrics(task),
    };
  }

  async updateTask(userId: string, id: string, body: UpdateTaskDto) {
    // 1. Check existence and ownership in one go
    const task = await this.taskRepository.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(
        'Task not found or you do not have permission',
      );
    }

    // 2. Business Logic: Immutable state check
    if (task.status === TaskStatus.COMPLETED && body.status) {
      throw new BadRequestException(
        'Completed tasks status cannot be modified',
      );
    }

    this.taskRepository.merge(task, body);

    const updatedTask = await this.taskRepository.save(task);

    return {
      message: 'Task updated successfully',
      data: this.withTimeMetrics(updatedTask),
    };
  }

  //   soft delete
  async deleteTask(userId: string, id: string) {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.taskRepository.softDelete(task);
    return {
      message: 'Task deleted successfully',
    };
  }
}
