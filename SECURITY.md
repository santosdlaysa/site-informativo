# Guia de Segurança - Site Informativo

## ⚠️ Credenciais de Administrador

### Problema Corrigido
As credenciais padrão (`admin@meublog.com` / `senha123`) estavam expostas no código-fonte e no arquivo `.env.example`. Isso representava um risco de segurança sério.

### O que foi mudado
1. **seed.ts** — Agora obriga o uso de variáveis de ambiente (`ADMIN_EMAIL` e `ADMIN_PASSWORD`)
2. **.env.example** — Removidas credenciais padrão; agora contém apenas placeholders de exemplo

### Como configurar corretamente

#### 1. Crie um arquivo `.env.local` (nunca commitar)
```bash
cp .env.example .env.local
```

#### 2. Defina credenciais seguras
```env
ADMIN_EMAIL="seu-email-real@seu-dominio.com"
ADMIN_PASSWORD="uma-senha-segura-e-unica-de-no-minimo-12-caracteres"
ADMIN_NAME="Seu Nome"
DATABASE_URL="postgresql://user:pass@host:port/dbname"
AUTH_SECRET="gere-com-openssl-rand-base64-32"
```

#### 3. Execute o seed com as novas credenciais
```bash
npx prisma db seed
```

#### 4. Altere a senha no painel admin assim que fizer login
- Acesse `/admin`
- Vá para a seção de Usuários/Configurações
- Mude sua senha para algo ainda mais seguro

### Boas Práticas de Segurança

✅ **Fazer:**
- Use senhas com pelo menos 12 caracteres
- Inclua maiúsculas, minúsculas, números e símbolos
- Use uma senha diferente para cada ambiente (dev, staging, prod)
- Altere a senha default imediatamente após o primeiro login
- Use HTTPS em produção (já está configurado)
- Revise arquivo `.env` está no `.gitignore` antes de commitar

❌ **Não fazer:**
- Nunca commite arquivos `.env` com credenciais reais
- Nunca mantenha credenciais padrão em produção
- Nunca compartilhe credenciais por mensagens ou email não criptografados
- Nunca exponha `NEXTAUTH_SECRET` na URL ou logs

### Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] `.env.local` contém credenciais seguras e **únicas**
- [ ] `NEXTAUTH_SECRET` foi gerado com `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` aponta para o domínio correto (https)
- [ ] Senha do admin foi alterada após primeiro login
- [ ] Banco de dados usa conexão HTTPS/SSL (`?sslmode=require`)
- [ ] Revise logs para garantir que não há credenciais expostas

### Se Credenciais Foram Comprometidas

Se você acidentalmente commitou ou expôs credenciais:

1. **Imediatamente:**
   - Altere a senha no painel admin
   - Revise acesso recente no banco de dados

2. **Limpe o histórico git:**
   ```bash
   # CUIDADO: Apenas execute em repositórios privados
   git-filter-repo --path .env --invert-paths
   git push origin --force-with-lease
   ```

3. **Notifique:**
   - Equipe de segurança/DevOps
   - Revise logs de auditoria do servidor

---

**Último update:** 2026-06-17
