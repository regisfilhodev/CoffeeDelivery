# Coffee Delivery API

API simples para delivery de café usando NestJS e Prisma.

## Como rodar

1. Instala as dependências:
```bash
npm install
```

2. Cria um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/coffee_delivery?schema=public"
```

3. Roda as migrações:
```bash
npx prisma migrate dev
```

4. Inicia o servidor:
```bash
npm run start:dev
```

## Endpoints

### Criar café
```http
POST /coffees/coffee-create
```
```json
{
  "nome": "Café Expresso",
  "tipo": "Expresso",
  "preco": 5.90,
  "descricao": "Café expresso tradicional",
  "tags": ["Forte", "Tradicional"]
}
```

### Listar cafés
```http
GET /coffees
```

### Ver detalhes de um café
```http
GET /coffees/:id/detalhes
```

### Buscar por período
```http
GET /coffees/coffee-query-all?start_date=2024-01-01&end_date=2024-12-31
```

## Tecnologias
- NestJS
- Prisma
- PostgreSQL
- TypeScript
