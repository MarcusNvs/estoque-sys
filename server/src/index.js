import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import produtosRoutes from "./routes/produtos.js";
import baixasRoutes from "./routes/baixas.js";
import usuariosRoutes from "./routes/usuarios.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rota raiz: pagina informativa da API
app.get("/", (req, res) =>
  res.json({
    api: "Estoque.sys",
    status: "online",
    endpoints: ["/api/health", "/api/auth", "/api/produtos", "/api/baixas", "/api/usuarios"],
  })
);

// Rota de saude
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtosRoutes);
app.use("/api/baixas", baixasRoutes);
app.use("/api/usuarios", usuariosRoutes);

// Tratador de erros generico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
