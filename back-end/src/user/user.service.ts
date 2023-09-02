import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'; // Adjust the path accordingly
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signup_create(username: string, password: string, email: string) {
    const existingUser = await this.findOne(username);

    if (existingUser) {
      return { status: HttpStatus.BAD_REQUEST, message: 'Username already exists' };
    }

    const existingEmail = await this.findByEmail(email);

    if (existingEmail) {
      return { status: HttpStatus.BAD_REQUEST, message: 'Email already used' };
    }
    

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
      accepted: false, // New field added, default value is false
    });

    await this.userRepository.save(newUser);

    const queuePosition = await this.QueuePosition(newUser.id) + 1;

    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully, but still needs to be accepted',
      user: newUser,
      queuePosition, // Return the queue position
    };
  }

  async QueuePosition(userId): Promise<number> {
    // Count all users with accepted set to false
    const allUsers = await this.userRepository.find({ where: { accepted: false }, order: { id: 'ASC' } });
    return allUsers.findIndex(user => user.id === userId);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
  
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async acceptUser(email: string): Promise<{ status: HttpStatus, message: string, user: User | undefined }> {
    const user = await this.findByEmail(email);

    if (!user) {
      return { status: HttpStatus.NOT_FOUND, message: 'User not found', user: undefined };
    }

    user.accepted = true;
    await this.userRepository.save(user);

    return { status: HttpStatus.OK, message: 'User accepted successfully', user: user };
  }

  async deleteUser(email: string): Promise<{ status: HttpStatus, message: string, user: User | undefined }> {
    const user = await this.findByEmail(email);

    if (!user) {
      return { status: HttpStatus.NOT_FOUND, message: 'User not found', user: undefined };
    }

    await this.userRepository.remove(user);

    return { status: HttpStatus.OK, message: 'User deleted successfully', user: user };
  }
  

  async validatePassword(username: string, password: string): Promise<boolean> {
    const user = await this.findOne(username);

    if (!user) {
      return false;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  }
}
