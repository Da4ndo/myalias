import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  private isEmailValid(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  @Post("register")
  async register(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
    @Res() res: Response,
  ) {
    if (!username || !password || !email) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Username, password, and email are required.' });
    }

    if (!this.isEmailValid(email)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid email format.' });
    }

    const result = await this.userService.signup_create(username, password, email);

    if (result.status !== HttpStatus.CREATED) {
      return res.status(result.status).json({ message: result.message });
    }

    const { user, ...response } = result;

    return res.status(response.status).json({ ...response, user: { usernmae: user.username, email: user.email } });
  }
}

