# 🚀 Deploy Seguro no Vercel

Guia passo-a-passo para fazer deploy do seu site no Vercel de forma segura.

---

## 📋 Pré-Requisitos

Você precisa de:
- ✅ Conta no Vercel (gratuita) - https://vercel.com
- ✅ Conta GitHub (para conectar repositório)
- ✅ Banco de dados PostgreSQL - Recomendo Render.com (vem configurado)
- ✅ Código commitado no GitHub

---

## 1️⃣ Preparar Repositório

### 1.1 Certifique-se que `.env.local` NÃO está commitado:

```bash
git status | grep ".env"
# Não deve mostrar nada
```

### 1.2 Verifique que `.env.local` está no `.gitignore`:

```bash
cat .gitignore | grep ".env"
# Deve mostrar: .env e .env*.local
```

### 1.3 Faça commit final antes de deploy:

```bash
git add -A
git commit -m "chore: prepare for vercel deploy"
git push origin master
```

---

## 2️⃣ Configurar Banco de Dados em Produção

### Opção A: Usar Render.com (Recomendado)

Se você já tem PostgreSQL no Render.com, apenas copie a URL:

```bash
# No Render Dashboard:
# 1. Vá para sua database
# 2. Copie "External Database URL"
# 3. Cole em VERCEL → Variáveis de Ambiente → DATABASE_URL
```

**Formato esperado:**
```
postgresql://usuario:senha@dpg-xxxxx.region-postgres.render.com/database?sslmode=require
```

### Opção B: Criar Novo Banco no Render.com

1. Acesse https://render.com
2. Dashboard → New → PostgreSQL
3. Preencha:
   - **Name:** `siteinfo-db`
   - **Database:** `siteinfo`
   - **Region:** Mesmo dos EUA (us-east-1)
4. Copie "External Database URL"

---

## 3️⃣ Criar Projeto no Vercel

### 3.1 Acesse Vercel Dashboard

https://vercel.com/dashboard

### 3.2 Clique "Add New..."

Selecione "Project"

### 3.3 Selecione seu repositório GitHub

```
Clique em "Import Git Repository"
↓
Procure por "site-informativo"
↓
Clique "Import"
```

### 3.4 Configure o Projeto

**Framework:** Selecione `Next.js`

**Root Directory:** deixe vazio (padrão)

---

## 4️⃣ Configurar Variáveis de Ambiente

### ⚠️ CRÍTICO: Nunca exponha credenciais!

**No Vercel Dashboard:**
1. Clique na aba **Environment Variables**
2. Adicione cada variável:

```env
DATABASE_URL="postgresql://usuario:senha@...?sslmode=require"
NEXTAUTH_URL="https://seu-dominio.vercel.app"
NEXTAUTH_SECRET="gere-novo-com-openssl-rand-base64-32"
ADMIN_EMAIL="seu-email@seu-dominio.com"
ADMIN_PASSWORD="senha-segura-unica-12+-chars"
ADMIN_NAME="Seu Nome"
SITE_MAINTENANCE="false"
```

### Como Gerar NEXTAUTH_SECRET:

```bash
# No seu terminal local:
openssl rand -base64 32
# Copie a saída para NEXTAUTH_SECRET no Vercel
```

### Configurar por Environment

Recomendado: Configure variáveis diferentes por ambiente:

```
Development (Preview):
- DATABASE_URL: banco de testes
- NEXTAUTH_SECRET: secret temporário
- ADMIN_PASSWORD: senha de teste

Production:
- DATABASE_URL: banco real
- NEXTAUTH_SECRET: secret único e forte
- ADMIN_PASSWORD: senha segura e única
```

---

## 5️⃣ Deploy Inicial

### 5.1 Clique "Deploy"

O Vercel vai:
1. Fazer clone do repositório
2. Instalar dependências
3. Executar `npm run build`
4. Fazer deploy

Isso pode levar 3-5 minutos.

### 5.2 Aguarde a mensagem de sucesso

```
✓ Production Deployment Complete
```

### 5.3 Acesse seu site

Vercel vai gerar URL: `https://seu-projeto.vercel.app`

---

## 6️⃣ Executar Seed em Produção

### ⚠️ IMPORTANTE: Seed é OBRIGATÓRIO antes de acessar o site

Depois do primeiro deploy, você precisa executar o seed para criar o usuário admin.

### 6.1 Opção A: Usar Vercel CLI (Recomendado)

```bash
# Instale Vercel CLI (uma vez)
npm install -g vercel

# Faça login
vercel login

# Execute seed em produção
vercel env pull .env.production.local
ADMIN_EMAIL="seu-email@seu-dominio.com" ADMIN_PASSWORD="sua-senha-segura" npx prisma migrate deploy && npx prisma db seed
```

### 6.2 Opção B: Conectar Banco Manualmente

Se a opção A não funcionar:

```bash
# 1. No seu banco de dados (Render/PostgreSQL):
#    Copie a External Database URL

# 2. No seu terminal local:
export DATABASE_URL="sua-url-copiada"
export ADMIN_EMAIL="seu-email@seu-dominio.com"
export ADMIN_PASSWORD="sua-senha-segura"

# 3. Execute as migrations e seed:
npx prisma migrate deploy
npx prisma db seed
```

### 6.3 Verifique que funcionou

```bash
# Acesse seu site:
https://seu-projeto.vercel.app/admin/login

# Faça login com:
Email: seu-email@seu-dominio.com
Senha: sua-senha-segura
```

Se funcionar → ✅ Deploy bem-sucedido!

---

## 7️⃣ Configurar Domínio Customizado

### 7.1 No Vercel Dashboard

**Settings → Domains**

