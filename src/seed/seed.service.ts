import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { AuthService } from 'src/auth/auth.service';
import { initialData } from './data/seed';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService,
    private readonly authService: AuthService
  ) { }

  async runSeed() {

    await this.productService.removeAll();
    await this.authService.removeAllUsers();

    const promiseUsers = initialData.users.map((user) => {
      return this.authService.create(user);
    });
    const users = await Promise.all(promiseUsers);

    const promiseProducts = initialData.products.map((product) => {
      return this.productService.create(product, users[0]);
    });
    await Promise.all(promiseProducts);

    return 'Seed executed';
  }

}
