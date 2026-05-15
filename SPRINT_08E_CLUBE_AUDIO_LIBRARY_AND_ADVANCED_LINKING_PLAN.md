# Plano de Auditoria e Implementação: SPRINT 08E - Biblioteca de Áudios e Vínculo Avançado

## Objetivo
Planejar a gestão centralizada de áudios do Clube Oracular, substituindo ou integrando o modelo atual de metadados manuais por um sistema de Biblioteca de Áudios rastreável e vinculável.

## Auditoria de Estrutura Atual (Diagnóstico)
1. **Modelagem Existente**:
   - Foram identificadas as tabelas `clube_audio_albums` e `clube_audio_tracks`.
   - `clube_audio_tracks` possui campos robustos: `audio_url`, `duracao_segundos`, `ordem`, `publicado`, `tipo` (Enum) e `tags`.
   - Atualmente, os itens da rota (`clube_rota_itens`) utilizam metadados JSONB (`metadata->'audios'`) para renderizar players, o que causa redundância e dificulta a gestão global.

2. **Vínculos Atuais**:
   - Os áudios são vinculados a "Álbuns" (que por sua vez se vinculam a Estações).
   - O player na Rota Premium consome o array de objetos dentro de `metadata`.

3. **Riscos e Gaps**:
   - Alterar a estrutura de metadata sem migração pode quebrar a experiência da assinante.
   - Falta uma interface central para o Admin gerenciar a biblioteca de faixas (`clube_audio_tracks`) de forma independente das estações.

## Proposta Técnica

### 1. Painel de Biblioteca de Áudios (Admin)
- **Localização**: Nova aba "Audioteca" no Painel Editorial.
- **Funcionalidades**:
  - Listagem de todas as faixas registradas em `clube_audio_tracks`.
  - Edição de títulos, descrições (se adicionadas ao schema futuramente) e URLs.
  - Preview de áudio diretamente no Admin.
  - Filtro por Estação/Álbum.

### 2. Vínculo Avançado (Estratégia)
- **Fase 1 (Atual)**: Permitir que o Admin selecione áudios da `clube_audio_tracks` para preencher o `metadata` do item de rota automaticamente, evitando erros de digitação de URL.
- **Fase 2 (Futuro)**: Adicionar coluna `audio_track_id` em `clube_rota_itens` para vínculo relacional direto (requer banco).

## Regras e Travas Respeitadas
- Nenhuma tabela nova será criada nesta sprint.
- O sistema de metadados continuará sendo o "consumidor final" para não quebrar o frontend atual, mas a "origem" será facilitada pela biblioteca.

## Classificação
**PRONTO PARA IMPLEMENTAÇÃO VISUAL**

(A estrutura de `clube_audio_tracks` é suficiente para criar o gerenciador visual sem novas migrações imediatas).

## Próximo Passo Sugerido
Implementar a aba "Audioteca" e o seletor de áudios dentro do editor de Itens de Rota.
