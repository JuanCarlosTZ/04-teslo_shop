import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

const configModule = ConfigModule.forRoot();

const typeormModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: true,
  synchronize: true,
});

@Module({
  imports: [
    configModule,
    typeormModule,
    ProductsModule,
    CommonModule,

  ]
})
export class AppModule { }
