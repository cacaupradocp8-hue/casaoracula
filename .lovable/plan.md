
# Plano: Big Five — Leitura Funcional

## Visao Geral

Criar uma **nova ferramenta independente** chamada **Big Five — Leitura Funcional** com questionario de 30 perguntas originais, baseada no modelo OCEAN, com linguagem profissional e contemporanea (nao simbolica).

---

## Arquitetura

```text
┌─────────────────────────────────────────────────────────────────┐
│                    BIG FIVE - FERRAMENTAS                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Big5 Oracular  │  │  Big5 Simbolico │  │ Big5 Funcional  │  │
│  │    (30 perguntas │  │  (Forcas Alma)  │  │   (30 perguntas │  │
│  │     simbolicas)  │  │                 │  │     OCEAN)      │  │
│  │                 │  │                 │  │                 │  │
│  │ /ferramenta/    │  │ /ferramentas/   │  │ /ferramenta/    │  │
│  │ big5-oracular   │  │ big5-simbolico  │  │ big5-funcional  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│                                                                 │
│       SIMBOLICO           SIMBOLICO          FUNCIONAL          │
│                                                NOVO ←           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Etapa 1: Banco de Dados

### Tabela `big5_funcional_dimensoes`

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid | PK |
| chave | text | abertura, conscienciosidade, extroversao, amabilidade, neuroticismo |
| nome | text | Nome OCEAN (ex: Abertura a Experiencia) |
| nome_ingles | text | Openness, Conscientiousness, etc |
| descricao | text | Descricao funcional (sem simbolismo) |
| cor | text | Cor para visualizacao |
| ordem | int | Ordem de exibicao |
| ativo | bool | Status |

### Tabela `big5_funcional_perguntas`

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid | PK |
| dimensao_id | uuid | FK para big5_funcional_dimensoes |
| texto_pergunta | text | A pergunta original |
| ordem | int | Ordem dentro da dimensao (1-6) |
| ativo | bool | Status |

### Tabela `big5_funcional_registros`

| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | uuid | PK |
| user_id | uuid | FK para auth.users |
| respostas_json | jsonb | { pergunta_id: valor } |
| medias_json | jsonb | { dimensao_chave: media } |
| dimensao_alta | text | Dimensao com maior media |
| dimensao_baixa | text | Dimensao com menor media |
| created_at | timestamp | Data do registro |

---

## Etapa 2: Dados Iniciais

### 5 Dimensoes

| Chave | Nome | Cor |
|-------|------|-----|
| abertura | Abertura a Experiencia (O) | #8B5CF6 (violeta) |
| conscienciosidade | Conscienciosidade (C) | #22C55E (verde) |
| extroversao | Extroversao (E) | #F59E0B (amarelo) |
| amabilidade | Amabilidade (A) | #EC4899 (rosa) |
| neuroticismo | Neuroticismo (N) | #EF4444 (vermelho) |

### 30 Perguntas (6 por dimensao)

Todas as perguntas fornecidas serao inseridas na ordem correta:

**Abertura (O):**
1. Gosto de questionar ideias estabelecidas, mesmo quando funcionam bem.
2. Sinto necessidade de aprender algo novo com frequencia.
3. Mudancas inesperadas despertam mais curiosidade do que medo em mim.
4. Consigo ver valor em perspectivas muito diferentes da minha.
5. Ideias abstratas ou conceituais me interessam mais do que instrucoes rigidas.
6. Costumo repensar crencas antigas a luz de novas experiencias.

**Conscienciosidade (C):**
1. Cumpro prazos mesmo quando ninguem esta acompanhando meu desempenho.
2. Planejo antes de agir, mesmo em tarefas simples.
3. Tenho facilidade em manter constancia em projetos de medio e longo prazo.
4. Quando assumo um compromisso, sinto responsabilidade real em cumpri-lo.
5. Consigo priorizar tarefas mesmo quando estou cansada emocionalmente.
6. Organizacao me traz clareza, nao rigidez.

**Extroversao (E):**
1. Falar em publico ou em grupo me deixa energizada.
2. Costumo tomar iniciativa em conversas ou projetos coletivos.
3. Prefiro resolver questoes conversando do que escrevendo.
4. Me sinto a vontade sendo vista e ouvida.
5. Interacoes sociais frequentes me estimulam mais do que me drenam.
6. Tenho facilidade em expressar ideias em tempo real.

**Amabilidade (A):**
1. Levo em conta o impacto das minhas decisoes nas outras pessoas.
2. Evito conflitos diretos quando acredito que nao valem o desgaste.
3. Consigo ouvir opinioes opostas sem sentir ataque pessoal.
4. Sou frequentemente vista como alguem acessivel.
5. Me importo genuinamente com o bem-estar de quem convive comigo.
6. Prefiro acordos colaborativos a disputas de poder.

**Neuroticismo (N):**
1. Mudancas de rotina afetam meu equilibrio emocional.
2. Tenho dificuldade em "desligar" pensamentos preocupantes.
3. Reajo intensamente a criticas, mesmo quando sao construtivas.
4. Situacoes de incerteza me geram ansiedade.
5. Emocoes negativas permanecem em mim por mais tempo do que gostaria.
6. Sinto meu corpo reagir rapidamente ao estresse.

---

## Etapa 3: Hook `useBig5Funcional`

Criar hook para gerenciar:
- Fetch de dimensoes e perguntas
- Calculo de medias por dimensao
- Identificacao de dimensao alta/baixa
- Salvar e carregar historico

---

## Etapa 4: Pagina `Big5Funcional.tsx`

### Fluxo de Telas

```text
INTRO → QUESTIONARIO (30 perguntas) → RESULTADO
```

### Tela de Introducao

- Titulo: "Big Five — Leitura Funcional"
- Aviso obrigatorio: "Este questionario descreve tendencias de funcionamento, nao define personalidade nem substitui avaliacao psicologica."
- Escala explicada: 1-5 (Discordo totalmente → Concordo totalmente)
- Botao "Iniciar"

### Tela de Questionario

- Progress bar
- Badge da dimensao atual (cor + nome)
- Pergunta em destaque
- 5 opcoes de resposta (radio/botoes)
- Navegacao: Anterior / Proxima
- Auto-avanco apos selecao

### Tela de Resultado

- Visualizacao radial (radar chart) das 5 dimensoes
- Card para dimensao mais alta com descricao funcional
- Card para dimensao mais baixa com descricao funcional
- Tabela resumo com todas as medias
- Botoes: "Voltar para Ferramentas" / "Refazer"

---

## Etapa 5: Navegacao e Rotas

| Rota | Componente |
|------|------------|
| /ferramenta/big5-funcional | Big5Funcional |

Adicionar ao menu lateral em "Ferramentas" ou como acesso via FerramentasHub.

---

## Etapa 6: Integracao com Ferramentas

Adicionar entrada na tabela `sala_ferramentas` ou na interface de ferramentas para que apareca junto das outras.

---

## Diferencas entre as 3 Ferramentas Big Five

| Aspecto | Big5 Oracular | Big5 Simbolico | Big5 Funcional |
|---------|---------------|----------------|----------------|
| Linguagem | Simbolica | Simbolica | Funcional |
| Perguntas | 30 | Afirmacoes | 30 |
| Narrativas | Sim | Sim | Nao |
| Rituais | Sim | Nao | Nao |
| Visualizacao | Radial | Radial | Radial |
| Uso | Terapeutico | Reflexivo | Profissional |

---

## Arquivos a Criar/Modificar

| Arquivo | Acao |
|---------|------|
| Migracao SQL | CRIAR tabelas e inserir dados |
| src/hooks/useBig5Funcional.ts | CRIAR hook |
| src/pages/Big5Funcional.tsx | CRIAR pagina |
| src/App.tsx | ADICIONAR rota |
| src/components/layout/Navigation.tsx | OPCIONAL - se desejar acesso direto |

---

## Resultado Esperado

Uma ferramenta limpa, profissional e contemporanea que complementa o sistema Big Five existente sem conflitar com as versoes simbolicas. Ideal para:
- Autoconhecimento objetivo
- Contexto profissional
- Leitura comportamental
- Relatorios internos do app
