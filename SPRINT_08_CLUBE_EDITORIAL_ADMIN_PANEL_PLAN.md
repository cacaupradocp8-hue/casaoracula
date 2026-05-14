# Plano Estratégico: Painel Editorial do Clube Oracular (SPRINT 08)

Este documento detalha o planejamento para a implementação do Painel Editorial no Admin, permitindo a gestão dinâmica das rotas e conteúdos guiados do Clube.

## 1. Auditoria da Estrutura Atual

Identificamos que a infraestrutura de banco de dados já é robusta e cobre a maior parte das necessidades editoriais:

- **Estações**: Geridas pela tabela `clube_estacoes`. Já possui suporte para título, subtítulo, banner e status.
- **Rotas/Itens**: Geridas pela tabela `clube_rota_itens`. Esta é a tabela mestre que o componente `ClubeRotaPremium` utiliza.
- **Campos Dinâmicos**: A tabela `clube_rota_itens` já possui colunas específicas para o conteúdo premium:
  - `porta`, `campo`, `torre`, `labirinto` (Cartografia)
  - `jardim_prompt` (Prompt do Diário)
  - `cenario_treinamento` (Laboratório 80/20)
  - `metadata` (Armazena JSON com áudios, perguntas sugeridas e outros detalhes)

**Diagnóstico**: A estrutura atual NÃO é hardcoded na UI. O componente `ClubeRotaPremium` é 100% orientado a dados (Data-driven), consumindo o que está no banco através do hook `useRotaOracular`.

## 2. Proposta de Painel Editorial (Admin)

O painel será integrado ao ambiente de Admin existente, adicionando uma nova aba ou subseção "Clube Editorial".

### Funcionalidades Planejadas:
1. **Gestão de Estações**:
   - Listagem de estações com status (ativa/rascunho).
   - Edição de metadados da estação (Livro, Autor, Banner).
2. **Editor de Itens da Rota**:
   - Interface para ordenar os passos da jornada (drag-and-drop visual ou índice numérico).
   - Formulário para edição de textos guiados e cartografia simbólica.
3. **Gestão de Mídia e Interação**:
   - Interface para vincular áudios (da tabela `clube_audio_tracks`) a cada passo.
   - Editor de prompts para Syntheia e Jardim da Psique por etapa.
4. **Dashboard de Engajamento**:
   - Visualização de quantas usuárias completaram cada etapa da rota ativa.

## 3. Plano de Implementação Técnica

O processo será dividido em fases para garantir segurança:

- **Fase 1: UI do Painel**: Criação dos componentes de listagem e formulários no Admin utilizando as tabelas `clube_estacoes` e `clube_rota_itens`.
- **Fase 2: Gestão de Metadados**: Implementação do salvamento de campos complexos dentro da coluna `metadata` (JSONB), permitindo flexibilidade sem alterar o schema.
- **Fase 3: Refinamento de UX**: Adição de previews para que o Admin veja como a rota ficará no mobile/desktop antes de publicar.

## 4. Segurança e Regras
- **Sem alteração de Schema**: O banco já suporta as colunas necessárias. Caso surja necessidade de novos campos, utilizaremos o objeto `metadata`.
- **Permissões**: Acesso restrito apenas ao perfil `admin`.
- **Integridade**: Manutenção das políticas RLS existentes.

---

**Classificação**: PRONTO PARA IMPLEMENTAÇÃO VISUAL

A estrutura de banco de dados é suficiente para suportar um painel editorial dinâmico sem necessidade de novas migrações imediatas.
