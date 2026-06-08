-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heroBgImage" TEXT,
    "qsImage" TEXT,
    "heroTag" TEXT NOT NULL DEFAULT 'Fortalecimento de Vínculos',
    "heroTitle" TEXT NOT NULL DEFAULT 'Conectando famílias e
gerando redes de apoio',
    "heroDesc" TEXT NOT NULL DEFAULT 'Nossos eventos de encerramento coroam meses de esforço, disciplina e união coletiva entre pais, alunos e orientadores.',
    "heroCta1Text" TEXT NOT NULL DEFAULT 'Ver Galeria de Fotos',
    "heroCta1Href" TEXT NOT NULL DEFAULT '/acoes',
    "heroCta2Text" TEXT NOT NULL DEFAULT 'Fale Conosco',
    "heroCta2Href" TEXT NOT NULL DEFAULT '/eventos',
    "stat1Num" TEXT NOT NULL DEFAULT '150+',
    "stat1Label" TEXT NOT NULL DEFAULT 'Jovens Formados',
    "stat2Num" TEXT NOT NULL DEFAULT '85+',
    "stat2Label" TEXT NOT NULL DEFAULT 'Famílias Apoiadas',
    "stat3Num" TEXT NOT NULL DEFAULT '3',
    "stat3Label" TEXT NOT NULL DEFAULT 'Oficinas Ativas',
    "stat4Num" TEXT NOT NULL DEFAULT 'Boa Vista',
    "stat4Label" TEXT NOT NULL DEFAULT 'Roraima, Brasil',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
