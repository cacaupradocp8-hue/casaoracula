# Auditoria de Delete Físico e Arquivamento Lógico no Admin

## 1. Resumo executivo

O Admin possui um **risco crítico de perda editorial e quebra relacional** devido ao uso generalizado de exclusão física (`.delete()`) em quase todos os domínios fundamentais (Formação, Cursos, Travessias, Salas e Ferramentas). Não existe um padrão de "Soft Delete" ou "Arquivamento" implementado na maioria das tabelas, o que torna as ações irreversíveis e potencialmente perigosas para a integridade de dados de progresso de alunas e usuários do Clube.

## 2. Mapa de deletes físicos

| Componente | Tabela | Confirmação? | Risco | Recomendação |
| :--- | :--- | :--- | :--- | :--- |
| `AdminModulosFormativos.tsx` | `modulos_formativos` | Sim (AlertDialog) | `EDITORIAL_DELETE_RISK` | Implementar `status_publicacao: 'archived'` |
| `AdminCursosTab.tsx` | `courses` | Sim | `RELATIONAL_DELETE_RISK` | Bloquear se houver módulos/aulas |
| `AdminCursosTab.tsx` | `course_modules` | Sim | `RELATIONAL_DELETE_RISK` | Bloquear se houver aulas |
| `AdminCursosTab.tsx` | `course_lessons` | Sim | `EDITORIAL_DELETE_RISK` | Soft delete para preservar progresso |
| `AdminConteudosTab.tsx` | `conteudo_travessias` | Sim | `DOMAIN_DELETE_RISK` | Implementar arquivamento lógico |
| `AdminConteudosTab.tsx` | `conteudo_aulas` | Sim | `EDITORIAL_DELETE_RISK` | Soft delete obrigatório |
| `AdminSalasTab.tsx` | `portal_salas` | Não (Inline) | `RELATIONAL_DELETE_RISK` | Adicionar confirmação |
| `AdminSalasTab.tsx` | `sala_ferramentas` | Sim | `DOMAIN_DELETE_RISK` | Usar campo `ativa: false` |
| `AdminFerramentasTab.tsx` | `sala_ferramentas` | Sim | `DOMAIN_DELETE_RISK` | Usar campo `ativa: false` |
| `AdminQuizTab.tsx` | `quizzes` | Sim | `EDITORIAL_DELETE_RISK` | Soft delete |
| `AdminAgentesTab.tsx` | `agentes` | Não aparente | `LOW_DELETE_RISK` | Revisar fluxo |

## 3. Tabelas afetadas

| Tabela | Conteúdo | Relações? | Risco de Órfãos | Prioridade |
| :--- | :--- | :--- | :--- | :--- |
| `conteudo_aulas` | Aulas de Portais | Sim (Progresso) | Alto (Perda de histórico) | `CRÍTICA` |
| `course_lessons` | Aulas de Cursos | Sim (Progresso) | Alto (Perda de histórico) | `CRÍTICA` |
| `courses` | Cursos | Sim (Módulos/Aulas) | Médio (Cascade ou Erro) | `ALTA` |
| `modulos_formativos` | Estrutura de Formação | Sim (Cursos/Portais) | Médio | `ALTA` |
| `sala_ferramentas` | Ferramentas | Sim (Vínculos) | Baixo | `MÉDIA` |

## 4. Campos de arquivamento existentes

| Tabela | deleted_at | archived_at | is_archived | status | ativo/ativa | observação |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `modulos_formativos` | Não | Não | Não | Sim | Não | Possui `status_publicacao` |
| `salas` | Não | Não | Não | Não | Sim | Campo `ativa` disponível |
| `sala_ferramentas` | Não | Não | Não | Não | Sim | Campo `ativa` disponível |
| `courses` | Não | Não | Não | Não | Não | Apenas `publicado: boolean` |
| `conteudo_aulas` | Não | Não | Não | Não | Não | Apenas `publicado: boolean` |

## 5. Respostas às perguntas estratégicas

