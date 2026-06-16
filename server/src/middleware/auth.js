import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo-padrao";

// Protege rotas privadas exigindo um token JWT valido no header Authorization
export function autenticar(req, res, next) {
  const header = req.headers.authorization || "";
  const [tipo, token] = header.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Token nao fornecido." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ erro: "Token invalido ou expirado." });
  }
}

// Restringe a rota a usuarios com papel de administrador
export function apenasAdmin(req, res, next) {
  if (req.usuario?.papel !== "admin") {
    return res.status(403).json({ erro: "Acesso restrito a administradores." });
  }
  next();
}

export function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email, papel: usuario.papel },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
