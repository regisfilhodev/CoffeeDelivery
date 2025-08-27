import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDto {
  @IsNumber()
  cafeId: number;

  @IsNumber()
  quantidade: number;
}

export class CreatePedidoDto {
  @IsNumber()
  clienteId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];
} 