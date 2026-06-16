# Estoque.sys

Sistema de gestão de estoque com **front-end React (Vite)** e **back-end Node.js (Express + Prisma + SQLite)**.

O front-end consome a API real do back-end: autenticação por JWT, CRUD de produtos, registro de baixas com abatimento de estoque e gestão de usuários.

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

| E-mail            | Senha    | Papel    |
| ----------------- | -------- | -------- |
| admin@estoque.com | admin123 | admin    |
| joao@estoque.com  | joao123  | operador |

A documentação completa da API está em [`server/README.md`](./server/README.md).
