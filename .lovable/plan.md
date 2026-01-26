# Plano: Mapa Simbólico Big Five Oracular

## ✅ Status: CONCLUÍDO

### Etapas Finalizadas

1. **Banco de Dados** ✅
   - Tabela `big5_oracular_fatores` — 5 fatores simbólicos
   - Tabela `big5_oracular_perguntas` — 30 perguntas exatas
   - Tabela `big5_oracular_registros` — Resultados com RLS

2. **Hook React** ✅
   - `src/hooks/useBig5Oracular.ts`
   - Lógica de fetch, cálculo de médias, salvamento

3. **Página Principal** ✅
   - `src/pages/Big5Oracular.tsx`
   - Fluxo: Aviso ético → Questionário → Resultado

4. **Rota** ✅
   - `/ferramenta/big5-oracular` adicionada no App.tsx

5. **Visualização** ✅
   - Gráfico radial com os 5 fatores
   - Narrativas simbólicas por fator
   - Indicação de fator predominante/fragilizado

## Acesso

Rota: `/ferramenta/big5-oracular`
Portal mínimo: `mentorada`
