import { ConflictException, Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CoffeeDto } from './types/Coffees';
import { CreatePedidoDto } from './types/Pedidos';
import { CreateClienteDto } from './types/Clientes';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

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

  async findAll() {
    const cafes = await this.prisma.cafe.findMany({
      select: {
        id: true,
        nome: true,
        tags: {
          select: {
            nome: true
          }
        }
      }
    });

    return cafes.map(cafe => ({
      id: cafe.id,
      nome: cafe.nome,
      tags: cafe.tags.map(tag => tag.nome)
    }));
  }

  async findOne(id: number) {
    if (!id) {
      throw new HttpException('ID é obrigatório', HttpStatus.BAD_REQUEST);
    }

    const coffee = await this.prisma.cafe.findUnique({
      where: {
        id: id
      },
      include: {
        tags: true
      }
    });

    if (!coffee) {
      throw new HttpException(`Café com ID ${id} não encontrado!`, HttpStatus.NOT_FOUND);
    }
    return coffee;
  }

  async create(coffee: CoffeeDto) {
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

  async findPedidosByCafeId(coffeeId: number) {
    const coffee = await this.prisma.cafe.findUnique({
      where: { id: coffeeId },
      include: {
        itemPedido: {
          include: {
            pedido: {
              select: {
                id: true,
                dataPedido: true,
                totalPedido: true
              }
            }
          }
        }
      }
    });

    if (!coffee) {
      throw new NotFoundException(`Café com ID ${coffeeId} não encontrado!`);
    }

    return {
      id: coffee.id,
      nome: coffee.nome,
      pedidos: coffee.itemPedido.map(item => ({
        pedidoId: item.pedido.id,
        dataPedido: item.pedido.dataPedido,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        totalPedido: item.pedido.totalPedido
      }))
    };
  }

  async findMaisVendidos(tipo?: string, nome?: string) {
    try {
      // Primeiro, vamos tentar uma consulta simples para verificar se o banco está funcionando
      const cafes = await this.prisma.cafe.findMany({
        select: {
          id: true,
          nome: true,
          tipo: true
        }
      });

      console.log('Cafés básicos encontrados:', cafes);

      if (!cafes || cafes.length === 0) {
        return [];
      }

      // Agora vamos tentar buscar os pedidos
      const cafesComPedidos = await Promise.all(
        cafes.map(async (cafe) => {
          const pedidos = await this.prisma.itemPedido.findMany({
            where: {
              cafeId: cafe.id
            },
            select: {
              quantidade: true
            }
          });

          const totalVendido = pedidos.reduce((total, pedido) => {
            return total + Number(pedido.quantidade);
          }, 0);

          return {
            id: cafe.id,
            nome: cafe.nome,
            tipo: cafe.tipo,
            totalVendido
          };
        })
      );

      // Aplicar filtros se fornecidos
      let cafesFiltrados = cafesComPedidos;
      
      if (tipo) {
        cafesFiltrados = cafesFiltrados.filter(cafe => cafe.tipo === tipo);
      }
      
      if (nome) {
        const nomeLower = nome.toLowerCase();
        cafesFiltrados = cafesFiltrados.filter(cafe => 
          cafe.nome.toLowerCase().includes(nomeLower)
        );
      }

      // Ordenar e retornar os top 3
      return cafesFiltrados
        .sort((a, b) => b.totalVendido - a.totalVendido)
        .slice(0, 3);

    } catch (error) {
      console.error('Erro detalhado ao buscar cafés mais vendidos:', error);
      throw new Error(`Erro ao processar a busca dos cafés mais vendidos: ${error.message}`);
    }
  }

  async remove(id: number) {
    const coffee = await this.prisma.cafe.findUnique({
      where: { id }
    });

    if (!coffee) {
      throw new NotFoundException(`Café com ID ${id} não encontrado!`);
    }

    await this.prisma.cafe.delete({
      where: { id }
    });

    return { message: `Café com ID ${id} foi deletado com sucesso!` };
  }

  async removeTag(tagId: number) {
    const tag = await this.prisma.tagCafe.findUnique({
      where: { id: tagId }
    });

    if (!tag) {
      throw new NotFoundException(`Tag com ID ${tagId} não encontrada!`);
    }

    await this.prisma.tagCafe.delete({
      where: { id: tagId }
    });

    return { message: `Tag com ID ${tagId} foi deletada com sucesso!` };
  }

  async createPedido(pedido: CreatePedidoDto) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: pedido.clienteId }
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${pedido.clienteId} não encontrado!`);
    }

    const cafes = await Promise.all(
      pedido.itens.map(async (item) => {
        const cafe = await this.prisma.cafe.findUnique({
          where: { id: item.cafeId }
        });

        if (!cafe) {
          throw new NotFoundException(`Café com ID ${item.cafeId} não encontrado!`);
        }

        return {
          cafe,
          quantidade: item.quantidade,
          precoUnitario: cafe.preco
        };
      })
    );

    const totalPedido = cafes.reduce(
      (total, item) => total + Number(item.precoUnitario) * item.quantidade,
      0
    );

    return this.prisma.pedido.create({
      data: {
        clienteId: pedido.clienteId,
        totalPedido,
        itens: {
          create: cafes.map(item => ({
            cafeId: item.cafe.id,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario
          }))
        }
      },
      include: {
        itens: {
          include: {
            cafe: true
          }
        }
      }
    });
  }

  async createCliente(cliente: CreateClienteDto) {
    const clienteExistente = await this.prisma.cliente.findFirst({
      where: {
        OR: [
          { email: cliente.email },
          { cpf: cliente.cpf }
        ]
      }
    });

    if (clienteExistente) {
      throw new ConflictException('Já existe um cliente com este email ou CPF!');
    }

    return this.prisma.cliente.create({
      data: {
        nome: cliente.nome,
        email: cliente.email,
        cpf: cliente.cpf,
        telefone: cliente.telefone
      }
    });
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