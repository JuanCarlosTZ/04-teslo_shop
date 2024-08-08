import { IsString, MinLength } from "class-validator";

export class MessageClientDto {

    @IsString()
    @MinLength(1)
    message: string;
}