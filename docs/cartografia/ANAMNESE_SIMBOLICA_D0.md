# ALINHAMENTO DA CARTOGRAFIA COMO ANAMNESE SIMBÓLICA (D0)

Este documento atualiza a arquitetura da **Cartografia Psíquica Orácula™** para formalizar seu uso clínico e pedagógico na **Casa das Máquinas**.

## 1. Ajuste Conceitual: A CidadELA como Gramática Universal
A CidadELA deixa de ser apenas um "dashboard de perfil" e passa a ser uma **Anamnese Simbólica**. 
- É uma linguagem para mapear o território psíquico, seja em auto-aplicação (terapeuta) ou em escuta clínica (cliente).

## 2. Diferença de Contextos

### Contexto 1: Autoaplicação (A Terapeuta como Sujeito)
*   **Finalidade**: Onboarding na Casa, recomendação de ferramentas de estudo, atualização da "Cidadela da Aluna".
*   **Pergunta Chave**: "Em que distrito da **sua** cidade você está habitando agora?"
*   **Uso Principal**: Orientação de rotas e recomendação de ferramentas para a própria aluna.

### Contexto 2: Anamnese Simbólica (A Cliente como Sujeito)
*   **Finalidade**: Organização da narrativa da cliente, hipótese simbólica de estado, planejamento de sessões.
*   **Pergunta Chave**: "Em que distrito **esta cliente** parece estar habitando agora?"
*   **Uso Principal**: Painel da terapeuta na Casa das Máquinas e orientação de condução clínica.

## 3. Contrato de Dados (Campos Adicionais)

O contrato de `CartografiaPsiquicaOracula` (em `src/lib/cartografia/contratos.ts`) foi atualizado para suportar metadados de contexto:

```typescript
contexto: {
  subject_type: 'terapeuta' | 'cliente';
  subject_id: string; // user_id ou client_id
  origem_leitura: 'auto' | 'terapeuta';
};
```

## 4. Relação com a Casa das Máquinas e Rotas

*   **Casa das Máquinas**: A Cartografia é o núcleo da ficha da cliente. Ao identificar um distrito como `vivo`, a Casa das Máquinas sugere automaticamente Portas, Torres, Labirintos e próximos passos de condução.
*   **Rotas da Casa**: As rotas deixam de ser sequências fixas e tornam-se "direcionadores geográficos" baseados no estado atual da cliente.

## 5. Ética e Linguagem (Cuidados Fundamentais)

A leitura da cliente **não é um diagnóstico**. É uma ferramenta de **Escuta e Organização Narrativa**.

| Termo Crítico (Evitar) | Termo Simbólico (Aprovado) |
| :--- | :--- |
| Diagnóstico | Hipótese Simbólica |
| Sintoma | Frequência no Distrito |
| Doença/Transtorno | Território de Sombra |
| Tratamento | Travessia / Condução |
| Cura | Integração / Próximo Passo |

---
**Classificação: CARTOGRAFIA_CLINICA_ALINHADA**
