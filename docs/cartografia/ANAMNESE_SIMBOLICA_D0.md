# ALINHAMENTO DA CARTOGRAFIA COMO ANAMNESE SIMBÓLICA (D0)

Este documento atualiza a arquitetura da **Cartografia Psíquica Orácula™** para formalizar seu uso clínico e pedagógico na **Casa das Máquinas**.

## 1. Ajuste Conceitual: A CidadELA como Gramática Universal
A CidadELA deixa de ser apenas um "dashboard de perfil" e passa a ser uma **Anamnese Simbólica**. 
- É uma linguagem para mapear o território psíquico, seja em auto-aplicação (terapeuta) ou em escuta clínica (cliente).

## 2. Diferença de Contextos

### Contexto 1: Autoaplicação (A Terapeuta como Sujeito)
*   **Finalidade**: Onboarding na Casa, recomendação de ferramentas de estudo, atualização da "Cidadela da Aluna".
*   **Pergunta Chave**: "Em que distrito da **sua** cidade você está habitando agora?"
*   **Visão**: O espelho da própria prática e estado emocional.

### Contexto 2: Anamnese Simbólica (A Cliente como Sujeito)
*   **Finalidade**: Organização da narrativa da cliente, hipótese diagnóstica simbólica, planejamento de sessões.
*   **Pergunta Chave**: "Em que distrito **esta cliente** parece estar habitando agora?"
*   **Visão**: Painel de acompanhamento na Casa das Máquinas.

## 3. Contrato de Dados (Campos Adicionais)

Para suportar o contexto clínico, o contrato de `estado_atual` (definido no Projeto D) deve incluir:

```typescript
interface CartografiaPsiquica {
  // ... campos do Projeto D
  contexto: {
    subject_type: 'terapeuta' | 'cliente';
    subject_id: string; // UUID da aluna ou da cliente
    origem_leitura: 'auto' | 'terapeuta'; // Quem fez a marcação
  };
  clinica: {
    hipotese_narrativa: string; // Texto livre da terapeuta
    proximos_passos: string[]; // Sugestões de condução
    ponto_de_tensao: string; // Onde a cliente está "travada"
  };
}
```

## 4. Relação com a Casa das Máquinas e Rotas

*   **Casa das Máquinas**: A Cartografia é o "cérebro" da ficha da cliente. Ao marcar um distrito como `vivo` na sessão, a Casa das Máquinas filtra automaticamente quais ferramentas e rotas são prioridade para aquela cliente.
*   **Rotas da Casa**: As rotas deixam de ser sequências fixas e passam a ser "prescrições geográficas". Se a cliente está no Labirinto, a rota sugerida é a que leva à Forja ou à Praça da Integração.

## 5. Ética e Linguagem (Cuidados Fundamentais)

A Cartografia da Cliente **não é um diagnóstico médico/psiquiátrico**. É uma ferramenta de **Escuta Simbólica**.

| Termo Evitado (Risco) | Termo Aprovado (Seguro) |
| :--- | :--- |
| Diagnóstico | Hipótese Simbólica |
| Sintoma | Frequência no Distrito |
| Doença/Transtorno | Território de Sombra |
| Tratamento | Travessia / Condução |
| Cura | Integração do Território |

**Regra de Ouro**: A leitura da terapeuta sobre a cliente é uma *interpretação narrativa* para apoiar a condução, não uma verdade absoluta sobre o sujeito.

---
**Classificação: CARTOGRAFIA_CLINICA_ALINHADA**
