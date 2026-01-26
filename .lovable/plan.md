
# Plano: Sistema Simbólico Integrado — Big Five → Rituais → Narroterapia

## Visao Geral

Estruturar o fluxo completo da Casa Oracula que integra:
1. **Big Five Oracular** (leitura simbolica)
2. **Rituais Simbolicos** (por combinacao de fatores)
3. **Narroterapia Oracular** (biblioteca por Porta)

**Regra Absoluta**: Nada e diagnostico. Nada e automatico. O sistema protege o campo simbolico.

---

## Arquitetura do Fluxo

```text
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO DO USUARIO                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. RESULTADO BIG FIVE                                          │
│     ├── Fator predominante                                      │
│     ├── Fator em tensao                                         │
│     └── Porta associada (mapeamento automatico)                 │
│                           │                                     │
│                           ▼                                     │
│  2. LEITURA NARRATIVA                                           │
│     ├── Texto curto simbolico                                   │
│     └── Aviso: "Este mapa nao explica. Ele aponta."             │
│                           │                                     │
│                           ▼                                     │
│  3. RITUAL SIMBOLICO (obrigatorio)                              │
│     ├── Instrucao simples baseada na combinacao                 │
│     ├── Tempo sugerido                                          │
│     └── Frase unica (quando aplicavel)                          │
│                           │                                     │
│                           ▼                                     │
│  4. DECISAO DE PROFUNDIDADE                                     │
│     ├── "Encerrar por hoje" → Fim                               │
│     └── "Acessar Narroterapia" → Somente certificadas           │
│                           │                                     │
│                           ▼                                     │
│  5. NARROTERAPIA (se autorizada)                                │
│     ├── Biblioteca filtrada por Porta                           │
│     ├── Audio com capa pulsante                                 │
│     └── Aviso: "Escuta simbolica. Nao interpretar."             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Etapa 1: Mapeamento Fatores → Portas

Criar tabela de mapeamento entre combinacoes de fatores Big Five e Portas da Psique.

### Nova Tabela: `big5_porta_mapeamento`

```sql
CREATE TABLE public.big5_porta_mapeamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fator_alto TEXT NOT NULL,           -- 'torre_interna', 'voz_mundo', etc.
  fator_baixo TEXT NOT NULL,          -- fator em tensao
  porta_associada TEXT NOT NULL,      -- 'Porta do Osso', 'Porta do Labirinto'
  porta_tipo_campo TEXT,              -- 'limiar', 'retencao', 'defesa', 'dissolucao'
  ritual_id UUID REFERENCES rituais_simbolicos(id),
  descricao_combinacao TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Mapeamentos Definidos

| Fator Alto | Fator Baixo | Porta | Ritual |
|------------|-------------|-------|--------|
| torre_interna | porta_abalo | Porta do Osso | O Peso que Nao se Nomeia |
| porta_possivel | torre_interna | Porta do Labirinto | O Traco Unico |
| campo_outro | torre_interna | Porta da Queda | O Limite Invisivel |
| voz_mundo | campo_outro | Porta do Limiar | A Pausa Deliberada |
| porta_abalo | voz_mundo | Porta da Descida | Nomear sem Explicar |

---

## Etapa 2: Tabela de Rituais Simbolicos

### Nova Tabela: `rituais_simbolicos`

```sql
CREATE TABLE public.rituais_simbolicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,                  -- 'O Peso que Nao se Nomeia'
  porta_associada TEXT,                -- nome da Porta
  material TEXT,                       -- 'uma pedra pequena'
  instrucao TEXT NOT NULL,             -- passo a passo
  duracao_segundos INTEGER DEFAULT 60,
  frase_unica TEXT,                    -- opcional
  silencio_obrigatorio BOOLEAN DEFAULT false,
  observacoes_facilitadora TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Rituais Canonicos

```sql
INSERT INTO rituais_simbolicos (slug, nome, porta_associada, material, instrucao, duracao_segundos, frase_unica, silencio_obrigatorio) VALUES

('peso-nao-nomeia', 'O Peso que Nao se Nomeia', 'Porta do Osso', 
 'uma pedra pequena',
 'A cliente segura a pedra por 1 minuto em silencio. Depois a coloca no chao.',
 60, 'Nem tudo que sustento precisa continuar comigo.', true),

