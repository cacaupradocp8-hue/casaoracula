# STRATEGIC AUDIT OF ORPHAN PAGES — CASA ORÁCULA 2.0

Este documento apresenta a classificação estratégica das páginas identificadas como órfãs (sem referência em `App.tsx` ou arquivos de rotas principais) após a conclusão da Fase 1 de limpeza.

## Tabela de Auditoria Estratégica

| Arquivo | Última Ref. | Domínio Provisório | Risco | Valor Estratégico | Dependências | Decisão |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Assinatura.tsx` | V0.1 | Pagamento/Conta | Alto | Reaproveitar (Checkout) | Supabase, Auth, Subscriptions | **KEEP** |
| `Billing.tsx` | V0.1 | Pagamento/Conta | Alto | Reaproveitar (Stripe) | Supabase, Stripe (futuro) | **KEEP** |
| `ExperienciaGratuita.tsx` | Fase 1 | Visitante | Médio | Transformar em Landing | Supabase, Auth | **KEEP/REDIRECT** |
| `PlanosClubeOracular.tsx` | V0.2 | Clube/Vendas | Médio | Landing Page Ativa | Rockty (links externos) | **KEEP** |
| `OraculaSalesPage.tsx` | V0.2 | Formação/Vendas | Médio | Landing Page Ativa | Rockty (links externos) | **KEEP** |
| `BibliotecaDasTravessias.tsx`| V0.2 | Clube/Simbólico | Baixo | Arquivar (Subst. por Unificada) | Supabase (travessia_familias) | **ARCHIVE** |
| `Big5Oracular.tsx` | V0.2 | Formação/Treino | Baixo | Reaproveitar (Ferramenta) | Supabase (big5_registros) | **KEEP** |
| `FerramentasMetodo.tsx` | V0.1 | Formação/Método | Baixo | Remover (Subst. por Hub) | Nenhuma (UI apenas) | **DELETE** |
| `FerramentasMetodoHub.tsx` | V0.2 | Formação/Hub | Baixo | Reaproveitar (Menu) | Navegação Interna | **KEEP** |
| `Tour.tsx` | Fase 1 | Visitante | Baixo | Remover (Obsoleto) | Supabase (tour_sections) | **DELETE** |

---

## Detalhamento das Decisões

### 1. Núcleo de Pagamento e Assinatura (PROTEGIDO)
- **Ficheiros:** `Assinatura.tsx`, `Billing.tsx`.
- **Justificativa:** Embora órfãos em termos de rotas ativas (o link pode ter sido removido do menu), eles contêm a lógica de integração com tabelas de `subscriptions` e preparação para Stripe. Remover agora causaria perda de trabalho estrutural.
- **Ação:** Manter os ficheiros, mas não restaurar a rota até o ciclo de Pagamentos.

### 2. Landing Pages de Vendas (VALOR ESTRATÉGICO)
- **Ficheiros:** `PlanosClubeOracular.tsx`, `OraculaSalesPage.tsx`.
- **Justificativa:** Estas páginas são destinos de links externos (Rockty/Marketing). Mesmo não estando no menu principal do App para usuários logados, elas são funcionais e necessárias para conversão.
- **Ação:** Manter os ficheiros. Considerar movê-las para uma pasta `marketing/` futuramente.

### 3. Substituições de Versão
- **Ficheiros:** `FerramentasMetodoHub.tsx` vs `FerramentasMetodo.tsx`.
- **Justificativa:** O `Hub` é a versão evoluída e visualmente alinhada com a V0.2. A página `FerramentasMetodo.tsx` original é redundante e legada.
- **Ação:** Remover `FerramentasMetodo.tsx`.

### 4. Limpeza de Obsoletos
- **Ficheiro:** `Tour.tsx`.
- **Justificativa:** A experiência de tour foi descontinuada em favor do `Onboarding.tsx` e `MapaCasaOracula.tsx`. Os componentes de tour são pesados e desnecessários.
- **Ação:** Deletar com segurança.

---

## Próximos Passos (Etapa 112)

1. **DELETE:** Remover `Tour.tsx` e `FerramentasMetodo.tsx`.
2. **ARCHIVE:** Mover `BibliotecaDasTravessias.tsx` para `src/archive/` (criando a pasta).
3. **KEEP:** Preservar o núcleo de pagamento e vendas intacto.
4. **LINK CHECK:** Verificar se `App.tsx` deve restaurar rotas de marketing (`/planos-clube`, `/formacao-venda`) se forem usadas externamente.

**Decisão estratégica:** O projeto está pronto para a remoção seletiva dos itens de baixo risco.
