import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Coffee } from './types/Coffees';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('coffee')
  getCoffee(): Coffee[] {
    return this.appService.getCoffee();
  }

  @Get('coffee/:id/detalhes')
  getCoffeeDetalhes(@Param() params:{id: string}): Coffee[] {
    return this.appService.getCoffeeId(Number(params.id));
  }

  @Post('coffee')
  createCoffee(@Body() coffee: Coffee): Coffee[] {
    return this.appService.postCoffee(coffee);
  }
}
