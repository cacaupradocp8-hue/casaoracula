

# Plano: Ajustes na Travessia 00 - UX Mobile e Liberação Gradual

## Visão Geral

Implementar três melhorias na Travessia 00 para otimizar a experiência no mobile e a condução da visitante:

1. **Liberação diária** — Um dia por vez, com 24h de intervalo
2. **Texto de abertura condensado** — Expansível no mobile
3. **Prova social + CTA** — Comentários de alunas e botão "Conheça a Casa"

---

## 1. Liberação de Conteúdo — Um Dia por Vez

### Lógica de Negócio

```text
Dia 1 → Liberado no primeiro acesso à Travessia 00
Dia 2 → Liberado 24h após o primeiro acesso ao Dia 1
Dia 3 → Liberado 24h após o primeiro acesso ao Dia 2
...e assim por diante
```

### Regras
- Não exige conclusão forçada (a usuária pode pausar)
- Não pode pular dias (sequencial)
- Sem gamificação visual ou contadores
- Dias futuros aparecem visíveis, porém bloqueados

### UX de Bloqueio

Os dias bloqueados mostrarão:
- Card visível com título e descrição (para curiosidade)
- Overlay discreto com cadeado
- Texto: "Este passo pede um dia de intervalo para maturação."

### Implementação Técnica

**Nova tabela no banco:**
```sql
travessia_day_unlocks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  aula_id UUID NOT NULL REFERENCES conteudo_aulas(id),
  first_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, aula_id)
)
```

**RLS:**
- SELECT/INSERT: `user_id = auth.uid()`

**Hook `useTravessiaUnlock`:**
- Verifica quais dias estão liberados
- Registra primeiro acesso
- Calcula tempo restante para próximo dia

---

## 2. Ajuste do Texto de Abertura (Mobile)

### Problema Atual

O texto de descrição da Travessia no header ocupa muito espaço vertical no mobile, empurrando os cards de dias para baixo.

### Solução

Criar componente colapsável:
- **Desktop**: Exibe tudo normalmente
- **Mobile**: Exibe apenas título + 2 linhas + botão "Ler mais"

### Implementação

No `TravessiaDetalhe.tsx`, dentro do header:

```text
┌─────────────────────────────────────────┐
│ [Ícone]                                 │
│                                         │
│ TRAVESSIA 0                             │
│ O Limiar da Casa                        │
│ Uma jornada de 7 dias para mapear...    │
│                                         │
│ [▼ Ler introdução completa]             │
│                                         │
│ [Começar Dia 1]                         │
└─────────────────────────────────────────┘
```

Ao expandir:
```text
│ Uma jornada de 7 dias para mapear seu   │
│ ponto de partida. Sem fórmulas. Sem     │
│ promessas. Apenas clareza sobre onde    │
│ você está agora.                        │
│                                         │
│ [▲ Fechar]                              │
```

---

## 3. Comentários de Alunas + CTA "Conheça a Casa"

### Onde Aparecem

No final da página `TravessiaDetalhe.tsx`, após a listagem de todos os 7 dias.

### Design dos Comentários

```text
┌─────────────────────────────────────────┐
│ VOZES DA TRAVESSIA                      │
├─────────────────────────────────────────┤
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ "Não mudou minha vida.            │   │
│ │  Mas organizou algo que eu nunca  │   │
│ │  tinha conseguido nomear."        │   │
│ │                          — Marina │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ "Finalmente parei de correr       │   │
│ │  atrás de respostas que           │   │
│ │  não eram minhas."                │   │
│ │                           — Carla │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ "Sete dias. Sem pressa.           │   │
│ │  Foi o tempo certo."              │   │
│ │                          — Renata │   │
│ └───────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### CTA "Conheça a Casa"

```text
┌─────────────────────────────────────────┐
│                                         │
│      🜂 Conheça a Casa Orácula          │
│                                         │
│    Sem pressa. Apenas quando fizer      │
│              sentido.                   │
│                                         │
└─────────────────────────────────────────┘
```

### Implementação

Os depoimentos serão gerenciáveis via tabela `app_settings` ou `text_models`:
- Chave: `travessia_zero_depoimentos`
- Valor: JSON array com `nome` e `texto`

O botão CTA leva para `/tour` (página institucional existente).

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/migrations/xxx.sql` | **CRIAR** — Nova tabela `travessia_day_unlocks` |
| `src/hooks/useTravessiaUnlock.ts` | **CRIAR** — Hook para lógica de liberação |
| `src/components/travessia/TravessiaHeader.tsx` | **CRIAR** — Header com texto colapsável |
| `src/components/travessia/TravessiaDayCard.tsx` | **CRIAR** — Card de dia com estado bloqueado |
| `src/components/travessia/TravessiaTestimonials.tsx` | **CRIAR** — Bloco de depoimentos |
| `src/pages/TravessiaDetalhe.tsx` | **MODIFICAR** — Integrar novos componentes |

