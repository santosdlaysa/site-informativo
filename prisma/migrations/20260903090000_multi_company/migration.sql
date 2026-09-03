-- Empresas: o mesmo painel pode administrar mais de um site/conjunto de conteúdo.
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");
INSERT INTO "Company" ("id", "name", "slug", "updatedAt") VALUES ('default', 'Raros Boa Vista', 'raros-boa-vista', CURRENT_TIMESTAMP);
INSERT INTO "Company" ("id", "name", "slug", "updatedAt") VALUES ('segunda-empresa', 'Segunda Empresa', 'segunda-empresa', CURRENT_TIMESTAMP);

ALTER TABLE "User" ADD COLUMN "companyId" TEXT NOT NULL DEFAULT 'default';
ALTER TABLE "Category" ADD COLUMN "companyId" TEXT NOT NULL DEFAULT 'default';
ALTER TABLE "Post" ADD COLUMN "companyId" TEXT NOT NULL DEFAULT 'default';
ALTER TABLE "ProgramSession" ADD COLUMN "companyId" TEXT NOT NULL DEFAULT 'default';
ALTER TABLE "Event" ADD COLUMN "companyId" TEXT NOT NULL DEFAULT 'default';
ALTER TABLE "CalendarDate" ADD COLUMN "companyId" TEXT NOT NULL DEFAULT 'default';
ALTER TABLE "SiteSettings" ADD COLUMN "companyId" TEXT NOT NULL DEFAULT 'default';

DROP INDEX IF EXISTS "Category_name_key";
DROP INDEX IF EXISTS "Category_slug_key";
CREATE UNIQUE INDEX "SiteSettings_companyId_key" ON "SiteSettings"("companyId");

ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Category" ADD CONSTRAINT "Category_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Post" ADD CONSTRAINT "Post_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProgramSession" ADD CONSTRAINT "ProgramSession_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CalendarDate" ADD CONSTRAINT "CalendarDate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SiteSettings" ADD CONSTRAINT "SiteSettings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "User_companyId_idx" ON "User"("companyId");
CREATE INDEX "Category_companyId_idx" ON "Category"("companyId");
CREATE INDEX "Post_companyId_idx" ON "Post"("companyId");
CREATE INDEX "ProgramSession_companyId_idx" ON "ProgramSession"("companyId");
CREATE INDEX "Event_companyId_idx" ON "Event"("companyId");
CREATE INDEX "CalendarDate_companyId_idx" ON "CalendarDate"("companyId");
