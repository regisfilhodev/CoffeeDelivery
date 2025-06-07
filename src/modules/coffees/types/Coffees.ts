import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateCoffeeDto {
    @IsString()
    nome: string;

    @IsString()
    tipo: string;

    @IsString()
    descricao: string;

    @IsNumber()
    preco: number;

    @IsArray()
    @IsOptional()
    tags?: string[];
}

export class CoffeeDto extends CreateCoffeeDto {
    @IsNumber()
    @IsOptional()
    id?: number;
}