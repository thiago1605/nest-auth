import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jtwService: JwtService,
  ) {}

  login(user: User): UserToken {
    const payload: UserPayload = {
      ...user,
      sub: user.email,
    };

    const jwtToken = this.jtwService.sign(payload);

    return { access_token: jwtToken };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (!user) throw new Error('Email ou senha incorreta!');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new Error('Email ou senha incorreta!');

    return {
      ...user,
      password: undefined,
    };
  }
}
