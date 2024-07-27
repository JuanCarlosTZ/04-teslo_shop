import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { HandlerHelper } from 'src/common/helpers/handle-exception.helper';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private context = 'AuthService';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly handler: HandlerHelper,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {

    return await this.handler.exception<User>(this.context, async () => {

      const { password, ...userData } = createUserDto;
      const user = await this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      const jwtPayload = this.getJwtPayload(user);
      const accessToken = this.getAccessJwt(jwtPayload)
      return { ...user, accessToken: accessToken };
    });
  }

  async login(loginUserDto: LoginUserDto) {
    console.log(`loginUserDto: ${loginUserDto}`);

    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, fullname: true, email: true, password: true }
    });

    console.log(`user: ${user}`);

    if (!user) throw new UnauthorizedException(`Credentials are not valid (mail)`);

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) throw new UnauthorizedException(`Credentials are not valid (password)`);



    const jwtPayload = this.getJwtPayload(user);
    const accessToken = this.getAccessJwt(jwtPayload)

    return { email: user.email, accessToken: accessToken };
  }

  private getAccessJwt(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  private getJwtPayload(user: User): JwtPayload {
    const jwtPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      fullname: user.fullname,
    }
    return jwtPayload;
  }


  async findAllUsers() {
    return await this.handler.exception<User>(this.context, async () => {
      const users = await this.userRepository.find();
      return users;
    });
  }

}
