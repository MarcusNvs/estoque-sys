import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export class AppError extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: "Rota não encontrada." });
}

export function tratadorDeErros(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      erro: "Dados inválidos.",
      detalhes: err.issues.map((i) => ({
        campo: i.path.join("."),
        mensagem: i.message,
      })),
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({ erro: err.message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ erro: "Registro já existente." });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ erro: "Registro não encontrado." });
    }
  }

  console.error(err);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}