1. **Componentes com `.delete()`**: `AdminModulosFormativos.tsx`, `AdminCursosTab.tsx`, `AdminConteudosTab.tsx`, `AdminSalasTab.tsx`, `AdminFerramentasTab.tsx`, `AdminQuizTab.tsx`, entre outros menores.
2. **Delete indireto**: `AdminConteudosTab` deleta aulas automaticamente ao deletar um portal.
3. **Tabelas com delete físico**: `modulos_formativos`, `courses`, `course_modules`, `course_lessons`, `conteudo_travessias`, `conteudo_aulas`, `salas`, `sala_ferramentas`, `portal_salas`, `agentes`, `quizzes`.
4. **Confirmação visual**: Sim, na maioria via `AlertDialog`.
5. **Toast**: Sim, implementado em quase todos os fluxos observados.
6. **Invalidação de cache**: Sim, via `queryClient.invalidateQueries` ou re-fetch local.
7. **Cascade/Órfãos**: Existe risco alto de órfãos ou erros de FK em tabelas que não tratam dependências manualmente no código (ex: `courses` -> `course_modules`).
8. **Campo `deleted_at`**: Inexistente em todas as tabelas auditadas.
9. **Campo `archived_at`**: Inexistente em todas as tabelas auditadas.
10. **Campo `is_archived`**: Inexistente em todas as tabelas auditadas.
11. **Campo `ativo/ativa`**: Existe em `salas` e `sala_ferramentas`.
12. **Status (draft/pub)**: Existe em `modulos_formativos` e `courses`.
13. **Despublicar vs Apagar**: Atualmente, despublicar apenas oculta; apagar remove permanentemente.
14. **Risco conteúdo publicado**: Alto, não há trava para apagar itens publicados.
15. **Risco conteúdo alunas**: Crítico, apagar aulas remove o progresso vinculado.
16. **Risco Clube**: Médio/Alto, dependendo da tabela (jornadas/estrada).
17. **Risco Cidadela**: Baixo, mas existente em vínculos de salas.
18. **Risco Casa das Máquinas**: Alto em ferramentas e salas.
19. **Risco Jardim da Heroína**: Baixo (auditoria em curso).
20. **Risco ferramentas**: Alto, ferramentas apagadas quebram rotas e sessões.
21. **Risco curso com filhos**: Existente, pode gerar erro de chave estrangeira se não houver cascade no banco.
22. **Risco aula com progresso**: Crítico (perda de histórico).
23. **Risco usuário/role**: Não auditado delete de usuário nesta etapa, mas crítico se existir.
24. **Log de auditoria**: Não aparente nas tabelas de conteúdo.
25. **Histórico de versão**: Inexistente.
26. **Soft delete prioritário**: `conteudo_aulas` e `course_lessons`.
27. **Delete físico temporário**: Tabelas de configuração menor ou temporária.
28. **Bloqueio imediato**: Delete de Cursos e Portais sem verificação de filhos.
29. **Menor implementação segura**: Trocar `.delete()` por `.update({ active: false })` onde houver o campo.
30. **Migrations futuras**: Adição de `archived_at` e `status` em todas as tabelas de conteúdo.

## 6. Riscos por domínio


- **Formação**: Risco de quebrar a jornada principal se módulos forem apagados.
- **Cursos**: Excluir uma aula física remove o registro de progresso (viewed) de todas as alunas que a assistiram.
- **Portais/Travessias**: Idem aos cursos. Deletar um portal deleta todas as aulas vinculadas no componente atual.
- **Salas/Ferramentas**: Risco de quebrar acessos configurados se a ferramenta sumir do banco.
- **Usuários**: Excluir `profiles` é um risco de privacidade e quebra total de dados vinculados (Auth).

## 6. Recomendações

### Corrigir antes de novas features
- Bloquear exclusão física de `courses` e `conteudo_travessias` se houver filhos.
- Substituir o delete físico de `sala_ferramentas` por `update({ ativa: false })`.

### Corrigir antes de mutations DAL
- Garantir que toda mutação de exclusão no Admin passe por um `confirm` consistente.
- Padronizar o uso de `archived_at` ou status equivalentes.

### Pode esperar
- Deletar dados de log ou auditoria antiga (se houver).

## 7. Proposta de próxima etapa

"Etapa 188 — Implementação de Arquivamento Lógico em Salas e Ferramentas. Substituir as chamadas `.delete()` nos componentes `AdminSalasTab.tsx` e `AdminFerramentasTab.tsx` por atualizações no campo `ativa: false`, ajustando as queries de leitura para filtrar apenas registros ativos por padrão."

## 8. Decisão final

`ADMIN_DELETE_NEEDS_SOFT_DELETE_PLAN`

O sistema está pronto para operar, mas as ações de exclusão física devem ser substituídas gradualmente por arquivamento lógico para garantir a segurança dos dados históricos e de progresso das alunas.

---

**Nota**: As DALs readonly criadas em `src/lib/dal/admin/` não possuem operações de escrita ou exclusão, estando seguras conforme o contrato.
