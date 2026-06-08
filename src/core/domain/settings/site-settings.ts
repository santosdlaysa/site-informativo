export interface SiteSettingsData {
  heroBgImage?: string | null;
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
}

export const DEFAULT_SETTINGS: SiteSettingsData = {
  heroBgImage: null,
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
};
