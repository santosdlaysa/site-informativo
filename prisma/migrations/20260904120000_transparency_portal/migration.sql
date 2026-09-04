ALTER TABLE "SiteSettings"
ADD COLUMN "transparencyTitle" TEXT NOT NULL DEFAULT 'Portal da Transparência',
ADD COLUMN "transparencyDescription" TEXT NOT NULL DEFAULT 'Acompanhe documentos, relatórios e informações institucionais do ADSocial.';

CREATE TABLE "TransparencyDocument" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "referenceYear" INTEGER,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileData" BYTEA NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    CONSTRAINT "TransparencyDocument_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TransparencyDocument_companyId_published_idx" ON "TransparencyDocument"("companyId", "published");
CREATE INDEX "TransparencyDocument_referenceYear_idx" ON "TransparencyDocument"("referenceYear");

ALTER TABLE "TransparencyDocument"
ADD CONSTRAINT "TransparencyDocument_companyId_fkey"
FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
