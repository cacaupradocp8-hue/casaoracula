
-- 1. club_books
CREATE TABLE public.club_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  autor TEXT,
  descricao TEXT,
  capa_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.club_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_books_select" ON public.club_books FOR SELECT TO authenticated USING (true);
CREATE POLICY "club_books_admin" ON public.club_books FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 2. club_cycles
CREATE TABLE public.club_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  book_id UUID REFERENCES public.club_books(id),
  portal TEXT,
  data_inicio DATE,
  data_fim DATE,
  data_encontro TIMESTAMPTZ,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.club_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_cycles_select" ON public.club_cycles FOR SELECT TO authenticated USING (true);
CREATE POLICY "club_cycles_admin" ON public.club_cycles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 3. club_user_cycles
CREATE TABLE public.club_user_cycles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_id UUID NOT NULL REFERENCES public.club_cycles(id) ON DELETE CASCADE,
  compromisso_semana TEXT,
  compromisso_concluido BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, cycle_id)
);
ALTER TABLE public.club_user_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_user_cycles_own" ON public.club_user_cycles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "club_user_cycles_admin" ON public.club_user_cycles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 4. club_cartography
CREATE TABLE public.club_cartography (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_id UUID NOT NULL REFERENCES public.club_cycles(id) ON DELETE CASCADE,
  torre_dominante TEXT,
  porta_ativa TEXT,
  labirinto_recorrente TEXT,
  arquetipos TEXT[] DEFAULT '{}',
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, cycle_id)
);
ALTER TABLE public.club_cartography ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_cartography_own" ON public.club_cartography FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "club_cartography_admin" ON public.club_cartography FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 5. club_reflections
CREATE TABLE public.club_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_id UUID NOT NULL REFERENCES public.club_cycles(id) ON DELETE CASCADE,
  onde_vejo_clientes TEXT,
  qual_arquetipo TEXT,
  qual_postura TEXT,
  proposta_intervencao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, cycle_id)
);
ALTER TABLE public.club_reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_reflections_own" ON public.club_reflections FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "club_reflections_admin" ON public.club_reflections FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 6. club_tools
CREATE TABLE public.club_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_id UUID NOT NULL REFERENCES public.club_cycles(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'pergunta_clinica',
  conteudo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.club_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_tools_own" ON public.club_tools FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "club_tools_admin" ON public.club_tools FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 7. club_meetings
CREATE TABLE public.club_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cycle_id UUID REFERENCES public.club_cycles(id) ON DELETE CASCADE,
  data TIMESTAMPTZ,
  portal TEXT,
  livro TEXT,
  roteiro_abertura TEXT,
  roteiro_compartilhamento TEXT,
  roteiro_dialogo TEXT,
  roteiro_integracao TEXT,
  roteiro_fechamento TEXT,
  realizado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.club_meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_meetings_select" ON public.club_meetings FOR SELECT TO authenticated USING (true);
CREATE POLICY "club_meetings_admin" ON public.club_meetings FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Triggers for updated_at
CREATE TRIGGER update_club_books_updated_at BEFORE UPDATE ON public.club_books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_club_cycles_updated_at BEFORE UPDATE ON public.club_cycles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_club_user_cycles_updated_at BEFORE UPDATE ON public.club_user_cycles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_club_cartography_updated_at BEFORE UPDATE ON public.club_cartography FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_club_reflections_updated_at BEFORE UPDATE ON public.club_reflections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_club_tools_updated_at BEFORE UPDATE ON public.club_tools FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_club_meetings_updated_at BEFORE UPDATE ON public.club_meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
