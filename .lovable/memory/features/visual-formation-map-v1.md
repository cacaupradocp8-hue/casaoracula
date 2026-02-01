# Memory: features/visual-formation-map-v1
Updated: just now

Mapa Visual da Formação: Sistema de visualização não-linear da progressão simbólica implementado como modal/drawer expansível com estética de Mandala/Labirinto. Estrutura principal:

**Componentes:**
- `FormationMapModal` - Modal principal com visualização e painel lateral
- `MandalaVisualization` - Renderização SVG em anéis concêntricos
- `NodeDetailPanel` - Detalhes do nodo selecionado com navegação
- `FormationMapTrigger` - Botão flutuante ou inline para abrir o modal

**Dados:**
- View `v_formation_progress` consolida travessias completadas/ativas e rituais por usuária
- Tabela `formation_map_nodes` define posicionamento visual (ring, angle) e textos simbólicos

**Regras de Design:**
- Sem percentuais ou barras de progresso
- Status: iluminado (ativo), velado (bloqueado), integrado (completo)
- Mensagens bloqueadas são simbólicas ("O portal permanece velado"), nunca técnicas
- Cores: gold (iluminado), purple (em travessia), muted (velado)

**Integração:** Botão flutuante presente em `PortalOraculaPage` e `CasaTecelaAtrio`.
