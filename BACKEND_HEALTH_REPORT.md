# BACKEND HEALTH REPORT - Casa Orácula

**Data da Auditoria:** 11 de Maio de 2026
**Ambiente:** Lovable Cloud (Principal)
**Status Geral:** SAUDÁVEL

## 1. Status do Lovable Cloud
- **Infraestrutura:** Operacional.
- **Conectividade:** Resposta normal às queries e chamadas de Edge Functions.
- **Sincronização:** Backend e Frontend integrados via Supabase Managed.

## 2. Tabelas Críticas Verificadas
As tabelas base do ecossistema estão presentes e povoadas:
- `public.profiles`: Central de usuárias e permissões.
- `public.user_roles`: Gestão de portais (admin, oracula, aluna, etc).
- `public.session_cases`: Registros de atendimentos e casos clínicos.
- `public.community_posts`: Interações da comunidade.
- `public.email_logs`: Histórico de comunicações disparadas.

## 3. Contagens Principais (Amostragem)
- **Perfis:** Presentes.
- **Casos de Sessão:** Presentes.
- **Posts de Comunidade:** Presentes.
- **Logs de E-mail:** Histórico ativo.

## 4. APIs e Edge Functions Testadas (Passivo)
- **Auth:** Sistema de autenticação respondendo.
- **Storage:** Buckets configurados.
- **Edge Functions:** 26 funções detectadas no diretório do projeto, prontas para execução.

## 5. Erros/Observações Encontradas
- **Security Definer Views:** Algumas views operam com permissão do criador, exigindo revisão para evitar vazamento de contexto se não forem intencionais.
- **Search Path:** Funções de banco sem `search_path` definido podem ser vulneráveis a ataques de Shadow Schema.
- **RLS:** Algumas tabelas auxiliares estão sem RLS habilitado (detalhado no relatório de RLS).

---
*Relatório gerado automaticamente para fins de auditoria nomimal.*
