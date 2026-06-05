import { PrismaClient, PostStatus, PostType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

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
  const email = process.env.ADMIN_EMAIL ?? "admin@meublog.com";
  const password = process.env.ADMIN_PASSWORD ?? "senha123";
  const name = process.env.ADMIN_NAME ?? "Admin";

  // Usuário administrador (preservado entre execuções)
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, passwordHash, role: "admin" },
  });

  // Limpeza dos dados de teste — deixa o site apenas com as ações reais.
  await prisma.projectItem.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.programSession.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.category.deleteMany({});

  // Categorias relevantes
  for (const c of CATEGORIES) {
    await prisma.category.create({ data: c });
  }
  const categories = await prisma.category.findMany();
  const catId = (slug: string) => categories.find((c) => c.slug === slug)?.id ?? null;

  // Posts das ações (mais recente primeiro: ordem do array)
  const now = new Date();
  for (const [i, a] of ACTIONS.entries()) {
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
