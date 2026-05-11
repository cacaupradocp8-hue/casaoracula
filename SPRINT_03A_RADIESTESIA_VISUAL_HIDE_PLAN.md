# Sprint 03A: Arquivamento Estratégico da Radiestesia — Ocultação Visual

Este plano detalha a primeira fase do arquivamento do módulo de Radiestesia, focando exclusivamente na ocultação dos pontos de acesso visual para usuárias (Visitante, Assinante, Aluna), sem realizar alterações estruturais no banco de dados ou nas permissões de rota.

## 1. Diagnóstico de Exposição Visual

A Radiestesia está exposta nos seguintes locais:

1.  **Hub de Ferramentas (`/ferramentas`):**
    - Listada dinamicamente a partir da tabela `sala_ferramentas`.
    - Atualmente visível para todas as usuárias com portal "mentorada" ou superior.
2.  **Travessia Detalhe (`/travessias/:slug`):**
    - Card fixo "Radiestesia Oracular" dentro da seção "Recursos de Escuta" da travessia `codigo-narrativas`.
3.  **Jardim da Psique (Primeira Experiência):**
    - Sugestão de portal "Radar do Eixo" para o perfil `perfil_profissional_atuante`.
    - Sugestão de portal "Leitura em 5 Camadas" para o perfil `perfil_terapeuta_integrativa`.
4.  **Admin Sidebar:**
    - Item "Radiestesia" no grupo "Ferramentas Simbólicas". (Deve ser mantido para Admins).

## 2. Estratégia de Ocultação (Frontend-Only)

Como o banco de dados não será alterado (`UPDATE sala_ferramentas SET ativa = false` não é permitido agora), a ocultação será feita via lógica de renderização no React.

### Alternativa Escolhida: Filtro por Identificador no Frontend
Implementaremos uma verificação nos componentes de listagem para excluir ferramentas que contenham a chave "radiestesia" ou rotas que iniciem com `/radiestesia`, exceto para usuárias com portal `admin`.

## 3. Arquivos a serem Alterados

### `src/pages/FerramentasHub.tsx`
- **Alteração:** Adicionar um filtro no array `allTools` para remover itens onde `t.rota` contenha "radiestesia", condicionado a `!isAdmin`.
- **Resultado:** A ferramenta desaparece do grid para usuárias comuns, mas permanece para Admins.

### `src/pages/TravessiaDetalhe.tsx`
- **Alteração:** No mapeamento `TRAVESSIA_CONTEUDO`, filtrar os `items` de cada seção para remover aqueles cuja rota seja `/radiestesia`, condicionado a `!isAdmin`.
- **Resultado:** O card "Radiestesia Oracular" deixa de ser exibido na Travessia "Código de Narrativas" para usuárias comuns.

### `src/components/jardim/JardimFirstExperience.tsx`
- **Alteração:** No objeto `JARDIM_BY_TAG`, filtrar as listas de `portals` para remover rotas que comecem com `/radiestesia`, condicionado a `!isAdmin`.
- **Resultado:** As sugestões de Radiestesia no primeiro acesso ao Jardim são removidas.

## 4. Manutenção do Acesso e Legado

- **URL Direta:** Como o `src/App.tsx` não será alterado, o acesso via `casaoracula.com.br/radiestesia` continuará funcionando para quem tiver a permissão `mentorada` (permissão atual).
- **Admin Dashboard:** A aba `AdminRadiestesiaTab` no Painel Administrativo e o link no `AdminSidebar` permanecem intactos.
- **Banco de Dados:** Nenhuma query SQL será executada. A tabela `sala_ferramentas` e `radiestesia_config` permanecem inalteradas.

## 5. Critérios de Validação

- [ ] **Visitante/Aluna/Assinante:** Não encontram nenhum link ou card de "Radiestesia" no Hub de Ferramentas ou nas Travessias.
- [ ] **Admin:** Continua vendo a Radiestesia no Hub de Ferramentas e na Barra Lateral Admin.
- [ ] **Acesso Manual:** Digitar `/radiestesia` na URL ainda carrega o módulo (preservando o acesso para testes e usuárias antigas que tenham o link).
- [ ] **Build:** `npm run build` sem erros.
- [ ] **Console:** Sem erros de "undefined" ao tentar filtrar itens inexistentes.

## 6. Plano de Rollback

Para reverter a ocultação visual, basta reverter as alterações nos três arquivos citados (FerramentasHub, TravessiaDetalhe, JardimFirstExperience), removendo os filtros condicionais adicionados.

---

**Confirmação:** Nenhuma alteração no banco de dados (`UPDATE`) ou nas permissões de rota (`minPortal`) será realizada nesta fase 03A.
