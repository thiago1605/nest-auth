import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { UUID } from 'crypto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post(':key')
  async create(
    @Body() data: CreateUserDto,
    @Param('key') key: UUID,
  ): Promise<User> {
    return await this.userService.create(key, data);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':email')
  async findOne(@Param('email') email: string): Promise<User> {
    const user = await this.userService.findOne(email);

    return {
      ...user,
      password: undefined,
    };
  }

  @Patch(':email')
  async update(@Param('email') email: string, @Body() data: UpdateUserDto) {
    return await this.userService.update(email, data);
  }

  @Delete(':email')
  async remove(@Param('email') email: string): Promise<void> {
    return await this.userService.remove(email);
  }
}
