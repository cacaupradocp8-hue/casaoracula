# Plano de Governança Admin Editorial V0.3

## 1. Status do plano

`ADMIN_EDITORIAL_GOVERNANCE_PLANNED`

Este documento estabelece a diretriz estratégica e técnica para a reorganização do sistema administrativo da Casa Orácula. Esta etapa consiste exclusivamente na formalização do plano, sem qualquer alteração em código ou banco de dados.

## 2. Resumo da auditoria (Fase 168)

A auditoria realizada confirmou a integridade do ambiente atual:
- **Status:** `ADMIN_EDITORIAL_AUDIT_APPROVED`
- **Segurança:** `ADMIN_ACCESS_SAFE` (Acesso restrito à role `admin`)
- **Governança:** `EDITORIAL_NEEDS_STRUCTURE` (Falta padronização em fluxos de publicação)
- **Legado:** `NO_LEGACY_REFERENCES` (Ambiente limpo de referências mortas)

O sistema está seguro para operação, mas apresenta gargalos arquiteturais que podem comprometer a escalabilidade.

## 3. Problema principal identificado

- **Acoplamento Excessivo:** Uso direto de chamadas Supabase (`supabase.from().select()`) dentro de componentes de UI.
- **Camadas Inexistentes:** Ausência de uma camada de DAL (Data Access Layer) ou Services dedicada exclusivamente ao Admin.
- **Complexidade de Componentes:** Arquivos de UI carregados com lógica de queries, mutations, estados de loading e validações de negócio.
- **Auditoria Limitada:** Dificuldade em rastrear alterações editoriais e implementar permissões granulares no futuro.

## 4. Princípio arquitetural V0.3

> **"Admin UI não deve conter regra de acesso, query complexa ou mutation direta."**

A interface deve ser puramente apresentacional, delegando a inteligência de dados para camadas especializadas.

## 5. Arquitetura proposta

A reorganização será baseada em:
- **`src/lib/dal/admin/`**: Funções puras de acesso a dados administrativo.
- **`src/hooks/admin/`**: Hooks especializados para orquestrar estados e mutations (React Query).
- **`src/types/admin.ts`**: Tipagem centralizada para entidades e permissões editoriais.
- **`src/services/admin/`**: Lógica de negócio complexa (ex: fluxos de certificação).

## 6. Domínios administrativos definidos

| Domínio | Abrangência | Responsabilidade |
| :--- | :--- | :--- |
| **Editorial** | Vitrine, Textos Públicos, Blocos | Gestão de Copy e Visual |
| **Clube / Rotas** | Estações, Travessias, Acervo | Operação Premium |
| **Formação** | Cursos, Módulos, Aulas | Gestão Acadêmica |
| **Usuárias** | Perfis, Roles, Assinaturas | Governança de Acessos |
| **Sistema** | Configurações, Logs, Auditoria | Infraestrutura Lógica |

## 7. Ordem de refatoração recomendada

1. **Abstração do DAL:** Criar as funções de leitura/escrita em `src/lib/dal/admin/`.
2. **Implementação de Hooks:** Migrar lógica do `useQuery` para hooks customizados em `src/hooks/admin/`.
3. **Limpeza de Componentes:** Refatorar `Admin.tsx` e abas (ex: `AdminModulosFormativos.tsx`) para consumir apenas os hooks.
4. **Documentação de RLS:** Revisar políticas de segurança para garantir o princípio do privilégio mínimo.

## 8. Guardrails de segurança

- Nenhuma mutation destrutiva (delete) deve ser feita sem confirmação de UI.
- Toda alteração editorial deve ser validada por tipos TypeScript.
- Conteúdos em "Rascunho" nunca devem vazar para o portal da Aluna/Visitante.
- O Modo Preview deve ser preservado para validação de conteúdo antes da publicação.

## 9. Critérios de aceite

- Zero uso de `supabase.from()` diretamente em páginas de Admin.
- Cobertura de tipos 100% nas funções do DAL Admin.
- Tempo de resposta de UI mantido através de cache inteligente (React Query).
- Sistema aprovado por `npx tsc --noEmit`.

## 10. Próximos passos recomendados

Sugerido iniciar pela migração do domínio de **Usuárias** e **Módulos Formativos**, por serem as áreas de maior volume de dados.
