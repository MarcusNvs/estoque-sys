import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma.js";
import { autenticar, gerarToken } from "../middleware/auth.js";

const router = Router();

// Remove a senha antes de devolver o usuario ao cliente
function semSenha(usuario) {
  const { senha, ...dados } = usuario;
  return dados;
}

// POST /api/auth/cadastro
router.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: "A senha deve ter ao menos 6 caracteres." });
  }

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    return res.status(409).json({ erro: "E-mail ja cadastrado." });
  }

  const hash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: hash, papel: "operador" },
  });

  const token = gerarToken(usuario);
  return res.status(201).json({ usuario: semSenha(usuario), token });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    return res.status(401).json({ erro: "E-mail ou senha invalidos." });
  }
  if (usuario.status === "Inativo") {
    return res.status(403).json({ erro: "Usuario inativo. Contate um administrador." });
  }

  const confere = await bcrypt.compare(senha, usuario.senha);
  if (!confere) {
    return res.status(401).json({ erro: "E-mail ou senha invalidos." });
  }

  const token = gerarToken(usuario);
  return res.json({ usuario: semSenha(usuario), token });
});

// GET /api/auth/me  (retorna o usuario do token)
router.get("/me", autenticar, async (req, res) => {
  const usuario = await prisma.usuario.findUnique({ where: { id: req.usuario.id } });
  if (!usuario) {
    return res.status(404).json({ erro: "Usuario nao encontrado." });
  }
  return res.json({ usuario: semSenha(usuario) });
});

export default router;
