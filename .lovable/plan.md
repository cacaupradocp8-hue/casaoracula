

# Plano: Interpretação de Funcionamento Atual — Big Five Funcional

## Objetivo

Adicionar uma **seção de leitura interpretativa completa** à tela de resultados do Big Five Funcional, exibindo as interpretações dinâmicas para cada dimensão baseadas no nível (alto/baixo).

---

## Situação Atual

| Elemento | Estado |
|----------|--------|
| Tabela `big5_funcional_dimensoes` | ✅ Existe com 5 dimensões |
| Campo `descricao` | ✅ Existe (descrição curta) |
| Campos de interpretação alto/baixo | ❌ Não existem |
| Tela de resultados | ✅ Mostra radar + dimensões alta/baixa |
| Leitura interpretativa expandida | ❌ Não existe |

---

## Arquitetura da Solução

```text
1. BANCO DE DADOS
   └── Adicionar campos de interpretação à tabela big5_funcional_dimensoes:
       • interpretacao_alto (TEXT) - texto completo quando resultado é alto
       • interpretacao_baixo (TEXT) - texto completo quando resultado é baixo
       • ponto_atencao_alto (TEXT) - ponto de atenção para resultado alto
       • ponto_atencao_baixo (TEXT) - ponto de atenção para resultado baixo

2. HOOK
   └── Atualizar interface Dimensao para incluir os novos campos

3. TELA DE RESULTADOS
   └── Adicionar nova seção "Leitura de Funcionamento Atual"
       com cards para cada dimensão mostrando:
       • Ícone/cor da dimensão
       • Nome da dimensão
       • Interpretação baseada no nível (alto ou baixo)
       • Ponto de atenção correspondente
```

---

## Alterações Técnicas

### 1. Migração do Banco de Dados

Adicionar 4 novos campos à tabela `big5_funcional_dimensoes`:

```sql
ALTER TABLE big5_funcional_dimensoes
ADD COLUMN interpretacao_alto TEXT,
ADD COLUMN interpretacao_baixo TEXT,
ADD COLUMN ponto_atencao_alto TEXT,
ADD COLUMN ponto_atencao_baixo TEXT;
```

Depois, popular com os textos fornecidos:

| Dimensão | interpretacao_alto | ponto_atencao_alto | interpretacao_baixo | ponto_atencao_baixo |
|----------|-------------------|-------------------|---------------------|---------------------|
| abertura | Você tende a: aprender com facilidade, questionar padrões... | Pode se dispersar ou se frustrar... | Você tende a: preferir métodos testados... | Pode resistir a mudanças necessárias... |
| conscienciosidade | Você tende a: cumprir compromissos com responsabilidade... | Pode assumir carga excessiva... | Você tende a: agir de forma mais espontânea... | Pode enfrentar dificuldades com prazos... |
| extroversao | Você tende a: se energizar em interações sociais... | Pode ter dificuldade em lidar com silêncio... | Você tende a: processar informações internamente... | Pode ser percebida como distante... |
| amabilidade | Você tende a: considerar o impacto das suas ações... | Pode evitar conflitos necessários... | Você tende a: priorizar autonomia e objetividade... | Pode ser percebida como dura... |
| neuroticismo | Você tende a: reagir intensamente ao estresse... | Pode se desgastar emocionalmente... | Você tende a: manter estabilidade emocional... | Pode minimizar emoções importantes... |

---

### 2. Atualizar Hook `useBig5Funcional`

**Arquivo:** `src/hooks/useBig5Funcional.ts`

Atualizar a interface `Dimensao`:

```typescript
export interface Dimensao {
  id: string;
  chave: string;
  nome: string;
  nome_ingles: string;
  descricao: string;
  cor: string;
  ordem: number;
  ativo: boolean;
  // NOVOS CAMPOS
  interpretacao_alto: string | null;
  interpretacao_baixo: string | null;
  ponto_atencao_alto: string | null;
  ponto_atencao_baixo: string | null;
}
```

Atualizar também `ResultadoCalculado` para incluir os novos campos:

```typescript
export interface ResultadoCalculado {
  medias: Record<string, number>;
  dimensaoAlta: { 
    chave: string; 
    nome: string; 
    descricao: string; 
    cor: string; 
    media: number;
    interpretacao_alto: string | null;
    ponto_atencao_alto: string | null;
  } | null;
  dimensaoBaixa: { 
    chave: string; 
    nome: string; 
    descricao: string; 
    cor: string; 
    media: number;
    interpretacao_baixo: string | null;
    ponto_atencao_baixo: string | null;
  } | null;
}
```

