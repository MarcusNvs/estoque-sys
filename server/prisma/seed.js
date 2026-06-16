import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpa as tabelas para um seed idempotente
  await prisma.baixa.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.usuario.deleteMany();

  const senhaAdmin = await bcrypt.hash("admin123", 10);
  const senhaJoao = await bcrypt.hash("joao123", 10);
  const senhaAna = await bcrypt.hash("ana123", 10);

  await prisma.usuario.createMany({
    data: [
      { nome: "Admin Principal", email: "admin@estoque.com", senha: senhaAdmin, papel: "admin", status: "Ativo" },
      { nome: "Operador João", email: "joao@estoque.com", senha: senhaJoao, papel: "operador", status: "Ativo" },
      { nome: "Ana Costa", email: "ana@estoque.com", senha: senhaAna, papel: "operador", status: "Inativo" },
    ],
  });

  await prisma.produto.createMany({
    data: [
      { nome: 'Monitor 24" Full HD', categoria: "Hardware", qtd: 15, preco: 899.9 },
      { nome: "Teclado mecânico RGB", categoria: "Periférico", qtd: 8, preco: 349.0 },
      { nome: "Cadeira ergonômica", categoria: "Mobiliário", qtd: 3, preco: 1249.0 },
      { nome: "Cabo HDMI 2m", categoria: "Cabos", qtd: 30, preco: 49.9 },
      { nome: "Papel A4 resma", categoria: "Papelaria", qtd: 5, preco: 29.9 },
      { nome: "Cabo USB-C 2m", categoria: "Cabos", qtd: 2, preco: 59.9 },
      { nome: "Notebook i7 16GB", categoria: "Hardware", qtd: 4, preco: 5499.0 },
      { nome: "Mouse sem fio", categoria: "Periférico", qtd: 22, preco: 129.0 },
    ],
  });

  console.log("Seed concluido com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
