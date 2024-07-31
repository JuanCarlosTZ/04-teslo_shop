import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        minLength: 1,
        uniqueItems: true,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Special url id',
        required: false,
        uniqueItems: true,
    })
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiProperty({
        required: false,
        default: 0,
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    stock?: number;

    @ApiProperty({
        description: 'Size of the avalable list',
        isArray: true,
        example: ['s', 'm', 'xl'],
        type: String
    })
    @IsArray()
    @IsString({ each: true })
    sizes: string[];

    @ApiProperty({
        required: false,
        default: 0,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?: number;

    @ApiProperty({
        enum: ['men', 'women', 'kid', 'unisex'],
        type: String,
    })
    @IsString()
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        required: false,
        isArray: true,
        example: ["t-shirt", "men"],
        type: String,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty({
        description: 'Images id',
        required: false,
        format: "text",
        isArray: true,
        type: String,
        example: [
            "image1.jpg",
            "image2.jpg",
        ],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

}
