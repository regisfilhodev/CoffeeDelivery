import { Body, Controller, Get, Param, Post, Query, ValidationPipe, BadRequestException } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeeDto } from './types/Coffees';
import { Transform } from 'class-transformer';
import { start } from 'repl';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) { }

  @Get()
  getCoffee(): CoffeeDto[] {
    return this.coffeesService.getCoffee();
  }

  @Get(':id/detalhes')
  getCoffeeDetalhes(@Param() params: { id: number }): CoffeeDto {
    return this.coffeesService.getCoffeeId(params.id);
  }

  @Post('/coffee-create')
  createCoffee(@Body() coffee: CoffeeDto) {
    return this.coffeesService.postCoffee(coffee);
  }

  @Get('/coffee-query-all')
  coffeeQueryAll(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string
  ) {

    return this.coffeesService.coffeeQueryAll(start_date, end_date);
  }
}