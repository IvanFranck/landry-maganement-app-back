import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/creat-user-dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }
}
