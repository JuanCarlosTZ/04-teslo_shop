import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { AppConfiguration } from './common/configuration/app.configuration';
import { appValidationSchemaJoi } from './common/dto/app_validation_schema_joi.dto';
import { SeedModule } from './seed/seed.module';

const configModule = ConfigModule.forRoot({
  load: [AppConfiguration.envConfig],
  validationSchema: appValidationSchemaJoi
});

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
    SeedModule,
  ]
})
export class AppModule { }
