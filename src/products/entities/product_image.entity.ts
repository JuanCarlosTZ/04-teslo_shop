import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity({ name: "Product_Image" })
export class ProductImage {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('text')
    url: string;

    @ManyToOne(() => Product,
        (product) => product.images, {
        onDelete: "CASCADE",
    })
    product: Product;
}