import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CoffeeDto } from './types/Coffees';

const coffeeList = [
  {
    id: 1,
    nome: 'Café com leite',
    tipo: '1',
    descricao: 'O melhor',
    preco: 6,
    tag: ['Normal', 'Quente'],
    quantidade: 3
  },
  {
    id: 2,
    nome: 'Capuccino',
    tipo: '2',
    descricao: 'Café cremoso com toque de chocolate',
    preco: 8,
    tag: ['Doce', 'Cremoso', 'Quente'],
    quantidade: 5
  },
  {
    id: 3,
    nome: 'Café Gelado',
    tipo: '3',
    descricao: 'Refrescante para dias quentes',
    preco: 7,
    tag: ['Gelado', 'Refrescante'],
    quantidade: 2
  }
]  

@Injectable()
export class CoffeesService {

  getCoffee(): CoffeeDto[] {
    return coffeeList;
  }
  getCoffeeId(id: number): CoffeeDto {
    const existcoffee = coffeeList.find(coffee => coffee.id === Number(id))

    if (!existcoffee) {
      throw new NotFoundException(`Café com ID ${id} não encontrado!`);
    }

    return existcoffee;   
  }
  postCoffee(coffee: CoffeeDto) {
    const coffeeExists = coffeeList.some(c => c.id === coffee.id);
    if (coffeeExists) {
      throw new ConflictException(`Café com ID ${coffee.id} já existe!`);
    }
    coffeeList.push(coffee)
    
    return ;
  }
}