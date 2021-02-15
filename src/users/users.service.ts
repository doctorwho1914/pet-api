import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import {User} from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import {PasswordService} from '../password/password.service';
import {UserListOptionsInterface} from './interfaces/user-list-options.interface';

@Injectable()
export class UsersService {

  constructor(private passwordService: PasswordService) {}

  async create(createUserDto: CreateUserDto) {
    if (!this.passwordService.checkSpecialCharacters(createUserDto.password)) {
      throw new Error('password must have special characters')
    }

    const file = await fs.promises.readFile('data/users.json');
    const data = JSON.parse(file.toString());

    if (!!data.find(e => e.email === createUserDto.email)) {
      throw new Error('Email must be unique')
    }

    data.unshift({
      id: uuidv4(),
      ...createUserDto,
      password: this.passwordService.getPasswordHash(createUserDto.password)
    });
    return fs.promises.writeFile('data/users.json', JSON.stringify(data));
  }

  async findAll(options?: UserListOptionsInterface) {
    const file = await fs.promises.readFile('data/users.json');
    let data: User[] = JSON.parse(file.toString());

    const processing = {
      sort: (field, value): User[] => value === 'asc'
          ? data.sort((a,b) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0))
          : data.sort((a,b) => (a[field] < b[field]) ? 1 : ((b[field] < a[field]) ? -1 : 0)),
      filter: (field, value): User[] => data.filter(e => e[field].includes(value))
    }

    Object.keys(options || {}).forEach(e => data = processing[e.split('_')[0]](e.split('_')[1], options[e]));

    return data;
  }

  async findOne(id: string) {
    const file = await fs.promises.readFile('data/users.json');
    const data = JSON.parse(file.toString());
    return data.find(e => e.id === id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password && !this.passwordService.checkSpecialCharacters(updateUserDto.password)) {
      throw new Error('password must have special characters')
    }

    const file: Buffer = await fs.promises.readFile('data/users.json');
    const data: User[] = JSON.parse(file.toString());
    const userIndex: number = data.findIndex(e => e.id === id);

    if (!!data.find(e => e.email === updateUserDto.email && e.id !== id)) {
      throw new Error('Email must be unique')
    }

    updateUserDto.password && (updateUserDto.password = this.passwordService.getPasswordHash(updateUserDto.password));
    data[userIndex] = {
      ...data[userIndex],
      ...updateUserDto,
    }
    await fs.promises.writeFile('data/users.json', JSON.stringify(data))

    return data[userIndex];
  }

  async remove(id: string) {
    const file = await fs.promises.readFile('data/users.json');
    const data = JSON.parse(file.toString());
    data.splice(data.findIndex(e => e.id === id), 1);
    return fs.promises.writeFile('data/users.json', JSON.stringify(data))
  }

}
