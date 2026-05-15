# SPRINT 08G: Taxonomia Editorial de Áudios - Plano de Implementação

## Objetivo
Planejar a organização editorial dos áudios do Clube Oracular, definindo uma taxonomia clara para as experiências sonoras e melhorando a navegação na Audioteca.

## Auditoria de Tipos (clube_audio_tracks.tipo)
- **Estado Atual**: O campo `tipo` utiliza o ENUM `track_type`.
- **Valores Existentes no ENUM**: `audio`, `podcast`.
- **Uso Atual**: 100% dos áudios estão marcados como `audio`.
- **Limitação**: O ENUM atual é técnico (formato) e não editorial (experiência).

## Identificação de Lacunas
- Não existem tipos que descrevam a função pedagógica ou simbólica do áudio (ex: Meditação, Aula, Prática).
- O campo é obrigatório (ENUM), o que impede o uso de textos livres para taxonomia sem alteração de banco.

## Proposta de Taxonomia Editorial
Como o campo `tipo` no banco é um ENUM técnico (`track_type`), a taxonomia editorial será implementada via **Mapeamento Visual** e **Sugestão de Tags**, mantendo a integridade do banco:

### 1. Categorias Editoriais (Mapeamento sugerido):
- **Abertura de Campo**: Início de estações/ciclos.
- **Aula Principal**: Conteúdo teórico denso.
- **Conto & Símbolo**: Narrativas arquetípicas.
- **Prática Guiada**: Exercícios e meditações.
- **Laboratório 80/20**: Aplicação técnica.
- **Fechamento de Campo**: Conclusão e integração.

### 2. Implementação na Audioteca (Sem mudança de schema):
- **Badge Visual**: Usar o campo `tags` (array de texto já existente) para armazenar e exibir a categoria editorial.
- **Filtro Avançado**: Adicionar filtro por categoria baseada nas tags.
- **Interface de Edição**: Sugestão de "Tags Rápidas" com os nomes da taxonomia oficial para evitar digitação inconsistente.

## Riscos
- **Inconsistência**: Por ser baseado em `tags` (texto livre), pode haver erros de digitação (ex: "Meditação" vs "meditacao").
- **Solução**: Implementar um seletor de tags pré-definidas no Admin.

## Classificação
**PRONTO PARA IMPLEMENTAÇÃO VISUAL**

Podemos implementar a taxonomia editorial utilizando a coluna `tags` já existente na tabela `clube_audio_tracks`, sem necessidade de alterar o ENUM `track_type` ou criar novas tabelas.

---
**Relatório gerado por Lovable em 15/05/2026**
