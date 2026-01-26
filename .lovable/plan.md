
# Plano: Mapa Simbólico de Funcionamento Psíquico – Big Five Oracular

## Visão Geral

Criar uma nova ferramenta interna chamada **"Mapa Simbólico de Funcionamento Psíquico – Big Five Oracular"**, distinta da ferramenta Big5 Simbólico já existente. Esta ferramenta possui:

- **30 perguntas exatas** (6 por fator) — não devem ser alteradas
- **5 fatores simbólicos** com nomes específicos
- **Escala Likert de 1 a 5** para todas as perguntas
- **Leitura narrativa simbólica** (não diagnóstico)

---

## Estrutura dos 5 Fatores

| Fator Simbólico | Equivalente OCEAN |
|-----------------|-------------------|
| 🜁 Porta do Possível | Abertura à Experiência |
| 🜂 Torre Interna | Conscienciosidade |
| 🜄 Campo do Outro | Amabilidade |
| 🜃 Voz no Mundo | Extroversão |
| 🜄 Porta do Abalo | Neuroticismo |

---

## Escala de Respostas

```
1 — Nunca / Quase nunca
2 — Raramente
3 — Às vezes
4 — Frequentemente
5 — Quase sempre
```

---

## Resultado Esperado

Após preenchimento:
1. **Resumo visual** com os 5 fatores (visualização radial)
2. **Texto simbólico** para cada fator (não diagnóstico)
3. **Indicação de:**
   - Fator predominante (maior média)
   - Fator fragilizado (menor média)
   - Padrão de funcionamento atual

---

## Implementação Técnica

### 1. Novas Tabelas no Banco de Dados

```sql
-- Fatores do Big5 Oracular
big5_oracular_fatores (
  id UUID PRIMARY KEY,
  chave TEXT UNIQUE,       -- 'porta_possivel', 'torre_interna', etc.
  nome TEXT,               -- 'Porta do Possível'
  nome_ocean TEXT,         -- 'Abertura à Experiência'
  simbolo TEXT,            -- '🜁'
  cor_primaria TEXT,       -- '#9B59B6'
  descricao_simbolica TEXT,
  narrativa_elevada TEXT,
  narrativa_fragil TEXT,
  ordem INTEGER
)

-- Perguntas (30 ao total, 6 por fator)
big5_oracular_perguntas (
  id UUID PRIMARY KEY,
  fator_id UUID REFERENCES big5_oracular_fatores,
  texto_pergunta TEXT,     -- Exatamente como fornecido
  ordem INTEGER
)

-- Registros de respostas
big5_oracular_registros (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  respostas_json JSONB,    -- { pergunta_id: valor }
  medias_json JSONB,       -- { fator_chave: media }
  fator_predominante TEXT,
  fator_fragilizado TEXT,
  reflexao_pessoal TEXT,
  created_at TIMESTAMPTZ
)
```

### 2. Nova Página React

Arquivo: `src/pages/Big5Oracular.tsx`

**Fluxo:**
1. **Tela de abertura** — Aviso ético (não é diagnóstico)
2. **Questionário** — 30 perguntas, uma por vez ou agrupadas por fator
3. **Cálculo** — Média de cada fator (soma ÷ 6)
4. **Resultado** — Visualização radial + narrativas

### 3. Rota e Navegação

- Rota: `/ferramenta/big5-oracular`
- Registrar em `sala_ferramentas` com slug `big5-oracular`

---

## Questionário Oficial (30 Perguntas)

### 🜁 PORTA DO POSSÍVEL (Abertura)
1. Quando algo foge do que você conhece, sua primeira reação é curiosidade, não defesa.
2. Você se interessa mais por perguntas profundas do que por respostas prontas.
3. Mudanças internas costumam te atrair, mesmo quando causam insegurança.
4. Você percebe quando está repetindo uma história antiga — e isso te incomoda.
5. O desconhecido te provoca mais fascínio do que medo.
6. Você sente que poderia viver versões muito diferentes de si mesma.

### 🜂 TORRE INTERNA (Conscienciosidade)
1. Você consegue sustentar decisões mesmo quando o entusiasmo inicial passa.
2. Quando algo é importante, você cria estrutura — não espera motivação.
3. Você prefere avançar pouco, mas com consistência.
4. Costuma cumprir acordos consigo mesma.
5. Você se sente desconfortável quando tudo está solto ou indefinido.
6. Ter rotina te fortalece mais do que te aprisiona.

