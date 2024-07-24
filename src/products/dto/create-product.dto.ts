import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    slug?: string;

    @IsOptional()
    @IsInt()
    @IsPositive()
    stock?: number;

    @IsArray()
    @IsString({ each: true })
    sizes: string[];

    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?: number;

    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

}
