import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class ProductsService {
  private readonly defaultLimit = this.serviceConfig.get('defaultPaginationLimit');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly serviceConfig: ConfigService,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      let product: Product = this.productRepository.create(createProductDto);
      product = await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handelException(error);
    }
  }

  async findAll(paginatoinDto: PaginationDto): Promise<Product[]> {
    try {
      const { limit = this.defaultLimit, offset = 0 } = paginatoinDto;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        //TODO Relaciones
      });
      return products;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(term: string): Promise<Product> {

    let product: Product = null;
    try {
      if (isUUID(term)) {
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where(' LOWER(title) =:title or slug =:slug', {
            title: term.toLocaleLowerCase(),
            slug: term.toLowerCase()
          }).getOne();
      }

    } catch (error) {
      console.log(error);
      this.handelException(error);
    }

    if (!product) {
      throw new NotFoundException(`Not exists a product by term "${term}"`);
    }

    return product

  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({ id, ...updateProductDto });
      return await this.productRepository.save(product);

    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundException();
      }
      this.handelException(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      if (isUUID(id)) {
        const { affected } = await this.productRepository.delete({ id });
        if (affected <= 0) throw new NotFoundException(`Product not found with id "${id}"`);
      }
    } catch (error) {
      this.handelException(error);
    }
  }

  handelException(error) {
    console.log(error)

    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error.code === '22P02') {
      throw new BadRequestException(`Not exists a product by submmited id`);
    }

    if (error.status == HttpStatus.BAD_REQUEST) {
      throw error;
    }

    if (error.status == HttpStatus.NOT_FOUND) {
      throw error;
    }

    throw new InternalServerErrorException('Unespected error. Check server logs.');
  }
}
