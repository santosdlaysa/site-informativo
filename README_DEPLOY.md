# 📦 Guia de Deploy - Resumo Executivo

## 🎯 Fluxo de Deploy no Vercel

```
┌─────────────────────────────────────────────────────────────┐
│                    SEU COMPUTADOR LOCAL                      │
│                                                               │
│  1. git push → GitHub                                        │
│  2. Seed com credenciais: npx prisma db seed                 │
│  3. Teste local: npm run dev                                 │
│                                                               │
│  .env.local (NUNCA commitar!)                                │
│  ├─ DATABASE_URL = postgres://...                            │
│  ├─ NEXTAUTH_SECRET = ...                                    │
│  ├─ ADMIN_EMAIL = seu@email.com                              │
│  └─ ADMIN_PASSWORD = SenhaSegura2024!                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        GITHUB                                │
│  (código público - SEM .env.local)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL DASHBOARD                          │
│                                                               │
│  1. Conectar repositório GitHub                              │
│  2. Settings → Environment Variables:                        │
│     • DATABASE_URL (de Render.com)                           │
│     • NEXTAUTH_SECRET (gerar novo!)                          │
│     • ADMIN_EMAIL                                            │
│     • ADMIN_PASSWORD                                         │
│  3. Clique "Deploy"                                          │
│                                                               │
│  ✓ Vercel cria servidor Node.js                              │
│  ✓ Instala dependências                                      │
│  ✓ Faz build do Next.js                                      │
│  ✓ Deploy em https://seu-projeto.vercel.app                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    BANCO DE DADOS                            │
│                   (Render.com PostgreSQL)                    │
│                                                               │
│  ✓ Vercel conecta automaticamente                            │
│  ✓ Execute seed para criar admin                             │
│  ✓ Dados persistem entre redeploys                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   SITE AO VIVO! 🎉                           │
│                                                               │
│  ✓ https://seu-projeto.vercel.app                            │
│  ✓ /admin/login funciona                                     │
│  ✓ Login com admin@seu-email.com                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Passos em Detalhes

### Passo 1: Preparação Local (5 min)

```bash
# Atualizar código local
git pull origin master

# Verificar que não há credenciais no git
git status | grep ".env"
# Não deve mostrar nada

# Fazer último commit
git add -A
git commit -m "chore: ready for vercel deploy"
git push origin master
```

### Passo 2: Criar Projeto no Vercel (5 min)

```
1. Acesse https://vercel.com
2. Faça login com GitHub
3. Dashboard → "Add New" → "Project"
4. Selecione "site-informativo"
5. Clique "Import"
6. Selecione Framework: "Next.js"
7. Clique "Deploy"
   ↓
   Aguarde ~3-5 minutos
   ↓
   ✅ Production Deployment Complete
```

### Passo 3: Configurar Variáveis (3 min)

**No Vercel Dashboard:**

```
Settings → Environment Variables
```

Adicione cada variável (copie/cole):

| Variável | Valor | Onde Obter |
|----------|-------|-----------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` | Render.com |
| `NEXTAUTH_URL` | `https://seu-projeto.vercel.app` | Vercel vai gerar |
| `NEXTAUTH_SECRET` | (gerate) | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | seu-email@seu-dominio.com | Seu email |
| `ADMIN_PASSWORD` | SenhaForte2024!Unica | Crie senha segura |
| `ADMIN_NAME` | Seu Nome | Seu nome |
| `SITE_MAINTENANCE` | false | Fixo |

**Depois:** Clique "Save" → "Redeploy" na aba Deployments

### Passo 4: Executar Seed (2 min)

```bash
# Instale Vercel CLI (uma vez)
npm install -g vercel

# Faça login
vercel login
# (vai abrir navegador para confirmar)

# Execute seed
export $(cat .env.local | xargs)
npx prisma migrate deploy
npx prisma db seed

# Saída esperada:
# ✓ Projeto Juventude Atualizada — Centro Social (12 fotos)
# ✓ Mutirão de Atendimentos... (13 fotos)
# ✓ 1º Fórum de Roraima... (13 fotos)
# Seed concluído: admin, categorias e 3 posts
```

### Passo 5: Testar Login (1 min)

```
1. Acesse: https://seu-projeto.vercel.app/admin/login
2. Faça login:
   Email: seu-email@seu-dominio.com
   Senha: SenhaForte2024!Unica
3. Se funcionar: ✅ Deploy bem-sucedido!
```

### Passo 6: Configurar Domínio (opcional, 5 min)

