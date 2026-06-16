import { Router } from "express";
import prisma from "../prisma.js";
import { autenticar } from "../middleware/auth.js";
import { comStatus } from "../utils/status.js";

const router = Router();

// Todas as rotas de produto sao privadas
router.use(autenticar);

// GET /api/produtos  (lista, com busca opcional ?busca=)
router.get("/", async (req, res) => {
  const { busca } = req.query;

  const produtos = await prisma.produto.findMany({
    where: busca
      ? {
          OR: [
            { nome: { contains: busca } },
            { categoria: { contains: busca } },
          ],
        }
      : undefined,
    orderBy: { id: "asc" },
  });

  return res.json(produtos.map(comStatus));
});

// GET /api/produtos/:id
router.get("/:id", async (req, res) => {
  const produto = await prisma.produto.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!produto) {
    return res.status(404).json({ erro: "Produto nao encontrado." });
  }
  return res.json(comStatus(produto));
});

// POST /api/produtos
router.post("/", async (req, res) => {
  const { nome, categoria, qtd, preco } = req.body;

  if (!nome || !categoria || qtd === undefined || preco === undefined) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }
  const qtdNum = parseInt(qtd, 10);
  const precoNum = parseFloat(preco);
  if (Number.isNaN(qtdNum) || qtdNum < 0) {
    return res.status(400).json({ erro: "Quantidade invalida." });
  }
  if (Number.isNaN(precoNum) || precoNum < 0) {
    return res.status(400).json({ erro: "Preco invalido." });
  }

  const produto = await prisma.produto.create({
    data: { nome, categoria, qtd: qtdNum, preco: precoNum },
  });
  return res.status(201).json(comStatus(produto));
});

// PUT /api/produtos/:id
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existente = await prisma.produto.findUnique({ where: { id } });
  if (!existente) {
    return res.status(404).json({ erro: "Produto nao encontrado." });
  }

  const { nome, categoria, qtd, preco } = req.body;
  const data = {};

  if (nome !== undefined) data.nome = nome;
  if (categoria !== undefined) data.categoria = categoria;
  if (qtd !== undefined) {
    const qtdNum = parseInt(qtd, 10);
    if (Number.isNaN(qtdNum) || qtdNum < 0) {
      return res.status(400).json({ erro: "Quantidade invalida." });
    }
    data.qtd = qtdNum;
  }
  if (preco !== undefined) {
    const precoNum = parseFloat(preco);
    if (Number.isNaN(precoNum) || precoNum < 0) {
      return res.status(400).json({ erro: "Preco invalido." });
    }
    data.preco = precoNum;
  }

  const produto = await prisma.produto.update({ where: { id }, data });
  return res.json(comStatus(produto));
});

// DELETE /api/produtos/:id
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const existente = await prisma.produto.findUnique({ where: { id } });
  if (!existente) {
    return res.status(404).json({ erro: "Produto nao encontrado." });
  }
  await prisma.produto.delete({ where: { id } });
  return res.status(204).send();
});

export default router;
