// /* eslint-disable prettier/prettier */
// import { HttpException, Injectable } from '@nestjs/common';
// import { CreateTodolistDto } from './dto/create-todolist.dto';
// import { UpdateTodolistDto } from './dto/update-todolist.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Todolist } from './entities/todolist.entity';
// import { Repository } from 'typeorm';
// import { User } from '../user/entities/user.entity';

// @Injectable()
// export class TodolistService {
//   // eslint-disable-next-line prettier/prettier
//   constructor(@InjectRepository(Todolist) private readonly todoRepo: Repository<Todolist>){}

//   async create(payload: CreateTodolistDto, user: User) {
//     const todo = new Todolist();
//     todo.user = user;
//     if (!user || !user.id){
//       throw new HttpException(`User not found`, 400)
//     }
//     todo.title = payload.title;
//     todo.description = payload.description;
//     Object.assign(todo, payload);
//     this.todoRepo.create(todo);
//     return await this.todoRepo.save(todo);
//   }

//   findAll() {
//     return `This action returns all todolist`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} todolist`;
//   }

//   update(id: number, updateTodolistDto: UpdateTodolistDto) {
//     return this.todoRepo.update(id, updateTodolistDto);
//   }

//   remove(id: number) {
//     return `This action removes a #${id} todolist`;
//   }
// }
/* eslint-disable prettier/prettier */
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodolistDto } from './dto/create-todolist.dto';
import { UpdateTodolistDto } from './dto/update-todolist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todolist } from './entities/todolist.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TodolistService {
  constructor(
    @InjectRepository(Todolist)
    private readonly todoRepo: Repository<Todolist>,
  ) {}

  async create(payload: CreateTodolistDto, user: User) {
    if (!user || !user.id) {
      throw new HttpException(`User not found`, 400);
    }

    const todo = this.todoRepo.create({
      ...payload,
      user,
    });

    return await this.todoRepo.save(todo);
  }

  async findAll() {
    return await this.todoRepo.find({
      relations: ['user'], // 👈 include user if you want
    });
  }

  async findOne(id: string) {
    const todo = await this.todoRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async update(id: string, updateTodolistDto: UpdateTodolistDto) {
    const todo = await this.todoRepo.preload({
      id,
      ...updateTodolistDto,
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return await this.todoRepo.save(todo);
  }

  async remove(id: string) {
    const todo = await this.findOne(id);
    return await this.todoRepo.remove(todo);
  }
}
