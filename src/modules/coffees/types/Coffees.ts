import { IsString, IsNumber, IsArray, IsDate, IsOptional } from 'class-validator';

export class CoffeeDto  {
    @IsNumber()
    id: number;

    @IsString()
    nome: string;

    @IsString()
    tipo: string;

    @IsString()
    descricao: string;

    @IsNumber()
    preco: number;

    @IsArray()
    tag: string[];

    @IsNumber()
    quantidade: number;

    @IsString()
    @IsOptional()
    date_create: string;
}