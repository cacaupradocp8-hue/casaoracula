# Technical Dependency Map & Consolidation Strategy

Este documento detalha as dependências técnicas para a consolidação dos itens identificados na auditoria de governança.

## 1. Mapas Psíquicos (Convergência)

| Componente | Arquivo | Rota | Dependência Atlas | Ação |
|---|---|---|---|---|
| **Mandala CidaDELA** | `CartografiaPsiquicaPage.tsx` | `/ferramenta/cartografia-psiquica-oracula` | **Primária** | Manter como porta de entrada. |
| **Mapa Vivo** | `CoMapaVivoPage.tsx` | `/mapa-vivo` | **Longitudinal** | Manter como motor de evolução. |
| **Mapa Oracula** | `MapaOracula.tsx` | `/ferramentas/mapa-oracula` | Nenhuma | Redirecionar para CidaDELA. |
| **Mapa Casa** | `MapaCasaOracula.tsx` | `/mapa-casa` | Nenhuma | Renomear para evitar conflito clínico. |

## 2. Big Five (Consolidação)

| Versão | Arquivo | Status | Atlas Layer |
|---|---|---|---|
| **Simbólico** | `Big5Simbolico.tsx` | Ativo | Dimensional (Canônico) |
| **Funcional** | `Big5Funcional.tsx` | Legado | Dimensional |
| **Base** | `Big5.tsx` | Legado | Dimensional |

**Estratégia:** Concentrar lógica de salvamento na tabela `big5_registros` e centralizar no `Big5Simbolico`.

## 3. Bibliotecas de Travessias

| Nome | Arquivo | Filtro Proposto |
|---|---|---|
| Biblioteca Unificada | `BibliotecaUnificada.tsx` | `all` |
| Travessias | `BibliotecaTravessias.tsx` | `categoria: travessia` |
| Família | `BibliotecaTravessiasFamilia.tsx` | `categoria: familia` |

**Estratégia:** Utilizar Query Parameters (`/biblioteca?tipo=travessia`) para eliminar arquivos duplicados.

## 4. Casa das Máquinas (Naming)

Padronizar prefixos de rotas para garantir que cookies e estados de "Cabine" sejam persistentes e isolados.
- `/casa` -> `/casa-das-maquinas/atrio`
- `/casa-tecelas` -> `/casa-das-maquinas/tecelas`
- `/sala-das-maquinas/cabine` -> `/casa-das-maquinas/cabine`

---
*Este mapa deve ser seguido na Fase de Refatoração Segura.*
