import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(usernameOrEmail: string, password: string) {
    const userByUsername = await this.userService.findByUsername(usernameOrEmail);
    const userByEmail = await this.userService.findByEmail(usernameOrEmail);
  
    const user = userByUsername || userByEmail;
  
    if (!user) {
      return { status: HttpStatus.UNAUTHORIZED, message: 'Invalid login credentials' };
    }
  
    // Check if the user is accepted
    if (!user.accepted) {
      return { status: HttpStatus.UNAUTHORIZED, message: `User not accepted. Still in queu. Position: ${await this.userService.QueuePosition(user.id) + 1}` };
    }
  
    const isValid = await this.userService.validatePassword(user.username, password);
  
    if (!isValid) {
      return { status: HttpStatus.UNAUTHORIZED, message: 'Invalid login credentials' };
    }
  
    const payload = { username: user.username };
    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }
}
