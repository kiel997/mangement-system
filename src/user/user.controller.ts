/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,  
  Req,
  Res,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { loginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Throttle } from '@nestjs/throttler';  // 👈 Import Throttle


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(){
    return [{id: 1, name: 'ezkiel'}]
  }

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.userService.update(id, payload);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Post('/login')
  @Throttle({ default: { limit: 5, ttl: 60 } }) // 👈 max 5 login per minute
  login(@Body() payload: loginDto, @Req() req: Request, @Res() res: Response) {
    return this.userService.signIn(payload, req, res);
  }

  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return this.userService.logout(req, res);
  }

  @Get('/get')
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }
}
