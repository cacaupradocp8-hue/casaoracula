# Encerramento Filtros Públicos Soft Delete V0

A camada de segurança e filtragem para a interface das alunas (frontend público/protegido) foi ajustada para respeitar o estado de arquivamento lógico dos conteúdos.

## 1. Status final

**Status**: `SOFT_DELETE_PUBLIC_FILTERS_V0_CLOSED`

A implementação da camada pública/protegida foi concluída e auditada com sucesso, garantindo que o arquivamento realizado no Admin reflita imediatamente na experiência da aluna, ocultando conteúdos obsoletos ou removidos.

## 2. Objetivo da camada

O objetivo fundamental foi estender a lógica de soft delete para além do ambiente administrativo, assegurando que registros arquivados nas tabelas `conteudo_travessias` e `conteudo_aulas` não sejam acessíveis pelas alunas em nenhum ponto de contato da aplicação, incluindo:

- **Listagens e Hubs**: Grades de portais e listas de aulas.
- **Páginas de Detalhe**: Visualização profunda de portais e travessias.
- **Visualização de Aula**: Acesso direto ao conteúdo pedagógico.
- **Acessos Diretos**: Tentativas de acesso via URL utilizando `id`, `slug`, `portal_id` ou `travessia_id`.

## 3. Regra aplicada

Todas as consultas (queries) realizadas fora do ambiente de administração (Admin) devem, obrigatoriamente, combinar os filtros de publicação (`publicado = true`) com a verificação de ausência de arquivamento:

```ts
.is("archived_at", null)
```

Esta regra garante que mesmo conteúdos marcados tecnicamente como "publicados" no banco de dados sejam omitidos da interface caso tenham sido arquivados logicamente.

## 4. Arquivos Ajustados

Os seguintes componentes e páginas foram atualizados para incluir a nova regra de filtragem:

- `src/pages/Portais.tsx`: Ocultação em cards e listagem geral.
- `src/pages/PortalDetalhe.tsx`: Bloqueio de acesso ao portal e filtragem da lista de aulas vinculadas.
- `src/pages/SalaDetalhe.tsx`: Filtragem de portais exibidos dentro de salas específicas.
- `src/pages/PortalOraculaPage.tsx`: Ajuste na listagem de travessias para o perfil Orácula.
- `src/pages/AulaPage.tsx`: Bloqueio de visualização individual de aulas arquivadas (acesso direto).
- `src/pages/TravessiaDetalhe.tsx`: Filtragem de lições/aulas em componentes de jornada.

## 5. Próximos Passos Sugeridos

- **Padronização em DAL**: Migrar gradualmente as queries inline das páginas para funções centralizadas na DAL para evitar repetição do filtro.
- **Tratamento de Erros**: Refinar as mensagens de "Conteúdo não encontrado" para diferenciar claramente entre conteúdo inexistente e conteúdo arquivado (para fins de suporte técnico).

---
**Documentação consolidada em**: 25 de Maio de 2026
**Referência**: `SOFT_DELETE_PUBLIC_FILTERS_AUDITED_OK`
