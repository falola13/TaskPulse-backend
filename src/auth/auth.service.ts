import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    // encrypt the user password here
    // For example, using bcrypt
    const hashedPassword = await bcrypt.hashSync(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const user = await this.usersService.createUser(createUserDto);
    const token = this.jwtService.sign({ id: user.id, email: user.email });
    return {
      data: this.wrap(user),
      token: token,
      message: 'Login Successful',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByEmail(loginDto.email);
    // compare the user password with the hashed password

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const userPassword = await bcrypt.compare(
      loginDto.password,
      user?.password,
    );

    if (!userPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      data: this.wrap(user),
      token: this.jwtService.sign({ id: user.id, email: user.email }),
      message: 'Login Successful',
    };
  }

  private wrap(data: User): {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  } {
    return {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    };
  }
}
