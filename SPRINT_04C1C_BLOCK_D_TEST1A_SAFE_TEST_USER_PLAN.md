# SPRINT_04C1C_BLOCK_D_TEST1A_SAFE_TEST_USER_PLAN.md

## 1. Objetivo
Planejar a criação controlada de um usuário de teste real no banco de dados para possibilitar testes de RPC que exigem integridade referencial em `auth.users`, `profiles` e `user_roles`.

## 2. Estratégia de Criação
Para garantir que o usuário seja tratado como teste e não como cliente real, a criação seguirá estas regras:
- **E-mail:** `test_d1_clube_mensal@oracula.com.br` (Domínio controlado, impossível de ser cliente real).
- **ID Fixo (Opcional):** Uso de UUID gerado no momento ou um padrão de teste se autorizado.
- **Origem:** Criação via SQL direto no schema `auth` e `public` para evitar disparos de e-mails reais de confirmação.

## 3. Registros Esperados
### auth.users
- `email`: `test_d1_clube_mensal@oracula.com.br`
- `email_confirmed_at`: `now()`
- `raw_app_meta_data`: `{"provider": "email", "is_test": true}`

### public.profiles
- `display_name`: `Teste RPC D1`
- `portal`: `visitante` (Estado inicial)
- `is_test`: `true` (Caso a coluna exista, se não, metadados no auth bastam)

### public.user_roles
- `portal`: `visitante`

## 4. Validações Pré e Pós
### Antes:
- Confirmar que o e-mail não existe em `auth.users`.
- Capturar contagem de `profiles` e `user_roles`.

### Depois:
- Confirmar criação dos 3 registros vinculados pelo mesmo UUID.
- Confirmar que o portal inicial é `visitante`.

## 5. Rollback e Limpeza
O usuário poderá ser removido completamente com:
```sql
-- A remoção no auth.users dispara o delete em cascade para profiles/user_roles se configurado, 
-- senão removemos manualmente:
DELETE FROM public.user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test_d1_clube_mensal@oracula.com.br');
DELETE FROM public.profiles WHERE id = (SELECT id FROM auth.users WHERE email = 'test_d1_clube_mensal@oracula.com.br');
DELETE FROM auth.users WHERE email = 'test_d1_clube_mensal@oracula.com.br';
```

## 6. Regras de Segurança
- Não enviar e-mail real.
- Não usar este usuário em ambiente de produção para logins reais.
- O usuário permanecerá sem assinaturas até a execução do `D.TEST-1`.

---
**Status:** Plano gerado. Aguardando autorização para execução.
