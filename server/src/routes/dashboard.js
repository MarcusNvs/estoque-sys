import { Router } from "express";
import prisma from "../prisma.js";
import { autenticar } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/erros.js";
import { comStatus } from "../utils/status.js";

const router = Router();

router.use(autenticar);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const [produtos, totalUsuarios, convitesPendentes, baixasMes, ultimasBaixas] =
      await Promise.all([
        prisma.produto.findMany(),
        prisma.usuario.count(),
        prisma.convite.count({ where: { status: "Pendente" } }),
        prisma.baixa.count({ where: { criadoEm: { gte: inicioMes } } }),
        prisma.baixa.findMany({
          include: { produto: true, usuario: true },
          orderBy: { criadoEm: "desc" },
          take: 6,
        }),
      ]);

    const comInfo = produtos.map(comStatus);
    const criticos = comInfo.filter((p) => p.status === "Crítico").length;
    const abaixoDoMinimo = comInfo.filter((p) => p.abaixoDoMinimo);
    const valorTotal = comInfo.reduce((acc, p) => acc + p.qtd * p.preco, 0);

    res.json({
      metricas: {
        totalProdutos: produtos.length,
        estoqueBaixo: abaixoDoMinimo.length,
        criticos,
        baixasMes,
        totalUsuarios,
        convitesPendentes,
        valorTotalEstoque: valorTotal,
      },
      alertas: abaixoDoMinimo
        .sort((a, b) => a.qtd - b.qtd)
        .slice(0, 6)
        .map((p) => ({ id: p.id, produto: p.nome, qtd: p.qtd, tipo: p.status })),
      ultimasMovimentacoes: ultimasBaixas.map((b) => ({
        id: b.id,
        produto: b.produto?.nome ?? "(removido)",
        qtd: b.quantidade,
        data: new Date(b.criadoEm).toLocaleDateString("pt-BR"),
        usuario: b.usuario?.nome ?? "—",
      })),
    });
  })
);

export default router;
