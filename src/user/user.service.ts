import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { comparePassword, hashPassword } from 'src/utils/password-hash';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateUserEmail(createUserDto.email);
    const hashedPassword = await this.hashUserPassword(
      createUserDto.password,
    );

    try {
      const user = await this.db.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          address: createUserDto.address || '',
          passwordHash: hashedPassword,
        },
      });

      return { message: 'User created successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  private async validateUserEmail(email: string, userId?: string) {
    const existingUser = await this.db.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Email is already in use');
    }
  }

  private async hashUserPassword(password: string): Promise<string> {
    return await hashPassword(password);
  }

  async findByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        address: true,
      },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.validateUserEmail(updateUserDto.email, id);
    const hashedPassword = await this.hashUserPassword(
      updateUserDto.password,
    );

    try {
      await this.db.user.update({
        where: { id },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          address: updateUserDto.address || '',
          passwordHash: hashedPassword,
        },
      });

      return { message: 'User updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }
}
