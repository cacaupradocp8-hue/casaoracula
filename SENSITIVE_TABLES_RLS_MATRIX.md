# SENSITIVE_TABLES_RLS_MATRIX.md

## Matriz de RLS e Tabelas Sensíveis

Esta matriz foca em tabelas que contêm PII (Personal Identifiable Information), dados clínicos ou financeiros.

| Tabela | RLS Ativo | Políticas SELECT | Políticas I/U/D | Risco | Ação |
| :--- | :---: | :--- | :--- | :--- | :--- |
| `profiles` | Sim | Owner & Admin | Owner & Admin | Baixo | Monitorar |
| `clientes` | Sim | Terapeuta & Admin | Terapeuta & Admin | Baixo | OK |
| `co_client_profiles` | Sim | Terapeuta & Admin | Terapeuta & Admin | Baixo | OK |
| `sessions` | Sim | Terapeuta & Admin | Terapeuta & Admin | Baixo | OK |
| `subscriptions` | Sim | Owner, Admin, Service | Admin & Service | Médio | Validar Service Role |
| `email_logs` | Sim | Owner & Admin | Autenticado (Insert) | Médio | Restringir Insert |
| `user_roles` | Sim | Owner & Admin | Admin | Baixo | OK |
| `agente_conversas` | Sim | Owner & Admin | Owner | Baixo | OK |
| `agente_mensagens` | Sim | Owner & Admin | Owner | Baixo | OK |

---

## Detalhamento de Riscos

### 1. `subscriptions`
- **Quem acessa:** Usuários veem seus planos; `service_role` gerencia via Edge Functions.
- **Risco:** A política de `service_role` é ampla (`USING (true)`). Embora o `service_role` deva ter acesso total, é vital garantir que funções `SECURITY DEFINER` não o exponham acidentalmente ao frontend.
- **Recomendação:** Auditar todas as RPCs que tocam nesta tabela.

### 2. `email_logs`
- **Quem acessa:** Usuários e Admins.
- **Risco:** A política de `INSERT` permite que qualquer usuário autenticado insira logs. Um usuário mal-intencionado poderia "inundar" a tabela com logs falsos, consumindo storage/quota.
- **Recomendação:** Adicionar check na política de `INSERT` para validar se o `user_id` da linha corresponde ao `auth.uid()`.

### 3. `ai_provider_prices` (Identificada no Scan Anterior)
- **RLS Ativo:** NÃO (conforme scan de integridade).
- **Risco:** Tabela de configuração de custos exposta. Embora não contenha PII, permite que qualquer um leia os preços internos dos provedores de IA.
- **Recomendação:** Habilitar RLS e permitir SELECT apenas para `authenticated`.

---

## Ações Recomendadas (Prioridade 1)

1. **Habilitar RLS** em `ai_provider_prices`.
2. **Refinar INSERT** em `email_logs` para garantir que `auth.uid() = user_id`.
3. **Auditoria de Admin Roles:** Verificar se a função `get_user_portal` ou `is_admin` usada nas policies possui `search_path` e é `SECURITY DEFINER` segura.

---
*Este relatório é meramente informativo e faz parte do Sprint de Hardening. Nenhuma alteração foi realizada.*
