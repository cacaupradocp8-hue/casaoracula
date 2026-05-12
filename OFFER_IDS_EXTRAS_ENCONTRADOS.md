# OFFER_IDS_EXTRAS_ENCONTRADOS.md

## Diagnóstico de IDs de Oferta Rockty Extras

Este documento analisa a presença dos IDs Rockty que apareceram no planejamento anterior mas que não fazem parte da matriz oficial aprovada.

### IDs Analisados:
- `j7mvkqg0pobcjg458yq0`
- `p1j8mzrkwk1b7pveq7za`
- `v7z4q6rxn80a9dge3mw1`

### Onde aparecem:
- **Código/Arquivos**: Apenas no arquivo `SPRINT_04C1B_PRE_MIGRATION_DRY_RUN.sql` (versão anterior). Não foram encontrados em outros arquivos do projeto via busca `rg`.
- **Banco de Dados**: 
    - Busca em `matriculas_pendentes`: **Nenhum registro encontrado**.
    - Busca em `subscriptions`: **Nenhum registro encontrado**.

### Conclusão:
Esses IDs são **artefatos de iterações de planejamento anteriores** e não representam dados reais no ambiente atual. Eles foram removidos da matriz de mapeamento oficial.

### Recomendação:
**Ignorar completamente**. Não devem ser mapeados nem considerados no SQL de migração final. O dry-run V2 irá monitorar caso algum deles surja inesperadamente.
