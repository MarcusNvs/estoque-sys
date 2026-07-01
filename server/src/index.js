import { env } from "./config/env.js";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import produtosRoutes from "./routes/produtos.js";
import baixasRoutes from "./routes/baixas.js";
import usuariosRoutes from "./routes/usuarios.js";
import convitesRoutes from "./routes/convites.js";
import dashboardRoutes from "./routes/dashboard.js";
import { rotaNaoEncontrada, tratadorDeErros } from "./middleware/erros.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({
    api: "Estoque.sys",
    status: "online",
    endpoints: [
      "/api/health",
      "/api/auth",
      "/api/produtos",
      "/api/baixas",
      "/api/usuarios",
      "/api/convites",
      "/api/dashboard",
    ],
  })
);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtosRoutes);
app.use("/api/baixas", baixasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/convites", convitesRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(rotaNaoEncontrada);
app.use(tratadorDeErros);

app.listen(env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${env.PORT}`);
});
