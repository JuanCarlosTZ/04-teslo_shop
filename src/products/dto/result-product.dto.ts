import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";

export class ResultProduct extends PartialType(CreateProductDto) {

    images?: string[];
}