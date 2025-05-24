import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeeDto } from './types/Coffees';
import { Transform } from 'class-transformer';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  getCoffee(): CoffeeDto[] {
    return this.coffeesService.getCoffee();
  }

  @Get(':id/detalhes')
  getCoffeeDetalhes(@Param() params:{id: number}): CoffeeDto {
    return this.coffeesService.getCoffeeId(params.id);
  }

  @Post('/coffee-create')
  createCoffee(@Body() coffee: CoffeeDto) {
    return this.coffeesService.postCoffee(coffee);
  }
}