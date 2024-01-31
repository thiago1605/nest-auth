import { Controller, Param, Get, Post, UseInterceptors } from '@nestjs/common';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { EmailService } from './email.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @IsPublic()
  @Get(':key')
  async verifyEmailAndProceed(@Param('key') key: string): Promise<boolean> {
    return await this.emailService.verifyEmailAndProceed(key);
  }

  @IsPublic()
  @Post(':email')
  async sendTokenToEmail(@Param('email') email: string): Promise<void> {
    return await this.emailService.sendVerificationEmail(email);
  }
}
