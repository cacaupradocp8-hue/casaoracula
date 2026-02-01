-- ================================================
-- MAPA VISUAL DA FORMAÇÃO - INFRAESTRUTURA
-- ================================================

-- View para progresso consolidado da formação
CREATE OR REPLACE VIEW public.v_formation_progress AS
WITH user_aula_completed AS (
  SELECT 
    uap.user_id,
    uap.aula_id,
    ca.titulo AS aula_titulo,
    ca.ordem AS aula_ordem,
    ca.travessia_id,
    ct.titulo AS travessia_titulo,
    ct.ordem AS travessia_ordem,
    ct.sala_id,
    uap.completed_at
  FROM public.user_aula_progress uap
  LEFT JOIN public.conteudo_aulas ca ON ca.id = uap.aula_id
  LEFT JOIN public.conteudo_travessias ct ON ct.id = ca.travessia_id
),
user_travessia_status AS (
  SELECT 
    uac.user_id,
    uac.travessia_id,
    uac.travessia_titulo,
    uac.travessia_ordem,
    uac.sala_id,
    COUNT(uac.aula_id) AS aulas_completed,
    (SELECT COUNT(*) FROM public.conteudo_aulas WHERE travessia_id = uac.travessia_id AND publicado = true) AS total_aulas,
    MAX(uac.completed_at) AS last_activity
  FROM user_aula_completed uac
  WHERE uac.travessia_id IS NOT NULL
  GROUP BY uac.user_id, uac.travessia_id, uac.travessia_titulo, uac.travessia_ordem, uac.sala_id
),
user_ritual_status AS (
  SELECT 
    rp.user_id,
    rp.ritual_id,
    rd.nome AS ritual_nome,
    rd.tipo,
    rd.trigger_event,
    rd.trigger_context_type,
    rd.trigger_context_id,
    rp.status AS ritual_status,
    rp.completed_at AS ritual_completed_at
  FROM public.ritual_passages rp
  LEFT JOIN public.ritual_definitions rd ON rd.id = rp.ritual_id
)
SELECT 
  p.id AS user_id,
  p.portal AS current_portal,
  p.nome AS nome_exibicao,
  p.role,
  p.created_at AS joined_at,
  
  -- Travessias completadas (todas aulas feitas)
  (SELECT COALESCE(json_agg(json_build_object(
    'id', uts.travessia_id,
    'titulo', uts.travessia_titulo,
    'ordem', uts.travessia_ordem,
    'sala_id', uts.sala_id,
    'completed_at', uts.last_activity
  )), '[]'::json)
  FROM user_travessia_status uts 
  WHERE uts.user_id = p.id AND uts.aulas_completed = uts.total_aulas AND uts.total_aulas > 0) AS completed_travessias,
  
  -- Travessias em progresso (algumas aulas feitas)
  (SELECT COALESCE(json_agg(json_build_object(
    'id', uts.travessia_id,
    'titulo', uts.travessia_titulo,
    'ordem', uts.travessia_ordem,
    'sala_id', uts.sala_id,
    'aulas_done', uts.aulas_completed,
    'aulas_total', uts.total_aulas
  )), '[]'::json)
  FROM user_travessia_status uts 
  WHERE uts.user_id = p.id AND uts.aulas_completed < uts.total_aulas AND uts.aulas_completed > 0) AS active_travessias,
  
  -- Rituais completados
  (SELECT COALESCE(json_agg(json_build_object(
    'id', urs.ritual_id,
    'nome', urs.ritual_nome,
    'tipo', urs.tipo,
    'context', urs.trigger_context_id,
    'completed_at', urs.ritual_completed_at
  )), '[]'::json)
  FROM user_ritual_status urs 
  WHERE urs.user_id = p.id AND urs.ritual_status = 'completed') AS completed_rituals

FROM public.profiles p
WHERE p.id IS NOT NULL;

-- Comentário
COMMENT ON VIEW public.v_formation_progress IS 
'View consolidada do progresso de formação por usuária. Agrega travessias, rituais e aulas.';

-- ================================================
-- TABELA DE NODOS DO MAPA (para posicionamento visual)
-- ================================================
CREATE TABLE IF NOT EXISTS public.formation_map_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type TEXT NOT NULL CHECK (node_type IN ('sala', 'portal', 'travessia', 'ritual')),
  reference_id UUID,
  label TEXT NOT NULL,
  description_locked TEXT,
  description_unlocked TEXT,
  position_ring INTEGER DEFAULT 1,
  position_angle DECIMAL DEFAULT 0,
  icon TEXT,
  color TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_formation_map_nodes_type ON public.formation_map_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_formation_map_nodes_reference ON public.formation_map_nodes(reference_id);

-- RLS
ALTER TABLE public.formation_map_nodes ENABLE ROW LEVEL SECURITY;

-- Todos podem ler nodos ativos
CREATE POLICY "Anyone can read active formation map nodes"
  ON public.formation_map_nodes FOR SELECT
  USING (ativo = true);

-- Admin pode gerenciar tudo
CREATE POLICY "Admin can manage formation map nodes"
  ON public.formation_map_nodes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger para updated_at
CREATE TRIGGER update_formation_map_nodes_updated_at
  BEFORE UPDATE ON public.formation_map_nodes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.formation_map_nodes IS 
'Nodos do mapa visual de formação. Define posicionamento e textos para cada elemento do labirinto.';