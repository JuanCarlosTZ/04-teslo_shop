import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({ format: "email", example: "user@example.com" })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "The password must have a Uppercase, lowercase letter and a number",
        format: "password"
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        example: 'Juan Carlos TZ'
    })
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    fullname: string;

    @ApiProperty({
        required: false,
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({
        required: false,
        isArray: true,
        type: String,
        example: ["admin", "super-user", "user"],
        default: ["user"]
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    roles: string[];

}
