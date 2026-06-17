# ⚡ Quick Start - Vercel em 10 Minutos

Guia rápido para fazer deploy no Vercel. Para detalhes, veja [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md).

---

## 🚀 10 Passos para Deploy

### 1️⃣ Faça commit final (2 min)

```bash
git add -A
git commit -m "chore: prepare for vercel deploy"
git push origin master
```

### 2️⃣ Acesse Vercel (1 min)

https://vercel.com/dashboard → "Add New" → "Project"

### 3️⃣ Conecte seu GitHub (2 min)

1. "Import Git Repository"
2. Busque "site-informativo"
3. Clique "Import"

### 4️⃣ Configure Framework (30 seg)

Selecione: **Next.js**

### 5️⃣ Adicione Variáveis de Ambiente (3 min)

**No Vercel:**
Settings → Environment Variables

Adicione:

```env
DATABASE_URL=postgresql://...?sslmode=require
NEXTAUTH_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=gere-com-openssl-rand-base64-32
ADMIN_EMAIL=seu-email@seu-dominio.com
ADMIN_PASSWORD=SenhaForte2024!Unica
ADMIN_NAME=Seu Nome
SITE_MAINTENANCE=false
```

### 6️⃣ Clique "Deploy" (5 min)

Aguarde até ver: ✅ "Production Deployment Complete"

### 7️⃣ Execute Seed em Produção (2 min)

Instale Vercel CLI (uma vez):
```bash
npm install -g vercel
vercel login
```

Depois execute:
```bash
export $(cat .env.local | xargs)
npx prisma migrate deploy
npx prisma db seed
```

### 8️⃣ Teste Login

Acesse: `https://seu-projeto.vercel.app/admin/login`

Login com:
- Email: seu-email@seu-dominio.com
- Senha: SenhaForte2024!Unica

### 9️⃣ Configurar Domínio (5 min)

**No Vercel:**
Settings → Domains → "Add Domain"

Entre com seu domínio (ex: `seu-site.com`)

Siga instruções de DNS

### 🔟 Ativar HTTPS

Vercel ativa automaticamente após configurar domínio.

Aguarde ~5 minutos e acesse: `https://seu-site.com`

---

## ✅ Checklist Final

- [ ] Código no GitHub
- [ ] Projeto criado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] Seed executado
- [ ] Login funciona
- [ ] Domínio configurado (opcional)
- [ ] HTTPS funcionando

**Pronto!** 🎉 Seu site está ao vivo!

---

## 📝 Comandos Importantes

```bash
# Ver logs em tempo real
vercel logs --tail

# Redeploy última versão
vercel deploy --prod

# Puxar variáveis localmente
vercel env pull

# Resetar banco de dados (⚠️ DELETA TUDO)
export $(cat .env.local | xargs)
npx prisma migrate reset
npx prisma db seed
```

---

## 🆘 Problemas Comuns

| Erro | Solução |
|------|---------|
| "Database connection failed" | Verifique DATABASE_URL em Vercel |
| "ADMIN_EMAIL not defined" | Configure variáveis em Environment Variables |
| "Login não funciona" | Execute `npx prisma db seed` |
| "HTTPS não funciona" | Aguarde 10 minutos e recarregue |

---

Para guia completo, veja: [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md)

**Boa sorte!** 🚀
