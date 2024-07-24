import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductImage } from './entities/product_image.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Product, ProductImage])
  ]
})
export class ProductsModule { }
