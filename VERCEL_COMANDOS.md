# 🔧 Comandos para Vercel - Copy & Paste

Copie e cole estes comandos no seu terminal **em ordem** para fazer deploy.

---

## 📝 Pré-Deploy (Local)

### 1. Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

**Copie a saída!** Você vai precisar em alguns minutos.

Exemplo de saída:
```
ocUx3aSF87Gu12X2CwLm6Lc7Quo8L+cHjB8HDwkZY/Q=
```

### 2. Preparar código

```bash
git add -A
git commit -m "chore: prepare for vercel deploy"
git push origin master
```

---

## 🌐 Passo 1: Vercel Dashboard

### 3. Criar projeto

```
1. Acesse: https://vercel.com/dashboard
2. Clique: "Add New" → "Project"
3. Selecione: "site-informativo"
4. Clique: "Import"
5. Framework: "Next.js"
6. Clique: "Deploy"
↓
Aguarde 3-5 minutos até ver: ✅ Production Deployment Complete
```

---

## 🔑 Passo 2: Configurar Environment Variables

### 4. Adicionar variáveis no Vercel

**No Vercel Dashboard:**
```
Settings → Environment Variables
```

**Copie e cole cada linha abaixo:**

#### A. DATABASE_URL
```
DATABASE_URL
```
**Valor:** Copie do Render.com (sua postgres URL)
```
postgresql://siteinfo_user:4FM50vqwlzpelp5N4yJcq6KD0p6ij4Vt@dpg-d8fjaal7vvec738d2em0-a.virginia-postgres.render.com/siteinfo?sslmode=require
```

#### B. NEXTAUTH_URL
```
NEXTAUTH_URL
```
**Valor:** Cole a saída do `openssl rand -base64 32` (de cima)
```
https://seu-projeto.vercel.app
```

#### C. NEXTAUTH_SECRET
```
NEXTAUTH_SECRET
```
**Valor:** Cole o secret gerado acima
```
ocUx3aSF87Gu12X2CwLm6Lc7Quo8L+cHjB8HDwkZY/Q=
```

#### D. ADMIN_EMAIL
```
ADMIN_EMAIL
```
**Valor:** Seu email real
```
wesleymenandes@gmail.com
```

#### E. ADMIN_PASSWORD
```
ADMIN_PASSWORD
```
**Valor:** Senha segura (12+ chars)
```
SenhaSegura2024!Wesley
```

#### F. ADMIN_NAME
```
ADMIN_NAME
```
**Valor:** Seu nome
```
Wesley
```

#### G. SITE_MAINTENANCE
```
SITE_MAINTENANCE
```
**Valor:** 
```
false
```

**Depois de adicionar todas:** Clique "Save"

---

## 🔄 Passo 3: Redeploy com Variáveis

### 5. Forçar redeploy

**No Vercel:**
```
Deployments → Clique na última versão → Redeploy
```

Aguarde deploy completar.

---

## 🗄️ Passo 4: Executar Seed em Produção

### 6. Instalar Vercel CLI (uma vez)

```bash
npm install -g vercel
```

### 7. Fazer login no Vercel

```bash
vercel login
```

(Vai abrir navegador, clique para confirmar)

### 8. Carregar variáveis do .env.local

```bash
export $(cat .env.local | xargs)
```

### 9. Executar migrations

```bash
npx prisma migrate deploy
```

### 10. Executar seed

```bash
npx prisma db seed
```

**Saída esperada:**
```
✓ Projeto Juventude Atualizada — Centro Social (12 fotos)
✓ Mutirão de Atendimentos a Pacientes com Doenças Genéticas (13 fotos)
✓ 1º Fórum de Roraima em Doenças Raras e Neurodivergentes (13 fotos)
Seed concluído: admin, categorias e 3 posts de ações.
```

---

## ✅ Passo 5: Verificar Deploy

### 11. Testar acesso

**Abra no navegador:**
```
https://seu-projeto.vercel.app/admin/login
```

**Faça login com:**
- **Email:** wesleymenandes@gmail.com
- **Senha:** SenhaSegura2024!Wesley

**Se funcionar:** ✅ Deploy bem-sucedido!

---

## 🌐 Passo 6: Configurar Domínio (Opcional)

### 12. Adicionar domínio

**No Vercel:**
```
Settings → Domains → "Add Domain"
```

Digite seu domínio:
```
seu-site.com
```

### 13. Configurar DNS

**No seu provedor (GoDaddy, Namecheap, etc):**

Crie um CNAME:
- **Nome:** @ (root)
- **Tipo:** CNAME
- **Valor:** cname.vercel-dns.com

**Aguarde propagação (até 48h)**

### 14. Acessar com seu domínio

```
https://seu-site.com
```

---

## 🔒 Comandos Úteis Posteriores

### Ver logs em tempo real
```bash
vercel logs --tail
```

### Ver lista de deployments
```bash
vercel list
```

### Redeploy da versão atual
```bash
vercel deploy --prod
```

### Puxar variáveis de produção localmente
```bash
vercel env pull .env.production.local
```

### Resetar banco de dados (⚠️ DELETA TUDO)
```bash
export $(cat .env.local | xargs)
npx prisma migrate reset
npx prisma db seed
```

---

## 📋 Checklist de Sucesso

Depois de tudo acima, verifique:

- [ ] Seed foi executado sem erros
- [ ] Login funciona: https://seu-projeto.vercel.app/admin/login
- [ ] Credenciais não aparecem na URL
- [ ] Site carrega rápido
- [ ] Domínio aponta para Vercel (se configurou)
- [ ] HTTPS funciona sem avisos

---

## 🆘 Se Algo Quebrou

### Seed não executa

```bash
# Verificar variáveis carregadas
echo $DATABASE_URL
echo $ADMIN_EMAIL
# Devem mostrar valores, não vazio

# Tentar novamente
export $(cat .env.local | xargs)
npx prisma db seed
```

### Login não funciona

```bash
# Verificar se seed foi executado
export $(cat .env.local | xargs)
npx prisma db seed

# Verificar se DATABASE_URL está corret em Vercel
# Settings → Environment Variables → DATABASE_URL
# Deve ter ?sslmode=require no final
```

### Build falha

```bash
# Verificar dependências localmente
npm install
npm run build

# Se funciona local, fazer push
git push origin master

# Vercel redeploy automaticamente
```

### Site lento

```bash
# Vercel tem limite em plano gratuito
# Soluções:
# 1. Upgrade para Hobby ($20/mês)
# 2. Otimizar imagens (WebP, compressão)
# 3. Usar cache agressivo
```

---

## 💡 Dicas Importantes

1. **NUNCA commite .env.local**
   - Está no `.gitignore` ✅
   - Contém credenciais reais

2. **Cada environment diferente**
   - Dev: .env.local (seu computador)
   - Prod: Environment Variables (Vercel)

3. **Altere senha regularmente**
   - Especialmente em produção
   - Use senha única para cada site

4. **Monitore seu site**
   - Verificar logs regularmente
   - Ativar Web Analytics no Vercel

5. **Backup do banco**
   - Render.com faz automaticamente
   - Teste restauração 1x/mês

---

## 📞 Precisa de Ajuda?

- **Erros do Next.js:** https://nextjs.org/docs/app/building-your-application/routing/error-handling
- **Problemas Vercel:** https://vercel.com/support
- **Banco PostgreSQL:** https://www.postgresql.org/docs/

---

**Você conseguiu!** 🎉 Seu site está ao vivo no Vercel!

Para mais detalhes, leia [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md)
