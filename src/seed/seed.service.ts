import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ) { }

  async runSeed() {

    await this.productService.removeAll();

    const promiseProducts = initialData.products.map((product) => {
      return this.productService.create(product);
    });
    await Promise.all(promiseProducts);

    return 'Seed executed';
  }
}
