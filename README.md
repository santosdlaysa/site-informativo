# MeuBlog

Blog com área pública e painel administrativo, construído em **Next.js (App Router) + TypeScript**
seguindo **Clean Architecture**, com **PostgreSQL** (Render) via **Prisma** e autenticação com
**Auth.js (NextAuth)**.

O design original (protótipos HTML/CSS/JS exportados do Claude Design) está preservado em
`design-reference/` e serve de referência visual — a UI foi reconstruída em React reaproveitando o
mesmo sistema visual (`src/styles/public.css` e `src/styles/admin.css`).

## Arquitetura

A dependência aponta sempre para dentro (apresentação → aplicação → domínio). A infraestrutura
implementa as portas definidas no domínio.

```
src/
├─ core/
│  ├─ domain/                 # Entidades, value objects, enums, PORTAS de repositório, erros
│  │  ├─ post/  category/  user/  shared/
│  └─ application/            # Casos de uso (orquestram o domínio) + DTOs + portas (id, hasher)
│     ├─ posts/  categories/  auth/  ports/
├─ infrastructure/            # Implementações concretas das portas
│  ├─ database/               # Prisma client, mappers, repositórios
│  ├─ auth/                   # NextAuth, bcrypt hasher
│  ├─ ids/                    # Gerador de id (UUID)
│  └─ container.ts            # Composition root (monta os casos de uso)
└─ app/ + presentation/       # Next.js (rotas, server actions) e componentes/UI
```

- **Domínio** não importa nada de framework, Prisma ou React.
- **Aplicação** depende só do domínio (via interfaces).
- **Infraestrutura** e **apresentação** dependem das camadas internas, nunca o contrário.
- O `container` é o único ponto que conhece todas as camadas e injeta as dependências.

## Pré-requisitos

- Node.js 20+ (testado em 22)
- Um banco PostgreSQL — em produção, o **PostgreSQL do Render**

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha:

   - `DATABASE_URL` — a *External Database URL* do banco no Render (inclui `?sslmode=require`).
   - `AUTH_SECRET` — gere com `openssl rand -base64 32`.
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` — credenciais do admin criado no seed.

3. Gere o client, crie o schema e popule os dados iniciais:

   ```bash
   npm run db:generate
   npm run db:migrate     # cria as tabelas (dev)
   npm run db:seed        # admin + categorias + posts de exemplo
   ```

4. Rode o app:

   ```bash
   npm run dev
   ```

   - Site público: `http://localhost:3000`
   - Painel: `http://localhost:3000/admin/login`

## Deploy no Render

- Crie um **PostgreSQL** e um **Web Service** apontando para este repositório.
- Build: `npm install && npm run build` · Start: `npm run start`.
- Variáveis de ambiente: `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_*`.
- Aplique as migrations no banco gerenciado com `npm run db:deploy` (e `npm run db:seed` na primeira vez).

## Escopo implementado

**Vertical slice de Posts**, ponta a ponta sobre a arquitetura:

- Área pública: home, listagem de posts (filtro por categoria), página individual do post, layout
  responsivo, contatos no rodapé.
- Painel: login administrativo (Auth.js), listagem de posts (abas, busca, excluir), criação e
  edição com seleção de menu, rascunho/publicado e upload de capa.

O schema do banco (`prisma/schema.prisma`) já cobre todos os módulos do escopo
(Programação, Eventos e Projetos/galeria). As páginas públicas de **Programação** e **Eventos** estão
como placeholders e são o próximo passo natural, seguindo o mesmo padrão de camadas dos Posts.
