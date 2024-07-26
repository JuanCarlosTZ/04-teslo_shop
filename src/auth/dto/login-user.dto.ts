import { IsArray, IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

}
