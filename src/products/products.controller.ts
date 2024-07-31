import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { User } from 'src/auth/entities/user.entity';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/helpers/roles.helper';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { ResultProduct } from './dto/result-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @Auth()
  @ApiResponse({ status: 201, description: 'Product was created', type: ResultProduct })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 500, description: 'Unespected error' })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<ResultProduct> {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({ status: 200, isArray: true, type: ResultProduct })
  @ApiResponse({ status: 500, description: 'Unespected error' })
  findAll(@Query() paginatoinDto: PaginationDto): Promise<ResultProduct[]> {
    return this.productsService.findAll(paginatoinDto);
  }

  @Get(':term')
  @ApiResponse({ status: 200, type: ResultProduct })
  @ApiResponse({ status: 500, description: 'Unespected error' })
  findOne(@Param('term') term: string): Promise<ResultProduct> {
    return this.productsService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  @ApiResponse({ status: 201, description: 'Product was created', type: ResultProduct })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 500, description: 'Unespected error' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ): Promise<ResultProduct> {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
