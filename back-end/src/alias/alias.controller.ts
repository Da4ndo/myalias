import { Controller, Post, Get, Delete, Put, Body, Res, Req, Param, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { SkipThrottle } from '@nestjs/throttler';

import { AliasService } from './alias.service';

@SkipThrottle()
@Controller('alias')
export class AliasController {
  constructor(private aliasService: AliasService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createData(
    @Res() res: Response,
    @Req() req: any,
  ) {
    const result = await this.aliasService.createData(req.user.email);
    return res.status(result.status).json(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':aliasEmail')
  async deleteAlias(
    @Param('aliasEmail') aliasEmail: string,
    @Res() res: Response,
    @Req() req: any,
    ) {
    const result = await this.aliasService.deleteData(aliasEmail, req.user.email);
    return res.status(result.status).json(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':aliasEmail')
  async updateData(
    @Param('aliasEmail') aliasEmail: string,
    @Body('enable') enable: boolean,
    @Res() res: Response,
    @Req() req: any,
    ) {
    const result = await this.aliasService.updateData(aliasEmail, enable, req.user.email,);
    return res.status(result.status).json(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAliasesByRealEmail(
    @Res() res: Response,
    @Req() req: any,
  ) {
    const aliases = await this.aliasService.getAliasesByRealEmail(req.user.email);
    const { password, ...userWithoutPassword } = req.user;
    return res.status(200).json({"user": userWithoutPassword, aliases});
  }
}
