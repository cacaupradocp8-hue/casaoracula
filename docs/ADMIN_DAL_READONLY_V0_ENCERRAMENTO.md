# Encerramento Admin DAL Readonly V0

## 1. Status final

`ADMIN_DAL_READONLY_V0_CLOSED`

A primeira microfase de extração readonly do Admin foi concluída com sucesso. Todas as queries de leitura planejadas foram centralizadas em camadas de acesso a dados (DAL) específicas, aumentando a manutenibilidade sem comprometer a estabilidade do sistema.

## 2. Objetivo da microfase

O objetivo principal foi reduzir o acoplamento direto entre os componentes da interface administrativa e o Supabase client, criando uma camada de abstração exclusiva para operações de leitura (DAL Readonly). Todo o processo foi executado sem realizar alterações em:

- UI, layout ou textos originais;
- Operações de escrita (mutations);
- Permissões, roles e regras de segurança (RLS);
- Rotas, menus e redirecionamentos;
- Esquema do banco de dados e migrations;
- Domínios sensíveis ou lógica de negócio protegida.

## 3. DALs criadas

| DAL | Arquivo | Status | Escopo |
| :--- | :--- | :--- | :--- |
| Formação | `src/lib/dal/admin/adminFormacaoRead.ts` | Aprovada | Módulos formativos, banner e opções de rota |
| Usuários | `src/lib/dal/admin/adminUsersRead.ts` | Aprovada | Listagem administrativa e estatísticas |
| Cursos | `src/lib/dal/admin/adminCoursesRead.ts` | Aprovada | Cursos, módulos e aulas |
| Portais/Travessias | `src/lib/dal/admin/adminPortalsRead.ts` | Aprovada | Portais, aulas, salas ativas e ferramentas |
| Salas/Ferramentas | `src/lib/dal/admin/adminSalasFerramentasRead.ts` | Aprovada | Salas, ferramentas e vínculos `portal_salas` |

## 4. Funções readonly consolidadas

#### `adminFormacaoRead.ts`
- `listAdminModulosFormativos`: Recupera a estrutura dos módulos de formação.
- `getAdminBannerSettings`: Busca configurações globais de banners.
- `getAvailableAdminRouteOptions`: Lista rotas válidas para configuração de destino.

#### `adminUsersRead.ts`
- `listAdminUsers`: Listagem de usuários com filtros administrativos.
- `getAdminUserStats`: Consolidação de métricas globais de usuárias.

#### `adminCoursesRead.ts`
- `listAdminCourses`: Lista cursos com metadados administrativos.
- `listAdminCourseModules`: Recupera módulos vinculados a um curso.
- `listAdminCourseLessons`: Lista aulas vinculadas a um módulo.

#### `adminPortalsRead.ts`
- `listAdminConteudoPortais`: Lista travessias e portais editoriais.
- `listAdminConteudoAulas`: Recupera aulas específicas de uma travessia.
- `listAdminSalasAtivas`: Lista salas com status ativo.
- `listAdminSalaFerramentas`: Lista ferramentas básicas vinculadas.

#### `adminSalasFerramentasRead.ts`
- `listAdminSalasFull`: Lista salas com todos os campos de configuração.
- `listAdminSalaFerramentasFull`: Recupera ferramentas com campos estendidos (`has_blocks`, `slug`).
- `listAdminPortalSalas`: Lista a matriz de vínculos entre portais e salas.
- `listAdminSalasForFerramentas`: Query otimizada para seletores de formulário.

## 5. Componentes ajustados

| Componente | Alteração |
| :--- | :--- |
| `AdminModulosFormativos.tsx` | Migrado para consumo da DAL de Formação. |
| `AdminUsersTab.tsx` | Migrado para consumo da DAL de Usuários. |
| `AdminCursosTab.tsx` | Migrado para consumo da DAL de Cursos. |
| `AdminConteudosTab.tsx` | Migrado para consumo da DAL de Portais/Travessias. |
| `AdminSalasTab.tsx` | Migrado para consumo da DAL de Salas/Ferramentas. |
| `AdminFerramentasTab.tsx` | Migrado para consumo da DAL de Salas/Ferramentas. |

