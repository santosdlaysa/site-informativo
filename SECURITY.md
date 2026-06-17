# Guia de Segurança Completo - Site Informativo

## 🔒 Visão Geral de Segurança

Este guia cobre todas as medidas de segurança implementadas no projeto. Siga este documento religiosamente para garantir que o site está protegido.

---

## 1️⃣ Credenciais de Administrador

### Problema Corrigido
As credenciais padrão (`admin@meublog.com` / `senha123`) estavam expostas. **NUNCA mantenha credenciais padrão em produção.**

### Configuração Correta

#### 1. Crie um arquivo `.env.local` (nunca commitar)
```bash
cp .env.example .env.local
```

#### 2. Defina credenciais seguras
```env
# ⚠️ CREDENCIAIS ÚNICAS - NÃO REUTILIZE EM OUTROS SITES
ADMIN_EMAIL="seu-email-real@seu-dominio.com"
ADMIN_PASSWORD="senha-com-12+-chars_Numero!Simbolo"
ADMIN_NAME="Seu Nome"

# Banco de dados
DATABASE_URL="postgresql://usuario:senha@host:port/dbname?sslmode=require"

# NextAuth - gere com: openssl rand -base64 32
NEXTAUTH_SECRET="gere-uma-chave-aleatoria-de-32-chars-base64"
NEXTAUTH_URL="https://seu-dominio.com"

# Desabilitar manutenção em produção
SITE_MAINTENANCE="false"
```

#### 3. Execute seed com credenciais seguras
```bash
npx prisma db seed
```

#### 4. Altere senha imediatamente após primeiro login
- Acesse `/admin` → Usuários → Editar seu perfil → Alterar senha

---

## 2️⃣ Proteção contra Exposição de Dados Sensíveis

### Implementado:
✅ **Formulário de login:**
- `autoComplete="off"` nos campos de email e senha
- Campos desabilitados durante envio (pending state)
- Valores limpos imediatamente após login bem-sucedido
- Senhas nunca mantidas em localStorage/sessionStorage

✅ **Server Actions:**
- Nunca retornam credenciais ou dados sensíveis
- Mensagens de erro genéricas (não revelam se email existe ou senha está errada)
- Logs de erro não expõem credenciais

✅ **URLs e Redirects:**
- Nunca passam credenciais como parâmetros de URL
- Redirects acontecem do lado do servidor (seguro)
- Sem exposição em histórico do navegador

✅ **Headers HTTP:**
- `Cache-Control: no-store` para páginas de login
- Impede cache de credenciais no navegador

---

## 3️⃣ Headers de Segurança HTTP

Todos os headers abaixo estão configurados em `next.config.mjs`:

| Header | Função | Proteção |
|--------|--------|----------|
| `X-Content-Type-Options: nosniff` | Previne MIME sniffing | XSS |
| `X-XSS-Protection: 1; mode=block` | Habilita proteção XSS do navegador | XSS |
| `X-Frame-Options: DENY` | Previne clickjacking | Clickjacking |
| `Content-Security-Policy` | Whitelist de recursos permitidos | XSS, Injection |
| `Strict-Transport-Security` | Força HTTPS por 1 ano | Man-in-the-Middle |
| `Referrer-Policy` | Controla referrer de requisições | Privacidade |

---

## 4️⃣ Autenticação & Sessão (NextAuth)

### Implementado:
✅ **JWT Strategy:**
- Sessões baseadas em token (stateless)
- Tokens assinados com `NEXTAUTH_SECRET`

✅ **Password Hashing:**
- Bcrypt com 10 salt rounds (algoritmo seguro)
- Senhas nunca armazenadas em texto plano

✅ **Credenciais Provider:**
- Validação de email/senha via servidor
- Erros genéricos (não revela qual campo está errado)

✅ **Proteção de Rotas:**
- Middleware protege `/admin/*` (exceto login)
- Redireciona usuários não autenticados para login

---

## 5️⃣ Boas Práticas Obrigatórias

