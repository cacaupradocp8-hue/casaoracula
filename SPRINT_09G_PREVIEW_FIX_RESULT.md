# Relatório de Ajuste Editorial: Correção do Preview Admin

## Diagnóstico do Problema
Identificou-se que o componente de Preview Editorial (`ClubeEditorialPreviewPage.tsx`) não estava renderizando corretamente o novo Passo 03 devido a:
1. **Divergência de Chaves**: O código buscava por `metadata.audios`, mas o pacote editorial utilizava `audio_placeholders` para itens em produção.
2. **Sombreamento de Seções**: O código exibia apenas o Jardim OU o Laboratório, ocultando um deles quando ambos estavam presentes.
3. **Falta de Fallback para Áudios**: Itens sem URL (em produção) eram simplesmente ocultados, impedindo a validação visual do planejamento.

## Melhorias Implementadas
- [x] **Suporte a Placeholders**: Adicionada lógica para renderizar áudios em estado "EM PRODUÇÃO", permitindo que o editorial valide a estrutura antes da gravação.
- [x] **Exibição Simultânea**: Separadas as seções de "Escrita Íntima" (Jardim) e "Prática Objetiva" (Laboratório), exibindo ambas com labels e estilos próprios.
- [x] **Robustez no Parsing**: Adicionado suporte para dados `metadata` que venham como string JSON do banco de dados.
- [x] **Labels Premium**: Atualizados títulos e badges para alinhar com a linguagem da Casa Orácula (Jardim da Psique, Laboratório 80/20).

## Validação Final
- [x] O Passo 03 agora exibe os 3 placeholders de áudio no preview.
- [x] O Jardim e o Laboratório aparecem como seções independentes.
- [x] Build concluído com sucesso.
- [x] Invisibilidade para assinantes mantida (proteção via RLS e status rascunho).

## Classificação
**APROVADO E AJUSTADO**
