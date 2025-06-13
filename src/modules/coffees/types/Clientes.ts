import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  cpf: string;

  @IsString()
  @IsOptional()
  telefone?: string;
} 