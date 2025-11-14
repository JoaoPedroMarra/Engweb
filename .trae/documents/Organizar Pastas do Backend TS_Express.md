## Objetivo
Organizar o backend em uma arquitetura clara e coerente (TS + Express), separando responsabilidades em camadas: rotas, controladores, serviços, repositórios, middlewares, modelos e validações, mantendo todos os endpoints e comportamentos já implementados.

## Estrutura de Pastas
- `src/server.ts`: bootstrap do servidor (escuta na porta, logs).
- `src/app.ts`: criação e configuração do Express (`cors`, `json`, rotas e middlewares globais).
- `src/routes/`
  - `auth.routes.ts`: rotas de cadastro e login (cliente e admin).
  - `customer.routes.ts`: rotas do cliente (histórico de pedidos e compras).
  - `admin.routes.ts`: rotas do administrador (adicionar produto).
  - `index.ts`: agrega e exporta o router principal.
- `src/controllers/`
  - `auth.controller.ts`: orquestra cadastro/login.
  - `customer.controller.ts`: histórico de pedidos/compras.
  - `admin.controller.ts`: adicionar produto.
- `src/services/`
  - `auth.service.ts`: hash/compare de senha, geração/validação de JWT.
  - `order.service.ts`: consulta de histórico do cliente.
  - `product.service.ts`: criação/adicionar produto.
- `src/repositories/`
  - `user.repository.ts`: CRUD em memória de usuários.
  - `order.repository.ts`: leitura em memória de pedidos.
  - `product.repository.ts`: CRUD em memória de produtos.
- `src/middlewares/`
  - `auth.middleware.ts`: autenticação via Bearer JWT.
  - `role.middleware.ts`: verificação de papel (`customer`/`admin`).
  - `error.middleware.ts`: tratador global de erros.
- `src/models/`
  - `user.model.ts`, `product.model.ts`, `order.model.ts`: tipos/entidades TS.
- `src/schemas/`
  - `auth.schema.ts`: `registerSchema`, `loginSchema` (Zod).
  - `product.schema.ts`: `productSchema` (Zod).
- `src/utils/`
  - `env.ts`: leitura de `JWT_SECRET`, `PORT`.
  - `jwt.ts`: helpers para assinar/verificar tokens (separado do service, opcional).
- `src/db/`
  - `memory.ts`: estruturas em memória e contadores (facilita futura troca por DB).

## Arquivos-Chave e Responsabilidades
- `app.ts`: registra middlewares globais e `router` principal.
- `server.ts`: importa `app` e inicia o servidor.
- `routes/*.ts`: define caminhos e associa a controladores + middlewares.
- `controllers/*.ts`: camadas finas que validam entrada (via schemas) e chamam serviços.
- `services/*.ts`: regras de negócio; chamam repositórios.
- `repositories/*.ts`: acesso a dados (in-memory), facilmente substituível por banco.
- `middlewares/*.ts`: autenticação JWT e controle de acesso por papel.
- `schemas/*.ts`: validação com Zod.
- `models/*.ts`: tipos TS de domínio.

## Divisão de Endpoints (mantidos)
- `POST /auth/register/customer`, `POST /auth/register/admin`.
- `POST /auth/login/customer`, `POST /auth/login/admin`.
- `GET /customer/orders`, `GET /customer/purchases`.
- `POST /admin/products`.
- `GET /health`.

## Migração do Código Atual
1. Extrair tipos `User`, `Product`, `Order` para `src/models/*`.
2. Mover schemas Zod para `src/schemas/*`.
3. Criar `src/db/memory.ts` com arrays e contadores; ajustar imports.
4. Implementar `auth.middleware.ts` (lógica atual de `authenticate`) e `role.middleware.ts`.
5. Separar a lógica de login/cadastro em `auth.controller.ts` e mover operações de senha/JWT para `auth.service.ts`.
6. Separar histórico do cliente em `customer.controller.ts`, com `order.service.ts`.
7. Separar adicionar produto em `admin.controller.ts`, com `product.service.ts`.
8. Criar `routes/*` associando paths aos controladores e middlewares; agregar em `routes/index.ts`.
9. Criar `app.ts` para montar middlewares e `router`; criar `server.ts` para iniciar.
10. Atualizar scripts se necessário (`dev`, `build`, `typecheck`) e testar.

## Convenções
- Nomes de arquivos em `kebab-case`.
- Imports relativos curtos e coesos.
- Validação sempre nos controladores via `schemas`.
- Sem comentários em código (exceto quando solicitado), tipagem estrita (`strict` no TS).

## Evolução Futura (opcional)
- Trocar `repositories` in-memory por Prisma + SQLite/PostgreSQL sem alterar serviços/controladores.
- Adicionar rota para o cliente criar pedidos para popular histórico.

## Entrega
- Refatorar mantendo o mesmo comportamento externo e endpoints.
- Rodar `npm run typecheck` e validar `GET /health` e fluxo de autenticação.

Confirma que posso aplicar essa organização e realizar a refatoração agora?