-- AlterTable: logos adicionais da Realização (slots 2 a 4), seguindo o padrão dos Parceiros
ALTER TABLE "SiteSettings" ADD COLUMN     "qsRealizacaoLogo2" TEXT,
ADD COLUMN     "qsRealizacaoLogo3" TEXT,
ADD COLUMN     "qsRealizacaoLogo4" TEXT;
