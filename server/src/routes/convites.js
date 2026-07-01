import { Router } from "express";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { env } from "../config/env.js";
import { autenticar, apenasAdmin, gerarToken } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/erros.js";
import { conviteSchemas } from "../validators/index.js";

const router = Router();

function statusAtual(convite) {
  if (convite.status === "Pendente" && convite.expiraEm < new Date()) {
    return "Expirado";
  }
  return convite.status;
}

function formatar(convite) {
  return {
    id: convite.id,
    email: convite.email,
    papel: convite.papel,
    status: statusAtual(convite),
    enviado: new Date(convite.criadoEm).toLocaleDateString("pt-BR"),
    expiraEm: convite.expiraEm,
    link: `${env.APP_URL}/?convite=${convite.token}`,
  };
}

router.get(
  "/token/:token",
  asyncHandler(async (req, res) => {
    const convite = await prisma.convite.findUnique({ where: { token: req.params.token } });
    if (!convite) throw new AppError(404, "Convite não encontrado.");
    res.json({
      email: convite.email,
      papel: convite.papel,
      status: statusAtual(convite),
    });
  })
);

router.post(
  "/aceitar",
  asyncHandler(async (req, res) => {
    const { token, nome, senha } = conviteSchemas.aceitar.parse(req.body);

    const convite = await prisma.convite.findUnique({ where: { token } });
    if (!convite) throw new AppError(404, "Convite não encontrado.");
    if (statusAtual(convite) !== "Pendente") {
      throw new AppError(409, "Este convite não está mais disponível.");
    }

    const jaExiste = await prisma.usuario.findUnique({ where: { email: convite.email } });
    if (jaExiste) throw new AppError(409, "Já existe uma conta com este e-mail.");

    const hash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.$transaction(async (tx) => {
      const novo = await tx.usuario.create({
        data: { nome, email: convite.email, senha: hash, papel: convite.papel },
      });
      await tx.convite.update({
        where: { id: convite.id },
        data: { status: "Aceito", aceitoEm: new Date() },
      });
      return novo;
    });

    const jwtToken = gerarToken(usuario);
    const { senha: _, ...dados } = usuario;
    res.status(201).json({ usuario: dados, token: jwtToken });
  })
);

router.use(autenticar, apenasAdmin);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const convites = await prisma.convite.findMany({ orderBy: { criadoEm: "desc" } });
    res.json(convites.map(formatar));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email, papel } = conviteSchemas.criar.parse(req.body);

    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) throw new AppError(409, "Já existe uma conta com este e-mail.");

    const pendente = await prisma.convite.findFirst({
      where: { email, status: "Pendente" },
    });
    if (pendente && pendente.expiraEm > new Date()) {
      throw new AppError(409, "Já existe um convite pendente para este e-mail.");
    }

    const token = randomBytes(24).toString("hex");
    const expiraEm = new Date(Date.now() + env.CONVITE_EXPIRA_HORAS * 60 * 60 * 1000);

    const convite = await prisma.convite.create({
      data: { email, papel, token, expiraEm, convidadoPorId: req.usuario.id },
    });

    res.status(201).json(formatar(convite));
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    await prisma.convite.update({ where: { id }, data: { status: "Cancelado" } });
    res.status(204).send();
  })
);

export default router;
