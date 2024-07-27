import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HandlerHelper } from 'src/common/helpers/handle-exception.helper';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private context = 'AuthService';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly handler: HandlerHelper,
  ) { }

  async create(createUserDto: CreateUserDto) {
    return await this.handler.exception<User>(this.context, async () => {

      const { password, ...userData } = createUserDto;
      let user = this.userRepository.create(createUserDto);

      user = await this.userRepository.save({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      return user;
    });
  }

  async login(loginUserDto: LoginUserDto) {

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    })

    if (!user) throw new UnauthorizedException(`Credentials are not valid (mail)`);

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) throw new UnauthorizedException(`Credentials are not valid (password)`);

    return user;

  }

}
