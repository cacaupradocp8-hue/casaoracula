
-- ============================================
-- CLIENT CIDADELA MAP: Symbolic journey data per client
-- ============================================
CREATE TABLE public.client_cidadela_map (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  distrito_atual TEXT DEFAULT NULL,
  torres_identificadas TEXT[] DEFAULT '{}',
  portas_cruzadas TEXT[] DEFAULT '{}',
  arquetipos_emergentes TEXT[] DEFAULT '{}',
  labirintos_visitados TEXT[] DEFAULT '{}',
  ferramentas_utilizadas TEXT[] DEFAULT '{}',
  historico_sessoes JSONB DEFAULT '[]'::jsonb,
  ultima_sessao TIMESTAMPTZ DEFAULT NULL,
  insights_ia JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, therapist_id)
);

ALTER TABLE public.client_cidadela_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can view their client maps"
  ON public.client_cidadela_map FOR SELECT
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Therapists can insert client maps"
  ON public.client_cidadela_map FOR INSERT
  TO authenticated
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Therapists can update their client maps"
  ON public.client_cidadela_map FOR UPDATE
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Therapists can delete their client maps"
  ON public.client_cidadela_map FOR DELETE
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER update_client_cidadela_map_updated_at
  BEFORE UPDATE ON public.client_cidadela_map
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_client_cidadela_map_client ON public.client_cidadela_map(client_id);
CREATE INDEX idx_client_cidadela_map_therapist ON public.client_cidadela_map(therapist_id);

CREATE OR REPLACE FUNCTION public.update_cidadela_from_session(
  _client_id UUID,
  _therapist_id UUID,
  _distrito TEXT DEFAULT NULL,
  _torre TEXT DEFAULT NULL,
  _porta TEXT DEFAULT NULL,
  _arquetipo TEXT DEFAULT NULL,
  _labirinto TEXT DEFAULT NULL,
  _ferramenta TEXT DEFAULT NULL,
  _insight TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.client_cidadela_map (client_id, therapist_id, distrito_atual, ultima_sessao)
  VALUES (_client_id, _therapist_id, _distrito, now())
  ON CONFLICT (client_id, therapist_id) DO UPDATE SET
    distrito_atual = COALESCE(_distrito, client_cidadela_map.distrito_atual),
    torres_identificadas = CASE 
      WHEN _torre IS NOT NULL AND NOT (_torre = ANY(client_cidadela_map.torres_identificadas))
      THEN array_append(client_cidadela_map.torres_identificadas, _torre)
      ELSE client_cidadela_map.torres_identificadas
    END,
    portas_cruzadas = CASE 
      WHEN _porta IS NOT NULL AND NOT (_porta = ANY(client_cidadela_map.portas_cruzadas))
      THEN array_append(client_cidadela_map.portas_cruzadas, _porta)
      ELSE client_cidadela_map.portas_cruzadas
    END,
    arquetipos_emergentes = CASE 
      WHEN _arquetipo IS NOT NULL AND NOT (_arquetipo = ANY(client_cidadela_map.arquetipos_emergentes))
      THEN array_append(client_cidadela_map.arquetipos_emergentes, _arquetipo)
      ELSE client_cidadela_map.arquetipos_emergentes
    END,
    labirintos_visitados = CASE 
      WHEN _labirinto IS NOT NULL AND NOT (_labirinto = ANY(client_cidadela_map.labirintos_visitados))
      THEN array_append(client_cidadela_map.labirintos_visitados, _labirinto)
      ELSE client_cidadela_map.labirintos_visitados
    END,
    ferramentas_utilizadas = CASE 
      WHEN _ferramenta IS NOT NULL AND NOT (_ferramenta = ANY(client_cidadela_map.ferramentas_utilizadas))
      THEN array_append(client_cidadela_map.ferramentas_utilizadas, _ferramenta)
      ELSE client_cidadela_map.ferramentas_utilizadas
    END,
    insights_ia = CASE 
      WHEN _insight IS NOT NULL 
      THEN client_cidadela_map.insights_ia || jsonb_build_object('text', _insight, 'at', now()::text)
      ELSE client_cidadela_map.insights_ia
    END,
    ultima_sessao = now();
END;
$$;
