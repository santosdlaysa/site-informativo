ALTER TABLE "SiteSettings"
ADD COLUMN "contactEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN "contactPhone" TEXT NOT NULL DEFAULT '';

UPDATE "SiteSettings"
SET
  "contactEmail" = 'adsocial.projetoacdg@gmail.com',
  "contactPhone" = '(95) 98123-8294'
WHERE "companyId" = 'segunda-empresa';
