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
  qsRealizacao: string;
  qsParcerias: string;
  qsFullText?: string | null;
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
  qsRealizacao: "ACDG Brasil",
  qsParcerias: "AD Social e Secretaria de Saúde de Boa Vista",
  qsFullText: [
    "O Centro de Assistência Multiprofissional em Doenças Raras de Boa Vista é uma iniciativa criada para fortalecer o atendimento às pessoas com doenças raras e suas famílias no município. O projeto resulta da parceria entre a ACDG Brasil, a Secretaria Municipal de Saúde de Boa Vista e o Centro de Serviço e Assistência Social Maria Fernandes (CESASMAF), instituições comprometidas com a promoção da saúde, da inclusão social e da garantia de direitos.",
    "As doenças raras representam um importante desafio para a saúde pública, devido à complexidade do diagnóstico, à necessidade de acompanhamento especializado e ao impacto significativo na vida dos pacientes e familiares. Muitas pessoas enfrentam dificuldades para obter diagnóstico precoce, acesso a especialistas e atendimento contínuo e integrado.",
    "Para enfrentar essa realidade, o Centro oferecerá atendimento multiprofissional nas áreas de medicina, enfermagem, serviço social, psicologia, fisioterapia, fonoaudiologia, terapia ocupacional, nutrição, odontologia, neuropsicopedagogia e genética médica, promovendo um cuidado humanizado, qualificado e centrado nas necessidades dos usuários.",
    "Na fase inicial, o serviço atenderá pacientes encaminhados pelas Unidades Básicas de Saúde (UBS), pelo Hospital da Criança Santo Antônio (HCSA), por outros serviços da rede pública e também por demanda espontânea, ampliando o acesso e possibilitando a identificação de novos casos.",
    "Além da assistência direta, o projeto prevê a realização de levantamentos epidemiológicos e sociais, produção de informações para subsidiar políticas públicas, capacitação permanente das equipes e fortalecimento das articulações institucionais necessárias à integração do serviço à Rede de Atenção à Saúde.",
    "Ao final do processo de implantação, espera-se que o Centro esteja plenamente integrado à rede municipal de saúde, contribuindo para a ampliação do acesso ao diagnóstico e ao cuidado especializado, para a melhoria da qualidade de vida das pessoas com doenças raras e para o fortalecimento das políticas públicas voltadas a essa população.",
    "Mais do que um serviço de saúde, o Centro será um espaço de acolhimento, orientação, produção de conhecimento e defesa de direitos, promovendo cuidado integral, inclusão social e dignidade às pessoas com doenças raras e suas famílias.",
  ].join("\n\n"),
  qsPartner1: null,
  qsPartner2: null,
  qsPartner3: null,
  qsPartner4: null,
  socialFacebook: "",
  socialTwitter: "",
  socialLinkedin: "",
  socialInstagram: "",
};
