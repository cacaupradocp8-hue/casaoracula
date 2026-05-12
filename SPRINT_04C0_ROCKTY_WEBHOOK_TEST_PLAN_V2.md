# Sprint 04C.0: Plano de Teste Controlado do Webhook Rockty (V2)

**Status:** Planejamento Revisado (Aguardando Aprovação)
**Objetivo:** Validar o mapeamento de offer_ids reais da Rockty para os planos e portais internos, garantindo a integridade dos dados e o isolamento total de usuárias reais.

---

## 1. Matriz de Mapeamento Rockty (Baseline de Teste)

| Rockty Offer ID | Expected Plan ID | Expected Portal | Produto |
| :--- | :--- | :--- | :--- |
| `karv9y4bewbdjcwbmvtwq` | `clube_mensal` | `assinante` | Clube Mensal |
| `mayikrzz0kc58ijeqs9a` | `clube_mensal` | `assinante` | Clube Mensal (Legado/Duplicado) |
| `2tgmh6vsiki7fg0buxdfxq` | `clube_anual` | `assinante` | Clube Anual |
| `qqqmfhyjku7ou9kc70gg` | `formacao_oracula` | `aluna` | Formação Orácula |
| `TEST_UNKNOWN_OFFER` | `unknown` | `visitante` (fallback) | Oferta Desconhecida |

---

## 2. Cenários de Teste V2 (Controlados)

Todos os testes usarão `customer_email` terminando em `@example.com` ou com sufixo `+test@` e `transaction_id`/`subscription_id` iniciando com `TEST_`.

### T00: Assinatura HMAC Inválida (Segurança)
- **Ação:** Enviar payload correto com cabeçalho `X-Rockty-Signature` incorreto.
- **Resultado Esperado:** HTTP 401 Unauthorized. Nenhuma alteração em tabelas de negócio (subscriptions, profiles). Registro em `webhook_logs` com status de erro (se implementado).

### T01: Clube Mensal (Fluxo de Mapeamento)
- **Offer ID:** `karv9y4bewbdjcwbmvtwq`
- **Email:** `teste.mensal+01@example.com`
- **Resultado Esperado:** Se o usuário não existir, deve gravar em `matriculas_pendentes` mapeando para `clube_mensal` e `portal_destino = 'assinante'`.

### T02: Clube Anual (Fluxo de Mapeamento)
- **Offer ID:** `2tgmh6vsiki7fg0buxdfxq`
- **Email:** `teste.anual+01@example.com`
- **Resultado Esperado:** Registro em `webhook_events` e `matriculas_pendentes` com `plan_id = 'clube_anual'`.

### T03: Formação Orácula (Fluxo Aluna)
- **Offer ID:** `qqqmfhyjku7ou9kc70gg`
- **Email:** `teste.oracula+01@example.com`
- **Resultado Esperado:** Validação do mapeamento para `plan_id = 'formacao_oracula'` e `portal_destino = 'aluna'`.

### T04: Offer ID Desconhecido (Segurança)
- **Offer ID:** `TEST_UNKNOWN_OFFER`
- **Email:** `teste.desconhecido+01@example.com`
- **Resultado Esperado:** O sistema deve registrar o log, mas não deve conceder acesso automático. Deve cair no fallback de `visitante` ou registrar erro de mapeamento em `webhook_logs`.

### T05: Compradora Sem Conta (Matrícula Pendente)
- **Email:** `compradora.inexistente@example.com` (Garantir que não existe no banco)
- **Resultado Esperado:** Inclusão na tabela `matriculas_pendentes`. **Proibido** criar registro em `auth.users` ou `profiles` automaticamente.

---

## 3. Estratégia de Isolamento de Perfis

- **PROIBIÇÃO:** Não será utilizado nenhum dos 5 perfis existentes no banco de dados.
- **PERFIS DE TESTE:** Se for necessário validar a alteração de `profiles.portal` em tempo real, será submetido um plano separado (**SPRINT_04C0A_CREATE_SAFE_TEST_PROFILE_PLAN.md**) para criar usuárias de teste específicas. Sem isso, os testes focarão apenas em `webhook_logs`, `webhook_events` e `matriculas_pendentes`.

---

## 4. Resultado Esperado por Tabela

| Tabela | Comportamento de Teste |
| :--- | :--- |
| `webhook_logs` | Registro do payload bruto com `processed = false/true` conforme o caso. |
| `webhook_events` | Registro único do evento para evitar duplicidade. |
| `subscriptions` | Criado apenas se o usuário de teste for pré-criado em etapa futura aprovada. |
| `matriculas_pendentes` | Destino principal para testes de mapeamento de emails novos. |
| `profiles` | **Nenhuma alteração** nesta fase. |
| `user_roles` | **Nenhuma alteração** nesta fase. |

---

## 5. Identificação e Limpeza

- **Padrão de Busca:** `email LIKE '%@example.com'` ou `transaction_id LIKE 'TEST_%'`.
- **Limpeza:** Após a execução e auditoria dos resultados, será gerada uma lista de IDs para exclusão ou marcação definitiva como "Test Data".

---

## 6. Riscos e Mitigações (Revisados)

1. **Erro de Mapeamento:** O teste validará se o código atual da Edge Function está pronto para traduzir os hashes da Rockty nos IDs de plano internos.
2. **Poluição de Produção:** Mitigado pelo uso de emails e IDs com prefixos de teste.
3. **Falsa Ativação:** O critério de êxito é o registro correto nas tabelas de auditoria e pendência, sem tocar em usuárias reais.

---

## 7. Próximos Passos

1. Revisão e Aprovação desta V2.
2. (Opcional) Plano 04C.0A para criação de perfis de teste seguros.
3. Execução dos testes simulados via `curl_edge_functions`.
