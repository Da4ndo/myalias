import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as randomName from 'random-name';

import { UserService } from 'src/user/user.service';
import { Alias } from './alias.entity';

@Injectable()
export class AliasService {
  constructor(
    @InjectRepository(Alias)
    private aliasRepository: Repository<Alias>,
    private readonly userService: UserService,
  ) {}

  async createData(realEmail: string) {
    // Get the user by realEmail to check user's plan
    const user = await this.userService.findByEmail(realEmail);

    // If the user's plan is free and they have less than 10 aliases, do not create a new alias
    if (user.plan.toLowerCase() === 'free') {
      const aliases = await this.getAliasesByRealEmail(realEmail);
      if (aliases.length >= 10) {
        return {
          status: HttpStatus.FORBIDDEN,
          message: 'Free users cannot have more than 10 aliases',
        };
      }
    }

    let aliasEmail =
      `${randomName.first()}.${randomName.last()}@myalias.pro`.toLowerCase();

    let aliasExists = await this.aliasRepository.findOne({
      where: { alias_email: aliasEmail },
    });

    // If the alias exists, append random numbers to it until we get a unique alias.
    while (aliasExists) {
      const randomNumber = Math.floor(Math.random() * 10000); // generate a random number between 0 and 9999
      aliasEmail = `${aliasEmail.split('@')[0]}${randomNumber}@myalias.pro`;
      aliasExists = await this.aliasRepository.findOne({
        where: { alias_email: aliasEmail },
      });
    }

    const newAlias = this.aliasRepository.create({
      real_email: realEmail,
      alias_email: aliasEmail,
      enable: true,
    });

    const savedAlias = await this.aliasRepository.save(newAlias);

    return {
      status: HttpStatus.CREATED,
      message: 'Data created successfully',
      alias: savedAlias, // Return the entire saved alias
    };
  }

  async deleteData(aliasEmail: string, realEmail: string) {
    const alias = await this.aliasRepository.findOne({
      where: { alias_email: aliasEmail, real_email: realEmail },
    });

    if (!alias) {
      return { status: HttpStatus.NOT_FOUND, message: 'Alias not found or not owned by user' };
    }

    await this.aliasRepository.remove(alias);
    return { status: HttpStatus.OK, message: 'Data deleted successfully' };
  }

  async updateData(aliasEmail: string, enable: boolean, realEmail: string) {
    const alias = await this.aliasRepository.findOne({
      where: { alias_email: aliasEmail, real_email: realEmail },
    });

    if (!alias) {
      return { status: HttpStatus.NOT_FOUND, message: 'Alias not found or not owned by user' };
    }

    alias.enable = enable;
    await this.aliasRepository.save(alias);
    return { status: HttpStatus.OK, message: 'Data updated successfully' };
  }

  async getAliasesByRealEmail(realEmail: string): Promise<Alias[]> {
    return await this.aliasRepository.find({
      where: { real_email: realEmail },
    });
  }

  async getList(): Promise<{ status: number, message: string, data?: { [key: string]: Alias[] }, error?: string }> {
    try {
      const aliases = await this.aliasRepository.find({
        order: {
          real_email: 'ASC',
        },
      });
  
      const result: { [key: string]: Alias[] } = {};
  
      aliases.forEach((alias) => {
        if (!result[alias.real_email]) {
          result[alias.real_email] = [];
        }
        result[alias.real_email].push(alias);
      });
  
      return {
        status: HttpStatus.OK,
        message: 'List of alias emails',
        data: result
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while fetching the list',
        error: error.message
      };
    }
  }
  
}
