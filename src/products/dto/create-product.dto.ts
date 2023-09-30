import {
    IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a number && max decimal 2' },
  )
  @IsPositive()
  price: number;

  @IsNotEmpty({ message: 'Stock is required' })
  @IsNumber()
  @Min(0, { message: 'Stock must be positive number' })
  stock: number;

  @IsNotEmpty({ message: 'Images is required' })
  @IsArray({message: 'Images must be an array'})
  images: string[];

  @IsNotEmpty({ message: 'Category is required' })
  @IsString()
  categoryId: string;
}
