import { PrismaClient, PostStatus, PostType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

const prisma = new PrismaClient();

function generateSecurePassword(): string {
  return randomBytes(16).toString('hex');
}

// Galeria de imagens já redimensionadas (scripts/process-acoes-images.mjs).
const manifest: Record<string, string[]> = JSON.parse(
  readFileSync(path.join(process.cwd(), "public", "acoes", "manifest.json"), "utf8"),
);

const CATEGORIES = [
  { name: "Ações Sociais", slug: "acoes-sociais", variant: "tut" },
  { name: "Saúde", slug: "saude", variant: "saude" },
];

// Os 3 posts reais das ações do Centro Social / Raros Boa Vista.
const ACTIONS = [
  {
    slug: "projeto-juventude-atualizada",
    images: "juventude-atualizada",
    category: "acoes-sociais",
    title: "Projeto Juventude Atualizada — Centro Social",
    excerpt:
      "Iniciativa do Centro Social para o desenvolvimento integral de adolescentes e jovens por meio de atividades educativas, culturais e sociais.",
    paragraphs: [
      "O Projeto Juventude Atualizada, desenvolvido pelo Centro Social, é uma iniciativa que tem como objetivo promover o desenvolvimento integral de adolescentes e jovens por meio de atividades educativas, culturais, sociais e de fortalecimento de valores.",
      "Pensado para atender às demandas da juventude contemporânea, o projeto busca criar um ambiente de aprendizado, acolhimento e crescimento pessoal, incentivando o protagonismo juvenil, a cidadania e a construção de perspectivas positivas para o futuro.",
      "Por meio de ações voltadas à capacitação, orientação e integração social, o Juventude Atualizada contribui para a formação de jovens mais preparados para os desafios da vida, fortalecendo habilidades, talentos e competências que podem impactar positivamente sua trajetória pessoal, familiar e profissional.",
      "Além das atividades formativas, o projeto também promove momentos de convivência, troca de experiências e desenvolvimento de valores essenciais, estimulando o respeito, a responsabilidade, a solidariedade e o compromisso com a comunidade.",
      "O Centro Social acredita que investir na juventude é investir na transformação da sociedade. Por isso, o Projeto Juventude Atualizada segue como uma importante ferramenta de inclusão, desenvolvimento humano e geração de oportunidades, reafirmando o compromisso da instituição com a promoção do bem-estar e da qualidade de vida de crianças, adolescentes, jovens e suas famílias.",
    ],
  },
  {
    slug: "mutirao-doencas-raras",
    images: "mutirao-doencas-raras",
    category: "saude",
    title: "Mutirão de Atendimentos a Pacientes com Doenças Genéticas",
    excerpt:
      "O 1º Mutirão de Doenças Raras promoveu saúde, acolhimento e atendimentos especializados a pessoas que convivem com doenças raras e suas famílias.",
    paragraphs: [
      "O Centro Social realizou o 1º Mutirão de Doenças Raras, uma importante ação voltada à promoção da saúde, acolhimento e orientação de pessoas que convivem com doenças raras e de suas famílias.",
      "A iniciativa teve como objetivo ampliar o acesso à informação, fortalecer a rede de apoio e proporcionar atendimentos especializados, contribuindo para a identificação precoce, acompanhamento e encaminhamento adequado dos pacientes. O mutirão reuniu profissionais, parceiros e voluntários comprometidos com a causa, promovendo um espaço de escuta, cuidado e conscientização.",
      "Durante a programação, os participantes tiveram acesso a orientações, atendimentos e informações sobre diversas condições raras, além de receberem suporte para compreender melhor os desafios enfrentados por quem convive com essas doenças. A ação também reforçou a importância do diagnóstico precoce, do tratamento adequado e da construção de políticas públicas que garantam mais qualidade de vida aos pacientes.",
      "O evento foi realizado em parceria com a Associação Brasileira de Doenças Genéticas, fortalecendo o compromisso conjunto de ampliar a visibilidade das doenças raras e promover ações que façam a diferença na vida das famílias atendidas.",
      "Mais do que um momento de atendimentos, o 1º Mutirão de Doenças Raras representou um passo importante na construção de uma rede de apoio mais forte, humana e acessível, reafirmando o compromisso do Centro Social com a inclusão, o cuidado e a valorização da vida.",
    ],
  },
  {
    slug: "forum-doencas-geneticas",
    images: "forum-doencas-geneticas",
    category: "saude",
    title: "1º Fórum de Roraima em Doenças Raras e Neurodivergentes",
    excerpt:
      "Evento dedicado à conscientização, troca de conhecimento e fortalecimento da rede de apoio às pessoas que convivem com doenças genéticas e raras.",
    paragraphs: [
      "O Centro Social promoveu o 1º Fórum de Doenças Genéticas, um evento dedicado à conscientização, troca de conhecimento e fortalecimento da rede de apoio às pessoas que convivem com doenças genéticas e raras.",
      "O fórum reuniu profissionais da saúde, especialistas, representantes de instituições parceiras, familiares e membros da comunidade para discutir temas relacionados ao diagnóstico precoce, acompanhamento multidisciplinar, inclusão social, acesso aos tratamentos e aos direitos das pessoas com doenças genéticas.",
      "A programação contou com palestras, momentos de diálogo e compartilhamento de experiências, proporcionando um ambiente de aprendizado e reflexão sobre os desafios enfrentados por pacientes e suas famílias. Além disso, o evento buscou ampliar o conhecimento da população sobre a importância da informação e da conscientização para a identificação e o manejo adequado dessas condições.",
      "Realizado em parceria com a Associação Brasileira de Doenças Genéticas, o fórum representou um importante marco para o fortalecimento das ações voltadas às doenças genéticas no estado, contribuindo para a construção de uma rede mais preparada, acolhedora e comprometida com a promoção da saúde e da qualidade de vida.",
      "Mais do que um encontro de especialistas, o 1º Fórum de Doenças Genéticas foi um espaço de escuta, acolhimento e mobilização social, reforçando a importância da união entre instituições, profissionais e famílias.",
    ],
  },
];

async function main() {
  if (!process.env.ADMIN_EMAIL) {
    console.error("❌ ERRO: ADMIN_EMAIL não está definido nas variáveis de ambiente");
    console.error("   Defina as variáveis de ambiente obrigatórias:");
    console.error("   - ADMIN_EMAIL (seu email de administrador)");
    console.error("   - ADMIN_PASSWORD (sua senha segura)");
    console.error("   - ADMIN_NAME (seu nome, opcional)");
    process.exit(1);
  }

  if (!process.env.ADMIN_PASSWORD) {
    console.error("❌ ERRO: ADMIN_PASSWORD não está definido nas variáveis de ambiente");
    process.exit(1);
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  // Empresas atendidas pelo mesmo painel. O conteúdo antigo fica vinculado à
  // empresa padrão; a segunda empresa serve como ponto de partida para o novo site.
  await prisma.company.upsert({
    where: { id: "default" },
    update: { name: "Raros Boa Vista", slug: "raros-boa-vista" },
    create: { id: "default", name: "Raros Boa Vista", slug: "raros-boa-vista" },
  });
  await prisma.company.upsert({
    where: { id: "segunda-empresa" },
    update: { name: "ADSocial", slug: "adsocial", logo: "/adsocial-logo.png", primaryColor: "#eab308", secondaryColor: "#15803d" },
    create: { id: "segunda-empresa", name: "ADSocial", slug: "adsocial", logo: "/adsocial-logo.png", primaryColor: "#eab308", secondaryColor: "#15803d" },
  });

  // Usuário administrador (preservado entre execuções)
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, passwordHash, role: "admin", companyId: "default" },
  });

  await prisma.siteSettings.upsert({
    where: { companyId: "segunda-empresa" },
    update: {
      qsImage: "/adsocial-logo.png",
      heroTag: "Servir, acolher e transformar",
      heroTitle: "Construindo um futuro com mais oportunidades",
      heroDesc: "O ADSocial atua para fortalecer comunidades, promover inclusão e transformar vidas por meio da solidariedade e do compromisso social.",
      heroCta1Text: "Conheça nossas ações",
      heroCta1Href: "/acoes",
      heroCta2Text: "Sobre o ADSocial",
      heroCta2Href: "/projeto",
      qsTag: "Sobre o ADSocial",
      qsTitle: "Servir, acolher e contribuir para a transformação da comunidade",
      qsBody1: "O ADSocial nasceu em 28 de janeiro de 1963 com o compromisso de servir, acolher e contribuir para a transformação da comunidade.",
      qsBody2: "Ao longo dos anos, essa missão tem se fortalecido por meio de ações voltadas às necessidades de diferentes públicos, oferecendo assistência social, apoio educacional, atividades culturais, iniciativas de saúde e projetos que promovem inclusão e desenvolvimento.",
      qsFeature1Title: "Cuidado e inclusão",
      qsFeature1Desc: "Ações que acolhem pessoas e fortalecem comunidades.",
      qsFeature2Title: "União que transforma",
      qsFeature2Desc: "Parcerias e solidariedade para criar novas possibilidades.",
      qsRealizacao: "ADSocial",
      qsParcerias: "Parceiros e comunidade",
      qsFullText: "O ADSocial nasceu em 28 de janeiro de 1963 com o compromisso de servir, acolher e contribuir para a transformação da comunidade.\n\nAo longo dos anos, essa missão tem se fortalecido por meio de ações voltadas às necessidades de diferentes públicos, oferecendo assistência social, apoio educacional, atividades culturais, iniciativas de saúde e projetos que promovem inclusão e desenvolvimento.\n\nMais do que realizar ações, o ADSocial acredita no poder da união e das parcerias para transformar realidades. Cada projeto, atendimento e iniciativa representa uma oportunidade de estar mais perto das pessoas, oferecendo apoio, cuidado e novas possibilidades.\n\nCom uma trajetória construída sobre solidariedade, compromisso e serviço ao próximo, o ADSocial segue ampliando sua atuação e fortalecendo comunidades, com o propósito de transformar vidas e construir um futuro com mais oportunidades para todos.",
    },
    create: {
      id: "segunda-empresa",
      companyId: "segunda-empresa",
      qsImage: "/adsocial-logo.png",
      heroTag: "Servir, acolher e transformar",
      heroTitle: "Construindo um futuro com mais oportunidades",
      heroDesc: "O ADSocial atua para fortalecer comunidades, promover inclusão e transformar vidas por meio da solidariedade e do compromisso social.",
      heroCta1Text: "Conheça nossas ações",
      heroCta1Href: "/acoes",
      heroCta2Text: "Sobre o ADSocial",
      heroCta2Href: "/projeto",
      qsTag: "Sobre o ADSocial",
      qsTitle: "Servir, acolher e contribuir para a transformação da comunidade",
      qsBody1: "O ADSocial nasceu em 28 de janeiro de 1963 com o compromisso de servir, acolher e contribuir para a transformação da comunidade.",
      qsBody2: "Ao longo dos anos, essa missão tem se fortalecido por meio de ações voltadas às necessidades de diferentes públicos, oferecendo assistência social, apoio educacional, atividades culturais, iniciativas de saúde e projetos que promovem inclusão e desenvolvimento.",
      qsFeature1Title: "Cuidado e inclusão",
      qsFeature1Desc: "Ações que acolhem pessoas e fortalecem comunidades.",
      qsFeature2Title: "União que transforma",
      qsFeature2Desc: "Parcerias e solidariedade para criar novas possibilidades.",
      qsRealizacao: "ADSocial",
      qsParcerias: "Parceiros e comunidade",
      qsFullText: "O ADSocial nasceu em 28 de janeiro de 1963 com o compromisso de servir, acolher e contribuir para a transformação da comunidade.\n\nAo longo dos anos, essa missão tem se fortalecido por meio de ações voltadas às necessidades de diferentes públicos, oferecendo assistência social, apoio educacional, atividades culturais, iniciativas de saúde e projetos que promovem inclusão e desenvolvimento.\n\nMais do que realizar ações, o ADSocial acredita no poder da união e das parcerias para transformar realidades. Cada projeto, atendimento e iniciativa representa uma oportunidade de estar mais perto das pessoas, oferecendo apoio, cuidado e novas possibilidades.\n\nCom uma trajetória construída sobre solidariedade, compromisso e serviço ao próximo, o ADSocial segue ampliando sua atuação e fortalecendo comunidades, com o propósito de transformar vidas e construir um futuro com mais oportunidades para todos.",
    },
  });

  // Categorias relevantes
  for (const c of CATEGORIES) {
    const existing = await prisma.category.findFirst({ where: { slug: c.slug, companyId: "default" } });
    if (!existing) await prisma.category.create({ data: { ...c, companyId: "default" } });
  }
  const categories = await prisma.category.findMany({ where: { companyId: "default" } });
  const catId = (slug: string) => categories.find((c) => c.slug === slug)?.id ?? null;

  // Posts das ações (mais recente primeiro: ordem do array)
  const now = new Date();
  for (const [i, a] of ACTIONS.entries()) {
    const existingPost = await prisma.post.findUnique({ where: { slug: a.slug }, select: { id: true } });
    if (existingPost) continue;
    const gallery = manifest[a.images] ?? [];
    const cover = gallery[0] ?? null;
    const content = a.paragraphs.join("\n\n");
    const publishedAt = new Date(now);
    publishedAt.setDate(publishedAt.getDate() - i); // escalona as datas

    const post = await prisma.post.create({
      data: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        content,
        coverImage: cover,
        status: PostStatus.PUBLISHED,
        type: PostType.STANDARD,
        readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
        publishedAt,
        authorId: admin.id,
        categoryId: catId(a.category),
      },
    });

    // Galeria de fotos (todas as imagens após a capa)
    const items = gallery.slice(1).map((image, position) => ({
      ownerPostId: post.id,
      image,
      position,
    }));
    if (items.length > 0) {
      await prisma.projectItem.createMany({ data: items });
    }
    console.log(`✓ ${a.title} (${gallery.length} fotos)`);
  }

  console.log("Seed concluído: admin, categorias e 3 posts de ações.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
