# Backend Hamburgueria (TypeScript + Express)

API para autenticação de clientes e administradores, histórico do cliente e adição de produtos pelo administrador. Estruturada de forma modular e pronta para integrar com seu front-end.

## Tecnologias
- TypeScript, Express, CORS, dotenv
- JWT (`jsonwebtoken`) para autenticação
- `bcrypt` para hash de senhas
- `zod` para validação

## Execução
- `npm run dev` inicia em `http://localhost:3000`
- `npm run build` compila para `dist`
- `npm run typecheck` valida tipos
- Variáveis: `JWT_SECRET` (recomendado em produção), `PORT` (default 3000)

## Estrutura de Pastas
```
src/
  app.ts                 # configura Express e rotas
  server.ts              # inicia servidor
  routes/
    index.ts             # agrega sub-rotas
    auth.routes.ts       # cadastro e login
    customer.routes.ts   # histórico (cliente)
    admin.routes.ts      # adicionar produto (admin)
  controllers/
    auth.controller.ts
    customer.controller.ts
    admin.controller.ts
  services/
    auth.service.ts
    order.service.ts
    product.service.ts
  repositories/
    user.repository.ts
    order.repository.ts
    product.repository.ts
  middlewares/
    auth.middleware.ts
    role.middleware.ts
    error.middleware.ts
  models/
    user.model.ts
    product.model.ts
    order.model.ts
  schemas/
    auth.schema.ts
    product.schema.ts
  utils/env.ts
  db/memory.ts           # armazenamento em memória
```

## Autenticação
- Header: `Authorization: Bearer <token>`
- Token contém `sub` (ID do usuário) e `role` (`customer` ou `admin`)
- Middlewares:
  - Autenticação: `src/middlewares/auth.middleware.ts:9`
  - Papel: `src/middlewares/role.middleware.ts:5`

## Rotas

### Saúde
- `GET /health`

### Cadastro
- `POST /auth/register/customer`
  - Body: `{ "name": string, "email": string, "password": string }`
  - Controller: `src/controllers/auth.controller.ts:6`
- `POST /auth/register/admin`
  - Body: `{ "name": string, "email": string, "password": string }`
  - Controller: `src/controllers/auth.controller.ts:18`

### Login
- `POST /auth/login/customer`
  - Body: `{ "email": string, "password": string }`
  - Controller: `src/controllers/auth.controller.ts:30`
- `POST /auth/login/admin`
  - Body: `{ "email": string, "password": string }`
  - Controller: `src/controllers/auth.controller.ts:42`

### Cliente
- `GET /customer/orders`
  - Header: `Authorization: Bearer <token>`
  - Controller: `src/controllers/customer.controller.ts:5`
- `GET /customer/purchases`
  - Header: `Authorization: Bearer <token>`
  - Controller: `src/controllers/customer.controller.ts:11`

### Administrador
- `POST /admin/products`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "name": string, "price": number, "description"?: string }`
  - Controller: `src/controllers/admin.controller.ts:5`

## Validações
- Cadastro/Login: `src/schemas/auth.schema.ts`
- Produto: `src/schemas/product.schema.ts`

## Modelos
- Usuário: `src/models/user.model.ts`
- Produto: `src/models/product.model.ts`
- Pedido: `src/models/order.model.ts`

## Serviços e Repositórios
- Autenticação: `src/services/auth.service.ts`
- Produtos: `src/services/product.service.ts` ↔ `src/repositories/product.repository.ts`
- Histórico: `src/services/order.service.ts` ↔ `src/repositories/order.repository.ts`
- Usuário: `src/repositories/user.repository.ts`

## Observações
- Armazenamento atual é em memória (`src/db/memory.ts`): reinicia a cada execução.
- Para persistência, pode-se integrar facilmente SQLite/Prisma ou MongoDB substituindo apenas a camada de repositórios.