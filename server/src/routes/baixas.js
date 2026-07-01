import { Router } from "express";
import prisma from "../prisma.js";
import { autenticar, autorizar } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/erros.js";
import { baixaSchemas, schemaPaginacao } from "../validators/index.js";
import { montarResposta } from "../utils/paginacao.js";

const router = Router();

router.use(autenticar);

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

const queryBaixas = schemaPaginacao(["id", "quantidade", "criadoEm"], "criadoEm");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page, limit, sort, order } = queryBaixas.parse(req.query);

    const [total, baixas] = await Promise.all([
      prisma.baixa.count(),
      prisma.baixa.findMany({
        include: { produto: true, usuario: true },
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json(montarResposta({ dados: baixas.map(formatar), total, page, limit }));
  })
);

router.post(
  "/",
  autorizar("admin", "operador"),
  asyncHandler(async (req, res) => {
    const { produtoId, quantidade, motivo } = baixaSchemas.criar.parse(req.body);

    const baixa = await prisma.$transaction(async (tx) => {
      const atualizados = await tx.produto.updateMany({
        where: { id: produtoId, qtd: { gte: quantidade } },
        data: { qtd: { decrement: quantidade } },
      });

      if (atualizados.count === 0) {
        const produto = await tx.produto.findUnique({ where: { id: produtoId } });
        if (!produto) throw new AppError(404, "Selecione um produto válido.");
        throw new AppError(400, `Estoque insuficiente. Disponível: ${produto.qtd}`);
      }

      return tx.baixa.create({
        data: {
          produtoId,
          quantidade,
          motivo: motivo || null,
          usuarioId: req.usuario.id,
        },
        include: { produto: true, usuario: true },
      });
    });

    res.status(201).json(formatar(baixa));
  })
);

export default router;
