import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Observable } from "rxjs";
import { User } from "../entities/user.entity";
import { Reflector } from "@nestjs/core";
import { META_ROLE } from "../helpers/roles.helper";


@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const roles: string[] = this.reflector.get(META_ROLE, context.getHandler());
        console.log(`${roles}`);
        if (!roles || roles.length == 0) return true;

        const req = context.switchToHttp().getRequest();
        const user = req.user as User;

        if (!user) throw new InternalServerErrorException(`User not found (UserhRoleGuard)`);

        for (const role of roles) {
            if (user.roles.includes(role)) {
                return true;
            }
        }

        throw new ForbiddenException(`User ${user.fullname} need a valid role: [${roles}]`)
    }
}