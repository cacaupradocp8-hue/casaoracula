# CAMADA DE CONDUÇÃO CLÍNICA DA CARTOGRAFIA (ETAPA E)

Este documento projeta a camada de inteligência que traduz a **Cartografia Psíquica** (Anamnese Simbólica) em orientações práticas de condução para a terapeuta dentro da **Casa das Máquinas**.

## 1. Arquitetura da Camada de Condução

A Camada de Condução atua como um "Tradutor Simbólico" entre o mapa de calor (Cartografia) e a ação clínica. Ela não substitui o olhar da terapeuta, mas organiza a paisagem para facilitar a escuta.

### Fluxo de Inteligência
1.  **Entrada**: `CartografiaPsiquica` (Distritos Vivos, Negligenciados, Movimento Dominante).
2.  **Processamento**: Cruzamento com o `Perfil Estrutural` para identificar tensões (ex: natural 'Forja' está 'Negligenciada').
3.  **Saída**: `LeituraConducao` (Hipóteses, Perguntas, Sugestões).

---

## 2. Contrato JSON Proposto: `LeituraConducao`

```typescript
interface LeituraConducao {
  contexto_id: string; // ID da Cartografia de origem
  timestamp: string;
  
  // Resumo do Estado (Visão Cliente)
  panorama: {
    distritos_vivos: string[];
    distritos_negligenciados: string[];
    movimento_dominante: string;
    clima_atual: string;
  };

  // Suporte à Terapeuta (Visão Condução)
  conducao: {
    hipotese_simbolica: string;
    perguntas_de_escuta: string[];
    cuidados_eticos: string[];
    travessia_sugerida: string;
  };

  // Direcionamento de Recursos
  recursos_sugeridos: {
    ferramenta_slug: string; // Ex: 'oraculo-dos-lobos'
    rota_slug: string;       // Ex: 'rota-dos-lobos-estacao-1'
    proximo_passo_imediato: string;
    ancora_narrativa: string; // Pergunta ou tema para abrir a sessão
  };
}
```

---

## 3. Exemplo de Saída (Caso: Labirinto Ativo + Forja Negligenciada)

```json
{
  "panorama": {
    "distritos_vivos": ["labirinto", "praca_abalo"],
    "distritos_negligenciados": ["forja_acao"],
    "movimento_dominante": "Paralisia por Excesso de Opções",
    "clima_atual": "Nebuloso e Tenso"
  },
  "conducao": {
    "hipotese_simbolica": "A cliente habita o Labirinto enquanto sua Forja (capacidade de agir) está sem energia, sugerindo que o pensar excessivo está consumindo a potência de realização.",
    "perguntas_de_escuta": [
      "Que fio você está segurando para não se perder nesse pensamento?",
      "Se você pudesse dar um passo, mesmo que na direção 'errada', o que aconteceria?",
      "O que o silêncio da sua Forja está tentando proteger?"
    ],
    "cuidados_eticos": [
      "Evitar pressionar por decisões rápidas (pode aumentar o abalo).",
      "Não validar o labirinto como labirinto sem saída; tratar como fase de processamento."
    ],
    "travessia_sugerida": "Do Pensamento Circular para o Gesto Mínimo."
  },
  "recursos_sugeridos": {
    "ferramenta_slug": "busssola_gesto_minimo",
    "rota_slug": "travessia_do_abalo",
    "proximo_passo_imediato": "Exercício de respiração e mapeamento de uma única ação para as próximas 24h.",
    "ancora_narrativa": "Fale sobre a última vez que você sentiu que suas mãos sabiam o que fazer, mesmo quando a cabeça não sabia."
  }
}
```

---

## 4. Regras Éticas de Linguagem

A Camada de Condução deve seguir rigorosamente a gramática simbólica para evitar desvios clínicos:

1.  **Não Determinismo**: Usar "Pode sugerir", "Hipótese", "Parece habitar", em vez de "Ela tem", "Ela é", "O problema é".
2.  **Linguagem de Território**: Substituir termos clínicos por geográficos (ex: em vez de 'Ansiedade', usar 'Vento forte no Portão de Chegada').
3.  **Foco na Potência**: Sempre apontar para o distrito que pode servir de recurso para a travessia.
4.  **Apoio, não Substituição**: A leitura termina sempre com um lembrete: "Esta é uma bússola simbólica; a direção final pertence à escuta soberana da terapeuta".

---

## 5. Integração com Casa das Máquinas

No painel da terapeuta, esta camada aparece como a **"Ficha Viva da Cliente"**:

*   **Miniatura da CidadELA**: Visualização rápida de onde a cliente está (Mapa de Calor).
*   **Card de Insights**: Exibe a Hipótese Simbólica e as Perguntas de Escuta de forma discreta para consulta durante a sessão.
*   **Timeline de Estados**: Histórico de como o movimento dominante mudou entre sessões (ex: de 'Abatimento' para 'Busca').

---

## 6. Relação com Rotas e Ferramentas

A leitura de condução serve como o **Motor de Recomendação Oracular**:

*   **Rota dos Lobos**: Se o estado for `labirinto`, a leitura sugere a estação de "Encontro com o Velho Lobo".
*   **Jardim/Reflexão**: Se `distritos_negligenciados` incluir 'Jardins', sugere uma ferramenta de contemplação.
*   **Perguntas Narrativas**: Extraídas diretamente da base de dados de "Ancoras de Território" do Oráculo.

---

## 7. Pendências antes da Implementação

1.  **Mapeamento de Hipóteses**: Criar a matriz de combinações de distritos e suas respectivas hipóteses simbólicas.
2.  **Banco de Perguntas**: Consolidar 3 a 5 perguntas de escuta para cada território da CidadELA.
3.  **Validação Pedagógica**: Revisar se os termos sugeridos estão alinhados com a metodologia Orácula.

---
**Classificação: CAMADA_CONDUCAO_PROJETADA**