('traco-unico', 'O Traco Unico', 'Porta do Labirinto',
 'papel + lapis',
 'Desenhar uma unica linha continua, sem levantar o lapis.',
 60, 'Um caminho basta por agora.', false),

('limite-invisivel', 'O Limite Invisivel', 'Porta da Queda',
 NULL,
 'A cliente cruza os bracos lentamente sobre o peito. Respira 3 vezes.',
 45, 'Aqui termina o outro. Aqui comeco eu.', false),

('pausa-deliberada', 'A Pausa Deliberada', 'Porta do Limiar',
 NULL,
 '2 minutos de silencio absoluto.',
 120, NULL, true),

('nomear-sem-explicar', 'Nomear sem Explicar', 'Porta da Descida',
 'papel',
 'A cliente escreve uma palavra que represente o estado. Nao se conversa sobre a palavra. Ela fica guardada.',
 60, NULL, true);
```

---

## Etapa 3: Registro de Ritual Realizado

### Nova Tabela: `big5_ritual_registros`

```sql
CREATE TABLE public.big5_ritual_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  big5_registro_id UUID REFERENCES big5_oracular_registros(id),
  ritual_id UUID REFERENCES rituais_simbolicos(id),
  porta_acessada TEXT,
  completado_em TIMESTAMPTZ,
  acessou_narroterapia BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Etapa 4: Novo Fluxo Pos-Resultado no Big5Oracular

### Modificar `src/pages/Big5Oracular.tsx`

Adicionar novas fases apos o resultado:

```typescript
type Phase = 
  | 'intro' 
  | 'questionnaire' 
  | 'result'           // resultado atual
  | 'symbolic_reading' // NOVA: leitura narrativa
  | 'ritual'           // NOVA: ritual simbolico
  | 'decision';        // NOVA: encerrar ou narroterapia
```

### Tela de Leitura Narrativa (Nova)

```text
┌────────────────────────────────────────┐
│     SEU CAMPO SIMBOLICO ATUAL          │
├────────────────────────────────────────┤
│                                        │
│  🜂 Torre Interna em forca             │
│  🜄 Porta do Abalo em tensao           │
│                                        │
│  ─────────────────────────────────     │
│                                        │
│  [Texto narrativo curto]               │
│  Forca externa, tensao interna.        │
│  O campo pede contencao, nao           │
│  explicacao.                           │
│                                        │
├────────────────────────────────────────┤
│  ⚠️ Este mapa nao explica.             │
│     Ele aponta.                        │
├────────────────────────────────────────┤
│                                        │
│        [Ritual de Abertura]            │
│                                        │
└────────────────────────────────────────┘
```

### Tela de Ritual Simbolico (Nova)

```text
┌────────────────────────────────────────┐
│     O PESO QUE NAO SE NOMEIA           │
│     Porta do Osso                      │
├────────────────────────────────────────┤
│                                        │
│  Material necessario:                  │
│  Uma pedra pequena                     │
│                                        │
│  ─────────────────────────────────     │
│                                        │
│  Segure a pedra por 1 minuto           │
│  em silencio.                          │
│                                        │
│  Depois, coloque-a no chao.            │
│                                        │
│  ─────────────────────────────────     │
│                                        │
│  [Timer: 1:00]                         │
│                                        │
├────────────────────────────────────────┤
│  "Nem tudo que sustento precisa        │
│   continuar comigo."                   │
├────────────────────────────────────────┤
│                                        │
│        [Ritual concluido]              │
│                                        │
└────────────────────────────────────────┘
```

### Tela de Decisao (Nova)

```text
┌────────────────────────────────────────┐
│                                        │
│  "Nem todo campo pede historia."       │
│                                        │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────────────────────────┐  │
│  │    Encerrar por hoje             │  │
│  │    O ritual foi suficiente.      │  │
│  └──────────────────────────────────┘  │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │    Acessar Narroterapia          │  │
│  │    Contos da Porta do Osso       │  │
│  │    🔒 Apenas certificadas        │  │
│  └──────────────────────────────────┘  │
│                                        │
└────────────────────────────────────────┘
```

---

## Etapa 5: Integracao com Narroterapia

### Nova Rota: `/narroterapia/porta/:portaNome`

Biblioteca filtrada pela Porta especifica.

### Modificar `BibliotecaClinica.tsx`

Adicionar filtro por Porta:

