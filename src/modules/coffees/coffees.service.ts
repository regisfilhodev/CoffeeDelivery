import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CoffeeDto } from './types/Coffees';
import { PrismaService } from 'src/prisma/prisma.service';

const coffeeList = [
  {
    id: 1,
    nome: 'Café com leite',
    tipo: '1',
    descricao: 'O melhor',
    preco: 6,
    tag: ['Normal', 'Quente'],
    quantidade: 3,
    date_create: "2025-05-30T23:12:44.831Z"
  },
  {
    id: 2,
    nome: 'Capuccino',
    tipo: '2',
    descricao: 'Café cremoso com toque de chocolate',
    preco: 8,
    tag: ['Doce', 'Cremoso', 'Quente'],
    quantidade: 5,
    date_create: "2025-05-30T23:12:44.831Z"

  },
  {
    id: 3,
    nome: 'Café Gelado',
    tipo: '3',
    descricao: 'Refrescante para dias quentes',
    preco: 7,
    tag: ['Gelado', 'Refrescante'],
    quantidade: 2,
    date_create: "2025-05-30T23:12:44.831Z"
  }
]  

@Injectable()
export class CoffeesService {
  constructor(private prisma: PrismaService) {}

  async getCoffee() {
    return this.prisma.cafe.findMany({
      include: {
        tags: true
      }
    });
  }

  async getCoffeeId(id: number) {
    const coffee = await this.prisma.cafe.findUnique({
      where: { id },
      include: {
        tags: true
      }
    });

    if (!coffee) {
      throw new NotFoundException(`Café com ID ${id} não encontrado!`);
    }
    return coffee;
  }

  async postCoffee(coffee: CoffeeDto) {
    const coffeeExists = await this.prisma.cafe.findFirst({
      where: { nome: coffee.nome }
    });

    if (coffeeExists) {
      throw new ConflictException(`Café com nome ${coffee.nome} já existe!`);
    }
    
    const newCoffee = await this.prisma.cafe.create({
      data: {
        nome: coffee.nome,
        tipo: coffee.tipo,
        preco: coffee.preco,
        descricao: coffee.descricao,
        tags: {
          create: coffee.tags?.map(tag => ({ nome: tag }))
        }
      },
      include: {
        tags: true
      }
    });
    
    return newCoffee;
  }

  async coffeeQueryAll(
    startDateString?: string,
    endDateString?: string,
  ) {
    const where: any = {};

    if (startDateString || endDateString) {
      where.dataPedido = {};
      
      if (startDateString) {
        where.dataPedido.gte = new Date(startDateString);
      }
      
      if (endDateString) {
        where.dataPedido.lte = new Date(endDateString);
      }
    }

    return this.prisma.cafe.findMany({
      where,
      include: {
        tags: true
      }
    });
  }
}