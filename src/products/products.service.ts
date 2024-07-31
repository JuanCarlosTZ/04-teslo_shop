import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { ProductImage } from './entities/product_image.entity';
import { ResultProduct } from './dto/result-product.dto';
import { HandlerHelper } from 'src/common/helpers/handle-exception.helper';
import { User } from 'src/auth/entities/user.entity';


@Injectable()
export class ProductsService {
  private readonly defaultLimit: number;
  private readonly context: 'ProductsService';

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly datasource: DataSource,

    private readonly serviceConfig: ConfigService,

    private readonly handler: HandlerHelper,

  ) {
    this.defaultLimit = this.serviceConfig.get<number>('defaultPaginationLimit');

  }

  async create(createProductDto: CreateProductDto, user: User): Promise<ResultProduct> {
    return await this.handler.exception(this.context, async () => {
      const images: ProductImage[] = createProductDto.images.map((image) => {
        return this.productImageRepository.create({ url: image });
      });

      const toCreateProductDto = { ...createProductDto, user, images: images };
      let product: Product = this.productRepository.create(toCreateProductDto);
      product = await this.productRepository.save(product);

      return this.getResultProduct(product);
    });

  }

  async findAll(paginatoinDto: PaginationDto): Promise<ResultProduct[]> {
    return await this.handler.exception(this.context, async () => {
      const { limit = this.defaultLimit, offset = 0 } = paginatoinDto;
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true
        }
      });

      return products.map(product => this.getResultProduct(product));
    });

  }

  async findOne(term: string): Promise<ResultProduct> {
    const product = await this.findOneProduct(term);
    console.log(product);
    return this.getResultProduct(product);
  }

  getResultProduct(product: Product): ResultProduct {
    const result: ResultProduct = { ...product, images: product.images?.map(image => image.url) };
    return result;
  }

  async findOneProduct(term: string): Promise<Product> {
    let product: Product = null;
    await this.handler.exception(this.context, async () => {
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
    });

    if (!product) {
      throw new NotFoundException(`Not exists a product by term "${term}"`);
    }
    return product
  }


  async update(id: string, updateProductDto: UpdateProductDto, user: User): Promise<ResultProduct> {
    const queryRunner = this.datasource.createQueryRunner();

    return await this.handler.exception(
      this.context,
      async () => {
        console.log();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { images, ...toUpdateProductDto } = updateProductDto;

        const updateProduct = await this.productRepository.preload({
          id,
          ...toUpdateProductDto,
          user
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

      },
      async (error) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release()

        if (error.code === '22P02') {
          throw new NotFoundException();
        }

      }
    );


  }

  async remove(id: string): Promise<void> {
    return await this.handler.exception(this.context, async () => {
      if (isUUID(id)) {
        const { affected } = await this.productRepository.delete({ id });
        if (affected <= 0) throw new NotFoundException(`Product not found with id "${id}"`);
      }
    });

  }


  async removeAll(): Promise<void> {
    return await this.handler.exception(this.context, async () => {
      await this.productRepository.delete({});
    });
  }


}
