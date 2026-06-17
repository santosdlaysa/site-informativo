# ✅ Checklist de Segurança - Deploy em Produção

Use este checklist **antes de cada deploy** para garantir que nenhuma credencial será exposta.

---

## 🔐 Pré-Deploy (Antes de fazer git push)

### Credenciais
- [ ] Verifique que `.env` está no `.gitignore`
  ```bash
  grep "^.env" .gitignore
  ```

- [ ] Confirme que nenhum arquivo `.env` real foi commitado
  ```bash
  git log --all --full-history -S ".env" -- .env
  ```

- [ ] Revise seu `.env.local` — nunca deve conter valores padrão
  ```bash
  cat .env.local | grep -E "(admin|senha|password)"
  # NÃO deve mostrar "admin@meublog.com" ou "senha123"
  ```

### Código
- [ ] Nenhuma senha hardcoded em arquivos `.ts` / `.tsx`
  ```bash
  git grep -i "password\|senha\|secret" -- '*.ts' '*.tsx' | grep -v "NEXTAUTH_SECRET\|passwordHash\|cryptography" | head -20
  ```

- [ ] Nenhum `console.log()` de dados sensíveis
  ```bash
  git grep "console\." -- '*.ts' '*.tsx' | grep -E "(email|password|token|secret)" | head -10
  ```

- [ ] Nenhum `process.env` exposto ao cliente
  ```bash
  grep -r "process\.env\.[A-Z]" src --include="*.tsx" | grep -v "NEXT_PUBLIC"
  ```

- [ ] `.env.example` contém apenas placeholders (não valores reais)
  ```bash
  cat .env.example
  # Deve mostrar: "seu-email@example.com" não "admin@meublog.com"
  ```

### Dependências
- [ ] Nenhuma vulnerabilidade alta ou crítica
  ```bash
  npm audit --audit-level=high
  ```

- [ ] Teste build local funciona
  ```bash
  npm run build
  # Deve completar sem erros
  ```

---

## 📋 Em Produção (Após deploy)

### Imediatamente após deploy
- [ ] Site está em HTTPS (não HTTP)
  ```bash
  curl -I https://seu-dominio.com | grep "HTTP"
  # Deve mostrar: HTTP/2 200 ou HTTP/1.1 200
  ```

- [ ] Headers de segurança estão presentes
  ```bash
  curl -I https://seu-dominio.com | grep -E "X-Content|Strict-Transport|Content-Security"
  # Deve mostrar headers de segurança
  ```

- [ ] Login funciona sem credenciais na URL
  - Acesse `https://seu-dominio.com/admin/login`
  - Faça login
  - Verifique URL na barra de endereço: **nunca** deve conter email ou senha

- [ ] Altere senha do admin imediatamente
  1. Faça login com credenciais provisória
  2. Vá para `/admin/posts` (ou qualquer página do admin)
  3. Encontre seção de Usuários/Perfil
  4. Altere para senha permanente

### Diariamente
- [ ] Revise logs para atividades suspeitas
  ```bash
  # Via terminal/SSH:
  tail -f /var/log/seu-app.log | grep -i "error\|failed"
  ```

- [ ] Revise tentativas de login falhadas
  ```bash
  # Procure por múltiplas falhas de um IP (força bruta?)
  grep "E-mail ou senha inválidos" /var/log/seu-app.log | tail -20
  ```

### Semanalmente
- [ ] Revise acesso de usuários ao banco de dados
  ```bash
  # Converse com seu provedor de hospedagem (Render, etc)
  ```

- [ ] Verifique backups estão funcionando
  - [ ] Backup automático ativado
  - [ ] Teste restauração em database temporário

- [ ] Execute `npm audit` novamente
  ```bash
  npm audit --audit-level=high
  ```

### Mensalmente
- [ ] Revise todos os logins no painel (se houver log de auditoria)
- [ ] Revise permissões de usuários (remova acessos desnecessários)
- [ ] Atualize dependências (npm update)
- [ ] Revise certificado SSL (vence em X dias?)
  ```bash
  openssl s_client -connect seu-dominio.com:443 | grep "notAfter"
  ```

---

## 🚨 Se Algo Está Errado

### Credenciais foram expostas?

**Imediata ação (5 minutos):**
1. Altere senha do admin no painel
2. Gere novo `NEXTAUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
3. Atualize `.env` em produção com novo secret
4. Redeploy
5. Revise logs para acesso não autorizado

**Dentro de 1 hora:**
1. Revise banco de dados para mudanças suspeitas
2. Revise logs de acesso de 48 horas atrás
3. Notifique equipe de segurança

**Limpeza do Git:**
```bash
# ⚠️ APENAS em repositórios privados após backup completo!
git-filter-repo --path .env --invert-paths
git push --force-with-lease
```

### Site foi invadido?

1. **Desabilite manutenção** (evita acesso de atacantes):
   ```env
   SITE_MAINTENANCE="true"
   ```

2. **Não panic** — tenha um plano:
   - Backup do banco antes de qualquer ação
   - Contate provedor de hospedagem (Render, etc)
   - Revise logs de 72 horas atrás

3. **Recuperação:**
   - Restaurar banco de último backup seguro
   - Resetar todas as senhas
   - Fazer full security audit do código
   - Deploy de versão corrigida

---

## 📞 Contatos Importantes

Guarde esses contatos:

- **Render Support:** https://render.com/docs/support
- **Let's Encrypt (SSL):** https://letsencrypt.org/support/
- **GitHub Security:** https://github.com/security
- **OWASP:** https://owasp.org/Top10/

---

## 🔗 Referências

- [OWASP Top 10 Security Risks](https://owasp.org/Top10/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)

---

**Versão:** 1.0  
**Última atualização:** 2026-06-17  
**Próxima revisão:** 2026-07-17
