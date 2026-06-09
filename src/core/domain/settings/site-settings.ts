export interface SiteSettingsData {
  heroBgImage?: string | null;
  qsImage?: string | null;
  heroTag: string;
  heroTitle: string;
  heroDesc: string;
  heroCta1Text: string;
  heroCta1Href: string;
  heroCta2Text: string;
  heroCta2Href: string;
  stat1Num: string;
  stat1Label: string;
  stat2Num: string;
  stat2Label: string;
  stat3Num: string;
  stat3Label: string;
  stat4Num: string;
  stat4Label: string;
  qsTag: string;
  qsTitle: string;
  qsBody1: string;
  qsBody2: string;
  qsFeature1Title: string;
  qsFeature1Desc: string;
  qsFeature2Title: string;
  qsFeature2Desc: string;
  qsPartnersTitle: string;
  qsPartner1?: string | null;
  qsPartner2?: string | null;
  qsPartner3?: string | null;
  qsPartner4?: string | null;
  socialFacebook: string;
  socialTwitter: string;
  socialLinkedin: string;
  socialInstagram: string;
}

export const DEFAULT_SETTINGS: SiteSettingsData = {
  heroBgImage: null,
  qsImage: null,
  heroTag: "Fortalecimento de Vínculos",
  heroTitle: "Conectando famílias e\ngerando redes de apoio",
  heroDesc:
    "Nossos eventos de encerramento coroam meses de esforço, disciplina e união coletiva entre pais, alunos e orientadores.",
  heroCta1Text: "Ver Galeria de Fotos",
  heroCta1Href: "/acoes",
  heroCta2Text: "Fale Conosco",
  heroCta2Href: "/eventos",
  stat1Num: "150+",
  stat1Label: "Jovens Formados",
  stat2Num: "85+",
  stat2Label: "Famílias Apoiadas",
  stat3Num: "3",
  stat3Label: "Oficinas Ativas",
  stat4Num: "Boa Vista",
  stat4Label: "Roraima, Brasil",
  qsTag: "Apresentação do Projeto",
  qsTitle: "Centro de Assistência Multiprofissional em Doenças Raras de Boa Vista",
  qsBody1:
    "Uma iniciativa que fortalece o atendimento às pessoas com doenças raras e suas famílias, fruto da parceria entre a ACDG Brasil, a Secretaria Municipal de Saúde de Boa Vista e o Centro de Serviço e Assistência Social Maria Fernandes (CESASMAF), comprometidos com a saúde, a inclusão social e a garantia de direitos.",
  qsBody2:
    "O Centro oferece atendimento multiprofissional humanizado — medicina, enfermagem, serviço social, psicologia, fisioterapia, fonoaudiologia, terapia ocupacional, nutrição, odontologia, neuropsicopedagogia e genética médica —, atendendo casos encaminhados pela rede pública e por demanda espontânea, e também produz informações para subsidiar políticas públicas voltadas a essa população.",
  qsFeature1Title: "Cuidado Integral",
  qsFeature1Desc: "Diagnóstico precoce e acompanhamento especializado e contínuo.",
  qsFeature2Title: "Acolhimento e Direitos",
  qsFeature2Desc: "Espaço de orientação, inclusão social e defesa de direitos.",
  qsPartnersTitle: "Parceiros",
  qsPartner1: null,
  qsPartner2: null,
  qsPartner3: null,
  qsPartner4: null,
  socialFacebook: "",
  socialTwitter: "",
  socialLinkedin: "",
  socialInstagram: "",
};
