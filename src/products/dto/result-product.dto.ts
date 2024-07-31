import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateProductDto } from "./create-product.dto";
import { IsString } from "class-validator";

export class ResultProduct extends PartialType(CreateProductDto) {
    @ApiProperty({
        format: "uuid",
    })
    @IsString()
    id: string;
}