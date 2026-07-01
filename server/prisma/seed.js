import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.baixa.deleteMany();
  await prisma.convite.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.usuario.deleteMany();

  const senhaAdmin = await bcrypt.hash("admin123", 10);
  const senhaJoao = await bcrypt.hash("joao123", 10);
  const senhaAna = await bcrypt.hash("ana123", 10);
  const senhaBia = await bcrypt.hash("bia123", 10);

  const admin = await prisma.usuario.create({
    data: { nome: "Admin Principal", email: "admin@estoque.com", senha: senhaAdmin, papel: "admin", status: "Ativo" },
  });
  await prisma.usuario.createMany({
    data: [
      { nome: "Operador João", email: "joao@estoque.com", senha: senhaJoao, papel: "operador", status: "Ativo" },
      { nome: "Ana Costa", email: "ana@estoque.com", senha: senhaAna, papel: "operador", status: "Inativo" },
      { nome: "Bia Lima", email: "bia@estoque.com", senha: senhaBia, papel: "visualizador", status: "Ativo" },
    ],
  });

  await prisma.produto.createMany({
    data: [
      { nome: 'Monitor 24" Full HD', categoria: "Hardware", qtd: 15, preco: 899.9, estoqueMinimo: 5 },
      { nome: "Teclado mecânico RGB", categoria: "Periférico", qtd: 8, preco: 349.0, estoqueMinimo: 10 },
      { nome: "Cadeira ergonômica", categoria: "Mobiliário", qtd: 3, preco: 1249.0, estoqueMinimo: 4 },
      { nome: "Cabo HDMI 2m", categoria: "Cabos", qtd: 30, preco: 49.9, estoqueMinimo: 10 },
      { nome: "Papel A4 resma", categoria: "Papelaria", qtd: 5, preco: 29.9, estoqueMinimo: 8 },
      { nome: "Cabo USB-C 2m", categoria: "Cabos", qtd: 2, preco: 59.9, estoqueMinimo: 10 },
      { nome: "Notebook i7 16GB", categoria: "Hardware", qtd: 4, preco: 5499.0, estoqueMinimo: 3 },
      { nome: "Mouse sem fio", categoria: "Periférico", qtd: 22, preco: 129.0, estoqueMinimo: 8 },
    ],
  });

  await prisma.convite.create({
    data: {
      email: "novo.operador@estoque.com",
      papel: "operador",
      token: randomBytes(24).toString("hex"),
      status: "Pendente",
      expiraEm: new Date(Date.now() + 72 * 60 * 60 * 1000),
      convidadoPorId: admin.id,
    },
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
