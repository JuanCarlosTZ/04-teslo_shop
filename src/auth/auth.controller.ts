import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { GetUser } from './decorators/get-user.decarator';
import { Auth } from './decorators';
import { ValidRoles } from './helpers/roles.helper';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiResponse({ status: 201, description: 'User was created', type: User })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 500, description: 'Unespected error' })
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'User was logged',
    example: {
      email: 'user@example.com',
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjNGU3N2FkZC1kYzVkLTRjMzgtOTlhOS02ZTg0MjU3MzVjN2YiLCJlbWFpbCI6InVzZXIxQHNlZWQuY29tIiwiZnVsbG5hbWUiOiJ1c2VyMSBzZWVkIiwiaWF0IjoxNzIyMzkyMTMwLCJleHAiOjE3MjIzOTkzMzB9.zW6n3d9BGCU4x5ucz_MAFDg18Et66LfAIEQA0kqf1-I",
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 500, description: 'Unespected error' })
  login(@Body() loginAuthDto: LoginUserDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('check-status')
  @Auth()
  checkStatus(@GetUser() user) {
    return this.authService.checkStatus(user);
  }

  @Get('users')
  @Auth(ValidRoles.admin)
  findAll() {
    return this.authService.findAllUsers();
  }

}
