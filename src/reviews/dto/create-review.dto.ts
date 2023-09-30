import { IsNotEmpty, IsString, IsNumber, Min, Max } from "class-validator";

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Product ID should not be empty' })
  @IsString({ message: 'Product ID should be a string' })
  productId: string;

  @IsNumber({}, { message: 'Rating should be a number' })
  @Min(1, { message: 'Rating should be at least 1' })
  @Max(5, { message: 'Rating should not exceed 5' })
  ratings: number;

  @IsString({ message: 'Comment should be a string' })
  comment: string;
}
