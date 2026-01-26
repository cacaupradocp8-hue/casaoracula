

# Plano: Criar Mapa Simbólico Big Five Oracular

## Status Atual
As tabelas necessárias (`big5_oracular_fatores`, `big5_oracular_perguntas`, `big5_oracular_registros`) ainda não existem no banco de dados.

## Próximo Passo Imediato
Preciso aplicar a migração do banco de dados para criar:

1. **Tabela `big5_oracular_fatores`** — Os 5 fatores simbólicos
2. **Tabela `big5_oracular_perguntas`** — As 30 perguntas exatas
3. **Tabela `big5_oracular_registros`** — Resultados das usuárias

## Sequência de Implementação

### Etapa 1: Banco de Dados (PENDENTE)
- Criar as 3 tabelas com RLS
- Inserir os 5 fatores simbólicos
- Inserir as 30 perguntas exatas

### Etapa 2: Hook React
- Criar `src/hooks/useBig5Oracular.ts`
- Lógica de fetch e cálculo de médias

### Etapa 3: Página Principal
- Criar `src/pages/Big5Oracular.tsx`
- Fluxo: Aviso ético → Questionário → Resultado

### Etapa 4: Rota
- Adicionar rota `/ferramenta/big5-oracular` no App.tsx

### Etapa 5: Visualização
- Componente de resultado com gráfico radial
- Narrativas simbólicas por fator

## Ação Necessária
Aprovar a migração do banco de dados para prosseguir com a implementação.

