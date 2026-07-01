import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória."),
  JWT_SECRET: z
    .string({ required_error: "JWT_SECRET é obrigatória." })
    .min(16, "JWT_SECRET deve ter ao menos 16 caracteres."),
  JWT_EXPIRES_IN: z.string().default("7d"),
  PORT: z.coerce.number().int().positive().default(3333),
  APP_URL: z.string().url().default("http://localhost:5173"),
  CONVITE_EXPIRA_HORAS: z.coerce.number().int().positive().default(72),
});

const resultado = schema.safeParse(process.env);

if (!resultado.success) {
  const detalhes = resultado.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  console.error(
    `\nConfiguração de ambiente inválida. Verifique o arquivo .env (use .env.example como base):\n${detalhes}\n`
  );
  process.exit(1);
}

export const env = resultado.data;
