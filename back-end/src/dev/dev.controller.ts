import {
  Controller,
  UseGuards,
  Get,
  Req,
  Post,
  Res,
  Delete,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DevService } from './dev.service';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AliasService } from '../alias/alias.service';

@UseGuards(AuthGuard('jwt'))
@Controller('dev')
export class DevController {
  constructor(
    private devService: DevService,
    private userService: UserService,
    private aliasService: AliasService,
  ) {}

  @Get()
  async fetch(@Req() req: any, @Res() res: Response) {
    if (await this.devService.isDev(req.user.username, req.user.email)) {
      // const result = await this.devService.fetch(req.user);
      return res.status(200).json({ status: 200 });
    } else {
      return res.status(401);
    }
  }

  @Get('accounts')
  async listAccounts(@Req() req: any, @Res() res: Response) {
    if (await this.devService.isDev(req.user.username, req.user.email)) {
      const result = await this.devService.listAccounts();
      return res.status(result.status).json(result);
    } else {
      return res.status(401);
    }
  }

  @Get('aliases')
  async listAliases(@Req() req: any, @Res() res: Response) {
    if (await this.devService.isDev(req.user.username, req.user.email)) {
      const result = await this.aliasService.getList();
      return res.status(result.status).json(result);
    } else {
      return res.status(401);
    }
  }

  @Post('aliases/manage')
  async managaAliases(
    @Req() req: any,
    @Res() res: Response,
    @Body('aliasEmail') aliasEmail: string,
    @Body('realEmail') realEmail: string,
    @Body('enable') enable: boolean,
  ) {
    if (await this.devService.isDev(req.user.username, req.user.email)) {
      if (!aliasEmail || !realEmail || enable === undefined) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'aliasEmail, realEmail and enable are required' });
      }

      const result = await this.aliasService.updateData(
        aliasEmail,
        enable,
        realEmail,
      );
      return res.status(result.status).json(result);
    } else {
      return res.status(401);
    }
  }

  @Post('accounts/accept')
  async acceptUser(
    @Req() req: any,
    @Res() res: Response,
    @Body('email') email: string,
  ) {
    if (await this.devService.isDev(req.user.username, req.user.email)) {
      if (!email) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Email is required' });
      }

      const result = await this.userService.acceptUser(email);
      return res.status(result.status).json(result);
    } else {
      return res.status(401);
    }
  }

  @Delete('accounts/manage')
  async manageAccount(
    @Req() req: any,
    @Res() res: Response,
    @Body('email') email: string,
  ) {
    if (await this.devService.isDev(req.user.username, req.user.email)) {
      if (!email) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Email is required' });
      }

      const result = await this.userService.deleteUser(email);
      return res.status(result.status).json(result);
    } else {
      return res.status(401);
    }
  }
}
