# PORTAL_SYNC_DIVERGENCE_REPORT.md

## Diagnóstico de Usuário Divergente

Este relatório detalha a inconsistência encontrada entre as tabelas `profiles` e `user_roles` para o usuário identificado no dry-run.

### Dados do Usuário
- **ID**: `afe12d58-16ad-41dc-ab6a-ff230adedd6e`
- **Email**: `gigametalplast@gmail.com`
- **profiles.portal**: `visitante`
- **user_roles.portal**: `assinante`
- **profile.role**: `aluna`
- **Criado em**: `2026-02-07 00:04:25.269478+00`
- **Última Atualização**: `2026-02-07 00:04:58.283353+00`

### Hipótese da Divergência
O usuário possui `role = 'aluna'`, o que sugere que houve uma tentativa de matrícula ou promoção manual. No entanto, o `portal` na tabela `profiles` permaneceu como `visitante`, enquanto na `user_roles` (que controla o acesso via RLS/Gating) ele já consta como `assinante`. 

Isso pode ter ocorrido por:
1. Falha em uma trigger que deveria atualizar ambas as tabelas de forma atômica.
2. Execução de um comando manual de `UPDATE` que esqueceu uma das tabelas.
3. Concorrência durante o processo de Sign Up + Matrícula Pendente (T01).

### Recomendação (Sem Execução)
A migração V3.2 planeja unificar a lógica de atualização. 
Para este caso específico, recomenda-se:
1. Manter `user_roles.portal = 'assinante'` como verdade prioritária de acesso.
2. Sincronizar `profiles.portal` para `assinante` durante a janela de manutenção da migração, garantindo consistência visual e lógica.

**Atenção**: Nenhuma correção foi aplicada neste momento.
