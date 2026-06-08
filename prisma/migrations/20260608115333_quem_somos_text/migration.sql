-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "qsBody1" TEXT NOT NULL DEFAULT 'O Centro Social Raros Boa Vista nasceu com o propósito de suprir as necessidades de capacitação, inserção digital e desenvolvimento artístico de crianças, adolescentes e jovens da região de Roraima.',
ADD COLUMN     "qsBody2" TEXT NOT NULL DEFAULT 'Através de oficinas e acompanhamento próximo de profissionais e voluntários, fortalecemos as competências e talentos individuais, cultivando valores humanos cruciais como o respeito, a responsabilidade cidadã e a solidariedade local.',
ADD COLUMN     "qsFeature1Desc" TEXT NOT NULL DEFAULT 'Acesso livre a cursos técnicos e artísticos.',
ADD COLUMN     "qsFeature1Title" TEXT NOT NULL DEFAULT 'Inclusão Real',
ADD COLUMN     "qsFeature2Desc" TEXT NOT NULL DEFAULT 'Apoio psicossocial para jovens e pais.',
ADD COLUMN     "qsFeature2Title" TEXT NOT NULL DEFAULT 'Desenvolvimento Integral',
ADD COLUMN     "qsTag" TEXT NOT NULL DEFAULT 'Quem Somos',
ADD COLUMN     "qsTitle" TEXT NOT NULL DEFAULT 'Compromisso com o futuro da nossa comunidade';
