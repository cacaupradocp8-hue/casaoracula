
-- Registros de Campo (symbolic field records, replaces "posts")
CREATE TABLE public.tecela_registros_campo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo_simbolico TEXT NOT NULL,
  texto TEXT NOT NULL,
  torre_ativa TEXT,
  porta_ativa TEXT,
  arquetipo_presente TEXT,
  estado_campo TEXT NOT NULL DEFAULT 'travessia' CHECK (estado_campo IN ('retencao', 'travessia', 'emergencia')),
  visivel BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ressonâncias (replaces likes - symbolic resonance)
CREATE TABLE public.tecela_ressonancias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registro_id UUID NOT NULL REFERENCES public.tecela_registros_campo(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(registro_id, user_id)
);

-- Conselho das Tecelãs (professional exchange)
CREATE TABLE public.tecela_conselho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  situacao TEXT NOT NULL,
  territorio_cidadela TEXT,
  torre_envolvida TEXT,
  pergunta_facilitadora TEXT NOT NULL,
  visivel BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Respostas do Conselho
CREATE TABLE public.tecela_conselho_respostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conselho_id UUID NOT NULL REFERENCES public.tecela_conselho(id) ON DELETE CASCADE,
  autor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Mensagens do Dia (oracular daily messages - admin only)
CREATE TABLE public.tecela_mensagens_dia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mensagem TEXT NOT NULL,
  data_exibicao DATE NOT NULL DEFAULT CURRENT_DATE,
  ativa BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.tecela_registros_campo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecela_ressonancias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecela_conselho ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecela_conselho_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tecela_mensagens_dia ENABLE ROW LEVEL SECURITY;

-- Registros de Campo: authenticated users can read visible, authors can insert/update own
CREATE POLICY "read_registros_campo" ON public.tecela_registros_campo
  FOR SELECT TO authenticated USING (visivel = true OR autor_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "insert_registros_campo" ON public.tecela_registros_campo
  FOR INSERT TO authenticated WITH CHECK (autor_id = auth.uid());

CREATE POLICY "update_own_registros_campo" ON public.tecela_registros_campo
  FOR UPDATE TO authenticated USING (autor_id = auth.uid() OR public.is_admin(auth.uid()));

-- Ressonâncias: authenticated read all, insert/delete own
CREATE POLICY "read_ressonancias" ON public.tecela_ressonancias
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "insert_ressonancias" ON public.tecela_ressonancias
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_own_ressonancias" ON public.tecela_ressonancias
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Conselho: same pattern
CREATE POLICY "read_conselho" ON public.tecela_conselho
  FOR SELECT TO authenticated USING (visivel = true OR autor_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "insert_conselho" ON public.tecela_conselho
  FOR INSERT TO authenticated WITH CHECK (autor_id = auth.uid());

CREATE POLICY "read_conselho_respostas" ON public.tecela_conselho_respostas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "insert_conselho_respostas" ON public.tecela_conselho_respostas
  FOR INSERT TO authenticated WITH CHECK (autor_id = auth.uid());

-- Mensagens do dia: everyone reads, admin writes
CREATE POLICY "read_mensagens_dia" ON public.tecela_mensagens_dia
  FOR SELECT TO authenticated USING (ativa = true OR public.is_admin(auth.uid()));

CREATE POLICY "admin_manage_mensagens_dia" ON public.tecela_mensagens_dia
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
