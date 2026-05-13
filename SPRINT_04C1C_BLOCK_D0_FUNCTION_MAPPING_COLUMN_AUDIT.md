# SPRINT_04C1C_BLOCK_D0_FUNCTION_MAPPING_COLUMN_AUDIT

## 1. Definição Atual da Função
**Função:** `public.process_webhook_subscription`

### Trecho de Leitura do Mapping:
```sql
-- Busca mapeamento da oferta
SELECT * INTO _mapping
FROM public.rockty_offer_mapping
WHERE rockty_offer_id = _plan_id -- _plan_id aqui é o parâmetro de entrada (rockty_offer_id)
AND ativo = true;

IF NOT FOUND THEN
    RETURN jsonb_build_object(
        'status', 'error',
        'message', 'Oferta desconhecida no mapping: ' || _plan_id
    );
END IF;

-- Define plano interno e portal
_internal_plan_id := _mapping.plan_id; -- <--- LINHA CRÍTICA
_portal_destino   := _mapping.portal_destino;
```

### Análise:
A função utiliza a propriedade `_mapping.plan_id` para extrair o identificador do plano interno.

## 2. Schema Real de `public.rockty_offer_mapping`
| Coluna | Tipo | Nulável |
| :--- | :--- | :--- |
| rockty_offer_id | text | NO |
| **plan_id** | **text** | **YES** |
| portal_destino | user_portal | NO |
| produto_nome | text | YES |
| duracao_dias | integer | YES |
| ativo | boolean | YES |

## 3. Veredito
**FUNÇÃO COMPATÍVEL COM SCHEMA REAL**

### Justificativa:
A auditoria confirma que tanto a tabela quanto a função utilizam o nome de coluna **`plan_id`**. Não há referência ao termo `internal_plan_id` na estrutura da tabela nem no acesso aos atributos do registro `_mapping` dentro da função.

## 4. Conclusão
Não há necessidade de correção emergencial (D.0.1) para este ponto específico, pois a função já está alinhada com as colunas reais do banco de dados.