```
1. No Vercel: Settings → Domains
2. Clique "Add Domain"
3. Digite seu domínio: seu-site.com
4. No seu DNS (GoDaddy, Namecheap, etc):
   Crie CNAME:
   Nome: @ (root)
   Valor: cname.vercel-dns.com
5. Aguarde propagação (até 48h)
6. Acesse: https://seu-site.com
```

---

## 🔒 Checklist de Segurança

**ANTES de clicar Deploy:**

- [ ] `.env.local` NÃO está no git (`git status` deve estar limpo)
- [ ] `.env.local` contém credenciais reais (não padrão)
- [ ] `NEXTAUTH_SECRET` foi gerado com `openssl rand -base64 32`
- [ ] `DATABASE_URL` usa `?sslmode=require`
- [ ] `SITE_MAINTENANCE="false"` em produção

**DEPOIS de fazer Deploy:**

- [ ] Seed foi executado (verificar no banco)
- [ ] Login funciona em HTTPS
- [ ] Credenciais NÃO aparecem na URL após login
- [ ] Senha foi alterada (depois fazer login pela primeira vez)

---

## 🆘 Solução Rápida de Problemas

### ❌ "Erro ao fazer login"
```bash
# Solução: Seed não foi executado
export $(cat .env.local | xargs)
npx prisma db seed
```

### ❌ "Database connection failed"
```bash
# Solução: DATABASE_URL está errado
# 1. Copie URL do Render.com
# 2. Paste em Vercel → Settings → Environment Variables
# 3. Redeploy
```

### ❌ "Build falhou"
```bash
# Solução: Falta dependência
npm install
npm run build
git push
# Redeploy automático no Vercel
```

### ❌ "NEXTAUTH_SECRET inválido"
```bash
# Solução: Gere novo secret
openssl rand -base64 32
# Copie para Vercel → Environment Variables
# Redeploy
```

---

## 📊 Arquitetura em Produção

```
Internet
   ↓
┌──────────────────────────────────┐
│     Vercel Edge Network          │
│  (CDN global - super rápido)     │
└──────────────────────────────────┘
   ↓
┌──────────────────────────────────┐
│  Vercel Serverless Functions     │
│  (Node.js + Next.js)             │
│  - /admin/login                  │
│  - /api/auth/*                   │
│  - /posts, /eventos, etc         │
└──────────────────────────────────┘
   ↓
┌──────────────────────────────────┐
│   Render PostgreSQL Database     │
│   (Dados persistem)              │
│   - Users                        │
│   - Posts                        │
│   - Events                       │
│   - etc                          │
└──────────────────────────────────┘
```

**Benefícios:**
✅ CDN global (muito rápido)
✅ Auto-scaling (aumenta/diminui automaticamente)
✅ Backup automático do banco
✅ SSL/HTTPS gratuito
✅ Deploy contínuo (automático ao push)

---

## 📚 Documentação Relacionada

| Arquivo | Para O Quê |
|---------|-----------|
| **DEPLOY_VERCEL.md** | Guia detalhado completo |
| **VERCEL_QUICK_START.md** | Resumo em 10 passos |
| **SECURITY.md** | Boas práticas de segurança |
| **SEGURANCA_CHECKLIST.md** | Checklist pré e pós deploy |

---

## ⏱️ Tempo Total Estimado

| Passo | Tempo |
|-------|-------|
| 1. Preparação local | 5 min |
| 2. Criar projeto Vercel | 5 min |
| 3. Configurar variáveis | 3 min |
| 4. Executar seed | 2 min |
| 5. Testar login | 1 min |
| **TOTAL** | **~15 minutos** |

---

## 🎓 Conceitos Importantes

**Vercel:** Plataforma para deploy de Next.js (simplifica tudo)

**Edge Network:** Servidores espalhados pelo mundo (CDN = rápido)

**Serverless:** Você não gerencia servidores (Vercel cuida)

**Environment Variables:** Credenciais que não estão no código

**Seed:** Script que popula banco com dados iniciais

**HTTPS:** Protocolo seguro (criptografa dados em trânsito)

---

## ✅ Status Final

Depois de seguir todos os passos:

- ✅ Código no GitHub
- ✅ App rodando no Vercel
- ✅ Banco em PostgreSQL (Render)
- ✅ Admin criado via seed
- ✅ Login funciona
- ✅ Domínio configurado (opcional)
- ✅ HTTPS ativado
- ✅ **Site ao vivo! 🚀**

---

**Próximo passo:** Compartilhe seu site com o mundo! 🌍

Para mais detalhes, leia [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md)

