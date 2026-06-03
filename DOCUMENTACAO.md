# MeuBlog — Documentação de implementação

> Estado do projeto em **02/06/2026**. Documento de acompanhamento do que já foi
> construído, como rodar e o que falta.

## 1. Visão geral

Aplicação **Next.js 15 (App Router) + TypeScript** seguindo **Clean Architecture**,
com **PostgreSQL** hospedado no **Render** via **Prisma**, autenticação com
**Auth.js (NextAuth v5)** e o sistema visual reaproveitado dos protótipos de design
(`design-reference/`, importados como `src/styles/public.css` e `src/styles/admin.css`).

- Build de produção: **passando** (compilação + lint + checagem de tipos).
- Banco no Render: **conectado**, migrations aplicadas e seed populado.
- 20 rotas no total (públicas dinâmicas + admin protegidas).

## 2. Arquitetura

Regra de dependência: **apresentação → aplicação → domínio**. A infraestrutura
implementa as *portas* (interfaces) declaradas no domínio. O domínio não importa
framework, Prisma nem React.

```
src/
├─ core/
│  ├─ domain/                 entidades, value objects, enums, PORTAS, erros
│  │  ├─ post/  category/  user/  program/  event/  project/  shared/
│  └─ application/            casos de uso + DTOs + portas (id, hasher)
│     ├─ posts/  categories/  auth/  program/  events/  projects/  ports/
├─ infrastructure/            implementações concretas
│  ├─ database/  (prisma client, mappers, repositórios)
│  ├─ auth/      (NextAuth, bcrypt)
│  ├─ ids/       (UUID)
│  └─ container.ts            composition root (injeta dependências)
└─ app/ + presentation/       rotas Next, server actions e componentes/UI
```

O **`container.ts`** é o único ponto que conhece todas as camadas; ele monta os
casos de uso com os repositórios Prisma e os expõe prontos para a apresentação.

## 3. Módulos implementados

### Autenticação (Auth.js / credentials)
- Login em `/admin/login` (e-mail + senha, hash bcrypt, sessão JWT).
- Todas as rotas `/admin/*` (grupo `(panel)`) protegidas no layout — sem sessão → redireciona para o login (HTTP 307).
- "Sair" encerra a sessão e volta ao login.

### Posts (vertical slice completo)
- **Público:** home (`/`), listagem `/posts` com filtro por categoria, post individual `/posts/[slug]` (404 real para slug inexistente), rodapé com contatos.
- **Admin:** `/admin/posts` (abas Todos/Publicados/Rascunhos, busca, excluir), `/admin/posts/novo` e `/admin/posts/[id]/editar` (título, resumo, conteúdo, menu/categoria, rascunho/publicado, upload de capa).
- Regras no domínio: geração e unicidade de slug, cálculo de tempo de leitura, transição publicar/despublicar. Rascunhos não aparecem no site público.

### Programação
- **Público:** `/programacao` — agenda agrupada por dia (abas), indicador "Ao vivo" e botão "Entrar na live" quando há link.
- **Admin:** `/admin/programacao` — formulário de nova sessão (título, descrição, palestrante, cargo, categoria, data/hora, duração, status, link) + lista das sessões cadastradas com exclusão.

### Eventos (apenas informativo, sem inscrição/checkout)
- **Público:** `/eventos` — evento em destaque + grade com filtro por formato (Todos/Online/Presencial); detalhe informativo em `/eventos/[slug]`.
- **Admin:** `/admin/eventos` — formulário (nome, descrição, categoria, formato, local, capa, data/hora, capacidade) + lista com exclusão.

### Projetos (post tipo galeria)
- Conceito "post dentro de post": uma coleção (`Post` do tipo `PROJECTS`) com itens (`ProjectItem`) que apontam para **posts existentes**.
- **Público:** `/projetos` (índice de coleções publicadas) e `/projetos/[slug]` (galeria; cada card abre o post vinculado). Posts do tipo galeria acessados por `/posts/[slug]` são redirecionados para `/projetos/[slug]`.
- **Admin:** `/admin/projetos` (lista) e construtor em `/admin/projetos/novo` e `/admin/projetos/[id]/editar` — monta a galeria item a item (imagem + post vinculado + legenda), adicionar/remover.

## 4. Banco de dados (Prisma)

Modelos em `prisma/schema.prisma`: `User`, `Category`, `Post`, `ProjectItem`,
`ProgramSession`, `Event` + enums `PostStatus`, `PostType`, `EventFormat`, `SessionStatus`.

