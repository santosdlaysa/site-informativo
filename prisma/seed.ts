import {
  PrismaClient,
  PostStatus,
  PostType,
  SessionStatus,
  EventFormat,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: "Notícias", slug: "noticias", variant: "news" },
  { name: "Tecnologia", slug: "tecnologia", variant: "tec" },
  { name: "Saúde", slug: "saude", variant: "saude" },
  { name: "Tutoriais", slug: "tutoriais", variant: "tut" },
];

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@meublog.com";
  const password = process.env.ADMIN_PASSWORD ?? "senha123";
  const name = process.env.ADMIN_NAME ?? "Admin";

  // Usuário administrador
  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, passwordHash, role: "admin" },
  });

  // Categorias
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, variant: c.variant },
      create: c,
    });
  }
  const allCategories = await prisma.category.findMany();
  const catId = (name: string) => allCategories.find((c) => c.name === name)?.id ?? null;
  const tec = await prisma.category.findUnique({ where: { slug: "tecnologia" } });
  const saude = await prisma.category.findUnique({ where: { slug: "saude" } });

  // Posts de exemplo
  const samples = [
    {
      title: "Como usar Prisma com PostgreSQL no Next.js",
      slug: "como-usar-prisma-com-postgresql-no-nextjs",
      excerpt: "Aprenda a integrar o Prisma ORM com PostgreSQL de forma simples e eficiente.",
      content:
        "O Prisma é um ORM moderno e intuitivo que torna o trabalho com bancos de dados muito mais agradável.\n\nNeste post, vamos ver como integrá-lo com PostgreSQL em um projeto Next.js, configurar o schema e rodar as primeiras migrations.",
      categoryId: tec?.id,
      status: PostStatus.PUBLISHED,
    },
    {
      title: "Entendendo Server Components no Next.js",
      slug: "entendendo-server-components-no-nextjs",
      excerpt: "Veja como os Server Components funcionam e quando usar.",
      content:
        "Server Components renderizam no servidor e reduzem o JavaScript enviado ao cliente.\n\nEntenda quando usá-los e como combiná-los com Client Components.",
      categoryId: tec?.id,
      status: PostStatus.PUBLISHED,
    },
    {
      title: "5 hábitos para melhorar sua saúde mental",
      slug: "5-habitos-para-melhorar-sua-saude-mental",
      excerpt: "Pequenas mudanças que fazem grande diferença no dia a dia.",
      content:
        "Cuidar da saúde mental é tão importante quanto cuidar do corpo.\n\nVeja cinco hábitos simples que ajudam a manter o equilíbrio.",
      categoryId: saude?.id,
      status: PostStatus.DRAFT,
    },
  ];

  for (const s of samples) {
    await prisma.post.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        title: s.title,
        slug: s.slug,
        excerpt: s.excerpt,
        content: s.content,
        status: s.status,
        readingTime: Math.max(1, Math.ceil(s.content.split(/\s+/).length / 200)),
        publishedAt: s.status === PostStatus.PUBLISHED ? new Date() : null,
        authorId: admin.id,
        categoryId: s.categoryId,
      },
    });
  }

  // Sessões da programação (ids fixos para o seed ser idempotente)
  const base = new Date();
  const atDay = (offset: number, h: number, m: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + offset);
    d.setHours(h, m, 0, 0);
    return d;
  };
  const sessions = [
    {
      id: "seed-ses-1",
      title: "Prisma + PostgreSQL na prática",
      description: "Configurando um banco de dados do zero em um projeto Next.js.",
      speaker: "Ana Martins",
      speakerRole: "Engenheira de Software",
      categoryId: catId("Tecnologia"),
      startsAt: atDay(0, 10, 0),
      durationMin: 60,
      status: SessionStatus.LIVE,
    },
    {
      id: "seed-ses-2",
      title: "Workshop: criando um blog com Tailwind CSS",
      description: "Do layout aos componentes, passo a passo.",
      speaker: "Carlos Lima",
      speakerRole: "Designer & Dev Front-end",
      categoryId: catId("Tutoriais"),
      startsAt: atDay(0, 14, 0),
      durationMin: 45,
      status: SessionStatus.SCHEDULED,
    },
    {
      id: "seed-ses-3",
      title: "Server Components: o que muda no seu projeto",
      description: "Entenda o novo modelo de renderização do Next.js.",
      speaker: "Pedro Alves",
      speakerRole: "Tech Lead",
      categoryId: catId("Tecnologia"),
      startsAt: atDay(1, 9, 30),
      durationMin: 50,
      status: SessionStatus.SCHEDULED,
    },
  ];
  for (const s of sessions) {
    await prisma.programSession.upsert({ where: { id: s.id }, update: s, create: s });
  }

  // Eventos
  const events = [
    {
      slug: "meublog-conf-2024",
      title: "MeuBlog Conf 2024",
      description:
        "Um dia inteiro de palestras sobre Next.js, performance web e o futuro do desenvolvimento full-stack.",
      categoryId: catId("Tecnologia"),
      format: EventFormat.PRESENTIAL,
      location: "Centro de Convenções · São Paulo, SP",
      startsAt: atDay(13, 9, 0),
      capacity: 350,
    },
    {
      slug: "workshop-api-routes",
      title: "Workshop: API Routes no Next.js",
      description: "Mão na massa criando endpoints seguros e performáticos.",
      categoryId: catId("Tutoriais"),
      format: EventFormat.ONLINE,
      location: "YouTube ao vivo",
      startsAt: atDay(5, 19, 0),
      capacity: null,
    },
  ];
  for (const e of events) {
    await prisma.event.upsert({ where: { slug: e.slug }, update: e, create: e });
  }

  // Coleção de Projetos (post tipo PROJECTS + galeria apontando p/ posts existentes)
  const prismaPost = await prisma.post.findUnique({ where: { slug: "como-usar-prisma-com-postgresql-no-nextjs" } });
  const serverPost = await prisma.post.findUnique({ where: { slug: "entendendo-server-components-no-nextjs" } });
  const projectPost = await prisma.post.upsert({
    where: { slug: "nossos-projetos" },
    update: {},
    create: {
      title: "Nossos Projetos",
      slug: "nossos-projetos",
      excerpt: "Uma seleção dos nossos principais projetos e tutoriais. Clique em qualquer card para ler o post completo.",
      content: "",
      type: PostType.PROJECTS,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });
  await prisma.projectItem.deleteMany({ where: { ownerPostId: projectPost.id } });
  const items = [
    { caption: "Integração com banco de dados", linkedPostId: prismaPost?.id ?? null, position: 0 },
    { caption: "Renderização no servidor", linkedPostId: serverPost?.id ?? null, position: 1 },
  ];
  await prisma.projectItem.createMany({
    data: items.map((it) => ({ ...it, ownerPostId: projectPost.id, image: null })),
  });

  console.log("Seed concluído: admin, categorias, posts, sessões, eventos e projetos criados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
