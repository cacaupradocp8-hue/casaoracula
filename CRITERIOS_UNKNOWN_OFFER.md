# CRITERIOS_UNKNOWN_OFFER

## 1. Definição
Um evento de `Unknown Offer` ocorre quando o `offer_id` enviado pela Rockty não possui um mapeamento correspondente na função `get_portal_from_offer`.

## 2. Impacto
- A assinatura é criada mas o portal alvo é indefinido.
- O usuário não recebe o acesso automático.
- Um registro de erro é gerado no Guardiã Rockty.

## 3. Critérios de Resolução
1. Identificar se a oferta é um novo produto ou um teste.
2. Se for produto real, obter o `offer_id` e o `portal` de destino.
3. Solicitar atualização do mapeamento no banco de dados/código.
4. Re-processar o webhook após a atualização (via trigger ou manual se autorizado).
