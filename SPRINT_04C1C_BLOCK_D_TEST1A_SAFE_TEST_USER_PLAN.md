# SPRINT_04C1C_BLOCK_D_TEST1A_SAFE_TEST_USER_PLAN.md

## 1. Objetivo
Planejar a criação controlada de um usuário de teste real no banco de dados para possibilitar testes de RPC que exigem integridade referencial em `auth.users`, `profiles` e `user_roles`.

## 2. Estratégia de Criação
Para garantir que o usuário seja tratado como teste e não como cliente real, a criação seguirá estas regras:
- **E-mail:** `test_d1_clube_mensal@oracula.com.br` (Domínio controlado, impossível de ser cliente real).
- **ID Fixo:** `00000000-0000-0000-0000-000000000999` (Facilita rastreabilidade e limpeza).
- **Origem:** Inserção direta no schema `auth` via SQL para evitar disparos de e-mails de confirmação e garantir que os metadados de teste estejam presentes.

## 3. Registros Esperados (Efeito Cascata Triggers)
A inserção em `auth.users` disparará automaticamente:
1. `handle_new_user()` -> Criará registro em `public.profiles` e `public.user_roles`.
2. `apply_pending_matricula()` -> Verificará pendências (não deve encontrar nenhuma para este e-mail).

### auth.users
- `id`: `00000000-0000-0000-0000-000000000999`
- `email`: `test_d1_clube_mensal@oracula.com.br`
- `email_confirmed_at`: `now()`
- `raw_user_meta_data`: `{"nome": "Teste RPC D1", "is_test": true}`
- `aud`: `authenticated`
- `role`: `authenticated`

### public.profiles (via Trigger)
- `id`: `00000000-0000-0000-0000-000000000999`
- `email`: `test_d1_clube_mensal@oracula.com.br`
- `nome`: `Teste RPC D1`
- `portal`: `visitante` (Valor padrão do trigger)

### public.user_roles (via Trigger)
- `user_id`: `00000000-0000-0000-0000-000000000999`
- `portal`: `visitante`

## 4. Validações Pré e Pós
### Antes:
- Confirmar que o ID `00000000-0000-0000-0000-000000000999` não existe em `auth.users`.
- Capturar contagem de `profiles` e `user_roles`.

### Depois:
- Confirmar criação dos registros vinculados pelo UUID `00000000-0000-0000-0000-000000000999`.
- Confirmar que o portal inicial em ambas as tabelas (`profiles` e `user_roles`) é `visitante`.

## 5. Rollback e Limpeza
O usuário poderá ser removido completamente com:
```sql
DELETE FROM public.user_roles WHERE user_id = '00000000-0000-0000-0000-000000000999';
DELETE FROM public.profiles WHERE id = '00000000-0000-0000-0000-000000000999';
DELETE FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000999';
```

## 6. Regras de Segurança
- Não enviar e-mail real (inserção direta no banco).
- A senha não será utilizável (não será definida via hash real para este teste).
- O usuário permanecerá sem assinaturas até a execução do `D.TEST-1`.

---
**Status:** Plano atualizado com IDs e colunas reais do banco. Aguardando autorização para execução.
