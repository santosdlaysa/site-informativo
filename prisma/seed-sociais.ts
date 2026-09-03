/**
 * Seed de conteúdo social (responsabilidade social / ações comunitárias).
 * Idempotente: faz upsert por slug e NÃO remove nada existente — apenas adiciona.
 * Rodar com:  npx tsx prisma/seed-sociais.ts
 */
import {
  PrismaClient,
  PostStatus,
  PostType,
  SessionStatus,
  EventFormat,
} from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Ações Sociais", slug: "acoes-sociais", variant: "news" },
  { name: "Sustentabilidade", slug: "sustentabilidade", variant: "saude" },
  { name: "Educação", slug: "educacao", variant: "tut" },
  { name: "Comunidade", slug: "comunidade", variant: "eventos" },
  { name: "Voluntariado", slug: "voluntariado", variant: "tec" },
];

const readingTime = (content: string) =>
  Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 200));

// Gradientes por categoria (combinam com as cores dos badges).
const GRAD: Record<string, [string, string]> = {
  "acoes-sociais": ["#1d4ed8", "#1e3a8a"],
  sustentabilidade: ["#059669", "#047857"],
  educacao: ["#7c3aed", "#5b21b6"],
  comunidade: ["#ea580c", "#c2410c"],
  voluntariado: ["#0891b2", "#0e7490"],
};

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Gera uma capa SVG (1200x675) como data-URL: gradiente + rótulo + título. */
function cover(title: string, label: string, slug: string): string {
  const [c1, c2] = GRAD[slug] ?? (["#1d4ed8", "#1e3a8a"] as [string, string]);
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > 24) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  const tspans = lines
    .slice(0, 3)
    .map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 70}">${escapeXml(l)}</tspan>`)
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>` +
    `</linearGradient></defs>` +
    `<rect width="1200" height="675" fill="url(#g)"/>` +
    `<circle cx="1030" cy="110" r="280" fill="#ffffff" fill-opacity="0.08"/>` +
    `<circle cx="1090" cy="600" r="190" fill="#ffffff" fill-opacity="0.06"/>` +
    `<text x="80" y="150" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff" fill-opacity="0.85" letter-spacing="3">${escapeXml(label.toUpperCase())}</text>` +
    `<text x="80" y="340" font-family="Segoe UI, Arial, sans-serif" font-size="58" font-weight="800" fill="#ffffff">${tspans}</text>` +
    `</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

async function main() {
  // Usa o usuário admin já existente como autor (não cria nem altera usuários).
  const admin =
    (await prisma.user.findFirst({ where: { role: "admin" } })) ??
    (await prisma.user.findFirst());
  if (!admin) {
    throw new Error(
      "Nenhum usuário encontrado. Rode antes o seed principal (npm run db:seed) para criar o admin.",
    );
  }

  // 1) Categorias (upsert por slug)
  for (const c of CATEGORIES) {
    const existing = await prisma.category.findFirst({ where: { slug: c.slug, companyId: "default" } });
    if (existing) await prisma.category.update({ where: { id: existing.id }, data: { name: c.name, variant: c.variant } });
    else await prisma.category.create({ data: { ...c, companyId: "default" } });
  }
  const cats = await prisma.category.findMany();
  const catId = (slug: string) => cats.find((c) => c.slug === slug)?.id ?? null;

  // 2) Posts (upsert por slug)
  const posts: Array<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    categorySlug: string;
    status: PostStatus;
  }> = [
    {
      title: "Programa de Eficiência Energética leva economia a famílias de baixa renda",
      slug: "programa-eficiencia-energetica-familias-baixa-renda",
      excerpt:
        "Ação substitui lâmpadas e geladeiras antigas por equipamentos eficientes, reduzindo a conta de luz e o consumo nas comunidades atendidas.",
      content:
        "O uso consciente da energia elétrica começa dentro de casa. Por isso, o Programa de Eficiência Energética percorre bairros e comunidades oferecendo a troca gratuita de equipamentos antigos por modelos mais econômicos.\n\nA iniciativa inclui a substituição de lâmpadas incandescentes por modelos de LED e a troca de geladeiras com mais de dez anos de uso, que costumam consumir muito mais energia do que os aparelhos atuais.\n\nAlém da economia na conta de luz, as famílias recebem orientações práticas sobre como evitar o desperdício no dia a dia — desde o uso adequado do chuveiro elétrico até o cuidado com aparelhos em modo de espera.\n\nProgramas como esse mostram que eficiência energética e inclusão social caminham juntas: quanto menor o desperdício, mais sobra no orçamento das famílias e menor é a pressão sobre o sistema elétrico.",
      categorySlug: "sustentabilidade",
      status: PostStatus.PUBLISHED,
    },
    {
      title: "Tarifa Social: quem tem direito ao desconto na conta de energia",
      slug: "tarifa-social-quem-tem-direito-ao-desconto",
      excerpt:
        "Famílias inscritas no CadÚnico e outros grupos podem pagar menos na conta de luz. Entenda como solicitar o benefício.",
      content:
        "A Tarifa Social de Energia Elétrica é um benefício que garante descontos na conta de luz para famílias de baixa renda. O objetivo é assegurar que o acesso à energia não pese no orçamento de quem mais precisa.\n\nTêm direito ao benefício, entre outros grupos, as famílias inscritas no Cadastro Único (CadÚnico) com renda por pessoa de até meio salário mínimo e famílias com pessoa que recebe o Benefício de Prestação Continuada (BPC).\n\nO desconto é aplicado de forma escalonada sobre o consumo mensal, podendo chegar à isenção parcial nas faixas iniciais. Para solicitar, basta manter o cadastro atualizado e procurar os canais de atendimento com um documento de identificação e o número do NIS.\n\nManter os dados em dia é fundamental para não perder o benefício. A orientação é revisar o cadastro sempre que houver mudança de endereço ou na composição da família.",
      categorySlug: "acoes-sociais",
      status: PostStatus.PUBLISHED,
    },
    {
      title: "Mutirão de Cidadania leva serviços gratuitos aos bairros",
      slug: "mutirao-de-cidadania-servicos-gratuitos-bairros",
      excerpt:
        "Atendimento itinerante oferece negociação de débitos, atualização cadastral e orientação sobre uso seguro da energia.",
      content:
        "Levar o atendimento para perto das pessoas é o objetivo do Mutirão de Cidadania, que monta estruturas itinerantes em praças, escolas e centros comunitários.\n\nNos pontos de atendimento, os moradores podem atualizar o cadastro, negociar débitos em condições facilitadas, solicitar a Tarifa Social e tirar dúvidas sobre a fatura de energia.\n\nO mutirão também oferece orientações sobre segurança: como identificar riscos em instalações antigas, por que não improvisar ligações elétricas e como agir em caso de fios partidos na rua.\n\nA ação aproxima a empresa da população e reforça que o atendimento de qualidade é um direito de todos, independentemente do bairro onde se mora.",
      categorySlug: "comunidade",
      status: PostStatus.PUBLISHED,
    },
    {
      title: "Educação ambiental nas escolas forma novos guardiões da energia",
      slug: "educacao-ambiental-nas-escolas-guardioes-da-energia",
      excerpt:
        "Projeto leva oficinas lúdicas sobre consumo consciente e fontes renováveis para estudantes da rede pública.",
      content:
        "Transformar crianças e adolescentes em multiplicadores do consumo consciente é a proposta do projeto de educação ambiental que visita escolas da rede pública.\n\nPor meio de oficinas lúdicas, jogos e experimentos, os estudantes aprendem de onde vem a energia que chega às suas casas, como ela é gerada e por que evitar o desperdício faz diferença para o planeta e para o bolso da família.\n\nO conteúdo aborda ainda as fontes renováveis, como a solar e a hidrelétrica, e estimula pequenas atitudes que, somadas, geram grande impacto: apagar as luzes ao sair de um cômodo, aproveitar a luz natural e cuidar dos aparelhos.\n\nAs crianças levam para casa o que aprendem e acabam ensinando os adultos — um efeito multiplicador que ajuda comunidades inteiras a economizar.",
      categorySlug: "educacao",
      status: PostStatus.PUBLISHED,
    },
    {
      title: "Energia que transforma: comunidades isoladas ganham acesso à eletricidade",
      slug: "energia-que-transforma-comunidades-isoladas",
      excerpt:
        "Levar luz a localidades distantes muda a rotina de famílias e abre portas para educação, saúde e geração de renda.",
      content:
        "Para quem vive em áreas isoladas, a chegada da energia elétrica representa muito mais do que acender uma lâmpada: significa estudar à noite, conservar alimentos e medicamentos e ter acesso à informação.\n\nProjetos de universalização levam a rede a localidades distantes e, onde a expansão tradicional é inviável, soluções com geração solar garantem o fornecimento de forma sustentável.\n\nCom energia, pequenos negócios se viabilizam, postos de saúde funcionam com mais segurança e escolas ampliam suas atividades. O impacto social é imediato e duradouro.\n\nLevar eletricidade a quem nunca teve acesso é um dos compromissos mais importantes do setor: energia é, antes de tudo, um instrumento de desenvolvimento e dignidade.",
      categorySlug: "acoes-sociais",
      status: PostStatus.PUBLISHED,
    },
    {
      title: "Voluntariado: colaboradores dedicam tempo a ações sociais",
      slug: "voluntariado-colaboradores-acoes-sociais",
      excerpt:
        "Programa incentiva funcionários a participar de reformas de espaços comunitários, arrecadações e oficinas.",
      content:
        "O engajamento social também acontece de dentro para fora. Pelo programa de voluntariado corporativo, colaboradores doam parte do seu tempo a causas que transformam a comunidade.\n\nAs atividades vão da reforma e pintura de espaços comunitários a campanhas de arrecadação de alimentos e agasalhos, passando por oficinas em que profissionais compartilham seus conhecimentos com jovens em busca do primeiro emprego.\n\nMais do que ajudar, o voluntariado aproxima as pessoas e fortalece o sentimento de pertencimento. Quem participa relata que recebe tanto quanto oferece.\n\nPequenos gestos, quando somados, constroem grandes mudanças — e a participação de cada voluntário é parte essencial desse movimento.",
      categorySlug: "voluntariado",
      status: PostStatus.DRAFT,
    },
  ];

  const catName: Record<string, string> = {};
  for (const c of CATEGORIES) catName[c.slug] = c.name;

  const slugToId: Record<string, string> = {};
  for (const p of posts) {
    const coverImage = cover(p.title, catName[p.categorySlug] ?? "Social", p.categorySlug);
    const created = await prisma.post.upsert({
      where: { slug: p.slug },
      update: { coverImage },
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        coverImage,
        status: p.status,
        readingTime: readingTime(p.content),
        publishedAt: p.status === PostStatus.PUBLISHED ? new Date() : null,
        authorId: admin.id,
        categoryId: catId(p.categorySlug),
      },
    });
    slugToId[p.slug] = created.id;
  }

  // 3) Programação (palestras / oficinas) — ids fixos = idempotente
  const base = new Date();
  const atDay = (offset: number, h: number, m: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + offset);
    d.setHours(h, m, 0, 0);
    return d;
  };
  const sessions = [
    {
      id: "seed-soc-ses-1",
      title: "Palestra: Uso consciente de energia em casa",
      description:
        "Dicas práticas para reduzir o consumo e a conta de luz sem abrir mão do conforto.",
      speaker: "Equipe de Eficiência Energética",
      speakerRole: "Programa Social",
      categoryId: catId("sustentabilidade"),
      startsAt: atDay(2, 9, 0),
      durationMin: 60,
      status: SessionStatus.SCHEDULED,
    },
    {
      id: "seed-soc-ses-2",
      title: "Oficina: Tarifa Social e atualização do CadÚnico",
      description:
        "Como solicitar o desconto na conta de energia e manter o cadastro em dia.",
      speaker: "Atendimento ao Cliente",
      speakerRole: "Relacionamento com a Comunidade",
      categoryId: catId("acoes-sociais"),
      startsAt: atDay(2, 14, 0),
      durationMin: 90,
      status: SessionStatus.SCHEDULED,
    },
    {
      id: "seed-soc-ses-3",
      title: "Roda de conversa: segurança com a rede elétrica",
      description:
        "Cuidados em casa e na rua para prevenir acidentes com a eletricidade.",
      speaker: "Equipe Técnica de Segurança",
      speakerRole: "Operação e Manutenção",
      categoryId: catId("comunidade"),
      startsAt: atDay(4, 10, 0),
      durationMin: 45,
      status: SessionStatus.SCHEDULED,
    },
  ];
  for (const s of sessions) {
    await prisma.programSession.upsert({ where: { id: s.id }, update: s, create: s });
  }

  // 4) Eventos (upsert por slug)
  const events = [
    {
      slug: "feira-de-cidadania-2026",
      title: "Feira de Cidadania",
      description:
        "Um dia de serviços gratuitos à população: atualização cadastral, Tarifa Social, negociação de débitos e orientações sobre uso seguro e eficiente da energia.",
      categoryId: catId("comunidade"),
      coverImage: cover("Feira de Cidadania", "Evento · Comunidade", "comunidade"),
      format: EventFormat.PRESENTIAL,
      location: "Praça central · Boa Vista, RR",
      startsAt: atDay(15, 8, 0),
      capacity: 500,
    },
    {
      slug: "webinar-tarifa-social-direitos",
      title: "Webinar: Tarifa Social e seus direitos",
      description:
        "Encontro online para esclarecer quem tem direito ao desconto na conta de luz e como solicitar o benefício.",
      categoryId: catId("acoes-sociais"),
      coverImage: cover("Tarifa Social e seus direitos", "Webinar", "acoes-sociais"),
      format: EventFormat.ONLINE,
      location: "Transmissão ao vivo pela internet",
      startsAt: atDay(8, 19, 0),
      capacity: null,
    },
    {
      slug: "dia-do-voluntariado",
      title: "Dia do Voluntariado",
      description:
        "Mutirão de colaboradores para reforma e pintura de um espaço comunitário, com arrecadação de alimentos.",
      categoryId: catId("voluntariado"),
      coverImage: cover("Dia do Voluntariado", "Evento · Voluntariado", "voluntariado"),
      format: EventFormat.PRESENTIAL,
      location: "Centro comunitário do bairro · Boa Vista, RR",
      startsAt: atDay(22, 8, 30),
      capacity: 120,
    },
  ];
  for (const e of events) {
    await prisma.event.upsert({ where: { slug: e.slug }, update: e, create: e });
  }

  // 5) Coleção de Projetos sociais (post tipo PROJECTS + galeria apontando p/ posts)
  const projectCover = cover("Nossos Projetos Sociais", "Coleção", "acoes-sociais");
  const projectPost = await prisma.post.upsert({
    where: { slug: "nossos-projetos-sociais" },
    update: { coverImage: projectCover },
    create: {
      title: "Nossos Projetos Sociais",
      slug: "nossos-projetos-sociais",
      excerpt:
        "Conheça as iniciativas que levam economia, cidadania e desenvolvimento às comunidades. Clique em um card para ler a matéria completa.",
      content: "",
      coverImage: projectCover,
      type: PostType.PROJECTS,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: catId("acoes-sociais"),
    },
  });
  await prisma.projectItem.deleteMany({ where: { ownerPostId: projectPost.id } });
  const galleryItems = [
    { caption: "Eficiência energética", linkedSlug: "programa-eficiencia-energetica-familias-baixa-renda", cat: "sustentabilidade" },
    { caption: "Tarifa Social", linkedSlug: "tarifa-social-quem-tem-direito-ao-desconto", cat: "acoes-sociais" },
    { caption: "Mutirão de Cidadania", linkedSlug: "mutirao-de-cidadania-servicos-gratuitos-bairros", cat: "comunidade" },
    { caption: "Educação ambiental", linkedSlug: "educacao-ambiental-nas-escolas-guardioes-da-energia", cat: "educacao" },
    { caption: "Energia que transforma", linkedSlug: "energia-que-transforma-comunidades-isoladas", cat: "acoes-sociais" },
  ];
  await prisma.projectItem.createMany({
    data: galleryItems.map((it, i) => ({
      ownerPostId: projectPost.id,
      linkedPostId: slugToId[it.linkedSlug] ?? null,
      caption: it.caption,
      image: cover(it.caption, "Projeto", it.cat),
      position: i,
    })),
  });

  console.log(
    `Seed social concluído: ${CATEGORIES.length} categorias, ${posts.length} posts, ${sessions.length} sessões, ${events.length} eventos e 1 coleção de projetos (${galleryItems.length} itens).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
