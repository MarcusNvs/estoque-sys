# Estoque.sys

Sistema de gestão de estoque com **front-end React (Vite)** e **back-end Node.js (Express + Prisma + SQLite)**.

O front-end consome a API real do back-end: autenticação por JWT, CRUD de produtos, registro de baixas com abatimento de estoque, gestão de usuários, convites por link, ponto de reposição e um dashboard alimentado por dados reais.

## Destaques desta versão

- Validação das entradas com **Zod** e **tratamento centralizado de erros** no back-end.
- **Baixa de estoque atômica** (transação com atualização condicional), evitando saldo negativo em acessos simultâneos.
- **Ambiente seguro**: variáveis validadas na inicialização, sem `JWT_SECRET` padrão no código (`server/.env.example`).
- **Proteção do login** com limite de tentativas e **paginação/filtros/ordenação** nas listagens.
- **Ponto de reposição** (`estoqueMinimo`) com alertas no dashboard.
- **Convite de usuários por token**: o admin gera um link local de aceite; o convidado define nome e senha e já entra no sistema.
- **Papéis** `admin`, `operador` e `visualizador` com autorização por rota.
- **Dashboard** consumindo métricas, alertas e movimentações reais da API.

## Estrutura

```
estoque-sys/
├── src/              front-end React (Vite)
│   ├── services/     camada de comunicação com a API (fetch + JWT)
│   ├── contexts/     AuthContext (login, sessão, token)
│   └── pages/        telas (Login, Cadastro, Estoque, Gerenc. Usuários...)
└── server/           back-end (Express + Prisma + SQLite)
    ├── prisma/       schema, migrations e seed
    └── src/          rotas, middleware de autenticação e utilitários
```

## Como rodar (dois terminais)

### 1. Back-end

```bash
cd server
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev          # http://localhost:3333
```

### 2. Front-end

```bash
npm install
npm run dev          # http://localhost:5173
```

O Vite encaminha as chamadas `/api` para o back-end (proxy configurado em `vite.config.js`), então basta abrir o front no navegador.

## Acesso

| E-mail            | Senha    | Papel        |
| ----------------- | -------- | ------------ |
| admin@estoque.com | admin123 | admin        |
| joao@estoque.com  | joao123  | operador     |
| bia@estoque.com   | bia123   | visualizador |

A documentação completa da API está em [`server/README.md`](./server/README.md).