### ✅ Fazer:

1. **Senhas:**
   - Mínimo 12 caracteres
   - Inclua: maiúsculas, minúsculas, números, símbolos
   - Única para cada ambiente
   - Altere default imediatamente após primeiro login

2. **Variáveis de Ambiente:**
   - Nunca commite `.env` (está no `.gitignore`)
   - Gere `NEXTAUTH_SECRET` com `openssl rand -base64 32`
   - Use valores diferentes para dev/staging/production

3. **Banco de Dados:**
   - Use conexão com SSL em produção (`?sslmode=require`)
   - Limpe backups antigos regularmente
   - Mantenha backups criptografados

4. **HTTPS:**
   - Obrigatório em produção
   - Certificate renewal automático (Let's Encrypt)
   - Redirecionar HTTP → HTTPS

5. **Logs:**
   - Revise logs regularmente para atividade suspeita
   - Nunca logue credenciais ou dados sensíveis
   - Mantenha logs por 90 dias mínimo

### ❌ Não fazer:

- ❌ Commitar `.env` com credenciais
- ❌ Usar credenciais padrão em produção
- ❌ Compartilhar credenciais via email/Slack
- ❌ Reutilizar senhas entre sites
- ❌ Logar credenciais ou tokens
- ❌ Armazenar senhas em cookies ou localStorage
- ❌ Deixar modo development em produção
- ❌ Desabilitar HTTPS
- ❌ Ignorar avisos de segurança npm

---

## 6️⃣ Checklist de Deploy em Produção

Antes de fazer deploy **sempre** verifique:

- [ ] `.env.local` tem credenciais **únicas e seguras**
- [ ] `NEXTAUTH_SECRET` gerado com `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` aponta para domínio com HTTPS
- [ ] `SITE_MAINTENANCE="false"` em produção
- [ ] Senha do admin alterada após primeiro login
- [ ] Database URL usa `?sslmode=require`
- [ ] NODE_ENV="production"
- [ ] npm audit sem vulnerabilidades altas
- [ ] HTTPS certificate válido
- [ ] Backup do banco criado antes do deploy
- [ ] Plano de rollback documentado

---

## 7️⃣ Se Credenciais Foram Comprometidas

### ⚠️ Ação Imediata (5 min):
1. Altere senha do admin no painel
2. Gere novo `NEXTAUTH_SECRET`
3. Redeploy com novos valores

### Dentro de 1 hora:
1. Revise logs de acesso para atividade suspeita
2. Revise banco de dados para mudanças não autorizadas
3. Notifique equipe de segurança

### Limpeza de Histórico Git:
```bash
# APENAS em repositórios privados e após backup completo!
git-filter-repo --path .env --invert-paths
git push origin --force-with-lease
```

---

## 8️⃣ Verificação de Segurança Periódica

Execute regularmente (semanal/mensal):

```bash
# Verificar dependências vulneráveis
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Verificar headers HTTP
curl -I https://seu-dominio.com

# Validar certificado SSL
openssl s_client -connect seu-dominio.com:443

# Revise logs
tail -f /var/log/seu-app.log | grep -i error
```

---

## 9️⃣ Segurança do Servidor

Se usando Render.com, Vercel, ou similar:

1. **Variáveis de Ambiente:**
   - Configure via dashboard (nunca em arquivos)
   - Use valores diferentes por environment (staging/production)

2. **Backups:**
   - Ativar backups automáticos do banco
   - Testar restauração regularmente

3. **Monitoring:**
   - Ativar alertas de CPU/Memória/Disco
   - Ativar alertas de erros HTTP 5xx

4. **Access Control:**
   - Revise permissões de equipe
   - Remova acessos de ex-funcionários

---

## 🔟 Contato de Segurança

Se descobrir uma vulnerabilidade:

1. **NÃO** crie issue pública
2. Contate administrador em privado
3. Descreva: tipo, localização, impacto, prova

---

**Última atualização:** 2026-06-17
**Revisor:** Sistema de Segurança Automatizado
