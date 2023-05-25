import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {

    @IsString()
    product_name: string

    @IsString()
    product_description: string

    @IsNumber()
    product_price: number

    @IsString()
    // @IsNotEmpty()
    category_name: string

}
