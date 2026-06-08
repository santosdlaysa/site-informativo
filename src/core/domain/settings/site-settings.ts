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
  qsTag: "Quem Somos",
  qsTitle: "Compromisso com o futuro da nossa comunidade",
  qsBody1:
    "O Centro Social Raros Boa Vista nasceu com o propósito de suprir as necessidades de capacitação, inserção digital e desenvolvimento artístico de crianças, adolescentes e jovens da região de Roraima.",
  qsBody2:
    "Através de oficinas e acompanhamento próximo de profissionais e voluntários, fortalecemos as competências e talentos individuais, cultivando valores humanos cruciais como o respeito, a responsabilidade cidadã e a solidariedade local.",
  qsFeature1Title: "Inclusão Real",
  qsFeature1Desc: "Acesso livre a cursos técnicos e artísticos.",
  qsFeature2Title: "Desenvolvimento Integral",
  qsFeature2Desc: "Apoio psicossocial para jovens e pais.",
  socialFacebook: "",
  socialTwitter: "",
  socialLinkedin: "",
  socialInstagram: "",
};
