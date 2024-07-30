import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CommonModule } from 'src/common/common.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfiguration } from 'src/common/configuration/app.configuration';
import { JwtStrategy } from './strategies/jwt-passport.strategy';

const jwtModuleRegisterAsync = JwtModule.registerAsync({
  imports: [CommonModule],
  inject: [AppConfiguration],
  useFactory: async (appConfiguration: AppConfiguration) => {
    return {
      secret: appConfiguration.appConfig().jwtSecret,
      signOptions: { expiresIn: '2h' }
    }
  }
});

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    jwtModuleRegisterAsync,
    CommonModule
  ],
  exports: [AuthService, TypeOrmModule, PassportModule, JwtModule, JwtStrategy]
})
export class AuthModule { }
