import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách user' })
  @ApiResponse({ status: 200, description: 'Danh sách user', type: [User] })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới 1 user' })
  @ApiResponse({ status: 201, description: 'User vừa được tạo', type: User })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