```typescript
// Se vier de um fluxo Big5, filtra pela Porta
const portaFiltro = searchParams.get('porta');

const { data: contos } = useQuery({
  queryKey: ['contos-clinicos', portaFiltro],
  queryFn: async () => {
    let query = supabase
      .from('contos_clinicos')
      .select('*')
      .eq('ativo', true);
    
    if (portaFiltro) {
      query = query.eq('porta_psiquica', portaFiltro);
    }
    
    return query.order('ordem');
  },
});
```

---

## Etapa 6: Componentes a Criar

### 1. `SymbolicReadingScreen.tsx`
Tela de leitura narrativa pos-resultado.

### 2. `RitualSymbolicScreen.tsx`
Tela de ritual com timer e instrucoes.

### 3. `DepthDecisionScreen.tsx`
Tela de decisao: encerrar ou narroterapia.

### 4. `useRitualSymbolic.ts`
Hook para gerenciar rituais e mapeamentos.

---

## Etapa 7: Logica de Mapeamento

### Hook: `useBig5PortaMapping.ts`

```typescript
interface PortaMapping {
  porta: string;
  portaTipoCampo: string;
  ritual: RitualSimbolico;
  narrativa: string;
}

function useBig5PortaMapping(
  fatorAlto: string,
  fatorBaixo: string
): PortaMapping | null {
  // Buscar mapeamento na tabela big5_porta_mapeamento
  // Retornar Porta + Ritual associado
}
```

---

## Etapa 8: Controle de Acesso Narroterapia

### Regras

1. **Certificadas** = Portal `oracula` ou `admin`
2. **Se certificacao expirar** = Acesso suspenso
3. **Ritual obrigatorio** = So pode acessar Narroterapia apos completar ritual

### Verificacao

```typescript
const podeAcessarNarroterapia = useMemo(() => {
  if (!isCertified) return false;
  if (!ritualCompletado) return false;
  if (isExpired) return false;
  return true;
}, [isCertified, ritualCompletado, isExpired]);
```

---

## Arquivos a Criar/Modificar

| Arquivo | Acao | Descricao |
|---------|------|-----------|
| Migracao SQL | CRIAR | Tabelas: rituais_simbolicos, big5_porta_mapeamento, big5_ritual_registros |
| `src/hooks/useRitualSymbolic.ts` | CRIAR | Logica de rituais |
| `src/hooks/useBig5PortaMapping.ts` | CRIAR | Mapeamento fatores→porta |
| `src/components/big5/SymbolicReadingScreen.tsx` | CRIAR | Tela leitura narrativa |
| `src/components/big5/RitualSymbolicScreen.tsx` | CRIAR | Tela ritual |
| `src/components/big5/DepthDecisionScreen.tsx` | CRIAR | Tela decisao |
| `src/pages/Big5Oracular.tsx` | MODIFICAR | Adicionar novas fases |
| `src/pages/narroterapia/BibliotecaClinica.tsx` | MODIFICAR | Filtro por Porta |

---

## Regras de UX (Obrigatorias)

1. **Linguagem simbolica** — Sem termos clinicos
2. **Silencio valorizado** — Pausas reais no fluxo
3. **Sem gamificacao** — Nenhum badge, pontos ou progresso forcado
4. **Avisos eticos visiveis** — Em todas as telas
5. **Um audio por vez** — Sync playback
6. **Capa pulsante** — Animacao sutil (prefers-reduced-motion respeitado)

---

## Textos Canonicos

### Aviso Leitura
> "Este mapa nao explica. Ele aponta."

### Aviso Ritual
> "Ritual nao resolve. Ritual organiza o campo."

### Aviso Narroterapia
> "Escuta simbolica. Nao interpretar."

### Tela Decisao
> "Nem todo campo pede historia."

---

## Secao Tecnica: Migracao SQL Completa

