import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsNotEmpty({ message: 'phone can not be empty' })
  @IsString({ message: 'phone must be a string' })
  phone: string;

  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'address can not be empty' })
  @IsString({ message: 'address must be a string' })
  address: string;

  @IsNotEmpty({ message: 'city can not be empty' })
  @IsString({ message: 'city must be a string' })
  city: string;

  @IsNotEmpty({ message: 'postCode can not be empty' }) 
  @IsString({ message: 'postCode must be a string' })   
  postCode: string;

  @IsNotEmpty({ message: 'state can not be empty' }) 
  @IsString({ message: 'state must be a string' })   
  state: string;

  @IsNotEmpty({ message: 'country can not be empty' }) 
  @IsString({ message: 'country must be a string' })   
  country: string;
}
