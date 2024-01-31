import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/dataBase/prisma.service';
import { EmailService } from '../email/email.service';
import { User } from './entities/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(key: UUID, data: CreateUserDto): Promise<User> {
    const userExists = await this.findOne(data.email);
    if (userExists) throw new BadRequestException('User already registered');

    const emailValidated = await this.emailService.verifyEmailAndProceed(key);
    if (!emailValidated) throw new BadRequestException('Código inválido!');

    return;

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      },
    });

    return {
      ...user,
      password: undefined,
    };
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }

  async update(email: string, data: UpdateUserDto): Promise<void> {
    const userExists = await this.findOne(email);
    if (!userExists) throw new BadRequestException('User not registered');

    if (data.email !== undefined) {
      const userEmail = await this.findOne(data.email);
      if (userEmail)
        throw new BadRequestException('This email is already in use');
    }

    await this.prisma.user.update({
      where: {
        email,
      },
      data,
    });
  }

  async remove(email: string): Promise<void> {
    if (!email) return;

    const userExists = await this.findOne(email);
    if (!userExists) throw new BadRequestException('User not registered');

    await this.prisma.user.delete({
      where: {
        email,
      },
    });
  }
}
