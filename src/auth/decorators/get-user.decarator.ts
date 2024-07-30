import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { IsArray, IsString } from "class-validator";

export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        const field = user[data];

        if (!user) throw new InternalServerErrorException('User not found (request)');

        return field ?? user;
    })