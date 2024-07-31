
import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class User {

    @ApiProperty({
        format: "uuid",
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        format: "email",
        uniqueItems: true,
    })
    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @ApiProperty({
        required: false
    })
    @Column('text')
    fullname: string;

    @ApiProperty({
        required: false,
        default: true
    })
    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        default: ["user"],
        type: String,
        isArray: true,
    })
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(() => Product, (product) => product.user)
    pruduct: Product;

    @BeforeInsert()
    @BeforeUpdate()
    formatData() {
        this.email = this.email.toLowerCase().trim();
    }

}
