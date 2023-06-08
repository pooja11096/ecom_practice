import { IsNumber } from "class-validator";

export class CreateCartDto {

    userId: string;

    productId: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    total: number;
}
