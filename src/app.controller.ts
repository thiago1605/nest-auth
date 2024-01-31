import { Controller, Get } from '@nestjs/common';
import { IsPublic } from './modules/auth/decorators/is-public.decorator';
import { User } from './modules/user/entities/user.entity';
import { CurrentUser } from './modules/auth/decorators/current-user.decorator';

@Controller()
export class AppController {
  @IsPublic()
  @Get()
  getHello(): string {
    return 'Hello';
  }

  @Get('me')
  getMe(@CurrentUser() user: User): User {
    return user;
  }
}