### 🜄 CAMPO DO OUTRO (Amabilidade)
1. Você percebe quando está se adaptando demais para não gerar conflito.
2. É difícil dizer "não" sem sentir culpa.
3. Você costuma priorizar o impacto das suas ações nos outros.
4. Em conflitos, tende a tentar manter o vínculo, mesmo que se silencie.
5. Você sente responsabilidade emocional pelo bem-estar de quem está perto.
6. Quando alguém sofre, você sente no corpo.

### 🜃 VOZ NO MUNDO (Extroversão)
1. Você se sente confortável sendo vista quando está alinhada com o que diz.
2. Prefere falar depois de pensar — não para ocupar espaço.
3. Você percebe quando está se escondendo para não ser julgada.
4. Se sente mais viva quando pode expressar sua verdade.
5. O silêncio, para você, é força — não fuga.
6. Você sabe quando sua voz está retraída.

### 🜄 PORTA DO ABALO (Neuroticismo)
1. Mudanças inesperadas mexem profundamente com você.
2. Você demora a se regular após conflitos emocionais.
3. Situações simples podem gerar ruminações longas.
4. Seu corpo reage antes da sua mente.
5. Em momentos de pressão, você sente que perde o eixo.
6. Emoções intensas costumam te atravessar com força.

---

## Narrativas Simbólicas por Fator

### Quando Fator Predominante
Cada fator terá um texto narrativo que descreve o **padrão atual**, sem diagnóstico.

### Quando Fator Fragilizado
Texto que indica uma **área que pede atenção**, com linguagem simbólica e respeitosa.

---

## Arquivos a Criar/Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `supabase/migrations/xxx.sql` | **CRIAR** | Tabelas: fatores, perguntas, registros |
| `src/pages/Big5Oracular.tsx` | **CRIAR** | Página principal da ferramenta |
| `src/hooks/useBig5Oracular.ts` | **CRIAR** | Hook para lógica e persistência |
| `src/components/big5oracular/` | **CRIAR** | Componentes específicos |
| `src/App.tsx` | **MODIFICAR** | Adicionar rota `/ferramenta/big5-oracular` |

---

## Fluxo Visual do Questionário

```
┌─────────────────────────────────────────┐
│   MAPA SIMBÓLICO DE FUNCIONAMENTO       │
│     PSÍQUICO – BIG FIVE ORACULAR        │
├─────────────────────────────────────────┤
│                                         │
│  ⚠️ AVISO IMPORTANTE                     │
│  Este NÃO é um teste psicológico.       │
│  É uma leitura simbólica do momento.    │
│                                         │
│           [Começar Leitura]             │
└─────────────────────────────────────────┘

           ▼ (após iniciar)

┌─────────────────────────────────────────┐
│  🜁 PORTA DO POSSÍVEL                    │
│  Pergunta 1 de 6                        │
├─────────────────────────────────────────┤
│                                         │
│  "Quando algo foge do que você          │
│   conhece, sua primeira reação          │
│   é curiosidade, não defesa."           │
│                                         │
│  ○ 1 — Nunca / Quase nunca              │
│  ○ 2 — Raramente                        │
│  ○ 3 — Às vezes                         │
│  ○ 4 — Frequentemente                   │
│  ○ 5 — Quase sempre                     │
│                                         │
│  [← Anterior]              [Próximo →]  │
└─────────────────────────────────────────┘

           ▼ (após 30 perguntas)

┌─────────────────────────────────────────┐
│  SEU MAPA DE FUNCIONAMENTO ATUAL        │
├─────────────────────────────────────────┤
│                                         │
│        [Visualização Radial]            │
│     5 fatores em círculo central        │
│                                         │
├─────────────────────────────────────────┤
│  ✨ FATOR PREDOMINANTE                   │
│  Porta do Possível (média 4.2)          │
│  [Narrativa simbólica...]               │
├─────────────────────────────────────────┤
│  ⚡ FATOR FRAGILIZADO                    │
│  Torre Interna (média 2.1)              │
│  [Narrativa simbólica...]               │
├─────────────────────────────────────────┤
│  📊 PADRÃO ATUAL                         │
│  [Texto narrativo geral...]             │
└─────────────────────────────────────────┘
```