### 7.2 Adicionar domínio

Clique "Add Domain"

Entre com: `seu-dominio.com` (sem www)

### 7.3 Configurar DNS

**Opção A: Apontar DNS (Recomendado)**

No seu provedor de domínio (GoDaddy, Namecheap, etc):

```
Tipo: CNAME
Nome: @ ou sudomínio
Valor: Cname.vercel-dns.com
```

**Opção B: Delegar nameservers**

```
NS1: ns1.vercel-dns.com
NS2: ns2.vercel-dns.com
NS3: ns3.vercel-dns.com
NS4: ns4.vercel-dns.com
```

### 7.4 Aguarde propagação

Pode levar até 48 horas. Verifique com:

```bash
nslookup seu-dominio.com
# Deve mostrar: vercel-dns.com
```

---

## 8️⃣ Ativar HTTPS

### Vercel ativa automaticamente via Let's Encrypt

Após configurar domínio:
1. Aguarde ~5 minutos
2. Acesse https://seu-dominio.com (com HTTPS)
3. Deve funcionar sem avisos

---

## 9️⃣ Alterações e Redeploy

### Quando você muda o código:

```bash
# 1. Commit local
git add -A
git commit -m "feat: sua mudança"

# 2. Push para GitHub
git push origin master

# 3. Vercel redeploy automaticamente
#    (você pode acompanhar no dashboard)
```

### Alterações em variáveis de ambiente:

```bash
# 1. Vá para Vercel Dashboard
# 2. Settings → Environment Variables
# 3. Edite o valor
# 4. Salve
# 5. Vá para Deployments
# 6. Clique "Redeploy" na versão atual
```

---

## 🔟 Monitorar em Produção

### 10.1 Ativar Observabilidade

**Settings → Observability**

Ative:
- ✅ Web Analytics
- ✅ Speed Insights
- ✅ Error Tracking

### 10.2 Revisar Logs

```bash
# Via Vercel CLI:
vercel logs

# Ou no Dashboard:
# Deployments → Clique última versão → Logs
```

### 10.3 Monitorar Uptime

```bash
# Usar ferramentas como:
# - Uptime Robot (gratuita)
# - Pingdom
# - New Relic
```

Configure para alertar se o site ficar offline.

---

## 🔐 Checklist Segurança para Vercel

Antes de acessar o site em produção:

- [ ] `.env.local` NÃO foi commitado
- [ ] `NEXTAUTH_SECRET` é único (gerado com openssl)
- [ ] `ADMIN_PASSWORD` é seguro (12+ chars, sem padrão)
- [ ] `DATABASE_URL` usa `?sslmode=require`
- [ ] Site está em HTTPS (não HTTP)
- [ ] Seed foi executado (usuário admin criado)
- [ ] Login funciona em https://seu-dominio.com/admin/login
- [ ] Credenciais não aparecem na URL após login

---

## 🆘 Troubleshooting

### Erro: "Database connection failed"

```bash
# Solução: Verifique DATABASE_URL

# 1. Copie URL do Render:
#    Dashboard → PostgreSQL → External Database URL

# 2. Cole em Vercel:
#    Settings → Environment Variables → DATABASE_URL

# 3. Redeploy:
#    Deployments → Redeploy
```

### Erro: "ADMIN_EMAIL not defined"

```bash
# Solução: Variáveis de ambiente não estão configuradas

# 1. No Vercel Dashboard:
#    Settings → Environment Variables

# 2. Adicione:
#    - ADMIN_EMAIL
#    - ADMIN_PASSWORD
#    - ADMIN_NAME

# 3. Redeploy
```

### Erro: "CredentialsSignin: Read more at https://errors.authjs.dev"

```bash
# Solução: Seed não foi executado ou credenciais estão erradas

# 1. Execute seed:
export DATABASE_URL="sua-url"
export ADMIN_EMAIL="seu-email"
export ADMIN_PASSWORD="sua-senha"
npx prisma db seed

# 2. Tente login novamente
```

### Erro: "Invalid NEXTAUTH_SECRET"

```bash
# Solução: NEXTAUTH_SECRET não está configurado corretamente

# 1. Gere novo secret:
openssl rand -base64 32

# 2. Cole em Vercel:
#    Settings → Environment Variables → NEXTAUTH_SECRET

# 3. Redeploy
```

### Site muito lento

```bash
# Soluções:
# 1. Vercel gratuito tem limite de requests
# 2. Considere upgrade para Hobby ($20/mês)
# 3. Otimize imagens (WebP, compressão)
# 4. Use cache agressivo para assets estáticos
```

---

## 📊 Plano Gratuito vs Pago

| Feature | Gratuito | Hobby ($20) |
|---------|----------|------------|
| Deployments | Ilimitados | Ilimitados |
| Projetos | 3 | Ilimitados |
| Build time | 6000 min/mês | 400 build hours/mês |
| Serverless Functions | 100GB transfer | Ilimitado |
| Regiões | 1 | 5+ |
| Edge Functions | 5 requisições/dia | Ilimitadas |
| Suporte | Community | Email |

Recomendação: Use **Gratuito** para teste, upgrade para **Hobby** se tiver > 100 visitas/dia.

---

## 🎯 Próximos Passos

1. ✅ Deploy no Vercel (feito acima)
2. ✅ Configurar domínio customizado
3. ✅ Ativar HTTPS
4. ✅ Monitorar em produção
5. ✅ Fazer backup regular do banco de dados

---

## 📞 Suporte

Se tiver problemas:

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth Docs:** https://authjs.dev

---

**Versão:** 1.0  
**Última atualização:** 2026-06-17  
**Status:** ✅ Pronto para deploy
