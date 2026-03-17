
CREATE TABLE IF NOT EXISTS public.tool_districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  district_id UUID NOT NULL REFERENCES public.city_districts(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'principal',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tool_id, district_id)
);

ALTER TABLE public.tool_districts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read tool_districts" ON public.tool_districts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage tool_districts" ON public.tool_districts FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
