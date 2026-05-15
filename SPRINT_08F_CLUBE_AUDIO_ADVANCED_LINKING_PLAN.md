# SPRINT 08F: Vínculo Avançado de Áudios - Plano de Implementação

## Objetivo
Planejar a transição do preenchimento manual de metadados de áudio em `clube_rota_itens` para um sistema de vínculo inteligente consumindo a Audioteca (`clube_audio_tracks`), garantindo consistência e facilidade de gestão.

## Auditoria de Vínculo Atual
- **Metadata JSONB**: Os áudios são armazenados em `metadata->'audios'`, que é um array de objetos contendo `titulo`, `descricao`, `duracao`, `tipo` e, em alguns casos, `url`.
- **Estrutura de Áudios**: A tabela `clube_audio_tracks` contém os campos reais (`titulo`, `audio_url`, `duracao_segundos`).
- **Relacionamentos**: Não existem colunas como `rota_item_id` em `clube_audio_tracks`, nem `track_id` em `clube_rota_itens`. O vínculo é puramente via dados duplicados no JSONB.
- **Tabelas de Vínculo**: Não foi identificada nenhuma tabela intermediária (ex: `clube_rota_item_audios`).

## Riscos Identificados
1. **Quebra de Player**: O componente da Rota dos Lobos consome o array `metadata.audios`. Qualquer alteração estrutural sem fallback quebrará a reprodução para as assinantes.
2. **Perda de Dados**: Edições manuais no JSONB podem apagar campos necessários para o player (ex: esquecer de colocar a duração formatada).
3. **Inconsistência**: O áudio pode ser atualizado na Audioteca mas continuar com a URL antiga no item da rota.

## Proposta: Modelo Híbrido com Seletor Inteligente (Caminho A + C)
Para evitar alterações de banco (PRECISA DE MODELAGEM DE BANCO) e focar na **IMPLEMENTAÇÃO VISUAL**, seguiremos o modelo híbrido:

1. **Leitura**: O player da assinante continua lendo de `metadata->'audios'`.
2. **Escrita (Admin)**: 
   - Ao editar um item de rota, o Admin verá um botão "Vincular da Audioteca".
   - Um seletor permitirá buscar faixas na `clube_audio_tracks`.
   - Ao selecionar, o sistema preencherá automaticamente o array `metadata.audios` com os dados sincronizados (URL, Título, Duração formatada).
3. **Sincronização Visual**: O Painel Editorial indicará se os dados no metadata estão "Sincronizados" ou "Divergentes" em relação à Audioteca.

## Classificação
**PRONTO PARA IMPLEMENTAÇÃO VISUAL**

Podemos implementar a interface de vínculo e a automação de escrita no JSONB sem alterar o schema do banco de dados, respeitando as travas da sprint.

## Regras de Implementação
- Não migrar dados em massa.
- Manter compatibilidade total com o array `metadata.audios` existente.
- Adicionar campo `track_id` dentro do objeto JSONB do áudio (opcional, para facilitar rastreabilidade futura sem mudar schema).

---
**Relatório gerado por Lovable em 15/05/2026**
