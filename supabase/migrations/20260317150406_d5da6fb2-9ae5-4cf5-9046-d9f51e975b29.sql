
-- 1. client_city_state: estado atual do cliente na CidaDELA
CREATE TABLE IF NOT EXISTS public.client_city_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  distrito_ativo TEXT,
  distrito_id UUID REFERENCES public.city_districts(id) ON DELETE SET NULL,
  arquetipo_ativo UUID REFERENCES public.founding_archetypes(id) ON DELETE SET NULL,
  ultima_ferramenta_id UUID REFERENCES public.tools(id) ON DELETE SET NULL,
  ultima_sessao_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(client_id)
);

ALTER TABLE public.client_city_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read client_city_state"
  ON public.client_city_state FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin manage client_city_state"
  ON public.client_city_state FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 2. ai_recommendations: sugestões geradas pelo sistema
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL DEFAULT 'proximo_passo',
  titulo TEXT,
  descricao TEXT,
  tool_sugerida_id UUID REFERENCES public.tools(id) ON DELETE SET NULL,
  distrito_sugerido_id UUID REFERENCES public.city_districts(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read ai_recommendations"
  ON public.ai_recommendations FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin manage ai_recommendations"
  ON public.ai_recommendations FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 3. Function: atualizar estado da CidaDELA após uso de ferramenta
CREATE OR REPLACE FUNCTION public.update_cidadela_on_tool_usage(
  _session_id UUID,
  _tool_id UUID,
  _arquetipo_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _client_id UUID;
  _district_id UUID;
  _district_nome TEXT;
  _proximo_passo_id UUID;
  _proximo_passo_nome TEXT;
  _result JSONB;
BEGIN
  -- 1. Identificar client_id pela sessão
  SELECT client_id INTO _client_id FROM sessions WHERE id = _session_id;
  IF _client_id IS NULL THEN
    RETURN jsonb_build_object('error', 'Sessão não encontrada');
  END IF;

  -- 2. Buscar distrito principal da ferramenta
  SELECT td.district_id, d.nome
  INTO _district_id, _district_nome
  FROM tool_districts td
  JOIN city_districts d ON d.id = td.district_id
  WHERE td.tool_id = _tool_id AND td.tipo = 'principal'
  LIMIT 1;

  -- 3. Upsert client_city_state
  INSERT INTO client_city_state (client_id, distrito_ativo, distrito_id, ultima_ferramenta_id, ultima_sessao_id, arquetipo_ativo)
  VALUES (_client_id, _district_nome, _district_id, _tool_id, _session_id, _arquetipo_id)
  ON CONFLICT (client_id) DO UPDATE SET
    distrito_ativo = COALESCE(_district_nome, client_city_state.distrito_ativo),
    distrito_id = COALESCE(_district_id, client_city_state.distrito_id),
    ultima_ferramenta_id = _tool_id,
    ultima_sessao_id = _session_id,
    arquetipo_ativo = COALESCE(_arquetipo_id, client_city_state.arquetipo_ativo),
    updated_at = now();

  -- 4. Registrar evento em co_city_history
  INSERT INTO co_city_history (client_id, session_id, tool_id, evento, distrito, detalhe)
  VALUES (_client_id, _session_id, _tool_id, 'ferramenta_utilizada', _district_nome,
    'Ferramenta aplicada na sessão');

  -- 5. Atualizar arquétipo se fornecido
  IF _arquetipo_id IS NOT NULL THEN
    UPDATE client_archetype_state
    SET arquitipo_regente_id = _arquetipo_id, updated_at = now()
    WHERE client_id = _client_id;
  END IF;

  -- 6. Buscar próximo passo
  SELECT t2.id, t2.nome
  INTO _proximo_passo_id, _proximo_passo_nome
  FROM tools t
  JOIN tools t2 ON t2.id = t.proximo_passo_id
  WHERE t.id = _tool_id AND t.proximo_passo_id IS NOT NULL;

  -- 7. Criar sugestão se houver próximo passo
  IF _proximo_passo_id IS NOT NULL THEN
    INSERT INTO ai_recommendations (client_id, session_id, tipo, titulo, descricao, tool_sugerida_id, distrito_sugerido_id)
    SELECT _client_id, _session_id, 'proximo_passo',
      'Próximo passo sugerido: ' || _proximo_passo_nome,
      'Baseado no fluxo metodológico após uso da ferramenta',
      _proximo_passo_id,
      td2.district_id
    FROM tool_districts td2
    WHERE td2.tool_id = _proximo_passo_id AND td2.tipo = 'principal'
    LIMIT 1;
  END IF;

  _result := jsonb_build_object(
    'client_id', _client_id,
    'distrito', _district_nome,
    'proximo_passo', _proximo_passo_nome,
    'arquetipo_atualizado', _arquetipo_id IS NOT NULL
  );

  RETURN _result;
END;
$$;
