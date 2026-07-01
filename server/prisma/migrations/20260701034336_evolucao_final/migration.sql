-- CreateTable
CREATE TABLE "Convite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "papel" TEXT NOT NULL DEFAULT 'operador',
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "expiraEm" DATETIME NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aceitoEm" DATETIME,
    "convidadoPorId" INTEGER,
    CONSTRAINT "Convite_convidadoPorId_fkey" FOREIGN KEY ("convidadoPorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "qtd" INTEGER NOT NULL DEFAULT 0,
    "preco" REAL NOT NULL DEFAULT 0,
    "estoqueMinimo" INTEGER NOT NULL DEFAULT 5,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Produto" ("categoria", "criadoEm", "id", "nome", "preco", "qtd") SELECT "categoria", "criadoEm", "id", "nome", "preco", "qtd" FROM "Produto";
DROP TABLE "Produto";
ALTER TABLE "new_Produto" RENAME TO "Produto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Convite_token_key" ON "Convite"("token");
