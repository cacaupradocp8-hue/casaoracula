# SECURITY_DEFINER_FUNCTIONS_FIX_PLAN.md

## Sumário
Auditoria de funções que executam com privilégios de `SECURITY DEFINER` mas carecem da configuração de `search_path`. Isso abre brechas para ataques de sequestro de path (search_path hijacking) por usuários mal-intencionados.

## Funções Vulneráveis (Sem search_path)

| Função | Uso | Risco | Status |
| :--- | :--- | :--- | :--- |
| `aplicar_impacto_cidadela` | Trigger (`trigger_aplicar_impacto_rota`) | Escalação de privilégios via schema malicious | Crítico |
| `get_clube_proximo_passo` | Frontend (RPC) | Injeção de lógica via search path | Médio |
| `can_receive_upsell_offer` | Frontend (RPC) | Bypass de lógica de negócio | Baixo |
| `sync_user_meta` | Trigger Interna | Manipulação de metadados | Alto |
| `process_recurring_tasks` | Cron Job | Execução de código arbitrário | Crítico |

---

## Plano de Correção (Hardening)

### Proposta SQL (Exemplo de Padrão)
Para cada função, deve-se aplicar o `search_path` limitado ao schema `public` (e `auth`/`extensions` se necessário).

```sql
-- Exemplo para aplicar_impacto_cidadela
ALTER FUNCTION public.aplicar_impacto_cidadela() 
SET search_path = public;

-- Exemplo para get_clube_proximo_passo
ALTER FUNCTION public.get_clube_proximo_passo(user_id uuid) 
SET search_path = public;
```

### Script de Massa
```sql
DO $$ 
DECLARE 
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE p.prosecdef = true 
        AND n.nspname = 'public'
        AND (p.proconfig IS NULL OR NOT (p.proconfig @> ARRAY['search_path=public']))
    LOOP
        EXECUTE format('ALTER FUNCTION %I.%I(%s) SET search_path = public', 
                       func_record.nspname, func_record.proname, func_record.args);
    END LOOP;
END $$;
```

---

## Plano de Rollback
Caso a correção cause falhas de resolução de tipos ou funções de outros schemas:

1. **Identificação:** Verificar logs de `Undefined Function` ou `Undefined Object`.
2. **Reversão:**
```sql
ALTER FUNCTION public.nome_da_funcao() RESET search_path;
```
3. **Correção cirúrgica:** Se a função precisar de múltiplos schemas, definir explicitamente:
```sql
ALTER FUNCTION public.nome_da_funcao() SET search_path = public, auth, extensions;
```

---

## Notas de Segurança
Funções que chamam `auth.uid()` ou `auth.role()` dentro de um contexto `SECURITY DEFINER` sem `search_path` são particularmente perigosas, pois o schema `auth` pode ser "sombreado" por um schema falso criado por um atacante.
