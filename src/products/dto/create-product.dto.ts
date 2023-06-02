import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {

    @IsString()
    product_name: string

    @IsString()
    product_description: string

    @IsNotEmpty()
    product_price: string

    image_url:string

    // @IsString()
    // @IsNotEmpty()
    // @IsString()
    category_name: string

}
