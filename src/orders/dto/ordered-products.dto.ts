import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class OrderedProductsDto {
  @IsNotEmpty({ message: 'id can not be empty' })
  @IsString({ message: 'id must be a string' })
  id: string;
  
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price should be number & max decimal precission 2' },
  )
  @IsPositive({ message: 'Price should be positive' })
  product_unit_price: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price should be number & max decimal precission 2' },
  )
  @IsPositive({ message: 'Price should be positive' })
  product_quantity: number;
}
