-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "qsPartner1" TEXT,
ADD COLUMN     "qsPartner2" TEXT,
ADD COLUMN     "qsPartner3" TEXT,
ADD COLUMN     "qsPartner4" TEXT,
ADD COLUMN     "qsPartnersTitle" TEXT NOT NULL DEFAULT 'Parceiros';