```sql
-- 1. Tabela de Rituais Simbolicos
CREATE TABLE public.rituais_simbolicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  porta_associada TEXT,
  material TEXT,
  instrucao TEXT NOT NULL,
  duracao_segundos INTEGER DEFAULT 60,
  frase_unica TEXT,
  silencio_obrigatorio BOOLEAN DEFAULT false,
  observacoes_facilitadora TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Mapeamento Big5 → Porta
CREATE TABLE public.big5_porta_mapeamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fator_alto TEXT NOT NULL,
  fator_baixo TEXT NOT NULL,
  porta_associada TEXT NOT NULL,
  porta_tipo_campo TEXT,
  ritual_id UUID REFERENCES rituais_simbolicos(id),
  descricao_combinacao TEXT,
  narrativa_curta TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(fator_alto, fator_baixo)
);

-- 3. Tabela de Registros de Ritual
CREATE TABLE public.big5_ritual_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  big5_registro_id UUID REFERENCES big5_oracular_registros(id),
  ritual_id UUID REFERENCES rituais_simbolicos(id),
  porta_acessada TEXT,
  completado_em TIMESTAMPTZ,
  acessou_narroterapia BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE rituais_simbolicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_porta_mapeamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_ritual_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read rituais" ON rituais_simbolicos FOR SELECT USING (true);
CREATE POLICY "Public read mapeamento" ON big5_porta_mapeamento FOR SELECT USING (true);
CREATE POLICY "Users manage own registros" ON big5_ritual_registros FOR ALL USING (user_id = auth.uid());

-- Inserir Rituais
INSERT INTO rituais_simbolicos (slug, nome, porta_associada, material, instrucao, duracao_segundos, frase_unica, silencio_obrigatorio) VALUES
('peso-nao-nomeia', 'O Peso que Nao se Nomeia', 'Porta do Osso', 'uma pedra pequena', 'Segure a pedra por 1 minuto em silencio. Depois, coloque-a no chao.', 60, 'Nem tudo que sustento precisa continuar comigo.', true),
('traco-unico', 'O Traco Unico', 'Porta do Labirinto', 'papel + lapis', 'Desenhe uma unica linha continua, sem levantar o lapis.', 60, 'Um caminho basta por agora.', false),
('limite-invisivel', 'O Limite Invisivel', 'Porta da Queda', NULL, 'Cruze os bracos lentamente sobre o peito. Respire 3 vezes.', 45, 'Aqui termina o outro. Aqui comeco eu.', false),
('pausa-deliberada', 'A Pausa Deliberada', 'Porta do Limiar', NULL, '2 minutos de silencio absoluto.', 120, NULL, true),
('nomear-sem-explicar', 'Nomear sem Explicar', 'Porta da Descida', 'papel', 'Escreva uma palavra que represente seu estado. Nao converse sobre ela. Guarde-a.', 60, NULL, true);

-- Inserir Mapeamentos
INSERT INTO big5_porta_mapeamento (fator_alto, fator_baixo, porta_associada, porta_tipo_campo, ritual_id, narrativa_curta) VALUES
('torre_interna', 'porta_abalo', 'Porta do Osso', 'dissolucao', 
 (SELECT id FROM rituais_simbolicos WHERE slug = 'peso-nao-nomeia'),
 'Forca externa, tensao interna. O campo pede contencao, nao explicacao.'),
('porta_possivel', 'torre_interna', 'Porta do Labirinto', 'limiar',
 (SELECT id FROM rituais_simbolicos WHERE slug = 'traco-unico'),
 'Visao sem contorno. O campo pede um unico passo, nao mil possibilidades.'),
('campo_outro', 'torre_interna', 'Porta da Queda', 'dissolucao',
 (SELECT id FROM rituais_simbolicos WHERE slug = 'limite-invisivel'),
 'Empatia sem eixo. O campo pede limite, nao mais entrega.'),
('voz_mundo', 'campo_outro', 'Porta do Limiar', 'limiar',
 (SELECT id FROM rituais_simbolicos WHERE slug = 'pausa-deliberada'),
 'Acao sem escuta. O campo pede silencio, nao mais palavras.'),
('porta_abalo', 'voz_mundo', 'Porta da Descida', 'dissolucao',
 (SELECT id FROM rituais_simbolicos WHERE slug = 'nomear-sem-explicar'),
 'Tempestade interna, recolhimento externo. O campo pede nome, nao historia.');
```

---

## Resultado Esperado

1. Usuario responde Big Five Oracular
2. Sistema identifica fatores e mapeia para Porta
3. Tela de leitura narrativa curta (sem CTA emocional)
4. Ritual simbolico obrigatorio antes de prosseguir
5. Decisao: encerrar ou acessar Narroterapia
6. Narroterapia filtrada pela Porta (somente certificadas)
7. Experiencia contemplativa, sem gamificacao
