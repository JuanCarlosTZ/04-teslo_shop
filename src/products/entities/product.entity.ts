import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product_image.entity";

@Entity({ name: 'Products' })
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('text', {
        nullable: true
    })
    description?: string;

    @Column('text', {
        unique: true,
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true,
    })
    sizes: string[];

    @Column('float', {
        default: 0.0,
    })
    price: number;

    @Column('text')
    gender: string;

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product, {
        cascade: true, eager: true
    })
    images?: ProductImage[];

    @BeforeInsert()
    @BeforeUpdate()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
        }
        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }
}
