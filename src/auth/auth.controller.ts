import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decarator';
import { User } from './entities/user.entity';
import { RawHeaders } from './decorators/raw-header.decorator';
import { Auth } from './decorators';
import { ValidRoles } from './helpers/roles.helper';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }


  @Post('login')
  login(@Body() loginAuthDto: LoginUserDto) {
    return this.authService.login(loginAuthDto);
  }


  @Get('users')
  @Auth(ValidRoles.admin)
  findAll(
    @GetUser() user: User,
    @GetUser('email') userEmail,
    @RawHeaders() rawHeaders: string[]
  ) {

    return this.authService.findAllUsers();
  }

}
