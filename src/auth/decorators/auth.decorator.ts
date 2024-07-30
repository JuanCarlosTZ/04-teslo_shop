import { applyDecorators, ExecutionContext, UseGuards } from "@nestjs/common";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "./user-role-guard.decorator";
import { ValidRoles } from "../helpers/roles.helper";

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard)
    )
}