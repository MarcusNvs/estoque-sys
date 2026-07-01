import { z } from "zod";

export const PAPEIS = ["admin", "operador", "visualizador"];
export const STATUS_USUARIO = ["Ativo", "Inativo"];

export function validar(schema, dados) {
  return schema.parse(dados);
}

const email = z.string().trim().email("E-mail inválido.");
const senha = z.string().min(6, "A senha deve ter ao menos 6 caracteres.");
const nome = z.string().trim().min(2, "Informe um nome válido.");

export const authSchemas = {
  cadastro: z.object({ nome, email, senha }),
  login: z.object({ email, senha: z.string().min(1, "Informe a senha.") }),
};

export const produtoSchemas = {
  criar: z.object({
    nome: z.string().trim().min(1, "Informe o nome do produto."),
    categoria: z.string().trim().min(1, "Informe a categoria."),
    qtd: z.coerce.number().int("Quantidade inválida.").min(0, "Quantidade inválida."),
    preco: z.coerce.number().min(0, "Preço inválido."),
    estoqueMinimo: z.coerce.number().int().min(0, "Estoque mínimo inválido.").default(5),
  }),
  atualizar: z
    .object({
      nome: z.string().trim().min(1),
      categoria: z.string().trim().min(1),
      qtd: z.coerce.number().int().min(0),
      preco: z.coerce.number().min(0),
      estoqueMinimo: z.coerce.number().int().min(0),
    })
    .partial(),
};

export const baixaSchemas = {
  criar: z.object({
    produtoId: z.coerce.number().int().positive("Selecione um produto válido."),
    quantidade: z.coerce.number().int().positive("Informe uma quantidade válida."),
    motivo: z.string().trim().max(200).optional().or(z.literal("")),
  }),
};

export const usuarioSchemas = {
  criar: z.object({
    nome,
    email,
    senha,
    papel: z.enum(PAPEIS).default("operador"),
  }),
  atualizar: z
    .object({
      nome,
      email,
      senha,
      papel: z.enum(PAPEIS),
      status: z.enum(STATUS_USUARIO),
    })
    .partial(),
};

export const conviteSchemas = {
  criar: z.object({
    email,
    papel: z.enum(PAPEIS).default("operador"),
  }),
  aceitar: z.object({
    token: z.string().min(1, "Token do convite ausente."),
    nome,
    senha,
  }),
};

export function schemaPaginacao(ordenaveis, padrao) {
  return z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    busca: z.string().trim().optional(),
    sort: z.enum(ordenaveis).default(padrao),
    order: z.enum(["asc", "desc"]).default("asc"),
  });
}