---

### 3. Nova Seção na Tela de Resultados

**Arquivo:** `src/pages/Big5Funcional.tsx`

Adicionar seção "Leitura de Funcionamento Atual" após o radar chart:

```text
┌─────────────────────────────────────────────────────────────────┐
│ 📖 LEITURA DE FUNCIONAMENTO ATUAL                               │
│                                                                 │
│ Este resultado descreve tendências de funcionamento,            │
│ não identidade fixa. Ele não define quem você é —               │
│ indica como você tende a agir hoje.                             │
├─────────────────────────────────────────────────────────────────┤
│ 🟦 ABERTURA À EXPERIÊNCIA (alto)                                │
│                                                                 │
│ Você tende a:                                                   │
│ • aprender com facilidade                                       │
│ • questionar padrões estabelecidos                              │
│ • se interessar por ideias novas e abordagens diferentes        │
│                                                                 │
│ Costuma se adaptar bem a contextos de mudança e inovação.       │
│                                                                 │
│ ⚠️ Ponto de atenção:                                            │
│ Pode se dispersar ou se frustrar em ambientes muito rígidos...  │
├─────────────────────────────────────────────────────────────────┤
│ 🟩 CONSCIENCIOSIDADE (alto/baixo)                               │
│ ...                                                             │
└─────────────────────────────────────────────────────────────────┘
```

A lógica para determinar alto/baixo:
- **Alto**: média ≥ 3.5
- **Baixo**: média < 3.5

---

### 4. Síntese Automática do Perfil

Adicionar ao final da leitura:

```text
┌─────────────────────────────────────────────────────────────────┐
│ 🧭 SÍNTESE DO PERFIL                                            │
│                                                                 │
│ Seu funcionamento atual mostra maior tendência em               │
│ [DIMENSÃO MAIS ALTA] e menor tendência em [DIMENSÃO MAIS BAIXA].│
│                                                                 │
│ Isso indica como você costuma reagir, não como deve agir.       │
│ Padrões podem mudar com contexto, fase de vida e escolhas       │
│ conscientes.                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5. Aviso Ético Fixo

Garantir que o `EthicalNotice` existente esteja presente:

```text
⚠️ Este resultado não é diagnóstico psicológico.
   Ele descreve tendências comportamentais em determinado momento.
```

---

## Estrutura Visual da Tela de Resultados Atualizada

```text
┌─────────────────────────────────────────────────────────────────┐
│ SEU PERFIL FUNCIONAL                                            │
│ [Radar Chart com 5 dimensões]                                   │
├─────────────────────────────────────────────────────────────────┤
│ [Cards: Dimensão mais alta | Dimensão mais baixa]               │
├─────────────────────────────────────────────────────────────────┤
│ 📖 LEITURA DE FUNCIONAMENTO ATUAL                               │
│ [Accordion ou Cards para cada dimensão com interpretação]       │
├─────────────────────────────────────────────────────────────────┤
│ 🧭 SÍNTESE DO PERFIL                                            │
│ [Texto dinâmico com resumo]                                     │
├─────────────────────────────────────────────────────────────────┤
│ RESUMO POR DIMENSÃO                                             │
│ [Barras de progresso para todas as 5 dimensões]                 │
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ AVISO ÉTICO                                                  │
│ [EthicalNotice existente]                                       │
├─────────────────────────────────────────────────────────────────┤
│ [Botões: Voltar | Refazer]                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Ordem de Implementação

1. Criar migração para adicionar campos à tabela `big5_funcional_dimensoes`
2. Popular os campos com os textos de interpretação fornecidos
3. Atualizar interfaces no hook `useBig5Funcional.ts`
4. Criar componente `Big5InterpretacaoCard` para cada dimensão
5. Adicionar seção de leitura na tela de resultados
6. Adicionar síntese automática do perfil
7. Testar fluxo completo

---

## Benefícios

- Leitura interpretativa rica e contextualizada
- Dados dinâmicos vindos do banco (editável pelo Admin)
- Indicação clara de alto/baixo por dimensão
- Ponto de atenção específico para cada cenário
- Linguagem funcional (não psicologizante)
- Mantém posicionamento ético da Casa Orácula

