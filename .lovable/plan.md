

# Plano: Guardiã da Leitura — IA Explicativa Big Five

## Objetivo

Integrar uma **assistente de IA chamada "Guardiã da Leitura"** dentro da estrutura das páginas Big5 (Funcional e Oracular), com a função exclusiva de **explicar a diferença entre as duas leituras** seguindo regras éticas rígidas.

---

## Situação Atual

| Elemento | Estado |
|----------|--------|
| `AIChatBlock` | Componente modular de chat com IA |
| Edge Function `ai-chat` | Recebe `contextPrompt` para contextualizar agente |
| `Big5Funcional.tsx` | Página completa com radar, leitura, síntese |
| `Big5Oracular.tsx` | Página com mapa simbólico, ritual, decisão |
| Tabela `agentes` | Armazena agentes com prompt, modelo, temperatura |
| IA explicativa integrada | Nao existe |

---

## Arquitetura da Solução

```text
1. BANCO DE DADOS
   └── Criar agente "Guardiã da Leitura" na tabela `agentes`
       • prompt_personalidade: regras absolutas (sem diagnóstico, sem hierarquia)
       • instrucoes_base: estrutura de resposta (Funcional → Oracular → Integração)
       • temperatura: 0.5 (respostas consistentes)
       • status: ativo

2. COMPONENTE
   └── Criar `GuardiaLeituraChat.tsx`
       • Chat compacto e expansível (accordion ou collapsible)
       • Mensagem inicial contextualizada
       • Usa `ai-chat` edge function com agente específico
       • Perguntas sugeridas para facilitar uso

3. INTEGRAÇÃO NAS PÁGINAS
   └── Adicionar componente em:
       • Big5Funcional.tsx (tela intro e resultado)
       • Big5Oracular.tsx (tela intro e resultado)
       
4. MODO PROFISSIONAL (OPCIONAL)
   └── Seção colapsável "Manual para Facilitadoras"
       • Ordem correta de aplicação
       • Como apresentar ao cliente
       • Frases permitidas e proibidas
       • Regra de ouro clínica
```

---

## Alterações Técnicas

### 1. Criar Agente na Tabela `agentes`

Migração para inserir o agente "Guardiã da Leitura":

```sql
INSERT INTO agentes (
  nome,
  descricao,
  prompt_personalidade,
  instrucoes_base,
  modelo_preferido,
  temperatura,
  max_tokens,
  status
) VALUES (
  'Guardiã da Leitura',
  'Explica a diferença entre Big Five Funcional e Oracular, sem diagnósticos ou interpretações.',
  'Você é a Guardiã da Leitura da Casa Orácula.

Sua função é explicar, de forma clara e tranquila, a diferença entre duas leituras oferecidas no app:
1) Big Five – Leitura Funcional
2) Big Five – Leitura Oracular

Regras absolutas:
– Não diagnosticar
– Não interpretar a usuária
– Não hierarquizar qual é "melhor"
– Não usar termos clínicos
– Não oferecer conselhos de mudança

Sua linguagem deve ser:
– adulta
– clara
– respeitosa
– simbólica leve, mas não mística',
  
  'Estrutura da resposta:

1) Explicar o Big Five Funcional
   → como um mapa de funcionamento prático
   → foco em comportamento, rotina, decisões e ambiente

2) Explicar o Big Five Oracular
   → como um espelho simbólico do momento psíquico
   → foco em narrativa interna, Portas e travessias

3) Explicar por que os dois não se contradizem
   → eles observam camadas diferentes da mesma pessoa

4) Encerrar com uma frase de integração, sem convite à ação

Frase-base de encerramento (use variações):
"O funcional mostra como você opera.
O oracular mostra onde a alma está trabalhando."',

  'google/gemini-2.5-flash',
  0.5,
  800,
  'ativo'
);
```

---

### 2. Criar Componente `GuardiaLeituraChat`

**Arquivo:** `src/components/big5/GuardiaLeituraChat.tsx`

Componente que:
- Usa o `AIChatBlock` internamente ou reimplementa com UI simplificada
- Exibe em formato collapsible/accordion
- Mensagem de boas-vindas contextualizada
- Perguntas sugeridas clicáveis

