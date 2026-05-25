# Plano de Soft Delete e Arquivamento Lógico Admin

## 1. Status do plano

`ADMIN_SOFT_DELETE_PLAN_CREATED`

Este documento apresenta o planejamento estratégico e técnico para a transição do sistema administrativo da Casa Orácula de um modelo de exclusão física para um modelo de arquivamento lógico controlado. Esta etapa é estritamente documental; nenhuma migração de banco de dados ou alteração de código deve ser realizada neste momento.

## 2. Resumo da auditoria

A auditoria realizada na Etapa 187 (`ADMIN_DELETE_AUDIT_APPROVED`) confirmou a presença de operações `.delete()` do Supabase em componentes críticos. O risco de perda de dados e instabilidade sistêmica é elevado em áreas fundamentais como:

- **Formação**: Estrutura dos módulos formativos.
- **Cursos e Aulas**: Conteúdo programático e registro de progresso.
- **Portais e Travessias**: Jornadas de experiência da habitante.
- **Salas e Ferramentas**: Infraestrutura de suporte e instrumentos clínicos.
- **Vínculos Estruturais**: Relações entre conteúdos, permissões e acessos.

## 3. Problema principal

O uso de exclusão física (Physical Delete) no estágio atual do projeto apresenta os seguintes riscos:

- **Perda Irreversível**: Impossibilidade de recuperação de conteúdos editados ou materiais históricos.
- **Links Quebrados**: Referências em roteiros, dashboards ou comunicações que apontam para IDs inexistentes.
- **Registros Órfãos**: Embora chaves estrangeiras possam impedir a exclusão, a tentativa de delete gera erros de UI que degradam a experiência administrativa.
- **Inconsistência de Progresso**: A remoção de uma aula física apaga instantaneamente o histórico de conclusão de todas as alunas vinculadas.
- **Dificuldade de Auditoria**: Ausência de rastro sobre quem apagou o quê e por qual motivo.
- **Risco de Publicação**: Possibilidade de apagar conteúdos que estão ativos e sendo consumidos em tempo real.

## 4. Princípio de governança

O padrão adotado para a evolução do sistema é:

> "Conteúdo editorial, formativo ou estrutural não deve ser apagado fisicamente por padrão. A exclusão física deve ser um privilégio excepcional, enquanto o arquivamento lógico deve ser a ferramenta de gestão do ciclo de vida do conteúdo."

## 5. Estratégia de campos futuros

Para padronizar o arquivamento, as seguintes colunas são propostas para migrações futuras:

- `is_archived`: Boolean (default false) para filtro rápido em queries de leitura.
- `archived_at`: Timestamp para registro cronológico da desativação.
- `archived_by`: UUID referenciando o administrador responsável.
- `status`: Enum expandido para incluir `archived` ou `hidden`.

## 6. Fases de implementação sugeridas

### Fase 1 — Padronização de Leitura (Ready)
- Ajustar DALs de leitura para respeitar filtros de `ativa: true` ou `is_archived: false` onde os campos já existem.
- Garantir que a UI administrativa mostre itens arquivados em uma aba ou seção separada.

### Fase 2 — Troca de Botões (UI/UX)
- Substituir o rótulo "Excluir" por "Arquivar" na interface.
- Alterar o `AlertDialog` para informar que o conteúdo será movido para o arquivo, não apagado.

### Fase 3 — Migração de Mutations
- Alterar funções de delete no código para chamadas de `.update()` enviando os metadados de arquivamento.
- Implementar travas de segurança que impedem o arquivamento de itens com dependências ativas.

### Fase 4 — Governança de Banco
- Executar as migrations de schema para adicionar os campos em tabelas que ainda não os possuem.
- Revisar políticas de RLS para garantir que usuários finais (habitantes) nunca vejam conteúdos arquivados.

## 7. Tabelas prioritárias

| Ordem | Tabela | Motivo da Prioridade |
| :--- | :--- | :--- |
| 1 | `conteudo_aulas` | Proteção imediata do progresso das alunas. |
| 2 | `course_lessons` | Proteção imediata do progresso em cursos. |
| 3 | `sala_ferramentas` | Manter integridade das rotas e sessões clínicas. |
| 4 | `modulos_formativos` | Estabilidade da estrutura da jornada principal. |
| 5 | `conteudo_travessias` | Preservação de conteúdo editorial de portais. |

## 8. O que não mexer automaticamente

- **Tabelas de Log/Auditoria**: Registros temporários podem continuar sofrendo delete físico por expiração.
- **Arquivos no Storage**: A limpeza de arquivos (PDFs/Imagens) deve seguir um ciclo de auditoria separado para não sobrecarregar o armazenamento com lixo eletrônico.
- **Tabelas de Relacionamento (Join Tables)**: Vínculos M:N (como `portal_salas`) podem sofrer delete físico se a relação for puramente associativa e não carregar metadados históricos.

## 9. Critérios de aceite futuros

- Uma aula arquivada não deve aparecer no portal da aluna, mas deve manter os registros de `viewed: true` no banco.
- O administrador deve conseguir "Desarquivar" um item com um clique, restaurando sua posição original.
- Nenhuma operação de "Excluir" deve ser disparada sem um rastro de quem a executou.

## 10. Próxima etapa recomendada

"Etapa 189 — Implementação Piloto de Soft Delete: Salas e Ferramentas. Realizar a primeira troca técnica, substituindo `.delete()` por `.update({ ativa: false })` nos componentes de Salas e Ferramentas, que já possuem o campo necessário no schema, validando o fluxo de UI e as queries de leitura."

---
Documento de planejamento técnico para governança de dados da Casa Orácula.
