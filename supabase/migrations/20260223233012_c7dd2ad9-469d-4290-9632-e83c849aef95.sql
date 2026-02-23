
-- Station progress per user
CREATE TABLE public.station_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  station_id UUID NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'latente' CHECK (status IN ('latente', 'em_travessia', 'integrado')),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, station_id)
);

-- Portal progress per user
CREATE TABLE public.portal_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  portal_id UUID NOT NULL REFERENCES public.clube_portais(id) ON DELETE CASCADE,
  state TEXT NOT NULL DEFAULT 'nao_iniciado' CHECK (state IN ('nao_iniciado', 'em_andamento', 'integrado')),
  last_position INTEGER DEFAULT 0,
  has_minimum_record BOOLEAN NOT NULL DEFAULT false,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, portal_id)
);

-- Enable RLS
ALTER TABLE public.station_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_progress ENABLE ROW LEVEL SECURITY;

-- Station progress policies
CREATE POLICY "Users read own station progress"
  ON public.station_progress FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users insert own station progress"
  ON public.station_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own station progress"
  ON public.station_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Portal progress policies
CREATE POLICY "Users read own portal progress"
  ON public.portal_progress FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users insert own portal progress"
  ON public.portal_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own portal progress"
  ON public.portal_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_station_progress_updated_at
  BEFORE UPDATE ON public.station_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portal_progress_updated_at
  BEFORE UPDATE ON public.portal_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
