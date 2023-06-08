import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  product_name: string;

  product_description: string;

  product_price: number;

  image_url: string;

  categoryId: string;
}