```text
┌──────────────────────────────────────────────────────────────┐
│ 💬 Pergunte à Guardiã da Leitura                       [▼]   │
├──────────────────────────────────────────────────────────────┤
│ "Olá! Sou a Guardiã da Leitura. Posso explicar a diferença  │
│ entre a Leitura Funcional e a Leitura Oracular do Big Five. │
│ Pergunte o que quiser — sem pressa."                         │
│                                                              │
│ Sugestões:                                                   │
│ [Qual a diferença entre as duas leituras?]                   │
│ [O resultado pode mudar com o tempo?]                        │
│ [Posso confiar nesse mapa?]                                  │
├──────────────────────────────────────────────────────────────┤
│ [____________________________________] [Enviar]              │
└──────────────────────────────────────────────────────────────┘
```

---

### 3. Criar Seção "Manual para Facilitadoras"

**Arquivo:** `src/components/big5/GuardiaManualProfissional.tsx`

Componente colapsável exibido apenas para usuárias com perfil profissional (`oracula`, `iniciada`, `admin`):

```text
┌──────────────────────────────────────────────────────────────┐
│ 📋 Manual para Facilitadoras                            [▼]  │
├──────────────────────────────────────────────────────────────┤
│ COMO USAR COM CLIENTES                                       │
│                                                              │
│ 1️⃣ Ordem correta                                            │
│ ✔ Primeiro: Big Five Funcional                              │
│ ✔ Depois (se houver campo): Big Five Oracular               │
│ Nunca o inverso.                                             │
│                                                              │
│ 2️⃣ Como apresentar                                          │
│ "Este primeiro mapa mostra como você tende a funcionar       │
│ no dia a dia. Ele não explica sua história, só organiza      │
│ padrões."                                                    │
│                                                              │
│ ...                                                          │
│                                                              │
│ ⚠️ O QUE É PROIBIDO                                         │
│ ❌ "Isso explica por que você é assim"                       │
│ ❌ "Seu problema está aqui"                                  │
│ ❌ "Você precisa desenvolver esse fator"                     │
│                                                              │
│ 🏆 REGRA DE OURO CLÍNICA                                    │
│ Se o mapa virar explicação, ele perdeu a função.            │
│ Se virar espelho silencioso, cumpriu o papel.               │
└──────────────────────────────────────────────────────────────┘
```

---

### 4. Integrar nas Páginas Big5

**Arquivo:** `src/pages/Big5Funcional.tsx`

Adicionar na tela **intro** (antes do questionário):
```text
<GuardiaLeituraChat 
  contextPage="funcional" 
  welcomeMessage="Olá! Antes de começar, posso explicar o que esta leitura revela — e o que ela não pretende revelar. Pergunte se quiser."
/>
```

Adicionar na tela **resultado** (após o EthicalNotice):
```text
<GuardiaLeituraChat 
  contextPage="funcional_resultado"
  welcomeMessage="Você completou a Leitura Funcional. Posso explicar o que significa esse mapa, ou esclarecer a diferença para a Leitura Oracular."
/>

{isProfessional && <GuardiaManualProfissional />}
```

**Arquivo:** `src/pages/Big5Oracular.tsx`

Mesma lógica:
- Na tela intro: chat contextualizado
- Na tela resultado: chat + manual profissional

---

## Fluxo de Uso

```text
Usuária acessa Big5 Funcional
    ↓
Vê chat da Guardiã (colapsado por padrão)
    ↓
Pode perguntar antes de iniciar
    ↓
Responde questionário
    ↓
Vê resultado + chat da Guardiã expandido
    ↓
Se profissional: vê Manual para Facilitadoras
```

---

## Benefícios

- IA contextualizada e restrita ao escopo explicativo
- Nenhum risco de diagnóstico ou interpretação
- Manual profissional protege o método e a facilitadora
- Componente reutilizável em ambas as páginas Big5
- Linguagem adulta, clara e simbólica leve
- Regras éticas garantidas pelo prompt do agente

---

## Ordem de Implementação

1. Criar migração para inserir agente "Guardiã da Leitura"
2. Criar componente `GuardiaLeituraChat.tsx`
3. Criar componente `GuardiaManualProfissional.tsx`
4. Integrar chat na página `Big5Funcional.tsx`
5. Integrar chat na página `Big5Oracular.tsx`
6. Testar fluxo completo

