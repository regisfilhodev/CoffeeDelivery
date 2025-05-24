import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesController } from './modules/coffees/coffees.controller';
import { CoffeesService } from './modules/coffees/coffees.service';

describe('AppController', () => {
  let appController: CoffeesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CoffeesController],
      providers: [CoffeesService],
    }).compile();

    appController = app.get<CoffeesController>(CoffeesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getCoffee()).toBe('Hello World!');
    });
  });
});
