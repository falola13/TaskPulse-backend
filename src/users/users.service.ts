import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }
  async createUser(data: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.exists({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new UnauthorizedException(
        `User with the email ${data.email} already exists`,
      );
    }
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  async findUserByEmail(email: string, showPassword?: boolean): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email }, select: {
        email: true,
        firstName: true,
        lastName: true,
        id: true,
        isTwoFAEnabled: true,
        role: true,
        imageUrl: true,
        password: showPassword
      }
    });
  }
  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.userRepository.save({ ...user, ...data });
  }

  async enableTwoFA(id: string) {
    return await this.userRepository.update({ id }, { isTwoFAEnabled: true });
  }
  async disableTwoFA(id: string) {
    return await this.userRepository.update({ id }, { isTwoFAEnabled: false });
  }

  async setTwoFASecret(id: string, secret: string) {
    return await this.userRepository.update(
      { id },
      { twoFactorSecret: secret },
    );
  }

  // ADMIN Roles only
  async getAllUsers(query: any) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const search = query.search || ''

    const qb = await this.userRepository.createQueryBuilder('user')

    qb.select([
      'user.id',
      'user.email',
      'user.firstName',
      'user.lastName',
      'user.role',
      'user.imageUrl',
      'user.isTwoFAEnabled',
    ])


    if (search) {
      qb.where(
        'user.email ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search',
        { search: `%${search}%` }
      );
    }
    qb.skip((page - 1) * limit).take(limit)

    const [users, total] = await qb.getManyAndCount()




    return {
      message: users.length ? 'Users fetched successfully!!' : 'No users found',
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    }
  }
}
