import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { ProductImage } from './entities/product_image.entity';
import { ResultProduct } from './dto/result-product.dto';


@Injectable()
export class ProductsService {
  private readonly defaultLimit: number;
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly datasource: DataSource,

    private readonly serviceConfig: ConfigService,

  ) {
    this.defaultLimit = this.serviceConfig.get<number>('defaultPaginationLimit');

  }

  async create(createProductDto: CreateProductDto): Promise<ResultProduct> {
    try {
      const images: ProductImage[] = createProductDto.images.map((image) => {
        return this.productImageRepository.create({ url: image });
      });

      const toCreateProductDto = { ...createProductDto, images: images };
      let product: Product = this.productRepository.create(toCreateProductDto);
      product = await this.productRepository.save(product);

      return this.getResultProduct(product);

    } catch (error) {
      this.handelException(error);

    }
  }

  async findAll(paginatoinDto: PaginationDto): Promise<ResultProduct[]> {
    try {
      const { limit = this.defaultLimit, offset = 0 } = paginatoinDto;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });

      return products.map(product => this.getResultProduct(product));

    } catch (error) {
      this.handelException(error);

    }
  }

  async findOne(term: string): Promise<ResultProduct> {
    const product = await this.findOneProduct(term);
    console.log(product);
    return this.getResultProduct(product);
  }

  getResultProduct(product: Product): ResultProduct {
    return { ...product, images: product.images?.map(image => image.url) }
  }

  async findOneProduct(term: string): Promise<Product> {
    let product: Product = null;
    try {
      if (isUUID(term)) {
        product = await this.productRepository.findOneBy({ id: term });
      } else {
        const queryBuilder = this.productRepository.createQueryBuilder('prod');
        console.log
        product = await queryBuilder
          .where('LOWER(title) =:title or LOWER(slug) =:slug', {
            title: term.toLowerCase(),
            slug: term.toLowerCase()
          })
          .leftJoinAndSelect('prod.images', 'prod_images')
          .getOne();
      }
    } catch (error) {
      this.handelException(error);
    }
    if (!product) {
      throw new NotFoundException(`Not exists a product by term "${term}"`);
    }
    return product
  }


  async update(id: string, updateProductDto: UpdateProductDto): Promise<ResultProduct> {
    const queryRunner = this.datasource.createQueryRunner();

    try {
      console.log();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const { images, ...toUpdateProductDto } = updateProductDto;

      const updateProduct = await this.productRepository.preload({
        id,
        ...toUpdateProductDto
      });


      if (images) {
        console.log('if images');
        await queryRunner.manager.delete(ProductImage, { product: id });
        updateProduct.images = images.map(image => {
          return this.productImageRepository.create({ url: image });
        });
      }

      let product = await queryRunner.manager.save(updateProduct);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      if (!images) {
        //return product with old images included
        product = await this.findOneProduct(id);
      }

      return this.getResultProduct(product);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release()

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
      this.logger.error(error);
      this.handelException(error);
    }
  }


  async removeAll(): Promise<void> {
    try {
      await this.productRepository.delete({});
    } catch (error) {
      this.logger.error(error);
      this.handelException(error);
    }
  }

  handelException(error) {

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

    this.logger.error(error);
    throw new InternalServerErrorException('Unespected error. Check server logs.');
  }
}
