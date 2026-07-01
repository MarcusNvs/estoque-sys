import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./erros.js";

export function autenticar(req, res, next) {
  const header = req.headers.authorization || "";
  const [tipo, token] = header.split(" ");

  if (tipo !== "Bearer" || !token) {
    return next(new AppError(401, "Token não fornecido."));
  }

  try {
    req.usuario = jwt.verify(token, env.JWT_SECRET);
    next();
  } catch {
    next(new AppError(401, "Token inválido ou expirado."));
  }
}

export function autorizar(...papeis) {
  return (req, res, next) => {
    if (!papeis.includes(req.usuario?.papel)) {
      return next(new AppError(403, "Acesso restrito para o seu perfil."));
    }
    next();
  };
}

export const apenasAdmin = autorizar("admin");

export function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}
