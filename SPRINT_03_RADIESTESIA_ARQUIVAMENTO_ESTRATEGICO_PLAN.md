# Planejamento da Sprint 03: Arquivamento Estratégico do Módulo de Radiestesia

## 1. Escopo e Objetivo
Arquivar o módulo de Radiestesia, removendo-o da navegação principal e classificando-o como laboratório/legado externo. O objetivo é focar o ecossistema no núcleo atual (Leitura Simbólica, Clube, Formação e Syntheia), preservando o histórico e o acesso administrativo.

## 2. Inventário de Radiestesia

### 2.1 Rotas Existentes (src/App.tsx)
- `/radiestesia`: Portal principal
- `/radiestesia/leitura`: Leitura 5 Camadas
- `/radiestesia/mesa`: Mesa Radionica
- `/radiestesia/graficos`: Catálogo de Gráficos
- `/radiestesia/graficos/:slug`: Detalhe do Gráfico
- `/radiestesia/pantaculos`: Pantáculos
- `/radiestesia/cristais`: Cristais e Campos
- `/radiestesia/escala`: Escala Narrativa
- `/radiestesia/diario`: Diário de Práticas

### 2.2 Componentes e Páginas (src/pages/radiestesia/)
- `RadiestesiaPortal.tsx`
- `Leitura5Camadas.tsx`
- `MesaRadionica.tsx`
- `CatalogoGraficos.tsx`
- `GraficoDetalhe.tsx`
- `Pantaculos.tsx`
- `CristaisCampos.tsx`
- `EscalaNarrativa.tsx`
- `DiarioPraticas.tsx`
- `AdminRadiestesiaTab.tsx` (src/components/admin/)

### 2.3 Ganchos e Integração
- `useRadiestesiaConfig.ts` (src/hooks/)
- Registro na tabela `sala_ferramentas` (Database)

## 3. Pontos de Exposição Atual
- **Menu Principal (Mobile/Desktop):** Não listado explicitamente no `Navigation.tsx`, mas acessível via `/ferramentas`.
- **Hub de Ferramentas:** Aparece como "Radiestesia & Gráficos Vibracionais" carregado dinamicamente da tabela `sala_ferramentas`.
- **Painel Admin:** Aba dedicada para gestão de gráficos e cristais.
- **Links Internos:** Possíveis menções em `JardimPsique` e `TravessiaDetalhe`.

## 4. Estratégia de Arquivamento

### 4.1 Reclassificação
- **Status:** Laboratório / Legado Externo.
- **Visibilidade:** Oculto na navegação pública (Hub de Ferramentas).
- **Acesso:** Mantido via URL direta ou área restrita de laboratório para Admin.

### 4.2 Ações Técnicas (Sprint 03)
1. **Banco de Dados (Invisibilidade):**
   - Atualizar `sala_ferramentas` setando `ativa = false` para o registro de Radiestesia. Isso remove o card do `/ferramentas` automaticamente sem apagar dados.
2. **Navegação:**
   - Garantir que não haja links fixos em menus laterais ou dashboards.
3. **Proteção de Rota:**
   - Alterar `minPortal` no `App.tsx` para `admin` nas rotas de Radiestesia, ou manter como está mas documentar que o acesso é "por convite/direto".
4. **Documentação de Código:**
   - Adicionar comentário de cabeçalho em `RadiestesiaPortal.tsx` e `App.tsx` (seção de rotas) indicando o status de "Módulo Arquivado/Legado".

## 5. Regras de Segurança e Integridade
- **NÃO APAGAR:** Nenhum componente, arquivo ou registro de banco será deletado.
- **NÃO ALTERAR RLS/EDGE:** A estrutura de permissões de banco permanece intacta.
- **NÃO REFATORAR:** O código interno do módulo não será mexido; se houver bugs legados, permanecerão lá até decisão futura.

## 6. Plano de Rollback
1. **Restaurar no Hub:** Voltar `ativa = true` na tabela `sala_ferramentas`.
2. **Restaurar Rotas:** Reverter alterações de `minPortal` no `App.tsx` (caso tenham sido alteradas).
3. **Navegação:** Reverter qualquer alteração em arquivos de navegação ou atalhos.

## 7. Critérios de Validação
- Visitante, Assinante e Aluna não encontram "Radiestesia" no `/ferramentas`.
- Admin consegue acessar `/radiestesia` digitando a URL.
- O Painel Admin continua permitindo editar os dados (para fins de histórico).
- Nenhuma funcionalidade central (Clube, Formação, Syntheia) é afetada.
- Build e Typecheck passam sem erros.

---
**Nota Estratégica:** A Radiestesia permanece no código como uma "ferramenta fantasma", disponível para uso interno ou para clientes antigos que possuam o link, mas deixa de ser um produto de prateleira da Casa Orácula.
