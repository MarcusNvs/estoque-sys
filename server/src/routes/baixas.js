import { Router } from "express";
import prisma from "../prisma.js";
import { autenticar } from "../middleware/auth.js";

const router = Router();

router.use(autenticar);

// Formata a baixa para o front
function formatar(baixa) {
  return {
    id: baixa.id,
    produtoId: baixa.produtoId,
    produto: baixa.produto?.nome ?? "(removido)",
    quantidade: baixa.quantidade,
    motivo: baixa.motivo || "—",
    usuario: baixa.usuario?.nome ?? null,
    data: new Date(baixa.criadoEm).toLocaleDateString("pt-BR"),
    criadoEm: baixa.criadoEm,
  };
}

// GET /api/baixas  (historico, mais recentes primeiro)
router.get("/", async (req, res) => {
  const baixas = await prisma.baixa.findMany({
    include: { produto: true, usuario: true },
    orderBy: { criadoEm: "desc" },
  });
  return res.json(baixas.map(formatar));
});

// POST /api/baixas  (registra baixa e abate do estoque)
router.post("/", async (req, res) => {
  const { produtoId, quantidade, motivo } = req.body;
  const qtd = parseInt(quantidade, 10);

  const produto = await prisma.produto.findUnique({ where: { id: Number(produtoId) } });
  if (!produto) {
    return res.status(404).json({ erro: "Selecione um produto valido." });
  }
  if (Number.isNaN(qtd) || qtd <= 0) {
    return res.status(400).json({ erro: "Informe uma quantidade valida." });
  }
  if (qtd > produto.qtd) {
    return res.status(400).json({ erro: `Estoque insuficiente. Disponivel: ${produto.qtd}` });
  }

  // Cria a baixa e abate o estoque de forma atomica
  const [baixa] = await prisma.$transaction([
    prisma.baixa.create({
      data: {
        produtoId: produto.id,
        quantidade: qtd,
        motivo: motivo || null,
        usuarioId: req.usuario.id,
      },
      include: { produto: true, usuario: true },
    }),
    prisma.produto.update({
      where: { id: produto.id },
      data: { qtd: produto.qtd - qtd },
    }),
  ]);

  return res.status(201).json(formatar(baixa));
});

export default router;
