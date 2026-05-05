## Plano de Correção e Auditoria — Débito Técnico de Tabelas Sobrepostas

### Mudança de regra confirmada
- **Big5 OCEAN permanece ATIVO** (`big5_oracular_*` e `big5_*` em uso pelas alunas).
- Removida a regra ética que bania Big5/diagnóstico acadêmico — Big5 é ferramenta formativa permitida.
- A memória `mem://business/product-constraints-negative` será atualizada para refletir: **apenas Eneagrama permanece banido**; Big5 é aceito.

---

### Fase 1 — Auditoria de Dependências (read-only)
Antes de qualquer alteração destrutiva, mapear o que ainda referencia as tabelas suspeitas:

1. **Clube legado (`club_*` sem prefixo `clube_`)**
   - Buscar imports/queries em `src/`, `supabase/functions/`, hooks, DAL.
   - Listar quais views/triggers do Postgres ainda apontam para essas tabelas.

2. **Cartografia sobreposta**
   - `cartographies`, `cartografia_psiquica`, `cartografia_complexos`, `co_cartografia_profile`.
   - Confirmar que `co_cartografia_profile` é canônica (memória aponta).
   - Mapear leituras/escritas das outras 3 no código.

3. **Big5 — separar legado acadêmico vs. ativo**
   - **MANTER**: `big5_oracular_fatores`, `big5_oracular_perguntas`, `big5_oracular_registros`, `big5_symbolic_*`, `big5_funcional_*`.
   - Auditar apenas: `big5_registros` e `big5_dimensoes` (versão antiga genérica) — verificar se algum hook/edge function ainda escreve nelas.
   - Se houver dependência viva, **NÃO depreciar**; apenas documentar.

4. **Tabelas largas (`clube_portais` 52 cols, `clube_livro_ciclos` 46 cols)**
   - Listar colunas realmente usadas vs. mortas via `rg` em todo o frontend.

**Entregável da Fase 1:** relatório markdown em `/mnt/documents/auditoria-debito-tecnico.md` com tabela: `tabela | refs no código | refs em DB (views/triggers/FKs) | recomendação`.

---

### Fase 2 — Isolamento Seguro (migration reversível)
Para cada tabela confirmada como **órfã** (zero referências):

1. **Renomear** com prefixo `_deprecated_` (não dropar):
   ```sql
   ALTER TABLE public.club_old RENAME TO _deprecated_club_old;
   ```
2. **Revogar grants** públicos e do role `authenticated`.
3. **Manter RLS** ativa para evitar leitura acidental.
4. **Adicionar comentário** SQL: `COMMENT ON TABLE ... IS 'Deprecated YYYY-MM-DD — pending drop after 30d observation.'`.

Tabelas candidatas (a confirmar na Fase 1):
- `club_*` (geração 1 do Clube), se não houver refs.
- `cartographies`, `cartografia_psiquica` (se sobrepostas a `co_cartografia_profile`).
- `big5_registros`/`big5_dimensoes` **somente** se sem refs (Big5 OCEAN das alunas usa `big5_oracular_*`, não essas).

---

### Fase 3 — Consolidação da Cartografia
- Confirmar `co_cartografia_profile` como canônica (já está na memória).
- Migrar dados úteis de `cartografia_complexos` para JSONB dentro de `co_cartografia_profile.complexos` (se houver dados).
- Adicionar VIEW de compatibilidade `cartografia_complexos_v` apontando para o JSONB (evita quebrar o componente `TelaSintese.tsx`).

---

### Fase 4 — Normalização de Tabelas Largas (opcional, fase futura)
- `clube_portais` (52 cols) → propor extração de blocos em `clube_portal_blocks` (já existe `clube_portais_blocos`?).
- `clube_livro_ciclos` (46 cols) → extrair metadata sazonal para `clube_livro_ciclos_meta`.
- **NÃO executar agora** — apenas documentar débito.

---

### Fase 5 — Atualização de Memória do Projeto
- `mem://business/product-constraints-negative`: remover Big5 da lista de banidos; manter apenas Eneagrama.
- `mem://index.md` (Core): substituir "Big Five e Eneagrama são BANIDOS" por "Eneagrama é BANIDO. Big5 OCEAN é permitido como ferramenta formativa simbólica."
- Criar `mem://architecture/deprecated-tables-registry` listando o que foi renomeado e quando dropar.

---

### Detalhes Técnicos (para devs)

**Comandos de auditoria que rodarei:**
```bash
rg -l "from\(['\"]club_" src/ supabase/functions/
rg -l "cartograph(ies|ia_psiquica|ia_complexos)" src/ supabase/functions/
rg -l "big5_registros|big5_dimensoes" src/ supabase/functions/
```

**SQL de inspeção (via supabase--read_query):**
- `pg_views` que referenciam tabelas alvo.
- `pg_trigger` ligados a essas tabelas.
- `information_schema.referential_constraints` para FKs.

**Reversão:** todo `RENAME TO _deprecated_*` é trivialmente reversível com `RENAME TO` reverso. Nenhum DROP nesta fase.

---

### O que NÃO será tocado
- `big5_oracular_*` (ferramenta ativa das alunas) — preservada integralmente.
- `big5_symbolic_*`, `big5_funcional_*` — preservadas.
- Componentes `Big5InterpretacaoCard`, `Big5TemplateEditor`, hook `useBig5Oracular` — preservados.
- Rotas e páginas existentes (regra `preservation-first`).

---

### Próximo passo após aprovação
Executar Fase 1 (auditoria read-only) e entregar o relatório antes de qualquer migration.