---

## Fluxo Visual Esperado

```text
VISITANTE ACESSA TRAVESSIA 00
           │
           ▼
┌─────────────────────────────────────────┐
│ TRAVESSIA ZERO                          │
│ O Limiar da Casa                        │
│ Uma jornada de 7 dias...                │
│ [▼ Ler introdução completa]             │
├─────────────────────────────────────────┤
│                                         │
│ [Dia 1 — O Silêncio]  ✓ Disponível      │
│ [Dia 2 — O Mapa]      🔒 Amanhã         │
│ [Dia 3 — O Eco]       🔒 Em 2 dias      │
│ [Dia 4 — A Pausa]     🔒 Bloqueado      │
│ [Dia 5 — O Corpo]     🔒 Bloqueado      │
│ [Dia 6 — O Limiar]    🔒 Bloqueado      │
│ [Dia 7 — A Decisão]   🔒 Bloqueado      │
│                                         │
├─────────────────────────────────────────┤
│ VOZES DA TRAVESSIA                      │
│ [Depoimento 1] [Depoimento 2]           │
├─────────────────────────────────────────┤
│       🜂 Conheça a Casa Orácula         │
│   Sem pressa. Apenas quando fizer       │
│             sentido.                    │
└─────────────────────────────────────────┘
```

---

## Resultado Esperado

1. Visitante tem experiência mais fluida no mobile
2. Liberação gradual cria ritmo de maturação
3. Prova social transmite reconhecimento sem promessas
4. CTA respeitoso convida sem pressionar
5. Zero alteração no conteúdo existente

---

## Seção Técnica

### Hook `useTravessiaUnlock`

```typescript
interface DayUnlockStatus {
  aulaId: string;
  isUnlocked: boolean;
  unlockDate: Date | null;
  hoursRemaining: number | null;
}

function useTravessiaUnlock(travessiaId: string) {
  // Busca todas as aulas da travessia (ordem)
  // Busca registros de unlock do usuario
  // Calcula status de cada dia baseado em:
  //   - Dia 1: sempre liberado
  //   - Dia N: liberado se existe unlock do Dia N-1 
  //            E passou 24h desde first_accessed_at
  
  return {
    dayStatuses: DayUnlockStatus[],
    registerAccess: (aulaId: string) => Promise<void>,
    isLoading: boolean
  };
}
```

### Lógica de Liberação

```typescript
// Para cada dia N (ordem):
const prevDayUnlock = unlocks.find(u => u.aula_ordem === ordem - 1);

if (ordem === 1) {
  return { isUnlocked: true };
}

if (!prevDayUnlock) {
  return { isUnlocked: false, hoursRemaining: null };
}

const hoursSincePrevAccess = differenceInHours(
  new Date(),
  prevDayUnlock.first_accessed_at
);

if (hoursSincePrevAccess >= 24) {
  return { isUnlocked: true };
}

return { 
  isUnlocked: false, 
  hoursRemaining: 24 - hoursSincePrevAccess,
  unlockDate: addHours(prevDayUnlock.first_accessed_at, 24)
};
```

### Texto de Bloqueio (Copy)

- **Genérico**: "Este passo pede um dia de intervalo para maturação."
- **Com tempo**: "Disponível amanhã às 14h" (opcional, se quiser mostrar)

### Depoimentos (Dados Iniciais)

```json
[
  {
    "nome": "Marina",
    "texto": "Não mudou minha vida. Mas organizou algo que eu nunca tinha conseguido nomear."
  },
  {
    "nome": "Carla", 
    "texto": "Finalmente parei de correr atrás de respostas que não eram minhas."
  },
  {
    "nome": "Renata",
    "texto": "Sete dias. Sem pressa. Foi o tempo certo."
  }
]
```

### Migração SQL

```sql
-- Tabela para rastrear primeiro acesso a cada dia
CREATE TABLE travessia_day_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aula_id UUID NOT NULL REFERENCES conteudo_aulas(id) ON DELETE CASCADE,
  first_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, aula_id)
);

-- RLS
ALTER TABLE travessia_day_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own unlocks"
  ON travessia_day_unlocks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own unlocks"
  ON travessia_day_unlocks FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Index para performance
CREATE INDEX idx_travessia_day_unlocks_user 
  ON travessia_day_unlocks(user_id, aula_id);
```

