import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HandlerHelper } from 'src/common/helpers/handle-exception.helper';
import * as bcrypt from 'bcrypt';

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

}
