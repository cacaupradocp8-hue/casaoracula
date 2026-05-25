# Auditoria Pré-Migration Soft Delete Portais/Travessias

## 1. Status da auditoria

`ADMIN_SOFT_DELETE_AUDIT_PORTALS_DONE`

Esta auditoria valida a segurança e o impacto da futura implementação de arquivamento lógico (soft delete) para os domínios de Portais e Aulas.

## 2. Tabelas analisadas

- `conteudo_travessias` (Portais)
- `conteudo_aulas` (Aulas)

## 3. Estado atual do schema

Ambas as tabelas utilizam atualmente apenas o campo `publicado: boolean` para controle de visibilidade. Não existem campos de rastreamento de exclusão ou arquivamento. 

- **Campos identificados**: `id`, `titulo`, `ordem`, `publicado`, `updated_at`.
- **Relações críticas**: 
    - `conteudo_aulas` possui chave estrangeira para `conteudo_travessias`.
    - `user_lesson_progress` (implícito) depende da existência física de `conteudo_aulas`.

## 4. Impacto da implementação futura

A adição dos campos `archived_at`, `archived_by` e `archive_reason` trará os seguintes benefícios e impactos:

| Tabela | Impacto Editorial | Impacto Relacional | Impacto em Alunas |
| :--- | :--- | :--- | :--- |
| `conteudo_travessias` | Permite ocultar portais obsoletos sem perder a estrutura. | Evita erro de FK ao tentar apagar portais com aulas. | Nenhum (se filtrado corretamente). |
| `conteudo_aulas` | Preserva o conteúdo de aulas descontinuadas. | Mantém integridade de chaves estrangeiras em logs. | **Preserva o progresso histórico (conclusão).** |

## 5. Auditoria de DAL e Componentes

- **`AdminPortalsRead.ts` (DAL)**: As funções `listAdminConteudoPortais` e `listAdminConteudoAulas` atualmente fazem `select('*')`. Após a migração, precisarão ser atualizadas para filtrar `archived_at is null` por padrão, ou incluir um parâmetro para visualizar arquivados.
- **`AdminConteudosTab.tsx` (UI)**: O componente utiliza `publicado` para opacidade visual. A lógica de delete atual é física (`.delete()`). A implementação futura deverá trocar o delete físico por um update nos novos campos de arquivamento.

## 6. Riscos identificados

- `EDITORIAL_RISK`: Baixo. O arquivamento é mais seguro que o delete atual.
- `RELATIONAL_RISK`: Médio. Requer atualização simultânea na DAL de leitura para não exibir conteúdos arquivados como se estivessem ativos/rascunhos.
- `STORAGE_RISK`: Baixo. O conteúdo textual permanece no banco, mas o impacto em bytes é negligenciável frente à segurança ganha.

## 7. Recomendações pré-migration

1. **Campos Seguros**: A adição de `archived_at` (timestamptz), `archived_by` (uuid) e `archive_reason` (text) é segura e recomendada.
2. **Filtro de Leitura**: Antes da migração, deve-se mapear todas as queries que consomem estas tabelas para garantir que o filtro `is null` seja aplicado uniformemente para evitar que conteúdos "apagados" reapareçam na interface de usuário (habitante).
3. **Padrão de UI**: O botão de "Excluir" deve ser visualmente distinto do "Despublicar" (toggle de rascunho), mesmo que ambos utilizem estados lógicos.

## 8. Decisão final

`ADMIN_SOFT_DELETE_PORTALS_APPROVED_FOR_MIGRATION`

A implementação do schema de soft delete para Portais e Aulas é segura e não apresenta riscos de regressão se acompanhada da atualização das queries de leitura.

## 9. Próxima etapa sugerida

"Etapa 190 — Migration Soft Delete Portais/Travessias V0. Criar migration para adicionar campos de arquivamento (`archived_at`, `archived_by`, `archive_reason`) às tabelas `conteudo_travessias` e `conteudo_aulas`, sem alterar o código da aplicação nesta fase."
