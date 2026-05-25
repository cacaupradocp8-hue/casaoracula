# Encerramento Soft Delete Portais/Travessias V0

O ciclo de implementação V0 para o sistema de arquivamento lógico (soft delete) dos conteúdos de Portais e Aulas foi concluído com sucesso.

## 1. Status final

**Status**: `SOFT_DELETE_PORTAIS_TRAVESSIAS_V0_CLOSED`

O ciclo V0 foi finalizado, garantindo que o fluxo operacional de remoção de conteúdos no Admin agora preserva a integridade dos dados no banco de dados, substituindo a exclusão permanente por um estado de arquivamento auditável.

## 2. Objetivo do ciclo

O objetivo principal deste ciclo foi substituir o delete físico comum (irreversível) pelo arquivamento lógico (soft delete) nas tabelas centrais de conteúdo:

- `public.conteudo_travessias` (Portais)
- `public.conteudo_aulas` (Aulas)

Com isso, evita-se a perda acidental de histórico, progresso de alunos e metadados editoriais, permitindo que a administração oculte conteúdos sem destruí-los.

## 3. Schema implementado

As tabelas mencionadas receberam os campos padronizados para o arquivamento lógico:

```sql
archived_at timestamptz null   -- Data e hora do arquivamento
archived_by uuid null          -- Identificador do autor da ação
archive_reason text null       -- Justificativa editorial obrigatória na UI
```

As chaves estrangeiras (FK) indevidas inicialmente criadas para `archived_by` foram removidas, mantendo o campo como um identificador UUID puro conforme o plano de arquitetura V0.

## 4. Mudanças na Interface (Admin)

- **Remoção do Delete Físico**: O botão de exclusão permanente e o handler `handleDelete` foram removidos da `AdminConteudosTab.tsx`.
- **Botão Arquivar**: Adicionado como ação primária de remoção (ícone de Archive, cor âmbar).
- **Modal de Arquivamento**: Implementado para solicitar obrigatoriamente o `archive_reason` antes de processar o arquivamento.
- **Filtragem Automática**: A DAL (`adminPortalsRead.ts`) foi atualizada para filtrar registros onde `archived_at IS NULL`, removendo os arquivados das listagens padrão de forma transparente.

## 5. Auditoria de Segurança

- **Domínios Sensíveis**: Nenhuma alteração foi realizada em Cidadela, Casa das Máquinas, Jardim da Heroína ou Atlas.
- **Permissões**: As RLS e políticas de acesso permanecem inalteradas, mantendo a segurança do banco de dados baseada em autenticação e roles.
- **Retrocompatibilidade**: Funcionalidades de publicação, edição e uploads continuam operando normalmente sobre os registros ativos.

## 6. Próximos Passos (V1)

Para o futuro ciclo V1 ou subsequentes, planeja-se:
1. Interface de recuperação (Restore) de conteúdos arquivados.
2. Aba de "Lixeira" ou "Arquivo" para visualização e gestão de conteúdos não ativos.
3. Auditoria automática de quem realizou o arquivamento via triggers (atualmente feito via UI).

---
**Ciclo Finalizado em**: 25 de Maio de 2026
**Referência**: `SOFT_DELETE_PORTAIS_TRAVESSIAS_DELETE_FIX_AUDITED_OK`
