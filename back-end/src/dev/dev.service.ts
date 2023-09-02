import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dev } from './dev.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class DevService {
  constructor(
    @InjectRepository(Dev)
    private readonly devRepository: Repository<Dev>,
    private userService: UserService
  ) {}
  
  async isDev(username: string, email: string): Promise<boolean> {
    const dev = await this.devRepository.findOne({ where: { username, email } });
    return !!dev;
  }

  // async fetch(user): Promise<Dev[]> {
  //   // Implement fetch logic here
  // }

  async listAccounts() {
    const usersList = await this.userService.findAll();
    // Remove the password property from each user in the list

    const withoutPUserList = usersList.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      status: HttpStatus.OK,
      message: 'List of users',
      users: withoutPUserList
    };
  }

  // async checkAliases(user): Promise<Dev[]> {
  //   // Implement checkAliases logic here
  // }
}
