import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class CreateServiceDto {
  @IsNotEmpty()
  label: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  description?: string;
}
