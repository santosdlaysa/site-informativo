-- AlterTable: créditos da seção (Realização / Parcerias Institucionais)
ALTER TABLE "SiteSettings" ADD COLUMN     "qsRealizacao" TEXT NOT NULL DEFAULT 'ACDG Brasil',
ADD COLUMN     "qsParcerias" TEXT NOT NULL DEFAULT 'AD Social e Secretaria de Saúde de Boa Vista';
