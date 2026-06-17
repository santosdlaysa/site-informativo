# 🔒 Instalação Segura do Projeto

Siga este guia **exatamente** para instalar o projeto sem expor credenciais.

---

## 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/site-informativo.git
cd site-informativo
```

✅ O arquivo `.env` está no `.gitignore` — você não verá credenciais no clone.

---

## 2️⃣ Instale Dependências

```bash
npm install
```

⚠️ **Nota:** Pode haver aviso de vulnerabilidades. Isso é esperado — veja seção "Vulnerabilidades" abaixo.

---

## 3️⃣ Configure Credenciais (OBRIGATÓRIO)

### Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

### Abra `.env.local` com seu editor:
```bash
# Windows (PowerShell)
code .env.local

# Linux/Mac
nano .env.local
```

### Edite com **valores reais e seguros**:
```env
# ⚠️ SUBSTITUA COM SEUS VALORES REAIS
# Escolha um email que você realmente tem acesso
ADMIN_EMAIL="seu-email@seu-dominio.com"

# Crie uma senha forte (12+ chars: maiúsc, minúsc, números, símbolos)
ADMIN_PASSWORD="SenhaForte2024!Unica"

# Seu nome
ADMIN_NAME="Seu Nome Completo"

# ⚠️ Configure seu banco de dados
# Se está usando SQLite localmente:
DATABASE_URL="file:./dev.db"

# Se está usando PostgreSQL:
DATABASE_URL="postgresql://usuario:senha@localhost:5432/dbname"

# Gere um secret seguro (copie a saída do comando abaixo):
# openssl rand -base64 32
NEXTAUTH_SECRET="sua-chave-aleatoria-de-32-chars-aqui"

# Development ou Production
NEXTAUTH_URL="http://localhost:3000"

# Desabilitar modo manutenção
SITE_MAINTENANCE="false"
```

---

## 4️⃣ Configurar Banco de Dados

### Se estiver usando SQLite (padrão para desenvolvimento):

```bash
# Executar migrations
npx prisma migrate dev

# Executar seed (cria admin com suas credenciais)
npx prisma db seed
```

Você verá:
```
✓ Seed concluído: admin, categorias e 3 posts de ações.
```

### Se estiver usando PostgreSQL:

```bash
# Certifique-se que `DATABASE_URL` está correto
echo $DATABASE_URL

# Executar migrations
npx prisma migrate deploy

# Executar seed
npx prisma db seed
```

---

## 5️⃣ Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Você verá:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## 6️⃣ Primeiro Login

1. Abra `http://localhost:3000/admin/login`
2. Faça login com as credenciais que definiu em `.env.local`
3. **Você deve estar em `/admin/posts`** após login bem-sucedido

✅ Verifique que a URL **NÃO contém email ou senha**

---

## ⚠️ Checklist de Segurança

- [ ] `.env.local` existe e é diferente de `.env.example`
- [ ] `ADMIN_EMAIL` não é `admin@meublog.com`
- [ ] `ADMIN_PASSWORD` não é `senha123`
- [ ] `NEXTAUTH_SECRET` é uma string aleatória (não vazia)
- [ ] Verifique que `.env.local` **NÃO está** no git:
  ```bash
  git status | grep ".env.local"
  # Não deve mostrar nada
  ```

---

## 🔧 Troubleshooting

### Erro: "ADMIN_EMAIL not defined in environment"

**Solução:** Você não configurou `.env.local`
```bash
cp .env.example .env.local
# Edite com valores reais
```

### Erro ao conectar banco de dados

**Solução:** Verifique `DATABASE_URL`
```bash
# SQLite (padrão):
DATABASE_URL="file:./dev.db"

# PostgreSQL:
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"
```

### Porta 3000 já está em uso

**Solução:** Use outra porta
```bash
npm run dev -- -p 3001
# Agora acesse http://localhost:3001
```

### "Invalid NEXTAUTH_SECRET"

**Solução:** Gere um novo secret
```bash
openssl rand -base64 32
# Copie a saída e cole em NEXTAUTH_SECRET
```

---

## 📝 Variáveis de Ambiente Explicadas

| Variável | Obrigatória | Exemplo | Notas |
|----------|-------------|---------|-------|
| `ADMIN_EMAIL` | ✅ Sim | seu@email.com | Email único, você deve ter acesso |
| `ADMIN_PASSWORD` | ✅ Sim | SeNha123!Forte | 12+ chars, incluir números/símbolos |
| `ADMIN_NAME` | ❌ Opcional | João Silva | Nome para o painel |
| `DATABASE_URL` | ✅ Sim | file:./dev.db | SQLite (local) ou PostgreSQL |
| `NEXTAUTH_SECRET` | ✅ Sim | (aleatório) | Gere com: openssl rand -base64 32 |
| `NEXTAUTH_URL` | ✅ Sim | http://localhost:3000 | Mude para https://seu-dominio.com em prod |
| `SITE_MAINTENANCE` | ❌ Opcional | false | "true" desabilita site inteiro |

---

## 🚀 Próximos Passos

Após instalação bem-sucedida:

1. Leia [`SECURITY.md`](./SECURITY.md) — Guia completo de segurança
2. Leia [`SEGURANCA_CHECKLIST.md`](./SEGURANCA_CHECKLIST.md) — Checklist pré-deploy
3. Configure seu editor:
   - Instale ESLint
   - Instale Prettier
   - Configure git hooks (optional)

---

## ❓ Ainda com dúvidas?

Comandos úteis para debug:

```bash
# Verificar variáveis carregadas (não mostra valores)
npx dotenv-cli printenv | head -10

# Limpar build cache
rm -rf .next

# Resetar banco de dados (⚠️ DELETA TUDO)
rm -f prisma/dev.db
npx prisma db seed

# Verificar logs do Prisma
PRISMA_DEBUG_GENERATOR=true npx prisma generate
```

---

**Versão:** 1.0  
**Última atualização:** 2026-06-17  
**Status:** ✅ Seguro para desenvolvimento