## 6. O que foi preservado

Foram preservados integralmente:
- **Interface**: Visual, textos, layout e responsividade.
- **Navegação**: Rotas, menus, redirects e roteamento protegido.
- **Segurança**: Roles, permissões, RLS e autenticação.
- **Banco**: Schema, migrations e integridade referencial.
- **Interação**: Toasts, dialogs, estados locais, validações e feedback visual.
- **Escrita**: Mutations (Insert/Update/Delete), Reorder, Publish/Unpublish e Uploads (Storage).

## 7. Mutations que ficaram fora da DAL

As seguintes operações permanecem descentralizadas nos componentes para garantir segurança nesta fase:
- Gestão (CRUD) de Módulos Formativos e Curso.
- Configuração de Banners e opções de rota.
- Alteração de portal e permissões de usuárias.
- Gestão de Aulas, Portais e Travessias.
- Publicação, despublicação e ordenação de conteúdos.
- Gestão de Salas, Ferramentas e vínculos de portais.
- Upload de arquivos e manipulação de objetos no Storage.

## 8. Guardrails de privacidade

- **Restrição de Acesso**: As DALs V0 não acessam dados terapêuticos, prontuários, pagamentos, certificados ou progresso individual de alunas.
- **Dados Sensíveis**: `adminUsersRead.ts` acessa apenas informações cadastrais básicas (nome/email/portal) necessárias para a gestão administrativa, sob auditoria.
- **Privacidade por Design**: Nenhuma tabela de rastreamento de atividade com identificadores pessoais foi incluída sem auditoria prévia.

## 9. Guardrails de domínio

A microfase não realizou qualquer intervenção nos seguintes domínios:
- Cidadela, Casa das Máquinas e Jardim da Heroína.
- Clube V3 e Dashboard.
- Integrações de IA, Syntheia ou Atlas.

## 10. Riscos ainda existentes

- **Mutations In-place**: Componentes extensos mantendo lógica de escrita complexa.
- **Soft Delete**: Ausência de política uniforme de arquivamento (ex: exclusão física ainda presente em Portais).
- **Auditoria**: Ausência de logs de auditoria editorial e histórico de versões.
- **Legado**: `AdminConteudosTab.tsx` permanece classificado como `LEGACY_BUT_ACTIVE` devido à sua complexidade.

## 11. Critérios para próximas DALs

1. Auditoria específica de segurança antes da extração.
2. Implementação restrita a operações `SELECT`.
3. Proibição de inclusão de lógica de escrita ou side-effects.
4. Manutenção rigorosa de tipos e contratos da UI.
5. Verificação pós-implementação via `tsc` e auditoria de domínio.

## 12. Próximos ciclos possíveis

- Auditoria e DAL para Admin Eventos/Calendário.
- Auditoria e DAL para o ecossistema do Clube V3.
- Plano de centralização de Mutations Administrativas.
- Implementação de Soft Delete/Arquivamento lógico global.
- Sistema de Logs de Auditoria Editorial.
- Refatoração UX/UI dos painéis administrativos legados.

## 13. O que não fazer automaticamente

Sem um novo ciclo formal, é proibido:
- Mover mutations para a DAL.
- Alterar políticas de RLS ou esquemas de tabela.
- Implementar logs ou soft delete sem plano aprovado.
- Intervir em Cidadela, Casa das Máquinas, Jardim da Heroína ou Clube V3.
- Introduzir IA ou Syntheia em fluxos administrativos.

## 14. Validação técnica final

- `npx tsc --noEmit`: Sucesso (0 erros).
- Integridade de Rotas Admin: Verificada.
- Segurança de Dados: Auditoria de privacidade concluída.
- Domínios Sensíveis: Inalterados.

## 15. Decisão final

`ADMIN_DAL_READONLY_V0_CLOSED`

A microfase Admin DAL Readonly V0 está encerrada e a aplicação encontra-se pronta para manutenção controlada e evolução estruturada.
