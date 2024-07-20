import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @Min(0)
    offset?: number;

}