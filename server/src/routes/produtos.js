import { Router } from "express";
import prisma from "../prisma.js";
import { autenticar, autorizar } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/erros.js";
import { comStatus } from "../utils/status.js";
import { produtoSchemas, schemaPaginacao } from "../validators/index.js";
import { montarResposta } from "../utils/paginacao.js";

const router = Router();

router.use(autenticar);

const queryProdutos = schemaPaginacao(
  ["id", "nome", "categoria", "qtd", "preco"],
  "id"
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { page, limit, busca, sort, order } = queryProdutos.parse(req.query);

    const where = busca
      ? { OR: [{ nome: { contains: busca } }, { categoria: { contains: busca } }] }
      : undefined;

    const [total, produtos] = await Promise.all([
      prisma.produto.count({ where }),
      prisma.produto.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json(montarResposta({ dados: produtos.map(comStatus), total, page, limit }));
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const produto = await prisma.produto.findUnique({ where: { id: Number(req.params.id) } });
    if (!produto) throw new AppError(404, "Produto não encontrado.");
    res.json(comStatus(produto));
  })
);

router.post(
  "/",
  autorizar("admin"),
  asyncHandler(async (req, res) => {
    const dados = produtoSchemas.criar.parse(req.body);
    const produto = await prisma.produto.create({ data: dados });
    res.status(201).json(comStatus(produto));
  })
);

router.put(
  "/:id",
  autorizar("admin"),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const dados = produtoSchemas.atualizar.parse(req.body);
    const produto = await prisma.produto.update({ where: { id }, data: dados });
    res.json(comStatus(produto));
  })
);

router.delete(
  "/:id",
  autorizar("admin"),
  asyncHandler(async (req, res) => {
    await prisma.produto.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  })
);

export default router;
