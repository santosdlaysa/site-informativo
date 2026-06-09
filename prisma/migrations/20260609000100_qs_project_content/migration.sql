-- AlterTable: alinha os defaults dos textos da seção (agora "Apresentação do Projeto")
ALTER TABLE "SiteSettings" ALTER COLUMN "qsTag" SET DEFAULT 'Apresentação do Projeto',
ALTER COLUMN "qsTitle" SET DEFAULT 'Centro de Assistência Multiprofissional em Doenças Raras de Boa Vista',
ALTER COLUMN "qsBody1" SET DEFAULT 'Uma iniciativa que fortalece o atendimento às pessoas com doenças raras e suas famílias, fruto da parceria entre a ACDG Brasil, a Secretaria Municipal de Saúde de Boa Vista e o Centro de Serviço e Assistência Social Maria Fernandes (CESASMAF), comprometidos com a saúde, a inclusão social e a garantia de direitos.',
ALTER COLUMN "qsBody2" SET DEFAULT 'O Centro oferece atendimento multiprofissional humanizado — medicina, enfermagem, serviço social, psicologia, fisioterapia, fonoaudiologia, terapia ocupacional, nutrição, odontologia, neuropsicopedagogia e genética médica —, atendendo casos encaminhados pela rede pública e por demanda espontânea, e também produz informações para subsidiar políticas públicas voltadas a essa população.',
ALTER COLUMN "qsFeature1Title" SET DEFAULT 'Cuidado Integral',
ALTER COLUMN "qsFeature1Desc" SET DEFAULT 'Diagnóstico precoce e acompanhamento especializado e contínuo.',
ALTER COLUMN "qsFeature2Title" SET DEFAULT 'Acolhimento e Direitos',
ALTER COLUMN "qsFeature2Desc" SET DEFAULT 'Espaço de orientação, inclusão social e defesa de direitos.';

-- Atualiza o registro existente para o novo conteúdo do projeto.
UPDATE "SiteSettings"
SET "qsTag"           = 'Apresentação do Projeto',
    "qsTitle"         = 'Centro de Assistência Multiprofissional em Doenças Raras de Boa Vista',
    "qsBody1"         = 'Uma iniciativa que fortalece o atendimento às pessoas com doenças raras e suas famílias, fruto da parceria entre a ACDG Brasil, a Secretaria Municipal de Saúde de Boa Vista e o Centro de Serviço e Assistência Social Maria Fernandes (CESASMAF), comprometidos com a saúde, a inclusão social e a garantia de direitos.',
    "qsBody2"         = 'O Centro oferece atendimento multiprofissional humanizado — medicina, enfermagem, serviço social, psicologia, fisioterapia, fonoaudiologia, terapia ocupacional, nutrição, odontologia, neuropsicopedagogia e genética médica —, atendendo casos encaminhados pela rede pública e por demanda espontânea, e também produz informações para subsidiar políticas públicas voltadas a essa população.',
    "qsFeature1Title" = 'Cuidado Integral',
    "qsFeature1Desc"  = 'Diagnóstico precoce e acompanhamento especializado e contínuo.',
    "qsFeature2Title" = 'Acolhimento e Direitos',
    "qsFeature2Desc"  = 'Espaço de orientação, inclusão social e defesa de direitos.'
WHERE "id" = 'default';
