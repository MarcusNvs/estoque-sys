# Estoque.sys Back-end

API REST do sistema de gestão de estoque, construída com **Node.js + Express**, **Prisma ORM** e **SQLite**, com autenticação via **JWT** e proteção das rotas privadas.

## Stack

- Node.js + Express
- Prisma ORM
- SQLite (arquivo `prisma/dev.db`)
- JSON Web Token (autenticação)
- bcryptjs (hash de senhas)

## Como executar

A partir da pasta `server/`:

```bash
# 1. Instalar dependências
npm install

# 2. Criar o banco SQLite e aplicar o schema
npx prisma migrate dev --name init

# 3. Popular o banco com dados iniciais (usuários e produtos)
npm run seed

# 4. Subir o servidor (porta 3333)
npm run dev
```

O servidor sobe em `http://localhost:3333`. A rota `GET /api/health` confirma que está no ar.

> Observação: na primeira vez, o `prisma generate`/`migrate` baixa os binários do Prisma. É necessário acesso à internet nessa etapa.

## Usuários do seed

| E-mail              | Senha     | Papel     | Status  |
| ------------------- | --------- | --------- | ------- |
| admin@estoque.com   | admin123  | admin     | Ativo   |
| joao@estoque.com    | joao123   | operador  | Ativo   |
| ana@estoque.com     | ana123    | operador  | Inativo |

## Variáveis de ambiente (`.env`)

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="troque-este-segredo-em-producao-estoque-sys"
PORT=3333
```

## Modelo de dados

- **Usuario**: id, nome, email (único), senha (hash), papel (`admin` | `operador`), status (`Ativo` | `Inativo`), criadoEm
- **Produto**: id, nome, categoria, qtd, preco, criadoEm. O campo `status` (`Normal` | `Baixo` | `Crítico`) é calculado a partir da quantidade.
- **Baixa**: id, quantidade, motivo, criadoEm, vínculo com Produto e Usuario. Registrar uma baixa abate o estoque do produto.

## Autenticação

O login e o cadastro retornam um `token` JWT. As rotas privadas exigem o header:

```
Authorization: Bearer <token>
```

Rotas de gestão de usuários exigem papel `admin`.

## Rotas

### Autenticação (`/api/auth`)

| Método | Rota             | Protegida | Descrição                          |
| ------ | ---------------- | --------- | ---------------------------------- |
| POST   | `/auth/cadastro` | Não       | Cria usuário operador e retorna token |
| POST   | `/auth/login`    | Não       | Autentica e retorna token          |
| GET    | `/auth/me`       | Sim       | Dados do usuário do token          |

### Produtos (`/api/produtos`) — privadas

| Método | Rota             | Descrição                          |
| ------ | ---------------- | ---------------------------------- |
| GET    | `/produtos`      | Lista produtos (busca: `?busca=`)  |
| GET    | `/produtos/:id`  | Detalha um produto                 |
| POST   | `/produtos`      | Cria produto                       |
| PUT    | `/produtos/:id`  | Atualiza produto                   |
| DELETE | `/produtos/:id`  | Remove produto                     |

### Baixas (`/api/baixas`) — privadas

| Método | Rota         | Descrição                                  |
| ------ | ------------ | ------------------------------------------ |
| GET    | `/baixas`    | Histórico de baixas                        |
| POST   | `/baixas`    | Registra baixa e abate o estoque           |

### Usuários (`/api/usuarios`) — privadas, apenas admin

| Método | Rota             | Descrição                          |
| ------ | ---------------- | ---------------------------------- |
| GET    | `/usuarios`      | Lista usuários (busca: `?busca=`)  |
| POST   | `/usuarios`      | Cria usuário                       |
| PUT    | `/usuarios/:id`  | Atualiza dados / papel / status    |
| DELETE | `/usuarios/:id`  | Remove usuário                     |

## Exemplos com curl

```bash
# Login
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@estoque.com","senha":"admin123"}'

# Listar produtos (use o token retornado acima)
curl http://localhost:3333/api/produtos \
  -H "Authorization: Bearer SEU_TOKEN"
```
