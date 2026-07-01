import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import prisma from "../prisma.js";
import { autenticar, gerarToken } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../middleware/erros.js";
import { authSchemas } from "../validators/index.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: "Muitas tentativas de acesso. Tente novamente em alguns minutos." },
});

function semSenha(usuario) {
  const { senha, ...dados } = usuario;
  return dados;
}

router.post(
  "/cadastro",
  asyncHandler(async (req, res) => {
    const { nome, email, senha } = authSchemas.cadastro.parse(req.body);

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) throw new AppError(409, "E-mail já cadastrado.");

    const hash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: hash, papel: "operador" },
    });

    const token = gerarToken(usuario);
    res.status(201).json({ usuario: semSenha(usuario), token });
  })
);

router.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, senha } = authSchemas.login.parse(req.body);

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new AppError(401, "E-mail ou senha inválidos.");
    if (usuario.status === "Inativo") {
      throw new AppError(403, "Usuário inativo. Contate um administrador.");
    }

    const confere = await bcrypt.compare(senha, usuario.senha);
    if (!confere) throw new AppError(401, "E-mail ou senha inválidos.");

    const token = gerarToken(usuario);
    res.json({ usuario: semSenha(usuario), token });
  })
);

router.get(
  "/me",
  autenticar,
  asyncHandler(async (req, res) => {
    const usuario = await prisma.usuario.findUnique({ where: { id: req.usuario.id } });
    if (!usuario) throw new AppError(404, "Usuário não encontrado.");
    res.json({ usuario: semSenha(usuario) });
  })
);

export default router;
