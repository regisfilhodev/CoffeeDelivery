import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeeDto } from './types/Coffees';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  async getCoffee() {
    return this.coffeesService.getCoffee();
  }

  @Get(':id/detalhes')
  async getCoffeeDetalhes(@Param() params: { id: number }) {
    return this.coffeesService.getCoffeeId(params.id);
  }

  @Post('/coffee-create')
  async createCoffee(@Body() coffee: CoffeeDto) {
    return this.coffeesService.postCoffee(coffee);
  }

  @Get('/coffee-query-all')
  async coffeeQueryAll(
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string
  ) {
    return this.coffeesService.coffeeQueryAll(start_date, end_date);
  }
}