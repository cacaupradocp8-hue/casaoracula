
-- Tramas (monthly themed threads)
CREATE TABLE public.tecela_tramas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  district_id TEXT,
  objective TEXT,
  prompt TEXT,
  month TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Casos-Espelho (anonymized case library)
CREATE TABLE public.tecela_casos_espelho (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  contexto_anonimizado TEXT NOT NULL,
  demanda_simbolica TEXT NOT NULL,
  leitura_oracula TEXT,
  erro_evitar TEXT,
  resultado TEXT,
  alerta_etico TEXT DEFAULT 'Este caso foi anonimizado. Qualquer semelhança é coincidência.',
  district_id TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aprovado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Intervenções colaborativas (extends existing interventions concept)
CREATE TABLE public.tecela_intervencoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL DEFAULT 'intervencao_simbolica',
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  district_id TEXT,
  tags TEXT[] DEFAULT '{}',
  nivel TEXT NOT NULL DEFAULT 'basico',
  contraindicacoes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aprovado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comentários (polimórfico: trama, caso, intervenção)
CREATE TABLE public.tecela_comentarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ref_type TEXT NOT NULL, -- 'trama' | 'caso' | 'intervencao'
  ref_id UUID NOT NULL,
  conteudo TEXT NOT NULL,
  autor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Favoritos (polimórfico)
CREATE TABLE public.tecela_favoritos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ref_type TEXT NOT NULL, -- 'caso' | 'intervencao'
  ref_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(ref_type, ref_id, user_id)
);

-- Supervisão eventos
CREATE TABLE public.tecela_supervisoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tema TEXT,
  data_evento TIMESTAMPTZ NOT NULL,
  link_ao_vivo TEXT,
  link_replay TEXT,
  caso_id UUID REFERENCES public.tecela_casos_espelho(id),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'agendada',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.tecela_tramas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecela_casos_espelho ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecela_intervencoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecela_comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecela_favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecela_supervisoes ENABLE ROW LEVEL SECURITY;

-- Tramas: authenticated can read, oracula+ can create
CREATE POLICY "Read tramas" ON public.tecela_tramas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Create tramas" ON public.tecela_tramas FOR INSERT TO authenticated
  WITH CHECK (public.has_portal_access(auth.uid(), 'oracula'));
CREATE POLICY "Update own tramas" ON public.tecela_tramas FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.is_admin(auth.uid()));
CREATE POLICY "Delete tramas admin" ON public.tecela_tramas FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- Casos: read approved or own; create oracula+
CREATE POLICY "Read casos" ON public.tecela_casos_espelho FOR SELECT TO authenticated
  USING (aprovado = true OR auth.uid() = created_by OR public.is_admin(auth.uid()));
CREATE POLICY "Create casos" ON public.tecela_casos_espelho FOR INSERT TO authenticated
  WITH CHECK (public.has_portal_access(auth.uid(), 'oracula'));
CREATE POLICY "Update own casos" ON public.tecela_casos_espelho FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.is_admin(auth.uid()));

-- Intervenções: read approved or own; create oracula+
CREATE POLICY "Read intervencoes" ON public.tecela_intervencoes FOR SELECT TO authenticated
  USING (aprovado = true OR auth.uid() = created_by OR public.is_admin(auth.uid()));
CREATE POLICY "Create intervencoes" ON public.tecela_intervencoes FOR INSERT TO authenticated
  WITH CHECK (public.has_portal_access(auth.uid(), 'oracula'));
CREATE POLICY "Update own intervencoes" ON public.tecela_intervencoes FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.is_admin(auth.uid()));

-- Comentários: read all, create authenticated
CREATE POLICY "Read comentarios" ON public.tecela_comentarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "Create comentarios" ON public.tecela_comentarios FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = autor_id);
CREATE POLICY "Delete own comentarios" ON public.tecela_comentarios FOR DELETE TO authenticated
  USING (auth.uid() = autor_id OR public.is_admin(auth.uid()));

-- Favoritos: own only
CREATE POLICY "Read own favoritos" ON public.tecela_favoritos FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Create favoritos" ON public.tecela_favoritos FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Delete own favoritos" ON public.tecela_favoritos FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Supervisões: read all, create admin/mentora
CREATE POLICY "Read supervisoes" ON public.tecela_supervisoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Create supervisoes" ON public.tecela_supervisoes FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Update supervisoes" ON public.tecela_supervisoes FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));