Migrations aplicadas no Render:
- `init` — schema completo.
- `program_event_fields` — `ProgramSession.speakerRole` e `Event.category`.
- `program_event_category_fk` — troca o texto `category` de `ProgramSession`/`Event`
  por uma **FK `categoryId` → `Category`** (com backfill por nome e índices).

Seed (`prisma/seed.ts`, idempotente): admin, 4 categorias, posts de exemplo,
3 sessões, 2 eventos e a coleção "Nossos Projetos".

## 5. Como rodar

```bash
npm install
# .env já criado com a URL do Render e AUTH_SECRET gerado
npm run db:generate
npm run db:migrate     # (já aplicado) cria/atualiza as tabelas
npm run db:seed        # popula dados de exemplo
npm run dev
```

- Site público: `http://localhost:3000`
- Painel: `http://localhost:3000/admin/login` → **admin@meublog.com** / **senha123**

Variáveis (`.env`): `DATABASE_URL` (Render), `AUTH_SECRET`, `ADMIN_EMAIL/PASSWORD/NAME`.

## 6. Validações executadas (contra o banco do Render)

| Verificação | Resultado |
|---|---|
| `npm run build` (compilação + lint + tipos) | ✅ |
| `tsc --noEmit` | ✅ sem erros |
| Home, `/posts`, filtro por categoria | ✅ 200 |
| Post individual / slug inexistente | ✅ 200 / 404 |
| Rascunho oculto no público | ✅ |
| `/programacao` (sessão "Ao vivo") | ✅ 200 |
| `/eventos`, `/eventos/[slug]`, filtro de formato | ✅ 200 |
| `/projetos`, `/projetos/[slug]` (galeria) | ✅ 200 |
| `/posts/[slug-de-projeto]` → `/projetos/[slug]` | ✅ 307 |
| `/admin/*` sem sessão → `/admin/login` | ✅ 307 |

## 7. Decisões e convenções

- **CSS reaproveitado**: estilos dos protótipos como folhas globais por rota (pública vs. painel), garantindo fidelidade pixel-perfect.
- **`<image-slot>`** dos protótipos virou o componente React `ImageSlot` (exibe imagem do banco em read-only e, no admin, redimensiona no cliente e salva como **data-URL** no próprio banco — sem storage externo).
- **Read models** nas consultas (dados já "achatados") e **entidades** nos comandos — CQRS-lite, sem vazar o ORM para a apresentação.
- **Server Actions** para mutações, com validação `zod` e tratamento de `DomainError`.
- Posts dos módulos Programação/Eventos usam **criar + excluir** (a edição inline não estava nos protótipos); Posts e Projetos têm **CRUD completo**.

## 8. Implementado em 03/06/2026

- **Edição de sessões e eventos**: novas rotas
  `/admin/programacao/[id]/editar` e `/admin/eventos/[id]/editar`, com
  `updateSessionAction`/`updateEventAction` e formulários reutilizáveis
  (`AdminSessionForm`/`AdminEventForm`) compartilhados entre criar e editar.
- **Categorias dinâmicas (FK real)**: `ProgramSession`/`Event` deixaram de gravar
  o nome como texto e passaram a referenciar `Category` por `categoryId`
  (migration `program_event_category_fk`, com backfill por nome, aplicada no
  Render). Os `select` enviam o id; as views expõem `categoryId` + `categoryName`.
- **Middleware de sessão admin**: `src/middleware.ts` protege `/admin/*` na borda
  (Auth.js v5 com `auth.config.ts` edge-safe), além da guarda no layout `(panel)`.

## 9. Pendências / próximos passos

- **Deploy no Render**: criar o Web Service (build `npm install && npm run build`, start `npm run start`), cadastrar as variáveis de ambiente e rodar `npm run db:deploy`.
- **Imagens**: hoje as capas ficam no banco como data-URL. Se o volume crescer, migrar para um object storage e guardar só a URL.
- Trocar a senha padrão do admin (`senha123`).

## 10. Mapa de rotas

As públicas usam o grupo `(public)` (layout público, `public.css`); as do painel
usam `admin/(panel)` (layout protegido, `admin.css`).

### Públicas

