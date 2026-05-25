# Plano de UI e Mutations — Soft Delete Portais e Aulas (V0)

Este documento descreve o plano técnico para a implementação da interface e das mutações de arquivamento lógico (soft delete) para Portais (Travessias) e Aulas.

## 1. Visão Geral
O objetivo é substituir ou complementar a ação de exclusão física atual por uma ação de arquivamento que preserve os dados no banco de dados, marcando-os com `archived_at`, `archived_by` e `archive_reason`.

## 2. Estratégia de Mutations (DAL/Hooks)

### Novas Operações Recomendadas
- **`useArchiveTravessia`**: Hook para atualizar os campos de arquivamento na tabela `conteudo_travessias`.
- **`useArchiveAula`**: Hook para atualizar os campos de arquivamento na tabela `conteudo_aulas`.

### Payload de Arquivamento
```typescript
{
  id: string;
  archived_at: string; // ISO string (now)
  archived_by: string; // ID do perfil do usuário logado
  archive_reason: string; // Texto fornecido pelo usuário
}
```

### Comportamento da Mutation
- Deve realizar um `update` simples nos campos específicos.
- Não deve disparar deleção física de registros relacionados (ferramentas, progresso, etc) nesta fase.

## 3. Estratégia de Interface (UI/UX)

### Admin de Conteúdos
1.  **Botão de Ação**: 
    - Manter o botão de excluir (lixeira), mas alterar seu comportamento ou adicionar um novo botão "Arquivar".
    - Recomendação V0: Alterar o modal de confirmação de exclusão para oferecer "Arquivar" como opção primária.

2.  **Modal de Arquivamento**:
    - Solicitar obrigatoriamente um "Motivo do Arquivamento" (`archive_reason`).
    - Exibir aviso: "Este conteúdo não será mais visível para os alunos, mas permanecerá no banco de dados."

3.  **Sinalização Visual**:
    - Conteúdos arquivados devem aparecer na listagem admin com um badge "Arquivado" ou opacidade reduzida.
    - Filtro na listagem: "Ver Ativos" (default) / "Ver Arquivados" / "Ver Todos".

## 4. Filtragem de Dados (Queries)

### Visão Aluno (Pública)
- As queries de busca de conteúdos devem ser alteradas para incluir:
  `query.is('archived_at', null)`
- Isso garante que alunos nunca vejam conteúdos arquivados.

### Visão Admin
- As queries padrão devem continuar trazendo todos os dados para permitir a gestão de arquivados, aplicando filtros apenas via UI.

## 5. Próximos Passos (Etapas Futuras)
1.  **Etapa 196**: Implementação dos hooks de mutation (`useArchiveTravessia` e `useArchiveAula`).
2.  **Etapa 197**: Alteração do modal de confirmação no Admin de Conteúdos.
3.  **Etapa 198**: Atualização das queries públicas para respeitar o `archived_at is null`.

## 6. Riscos e Mitigações
- **Vínculos Órfãos**: Verificar se o arquivamento de um Portal afeta a navegação de Aulas vinculadas. (Mitigação: Garantir que a query de aulas também filtre por arquivamento).
- **UX do Admin**: Evitar poluição visual na listagem principal. (Mitigação: Usar abas ou filtros claros).

---
**Status do Plano**: Aguardando implementação.
**Referência**: `SOFT_DELETE_PORTAIS_TRAVESSIAS_SCHEMA_APPROVED`
