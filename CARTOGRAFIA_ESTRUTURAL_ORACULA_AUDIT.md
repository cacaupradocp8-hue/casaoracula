# CARTOGRAFIA ESTRUTURAL ORÁCULA™ — AUDIT REPORT

## 1. Current Implementation Map

### Tools & Engines
- **Motor Unificado (`montarProfileJson.ts`)**: Central orchestrator that combines behavioral reading (`leituraComportamental.ts`) and city derivation (`derivacaoCidadela.ts`). It uses the Big Five model as input.
- **Subscriber Mode (`CartografiaPsiquicaPage.tsx`)**: Stepper flow (30 questions) -> generating state -> results (`SaidaSimbolica`). Requires 'aluna' level.
- **Professional Mode (`CartografiaPsiquicaOracula.tsx`)**: Reusable component for Casa das Máquinas. Same 30 questions -> results (`SaidaClinica`, `CamadaLeituraPsiquica`, `CamadaCidadela`, `CamadaDirecaoClinica`).
- **Legacy Professional Mode (`CartografiaPage.tsx`)**: Old version with manual scoring (radar-style) per territory. Still linked in `casaMaquinasRoutes.tsx`.

### Routes
- `/ferramenta/cartografia-psiquica-oracula`: Main route for both self-assessment and some professional contexts.
- `/casa-das-maquinas/ferramentas/cartografia`: Redirects to the main route.
- `/casa-das-maquinas/cabine?fromCartografia=true`: Return point after professional use.

### Data Model
- `cartografia_psiquica`: Stores core derivation (color, atmosphere, districts, symbol, etc.).
- `co_cartografia_profile`: Stores the full structured `profile_json` (the "brain" of the reading).
- `big5_oracular_registros`: Stores raw answers and averages.
- `auto_mapeamento`: User-facing map state.
- `client_city_state` / `client_live_map_state`: Professional-facing live map states.

## 2. Duplicate Tools & Overlaps

| Tool | Status | Findings |
| :--- | :--- | :--- |
| `Big5Simbolico.tsx` | **MERGE** | Separate 1-5 assessment for "Forces of the Soul". High overlap with the core Cartografia engine. |
| `CartografiaTorre.tsx` | **MERGE** | Focuses on defense families. Overlaps with the "Trait" and "Resource" territories of the new structure. |
| `VariacoesFerramentasPage.tsx` | **KEEP** | Uses Cartografia as a baseline but generates permutations. |
| `SaidaSimbolica` vs `LeituraRevelacao` | **MERGE** | Two ways of showing the same symbolic data to the user. |

## 3. Recommended Architecture: CARTOGRAFIA ESTRUTURAL ORÁCULA™

The tool will be refactored into a single **Premium Stepper Engine** organized by the **Six Territories**:

1.  **Symptom Territory**: Current discomforts and patterns.
2.  **Life History Territory**: Relational patterns and turning points.
3.  **Trait Territory**: Behavioral tendencies (replaces/integrates raw Big Five).
4.  **Belief Territory**: Core narratives and assumptions.
5.  **Resource Territory**: Strengths and symbolic supports.
6.  **Attention and Safety Territory**: (The renamed Risk Engine).

### Mode 1 — Subscriber (CidaDELA Interior)
- Personal symbolic journey.
- Output: Structured **Mapa Vivo** for self-reflection.

### Mode 2 — Professional (Casa das Máquinas)
- Case formulation support.
- Output: Technical **Mapa Vivo** with clinical reasoning notes.

## 4. UX & Technical Proposal

### UX Flow
- **Stepper**: One territory per step. Calm, premium UI.
- **Progressive Disclosure**: Micro-summaries after each territory.
- **Saving**: Robust "pause and return" logic using `co_cartografia_profile`.
- **Result**: A living dashboard (Mapa Vivo) instead of a static report.

### Data Model Update
- Extend `metadata_json` in `cartografia_psiquica` or create `cartografia_territorios` table to store qualitative data from the 6 territories.
- Ensure `client_live_map_state` is the primary target for Professional Mode output.

### Ethical & Access Rules
- **Access**: Strictly restricted to subscribers/professionals. No public entry.
- **Ethics**: Labels renamed to avoid clinical certainty. Mandatory disclaimer on all outputs. "Risk Engine" -> "Attention and Safety Layer".

## 5. Migration & Build Plan

### Phase 1: Engine Refactor (The Brain)
- [ ] Update `montarProfileJson.ts` to include the 6 territories logic.
- [ ] Rename "Risk" terminology to "Attention and Safety".
- [ ] Integrate Atlas Orácula language mapping into the engine.

### Phase 2: Professional Cleanup
- [ ] Deprecate `CartografiaPage.tsx` (the manual radar version).
- [ ] Standardize `CartografiaPsiquicaOracula.tsx` as the single CM component.

### Phase 3: The New Stepper (The Face)
- [ ] Refactor `CartografiaPsiquicaPage.tsx` into the 6-territory stepper.
- [ ] Implement progressive disclosure micro-summaries.
- [ ] Connect output to the new Mapa Vivo format.

### Phase 4: Integration & Labels
- [ ] Global search & replace for "Cartografia Psíquica" -> "Cartografia Estrutural Orácula" / "CidaDELA Interior".
- [ ] Clean up redundant routes and menu links.

---
**Decision**: PROCEED WITH REFACTOR.
**Build Priority**: HIGH.
