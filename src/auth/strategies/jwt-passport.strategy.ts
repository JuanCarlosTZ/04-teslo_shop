import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AppConfiguration } from "src/common/configuration/app.configuration";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly appConfig: AppConfiguration
    ) {
        super({
            secretOrKey: appConfig.appConfig().jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        } as StrategyOptions);
    }

    async validate(payload: JwtPayload): Promise<User> {

        const { userId } = payload;
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) throw new UnauthorizedException('Token not valid');
        if (user.isActive) throw new UnauthorizedException('User lock, contact with an admin');

        return user;

    }

} 