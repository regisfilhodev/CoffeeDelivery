import { Body, Controller, Delete, Get, Param, Post, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeeDto } from './types/Coffees';
import { Prisma } from 'generated/prisma';
import { CreatePedidoDto } from './types/Pedidos';
import { CreateClienteDto } from './types/Clientes';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  async findAll() {    
    return this.coffeesService.findAll();
  }

  @Get('/plus-order-coffee')
  async findMaisVendidos(
    @Query('tipo') tipo?: string,
    @Query('nome') nome?: string
  ) {
    try {
      console.log('Controller - Recebendo requisição com parâmetros:', { tipo, nome });
      const resultado = await this.coffeesService.findMaisVendidos(tipo, nome);
      console.log('Controller - Resultado:', resultado);
      return resultado;
    } catch (error) {
      console.error('Controller - Erro:', error);
      throw new HttpException(
        `Erro ao buscar cafés mais vendidos: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('/coffee-query-all')
  async coffeeQueryAll(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string
  ) {
    return this.coffeesService.coffeeQueryAll(start_date, end_date);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new HttpException('ID inválido', HttpStatus.BAD_REQUEST);
      }
      return this.coffeesService.findOne(numericId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Erro ao buscar café: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id/orders')
  async findPedidosByCafeId(@Param('id') id: string) {
    return this.coffeesService.findPedidosByCafeId(Number(id));
  }

  @Post('/coffee-create')
  async create(@Body() coffee: CoffeeDto) {
    return this.coffeesService.create(coffee);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.coffeesService.remove(Number(id));
  }

  @Delete(':tagId/tags')
  async removeTag(@Param('tagId') tagId: string) {
    return this.coffeesService.removeTag(Number(tagId));
  }

  @Post('/pedido-create')
  async createPedido(@Body() pedido: CreatePedidoDto) {
    return this.coffeesService.createPedido(pedido);
  }

  @Post('/cliente-create')
  async createCliente(@Body() cliente: CreateClienteDto) {
    return this.coffeesService.createCliente(cliente);
  }
}