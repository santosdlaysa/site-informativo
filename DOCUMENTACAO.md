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
- **`<image-slot>`** dos protótipos virou o componente React `ImageSlot` (exibe imagem do banco em read-only e, no admin, faz upload convertendo para data-URL — sem storage externo nesta fase).
- **Read models** nas consultas (dados já "achatados") e **entidades** nos comandos — CQRS-lite, sem vazar o ORM para a apresentação.
- **Server Actions** para mutações, com validação `zod` e tratamento de `DomainError`.
- Posts dos módulos Programação/Eventos usam **criar + excluir** (a edição inline não estava nos protótipos); Posts e Projetos têm **CRUD completo**.

## 8. Pendências / próximos passos

- **Imagens**: hoje as capas são salvas como data-URL no banco. Para produção, migrar para um object storage (ex.: S3/Cloudinary/Render Disk) e guardar só a URL.
- **Edição** de sessões e eventos (os casos de uso `UpdateSession`/`UpdateEvent` já existem no container; falta a UI).
- **Categorias dinâmicas** em Programação/Eventos (hoje o `select` usa os nomes das categorias; o campo é gravado como texto).
- **Deploy no Render**: criar o Web Service (build `npm install && npm run build`, start `npm run start`), cadastrar as variáveis de ambiente e rodar `npm run db:deploy`.
- Trocar a senha padrão do admin (`senha123`).
- Endurecer a sessão admin com `middleware` (hoje a proteção está no layout server-side, que já cobre todas as rotas do painel).
