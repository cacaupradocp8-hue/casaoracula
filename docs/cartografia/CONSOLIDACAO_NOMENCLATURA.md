# CONSOLIDAÇÃO DA NOMENCLATURA — ARQUITETURA CIDADELA

Este documento estabelece o padrão oficial de nomenclatura para as duas camadas da arquitetura Orácula™, eliminando ambiguidades entre o perfil estável e o estado transitório.

## 1. Glossário Oficial

*   **Cidadela Interior**: O ecossistema psíquico completo do usuário, composto por 11 territórios.
*   **Território**: Espaço físico-simbólico fixo na cidade (ex: Labirinto, Forja, Torres).
*   **Distrito**: Unidade funcional de análise vinculada a um território ou eixo do Big Five.
*   **Perfil Estrutural (Camada 1)**: O "motor" estável; como a pessoa tende a habitar o mundo (permanente).
*   **Cartografia Psíquica (Camada 2)**: O "GPS" de estado; onde a pessoa está habitando agora (transitório).

---

## 2. Termos Aprovados

### Camada 1 — Perfil Estrutural Orácula™
Objetivo: Mapear a natureza estável e os talentos inatos.

*   **`distritos_naturais`**: (Substitui `distritos_acesos`, `distritos_ativos`) Territórios que compõem a estrutura base da pessoa.
*   **`clima_estrutural`**: (Substitui `clima_cidade`) A atmosfera base derivada da personalidade.
*   **`torre_dominante`**: A estratégia central de funcionamento estável.

### Camada 2 — Cartografia Psíquica Orácula™ (Cidadela Viva)
Objetivo: Mapear o estado emocional e o movimento do momento.

*   **`distritos_vivos`**: (Substitui `distritos_ativos_agora`) Territórios com alta carga de energia ou ocupação no presente.
*   **`distritos_negligenciados`**: Territórios evitados ou sem energia no momento.
*   **`movimento_dominante`**: A dinâmica psicológica ativa (ex: Retração, Expansão, Travessia).

---

## 3. Termos Deprecados (Aliasing de Transição)

Para garantir a compatibilidade retroativa ("sem quebra"), os termos abaixo devem ser evitados em novos desenvolvimentos, mas permanecem no código como aliases:

| Termo Deprecado | Novo Termo Oficial | Contexto |
| :--- | :--- | :--- |
| `distritos_acesos` | `distritos_naturais` | Camada 1 (Motor de Derivação) |
| `distritos_ativos` | `distritos_vivos` | Camada 2 (GPS / Sessão Viva) |
| `territorios_principais` | `distritos_naturais` | Persistência (Tabela `cartografia_psiquica`) |
| `clima_cidade` | `clima_estrutural` | Camada 1 |

---

## 4. Plano de Migração Sem Quebra

1.  **Camada de Orquestração**: O arquivo `src/lib/cartografia/montarProfileJson.ts` atua como o tradutor oficial. Ele consome os motores internos (que ainda podem usar termos legados) e entrega o JSON estruturado com os novos campos `perfil_estrutural` e `estado_atual`.
2.  **Consumo na UI**: Componentes novos devem ler exclusivamente de `profile.perfil_estrutural.distritos_naturais`. Componentes legados continuam lendo de `profile.cidadela.distritos_acesos` (que agora é um espelho).
3.  **Hooks**: O hook `useCartografiaGPS` passará a diferenciar o estado do cliente (vivos) da base do terapeuta (naturais).

## 5. Impacto nos Consumidores Atuais

*   **Mandala Pessoal / Mapa SVG**: Sem impacto; a estrutura de compatibilidade no JSON mantém os campos antigos como espelhos dos novos.
*   **Bússola / GPS**: Ganho de precisão; agora é possível diferenciar se um distrito está "aceso" (porque é natural da pessoa) ou "vivo" (porque ela está passando por um abalo agora).
*   **Persistência**: Não houve alteração em colunas do banco de dados; a mudança ocorre na estrutura semântica dentro do campo `profile_json`.
