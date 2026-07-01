import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { autenticar, apenasAdmin } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/erros.js";
import { usuarioSchemas, schemaPaginacao } from "../validators/index.js";
import { montarResposta } from "../utils/paginacao.js";

const router = Router();

router.use(autenticar, apenasAdmin);

function formatar(u) {
  return {
    id: u.id,
    nome: u.nome,
    email: u.email,
    papel: u.papel,
    status: u.status,
    cadastro: new Date(u.criadoEm).toLocaleDateString("pt-BR"),
  };
}

const queryUsuarios = schemaPaginacao(["id", "nome", "email", "papel"], "id");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page, limit, busca, sort, order } = queryUsuarios.parse(req.query);

    const where = busca
      ? { OR: [{ nome: { contains: busca } }, { email: { contains: busca } }] }
      : undefined;

    const [total, usuarios] = await Promise.all([
      prisma.usuario.count({ where }),
      prisma.usuario.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json(montarResposta({ dados: usuarios.map(formatar), total, page, limit }));
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { nome, email, senha, papel } = usuarioSchemas.criar.parse(req.body);

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) throw new AppError(409, "E-mail já cadastrado.");

    const hash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: hash, papel },
    });
    res.status(201).json(formatar(usuario));
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { nome, email, papel, status, senha } = usuarioSchemas.atualizar.parse(req.body);

    const data = {};
    if (nome !== undefined) data.nome = nome;
    if (email !== undefined) data.email = email;
    if (papel !== undefined) data.papel = papel;
    if (status !== undefined) data.status = status;
    if (senha) data.senha = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.update({ where: { id }, data });
    res.json(formatar(usuario));
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (id === req.usuario.id) {
      throw new AppError(400, "Você não pode remover a própria conta.");
    }
    await prisma.usuario.delete({ where: { id } });
    res.status(204).send();
  })
);

export default router;
