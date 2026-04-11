
-- Drop old tables (cascade dependencies)
DROP TABLE IF EXISTS public.club_tools CASCADE;
DROP TABLE IF EXISTS public.club_reflections CASCADE;
DROP TABLE IF EXISTS public.club_cartography CASCADE;
DROP TABLE IF EXISTS public.club_user_cycles CASCADE;
DROP TABLE IF EXISTS public.club_meetings CASCADE;
DROP TABLE IF EXISTS public.club_cycles CASCADE;
DROP TABLE IF EXISTS public.club_books CASCADE;

-- 1. CICLOS DO CLUBE
CREATE TABLE public.club_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  portal TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.club_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_cycles_select" ON public.club_cycles FOR SELECT TO authenticated USING (true);
CREATE POLICY "club_cycles_admin" ON public.club_cycles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 2. LIVROS
CREATE TABLE public.club_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES public.club_cycles(id),
  title TEXT,
  author TEXT,
  cover_url TEXT,
  description TEXT
);
ALTER TABLE public.club_books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_books_select" ON public.club_books FOR SELECT TO authenticated USING (true);
CREATE POLICY "club_books_admin" ON public.club_books FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 3. USUÁRIO NO CICLO
CREATE TABLE public.club_user_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cycle_id UUID REFERENCES public.club_cycles(id),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.club_user_cycles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_user_cycles_own" ON public.club_user_cycles FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "club_user_cycles_admin" ON public.club_user_cycles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 4. CARTOGRAFIA
CREATE TABLE public.club_cartography (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cycle_id UUID,
  torre TEXT,
  porta TEXT,
  labirinto TEXT,
  arquetipos TEXT[],
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.club_cartography ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_cartography_own" ON public.club_cartography FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "club_cartography_admin" ON public.club_cartography FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 5. ESPELHO
CREATE TABLE public.club_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cycle_id UUID,
  campo_clientes TEXT,
  arquetipo TEXT,
  postura TEXT,
  intervencao TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.club_reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_reflections_own" ON public.club_reflections FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "club_reflections_admin" ON public.club_reflections FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 6. FORJA
CREATE TABLE public.club_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cycle_id UUID,
  tipo TEXT,
  conteudo TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.club_tools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_tools_own" ON public.club_tools FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "club_tools_admin" ON public.club_tools FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- 7. ENCONTROS
CREATE TABLE public.club_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_id UUID REFERENCES public.club_cycles(id),
  date TIMESTAMPTZ,
  roteiro JSONB,
  completed BOOLEAN DEFAULT false
);
ALTER TABLE public.club_meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "club_meetings_select" ON public.club_meetings FOR SELECT TO authenticated USING (true);
CREATE POLICY "club_meetings_admin" ON public.club_meetings FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
