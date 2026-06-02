# PROJETO DA CARTOGRAFIA PSÍQUICA ORÁCULA™ (CAMADA 2)

Este documento define a arquitetura técnica e clínica da Camada 2 da Cidadela, focada no **Estado Atual (Cidadela Viva)** do usuário.

## 1. Arquitetura da Cartografia Psíquica

A Cartografia Psíquica não é um traço de personalidade, mas uma **leitura dinâmica de frequência**. Enquanto o Perfil Estrutural (Camada 1) é o "Mapa da Região", a Cartografia Psíquica é o "Sinal do GPS" e o "Mapa de Calor".

### Níveis de Visibilidade
*   **Frequência**: A intensidade de energia em cada distrito.
*   **Vizinhança**: A relação entre distritos vivos (ex: se Forja e Labirinto estão acesos, há uma tensão entre ação e dúvida).
*   **Contraste**: A diferença entre o Perfil Estrutural (natureza) e a Cartografia Psíquica (estado).

---

## 2. Contrato de Dados (Detalhamento)

O objeto `estado_atual` dentro do `profile_json` será alimentado pelos seguintes campos:

```json
{
  "estado_atual": {
    "pergunta_ancora_estado": "Em que distrito da sua cidade você está habitando agora?",
    "distritos_vivos": ["string[]"], // Os top 3 com maior peso de atividade recente
    "distritos_negligenciados": ["string[]"], // Naturais da Camada 1 que estão com energia zerada
    "movimento_dominante": "string", // ex: "Recolhimento", "Expansão", "Confronto", "Inércia"
    "travessia_sugerida": "string", // Ação pedagógica recomendada
    "ferramenta_inicial_sugerida": "string", // Slug da ferramenta recomendada para o estado
    "frequencia_distritos": {
      "portao_chegada": 0.8,
      "torres": 0.2,
      "..." : 0.0
    },
    "data_ultima_leitura": "ISO8601",
    "confianca_leitura": 0.0 // 0 a 1, baseado na quantidade de fontes recentes
  }
}
```

---

## 3. Fontes de Alimentação (Pipeline)

A Cartografia Psíquica é alimentada por um **Somador de Frequência**:

1.  **Sessão Viva (Peso 10)**: Inputs diretos da terapeuta durante a sessão (ex: Marcação de distritos acesos no Mapa Vivo).
2.  **Check-in de Estado (Peso 5)**: Autoavaliação subjetiva do usuário (humor, energia, disposição).
3.  **Ferramentas Oraculares (Peso 3)**: Conclusão de exercícios específicos (ex: Narroterapia pontua 'Casa dos Sonhos').
4.  **Rotas concluídas (Peso 4)**: Progressão em estações (ex: Rota dos Lobos pontua 'Labirinto' e 'Portal de Renascimento').
5.  **Diário / Sonhos / Reflexões (Peso 2)**: Processamento de palavras-chave que remetem aos territórios.
6.  **Jardins (Peso 2)**: Registro de arquétipos emergentes no Jardim da Heroína.

---

## 4. Regras de Atualização e Derivação

### Regra de Decaimento (Entropy)
O estado psíquico é volátil. A energia de um distrito diminui **10% a cada 24h** sem novos inputs. Após 10 dias sem dados, a Cartografia Psíquica torna-se "Opaca" (Baixa Confiança).

### Identificação de Movimento Dominante
*   **Expansão**: Aumento de energia nos distritos de *Voz no Mundo* (Forja, Praça Integração).
*   **Recolhimento**: Concentração de energia em *Torre Interna* (Conselho Interior) ou *Casa dos Sonhos*.
*   **Abatimento**: Alta energia em *Praça do Abalo* + Baixa energia em *Forja*.
*   **Travessia**: Energia migrando de um distrito de tensão para um distrito de recurso.

### Identificação de Distritos Negligenciados
Identificados quando um distrito é `natural` (Camada 1), mas sua `frequência` na Camada 2 está abaixo de 0.2 por mais de 7 dias.

---

## 5. Estratégia de Coexistência (Layering)

A Cidadela exibirá as duas camadas simultaneamente:

1.  **Base (Camada 1)**: Renderizada em tons de cinza ou contornos suaves (blueprint). Representa o "quem eu sou".
2.  **Pulso (Camada 2)**: Renderizada em cores vibrantes (aura/calor). Representa o "onde estou".
3.  **O Espaço Clínico**: Áreas onde o Perfil Estrutural é forte mas a Cartografia Psíquica é fraca são sinalizadas como "Territórios em Sombra" ou "Potencial Adormecido".

---

## 6. Exemplo Completo de JSON (Caso Hipotético)

**Perfil**: Uma pessoa estruturalmente focada em Vínculos (Espelho) e Estrutura (Torres), mas passando por uma crise (Abalo).

```json
{
  "perfil_estrutural": {
    "pergunta_ancora_estrutural": "Como esta pessoa costuma habitar o mundo?",
    "distritos_naturais": ["espelho_vinculos", "torres"],
    "torre_dominante": "Torre do Vínculo Protegido",
    "clima_estrutural": "Organizada mas silenciosa"
  },
  "estado_atual": {
    "pergunta_ancora_estado": "Em que distrito da sua cidade você está habitando agora?",
    "distritos_vivos": ["praca_abalo", "labirinto"],
    "distritos_negligenciados": ["torres"],
    "movimento_dominante": "Crise de Transição",
    "travessia_sugerida": "Contenção de Danos e Aterramento",
    "ferramenta_inicial_sugerida": "narroterapia_abalo",
    "frequencia_distritos": {
      "praca_abalo": 0.95,
      "labirinto": 0.80,
      "espelho_vinculos": 0.30,
      "torres": 0.05
    },
    "data_ultima_leitura": "2026-06-02T14:30:00Z",
    "confianca_leitura": 0.85
  }
}
```

---
**Status: CARTOGRAFIA_PSIQUICA_PROJETADA**
