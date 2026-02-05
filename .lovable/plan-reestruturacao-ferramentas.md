# Plano de Reestruturação: Sistema de Ferramentas Simbólicas do Jardim da Heroína

## Diagnóstico Atual

Foram identificadas **10 ferramentas** que precisam de revisão conceitual e linguística:

| Ferramenta Atual | Problema | Função Psíquica Correta |
|------------------|----------|-------------------------|
| Neuroplasticidade & Mudança de Padrões | Linguagem técnica/científica | Integração viva |
| Trilha de Neuroplasticidade | Não deve existir como trilha | Dissolver como eixo transversal |
| Espelho de Consciência | OK, mas refinar copy | Revelação e espelhamento |
| Radar de Eixo | Revisar tom de "diagnóstico" | Leitura de alinhamento |
| Leitura em 5 Camadas | OK, já está correto | Diferenciação de planos |
| Mapa de Plasticidade Psíquica | Linguagem técnica | Travessia de transformação |
| Mapa Arquetípico do Ego Feminino | Revisar "diagnóstico" | Leitura simbólica |
| O Mapa dos Cinco Territórios | OK | Espelho narrativo |
| Mapa da Orácula | OK | Visualização integrada |
| Constelação Sistêmica | OK | Registro de movimentos |

---

## Plano de Ação

### Fase 1: Renomear e Reposicionar (Banco de Dados)

#### 1.1 "Neuroplasticidade & Mudança de Padrões"
**Novo nome:** `Campo de Integração Viva`
**Nova descrição:** `Um espaço onde novos modos de responder à vida se estabilizam. Não é técnica — é continuidade da experiência.`
**Novo tipo:** `integracao`

#### 1.2 "Trilha de Neuroplasticidade" 
**Ação:** DESATIVAR (ativa = false)
**Motivo:** Não deve existir como trilha independente. O conceito será redistribuído como eixo transversal.

#### 1.3 "Mapa de Plasticidade Psíquica"
**Novo nome:** `O Caminho da Transformação Consciente`
**Nova descrição:** `Uma travessia pelos padrões que pedem mudança e pelas novas respostas que desejam nascer. Não é treino — é enraizamento.`
**Novo tipo:** `travessia`

#### 1.4 "Radar de Eixo"
**Novo nome:** `Radar do Eixo Interno`
**Nova descrição:** `Leitura de alinhamento interno — percepção de desvios, compensações e excessos. Instrumento de precisão simbólica, não de julgamento.`
**Novo tipo:** `leitura_simbolica`

#### 1.5 "Espelho de Consciência"
**Nova descrição:** `Ferramenta de revelação e espelhamento. Torna visível padrões, automatismos e narrativas internas. Porta de entrada para a consciência estrutural.`
**Tipo mantido:** `autoleitura`

#### 1.6 "Mapa Arquetípico do Ego Feminino"
**Novo tipo:** `autoleitura` (não diagnóstico)
**Descrição ajustada:** Remover "teste psicológico", já está correto.

---

### Fase 2: Revisar Páginas (Frontend)

#### 2.1 `/salas/Neuroplasticidade.tsx`
- Remover todos os termos: neuroplasticidade, técnica, método, padrão comportamental
- Usar: integração, ressignificação, enraizamento, continuidade
- Título: "Campo de Integração Viva"
- Subtítulo: "Onde novos modos de responder à vida se estabilizam"

---

### Fase 3: Arquitetura de Integração

#### Território Único Vivo
Todas as ferramentas devem ser apresentadas como partes de um único sistema:

```
┌─────────────────────────────────────────────────────────────┐
│                    JARDIM DA HEROÍNA                        │
│                   (Território Vivo)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  REVELAÇÃO  │───▶│   LEITURA   │───▶│ INTEGRAÇÃO  │     │
│  │             │    │             │    │             │     │
│  │ • Espelho   │    │ • 5 Camadas │    │ • Campo     │     │
│  │ • Radar     │    │ • Mapas     │    │   Vivo      │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                    CONTINUIDADE                             │
│              (Eixo transversal silencioso)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Fluxo Natural
1. **Revelação** (Espelho, Radar) → Torna visível
2. **Leitura** (5 Camadas, Mapas) → Diferencia planos
3. **Integração** (Campo Vivo) → Estabiliza mudança

---

## Linguagem Proibida vs. Permitida

| ❌ PROIBIDO | ✅ USAR |
|-------------|---------|
| Neuroplasticidade | Integração |
| Técnica | Convite |
| Método | Caminho |
| Treino | Enraizamento |
| Passo a passo | Travessia |
| Padrão comportamental | Modo de responder |
| Explicação científica | Narrativa simbólica |
| Diagnóstico | Leitura |
| Avaliação | Espelhamento |

---

## Próximos Passos

1. ✅ Plano criado
2. ⏳ Atualizar banco de dados (sala_ferramentas)
3. ⏳ Revisar página Neuroplasticidade.tsx
4. ⏳ Verificar outras páginas afetadas
