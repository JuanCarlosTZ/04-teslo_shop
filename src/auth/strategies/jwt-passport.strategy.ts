import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AppConfiguration } from "src/common/configuration/app.configuration";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly authService: AuthService,

        private readonly appConfig: AppConfiguration
    ) {
        super({
            secretOrKey: appConfig.appConfig().jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        } as StrategyOptions);
    }

    async validate(payload: JwtPayload): Promise<User> {
        return this.authService.checkJwtPayload(payload);
    }

} 