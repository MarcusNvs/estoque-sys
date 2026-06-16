import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { autenticar, apenasAdmin } from "../middleware/auth.js";

const router = Router();

// Gestao de usuarios e restrita a administradores
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

// GET /api/usuarios  (lista, com busca opcional ?busca=)
router.get("/", async (req, res) => {
  const { busca } = req.query;
  const usuarios = await prisma.usuario.findMany({
    where: busca
      ? { OR: [{ nome: { contains: busca } }, { email: { contains: busca } }] }
      : undefined,
    orderBy: { id: "asc" },
  });
  return res.json(usuarios.map(formatar));
});

// POST /api/usuarios  (cria usuario)
router.post("/", async (req, res) => {
  const { nome, email, senha, papel } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha nome, e-mail e senha." });
  }
  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    return res.status(409).json({ erro: "E-mail ja cadastrado." });
  }
  const hash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: hash, papel: papel === "admin" ? "admin" : "operador" },
  });
  return res.status(201).json(formatar(usuario));
});

// PUT /api/usuarios/:id  (atualiza dados, papel ou status)
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existente = await prisma.usuario.findUnique({ where: { id } });
  if (!existente) {
    return res.status(404).json({ erro: "Usuario nao encontrado." });
  }

  const { nome, email, papel, status, senha } = req.body;
  const data = {};
  if (nome !== undefined) data.nome = nome;
  if (email !== undefined) data.email = email;
  if (papel !== undefined) data.papel = papel === "admin" ? "admin" : "operador";
  if (status !== undefined) data.status = status === "Inativo" ? "Inativo" : "Ativo";
  if (senha) data.senha = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.update({ where: { id }, data });
  return res.json(formatar(usuario));
});

// DELETE /api/usuarios/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existente = await prisma.usuario.findUnique({ where: { id } });
  if (!existente) {
    return res.status(404).json({ erro: "Usuario nao encontrado." });
  }
  if (id === req.usuario.id) {
    return res.status(400).json({ erro: "Voce nao pode remover a propria conta." });
  }
  await prisma.usuario.delete({ where: { id } });
  return res.status(204).send();
});

export default router;
