# Estoque.sys Back-end

API REST do sistema de gestão de estoque, construída com **Node.js + Express**, **Prisma ORM** e **SQLite**, com autenticação via **JWT** e proteção das rotas privadas.

## Stack

- Node.js + Express
- Prisma ORM
- SQLite (arquivo `prisma/dev.db`)
- JSON Web Token (autenticação)
- bcryptjs (hash de senhas)
- Zod (validação das entradas)
- express-rate-limit (proteção do login)

## Melhorias aplicadas (feedback do Trabalho 2)

- **Validação com Zod**: todas as entradas (auth, produtos, baixas, usuários, convites) são validadas por schemas em `src/validators`.
- **Tratamento centralizado de erros**: um único middleware (`src/middleware/erros.js`) padroniza respostas de validação, erros de banco (Prisma) e falhas inesperadas.
- **Baixa atômica**: a checagem de saldo e o abatimento ocorrem em uma transação com atualização condicional (`updateMany` com `qtd >= quantidade`), impedindo estoque negativo mesmo com acessos simultâneos.
- **Ambiente seguro**: as variáveis são validadas na inicialização (`src/config/env.js`); a aplicação não sobe sem um `JWT_SECRET` válido. Veja `.env.example`.
- **Proteção do login**: limite de tentativas por IP na rota `/api/auth/login`.
- **Paginação, filtros e ordenação** nas listagens de produtos, usuários e baixas.
- **Ponto de reposição**: campo `estoqueMinimo` por produto e alertas de itens abaixo do mínimo.
- **Convite de usuários por token**: geração de convite com expiração e link local de aceite.
- **Papéis**: `admin`, `operador` e `visualizador`, com autorização por rota.
- **Dashboard com dados reais**: rota `/api/dashboard` agrega métricas, alertas e últimas movimentações.

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
| admin@estoque.com   | admin123  | admin        | Ativo   |
| joao@estoque.com    | joao123   | operador     | Ativo   |
| ana@estoque.com     | ana123    | operador     | Inativo |
| bia@estoque.com     | bia123    | visualizador | Ativo   |

## Variáveis de ambiente (`.env`)

Copie `.env.example` para `.env` e ajuste os valores. Todas são validadas na inicialização.

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="defina-um-segredo-forte-com-ao-menos-16-caracteres"
JWT_EXPIRES_IN="7d"
PORT=3333
APP_URL="http://localhost:5173"
CONVITE_EXPIRA_HORAS=72
```

- `JWT_SECRET` é obrigatória e deve ter ao menos 16 caracteres (sem valor padrão inseguro no código).
- `APP_URL` é usada para montar o link de aceite dos convites.
- `CONVITE_EXPIRA_HORAS` define a validade de cada convite.

O convite é entregue por **link local**: ao criar um convite, a API retorna o campo `link`, que o administrador copia e envia ao convidado (não há dependência de serviço externo de e-mail).

## Modelo de dados

- **Usuario**: id, nome, email (único), senha (hash), papel (`admin` | `operador` | `visualizador`), status (`Ativo` | `Inativo`), criadoEm
- **Produto**: id, nome, categoria, qtd, preco, `estoqueMinimo`, criadoEm. Os campos `status` (`Normal` | `Baixo` | `Crítico`) e `abaixoDoMinimo` são calculados a partir da quantidade e do estoque mínimo.
- **Baixa**: id, quantidade, motivo, criadoEm, vínculo com Produto e Usuario. Registrar uma baixa abate o estoque do produto de forma atômica.
- **Convite**: id, email, papel, token (único), status (`Pendente` | `Aceito` | `Expirado` | `Cancelado`), expiraEm, aceitoEm, convidadoPor.

## Autenticação e papéis

O login e o cadastro retornam um `token` JWT. As rotas privadas exigem o header:

```
Authorization: Bearer <token>
```

- `admin`: cadastra produtos, gerencia usuários e convites, registra baixas.
- `operador`: registra baixas e consulta o estoque.
- `visualizador`: apenas consulta produtos, baixas e dashboard.

## Formato das listagens

As rotas de listagem aceitam `?page`, `?limit`, `?sort`, `?order` e `?busca` e retornam:

```json
{ "dados": [ ... ], "paginacao": { "total": 8, "page": 1, "limit": 20, "totalPaginas": 1, "temProxima": false, "temAnterior": false } }
```

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

### Convites (`/api/convites`)

| Método | Rota                    | Protegida    | Descrição                                   |
| ------ | ----------------------- | ------------ | ------------------------------------------- |
| GET    | `/convites/token/:token`| Não          | Consulta um convite pelo token              |
| POST   | `/convites/aceitar`     | Não          | Aceita o convite e cria o usuário           |
| GET    | `/convites`             | admin        | Lista convites                              |
| POST   | `/convites`             | admin        | Gera convite (retorna `link` de aceite)     |
| DELETE | `/convites/:id`         | admin        | Cancela o convite                           |

### Dashboard (`/api/dashboard`) — privada

| Método | Rota          | Descrição                                          |
| ------ | ------------- | -------------------------------------------------- |
| GET    | `/dashboard`  | Métricas, alertas de estoque e últimas movimentações |

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
