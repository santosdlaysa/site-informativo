-- Categorias dinâmicas: troca o campo de texto `category` por uma FK `categoryId`
-- em ProgramSession e Event, preservando os dados existentes (backfill por nome).

-- AlterTable: adiciona a coluna de FK (nullable)
ALTER TABLE "ProgramSession" ADD COLUMN "categoryId" TEXT;
ALTER TABLE "Event" ADD COLUMN "categoryId" TEXT;

-- Backfill: mapeia o texto da categoria para o id da Category de mesmo nome
UPDATE "ProgramSession" s SET "categoryId" = c."id" FROM "Category" c WHERE s."category" = c."name";
UPDATE "Event" e SET "categoryId" = c."id" FROM "Category" c WHERE e."category" = c."name";

-- DropColumn: remove o antigo campo de texto
ALTER TABLE "ProgramSession" DROP COLUMN "category";
ALTER TABLE "Event" DROP COLUMN "category";

-- CreateIndex
CREATE INDEX "ProgramSession_categoryId_idx" ON "ProgramSession"("categoryId");
CREATE INDEX "Event_categoryId_idx" ON "Event"("categoryId");

-- AddForeignKey
ALTER TABLE "ProgramSession" ADD CONSTRAINT "ProgramSession_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
