# SECURITY_DEFINER_VIEWS_FULL_REPORT.md

## Sumário
Este relatório detalha as views identificadas como `SECURITY DEFINER` no schema `public`. No Supabase/PostgreSQL, views sem a opção `security_invoker=true` executam com as permissões do criador (owner), o que pode ignorar políticas de RLS e expor dados indevidamente.

| View Name | Schema | Owner | Vulnerabilidade | Recomendação |
| :--- | :--- | :--- | :--- | :--- |
| `co_client_detailed_profile` | public | postgres | Ignora RLS na leitura de perfis sensíveis | Trocar para `SECURITY INVOKER` |
| `clube_v3_user_stats` | public | postgres | Executa com privilégios de owner sobre dados de uso | Trocar para `SECURITY INVOKER` |
| `admin_audit_summary` | public | postgres | Acesso a logs de auditoria sem checagem de role na view | Restringir acesso via RLS na tabela base |
| `client_health_overview` | public | postgres | Consolida dados de múltiplas tabelas clínicas | Trocar para `SECURITY INVOKER` |
| `session_analytics_view` | public | postgres | Analítica de sessões que ignora propriedade do terapeuta | Trocar para `SECURITY INVOKER` |
| `email_delivery_stats` | public | postgres | Exposição de metadados de comunicação | Trocar para `SECURITY INVOKER` |
| `user_access_matrix` | public | postgres | Mapeamento de permissões visível globalmente | Restringir acesso ou tornar Invoker |

---

## Detalhes Técnicos

### 1. View: `co_client_detailed_profile`
- **Tabelas Acessadas:** `clientes`, `co_client_profiles`, `profiles`
- **Exposição de Dados:** Dados de saúde mental, PII (Nomes, Emails).
- **Risco:** Um usuário autenticado pode consultar esta view e ver dados de clientes que não pertencem a ele, pois a view usa os privilégios do owner `postgres`.
- **SQL Sugerido:**
```sql
ALTER VIEW public.co_client_detailed_profile SET (security_invoker = true);
```

### 2. View: `clube_v3_user_stats`
- **Tabelas Acessadas:** `clube_v3_user_progress`, `user_journey_stats`
- **Exposição de Dados:** Progresso detalhado de jornada e engajamento.
- **Risco:** Bypass de RLS de privacidade de jornada.
- **Recomendação:** Converter para `SECURITY INVOKER`.

### 3. View: `admin_audit_summary`
- **Tabelas Acessadas:** `admin_automation_audit`, `admin_action_history`
- **Exposição de Dados:** Ações administrativas e mudanças de sistema.
- **Risco:** Se o frontend permitir consulta a esta view por engano, dados de auditoria interna vazam.
- **Recomendação:** Manter como está MAS garantir que apenas o owner tenha permissão de SELECT (`REVOKE ALL ON public.admin_audit_summary FROM PUBLIC;`).

### 4. View: `client_health_overview`
- **Tabelas Acessadas:** `client_archetype_state`, `client_pattern_stats`
- **Exposição de Dados:** Estados arquetípicos e diagnósticos.
- **Risco:** Crítico. Bypass de isolamento terapeuta-cliente.
- **Recomendação:** Obrigatório `SECURITY INVOKER`.

---

## Observações Gerais
Todas as views acima foram criadas sem a flag `security_invoker`, o que as coloca na categoria de severidade **ERROR** pelo linter do Supabase. A correção padrão deve ser a aplicação da flag de invoker para que o RLS das tabelas base seja respeitado.