| Rota | Arquivo | Descrição |
|---|---|---|
| `/` | `app/(public)/page.tsx` | Home com posts em destaque |
| `/posts` | `app/(public)/posts/page.tsx` | Listagem com filtro por categoria |
| `/posts/[slug]` | `app/(public)/posts/[slug]/page.tsx` | Post individual (404 real; tipo galeria → 307 para `/projetos/[slug]`) |
| `/programacao` | `app/(public)/programacao/page.tsx` | Agenda por dia + indicador "Ao vivo" |
| `/eventos` | `app/(public)/eventos/page.tsx` | Evento em destaque + grade com filtro de formato |
| `/eventos/[slug]` | `app/(public)/eventos/[slug]/page.tsx` | Detalhe informativo do evento |
| `/projetos` | `app/(public)/projetos/page.tsx` | Índice de coleções publicadas |
| `/projetos/[slug]` | `app/(public)/projetos/[slug]/page.tsx` | Galeria; cada card abre o post vinculado |

### Admin

| Rota | Arquivo | Descrição |
|---|---|---|
| `/admin` | `app/admin/page.tsx` | Redireciona (307) para `/admin/posts` |
| `/admin/login` | `app/admin/login/page.tsx` | Login (fora do grupo protegido) |
| `/admin/posts` | `app/admin/(panel)/posts/page.tsx` | Lista com abas, busca e exclusão |
| `/admin/posts/novo` | `app/admin/(panel)/posts/novo/page.tsx` | Criar post |
| `/admin/posts/[id]/editar` | `app/admin/(panel)/posts/[id]/editar/page.tsx` | Editar post |
| `/admin/programacao` | `app/admin/(panel)/programacao/page.tsx` | Nova sessão + lista |
| `/admin/programacao/[id]/editar` | `app/admin/(panel)/programacao/[id]/editar/page.tsx` | Editar sessão |
| `/admin/eventos` | `app/admin/(panel)/eventos/page.tsx` | Novo evento + lista |
| `/admin/eventos/[id]/editar` | `app/admin/(panel)/eventos/[id]/editar/page.tsx` | Editar evento |
| `/admin/projetos` | `app/admin/(panel)/projetos/page.tsx` | Lista de coleções |
| `/admin/projetos/novo` | `app/admin/(panel)/projetos/novo/page.tsx` | Construtor de galeria |
| `/admin/projetos/[id]/editar` | `app/admin/(panel)/projetos/[id]/editar/page.tsx` | Editar galeria |

### API

| Rota | Arquivo | Descrição |
|---|---|---|
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | Handlers do Auth.js (login/logout/sessão) |

Layouts: `app/layout.tsx` (raiz) · `app/(public)/layout.tsx` (público) ·
`app/admin/layout.tsx` (carrega `admin.css`) · `app/admin/(panel)/layout.tsx`
(guarda de sessão — sem sessão redireciona para `/admin/login`).

## 11. Casos de uso e server actions

Os casos de uso vivem em `src/core/application/<módulo>/` e são montados no
`container.ts`. As mutações da apresentação passam por **server actions**
(`src/presentation/actions/`), que validam com `zod`, chamam o caso de uso e
tratam `DomainError`.

| Módulo | Casos de uso | Server action |
|---|---|---|
| Posts | `create`, `update`, `delete`, `get-by-slug`, `list`, `list-published` (+ `slug-uniqueness`) | `post-actions.ts` |
| Categorias | `list-categories` | — |
| Auth | `authenticate` | `auth-actions.ts` |
| Programação | `program.usecases.ts` (create / update / list / delete) | `program-actions.ts` |
| Eventos | `event.usecases.ts` (create / update / list / delete) | `event-actions.ts` |
| Projetos | `project.usecases.ts` (create / update / list / delete) | `project-actions.ts` |

Portas (interfaces) em `src/core/application/ports/`: `id-generator.ts`,
`password-hasher.ts` — implementadas em `src/infrastructure/` (UUID e bcrypt).

## 12. Scripts npm

| Script | Comando | Para quê |
|---|---|---|
| `dev` | `next dev` | Servidor de desenvolvimento |
| `build` | `prisma generate && next build` | Build de produção (gera o client antes) |
| `start` | `next start` | Sobe o build de produção |
| `lint` | `next lint` | ESLint |
| `typecheck` | `tsc --noEmit` | Checagem de tipos sem emitir |
| `db:generate` | `prisma generate` | Gera o Prisma Client |
| `db:migrate` | `prisma migrate dev` | Cria/aplica migrations em desenvolvimento |
| `db:deploy` | `prisma migrate deploy` | Aplica migrations em produção |
| `db:seed` | `tsx prisma/seed.ts` | Popula dados de exemplo (idempotente) |
| `db:studio` | `prisma studio` | Inspeção visual do banco |

Stack fixada no `package.json`: Next 15.1, React 19, Prisma 6.2,
NextAuth 5 (beta), `zod` 3.24, `bcryptjs`, `tsx` e TypeScript 5.7.
