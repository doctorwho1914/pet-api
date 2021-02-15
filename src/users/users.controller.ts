import {Controller, Get, Post, Body, Put, Param, Delete, Query, BadRequestException} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {UserListOptionsInterface} from './interfaces/user-list-options.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
        .catch(err => {
          throw new BadRequestException({
            "statusCode": 400,
            "message": [err.message],
            "error": "Bad Request"
          })
        });
  }

  @Get()
  findAll(@Query() query: UserListOptionsInterface) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
        .catch(err => {
          throw new BadRequestException({
            "statusCode": 400,
            "message": [err.message],
            "error": "Bad Request"
          })
        });;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
