import {Prisma} from '@prisma/client'
export class CreateOrderitemDto implements Prisma.OrderItemUncheckedCreateInput {
    id?: string;
    orderId: string;
    productId: string;
    quantity: number;
    total: number;
}
