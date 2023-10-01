import { Type } from "class-transformer";
import { CreateShippingDto } from "./create-shipping.dto";
import { ValidateNested, validate } from "class-validator";
import { OrderedProductsDto } from "./ordered-products.dto";

export class CreateOrderDto {
    @Type(()=>CreateShippingDto)
    @ValidateNested()
    shippingAddress: CreateShippingDto;

    @Type(()=>OrderedProductsDto)
    @ValidateNested()
    orderedProducts: OrderedProductsDto[];
}