---

## Detalhes de Implementação

### Cálculo das Médias
```typescript
// Para cada fator:
const mediaPorFator = perguntas
  .filter(p => p.fator_id === fatorId)
  .map(p => respostas[p.id])
  .reduce((a, b) => a + b, 0) / 6;

// Predominante = maior média
// Fragilizado = menor média
```

### Mapeamento de Intensidade
```typescript
const intensidade = (media: number) => {
  if (media <= 2) return 'low';
  if (media <= 3) return 'medium';
  if (media <= 4) return 'high';
  return 'dominant';
};
```

### RLS (Row Level Security)
- `big5_oracular_fatores` e `big5_oracular_perguntas`: Leitura pública
- `big5_oracular_registros`: SELECT/INSERT apenas para `user_id = auth.uid()`

---

## Textos Éticos Obrigatórios

### Tela de Abertura
> "Este instrumento é uma leitura simbólica, não um diagnóstico.
> Não substitui avaliação profissional.
> O objetivo é oferecer uma linguagem para o que já se move em você."

### Rodapé do Resultado
> "Este mapa reflete um momento — não uma identidade fixa.
> Use como espelho, não como sentença."

---

## Seção Técnica

### Migração SQL Completa

```sql
-- 1. Tabela de Fatores
CREATE TABLE public.big5_oracular_fatores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  nome_ocean TEXT NOT NULL,
  simbolo TEXT,
  cor_primaria TEXT DEFAULT '#C9A45C',
  descricao_simbolica TEXT,
  narrativa_elevada TEXT,
  narrativa_fragil TEXT,
  ordem INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Perguntas
CREATE TABLE public.big5_oracular_perguntas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fator_id UUID NOT NULL REFERENCES big5_oracular_fatores(id),
  texto_pergunta TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Registros
CREATE TABLE public.big5_oracular_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  respostas_json JSONB NOT NULL DEFAULT '{}',
  medias_json JSONB NOT NULL DEFAULT '{}',
  fator_predominante TEXT,
  fator_fragilizado TEXT,
  reflexao_pessoal TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE big5_oracular_fatores ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_oracular_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_oracular_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read fatores"
  ON big5_oracular_fatores FOR SELECT USING (true);

CREATE POLICY "Public read perguntas"
  ON big5_oracular_perguntas FOR SELECT USING (true);

CREATE POLICY "Users manage own registros"
  ON big5_oracular_registros FOR ALL
  USING (user_id = auth.uid());

-- Inserir 5 Fatores
INSERT INTO big5_oracular_fatores (chave, nome, nome_ocean, simbolo, cor_primaria, ordem) VALUES
('porta_possivel', 'Porta do Possível', 'Abertura à Experiência', '🜁', '#9B59B6', 1),
('torre_interna', 'Torre Interna', 'Conscienciosidade', '🜂', '#3498DB', 2),
('campo_outro', 'Campo do Outro', 'Amabilidade', '🜄', '#27AE60', 3),
('voz_mundo', 'Voz no Mundo', 'Extroversão', '🜃', '#E74C3C', 4),
('porta_abalo', 'Porta do Abalo', 'Neuroticismo', '🜄', '#F39C12', 5);

-- Inserir 30 Perguntas (6 por fator)
-- [Perguntas exatamente como fornecidas]
```

### Hook `useBig5Oracular`

```typescript
interface Big5OracularResult {
  fatores: Fator[];
  perguntas: Pergunta[];
  loading: boolean;
  saveResult: (data) => Promise<void>;
}

function useBig5Oracular(): Big5OracularResult {
  // Fetch fatores e perguntas
  // Função para salvar registro
  // Cálculo de médias
}
```

### Componente de Resultado

```typescript
interface ResultProps {
  medias: Record<string, number>;
  fatores: Fator[];
  predominante: string;
  fragilizado: string;
}
```

---

## Resultado Esperado

1. Nova ferramenta acessível em `/ferramenta/big5-oracular`
2. 30 perguntas exatamente como especificadas
3. Escala 1-5 para todas
4. Visualização radial com 5 fatores
5. Narrativas simbólicas (sem diagnóstico)
6. Indicação de fator predominante e fragilizado
7. Salvamento no banco de dados
8. Integração com Jardim da Psique
