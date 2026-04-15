
CREATE TABLE public.group_field_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.therapeutic_groups(id) ON DELETE CASCADE,
  circulo_id UUID REFERENCES public.circulos_sagrados(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'grupo',
  therapist_id UUID NOT NULL,
  estado_campo TEXT NOT NULL,
  direcao TEXT NOT NULL,
  risco TEXT NOT NULL DEFAULT 'baixo',
  tensao TEXT,
  padrao TEXT,
  pode_aprofundar BOOLEAN NOT NULL DEFAULT false,
  nivel_intervencao TEXT NOT NULL DEFAULT 'baixo',
  recomendacao TEXT,
  frase_simbolica TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_field_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapist can manage own snapshots"
  ON public.group_field_snapshots
  FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE INDEX idx_gfs_group ON public.group_field_snapshots(group_id, created_at DESC);
CREATE INDEX idx_gfs_circulo ON public.group_field_snapshots(circulo_id, created_at DESC);

-- Validation trigger for mode
CREATE OR REPLACE FUNCTION public.validate_gfs_mode()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = 'public' AS $$
BEGIN
  IF NEW.mode NOT IN ('grupo', 'circulo') THEN
    RAISE EXCEPTION 'mode must be grupo or circulo';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_gfs_mode
  BEFORE INSERT OR UPDATE ON public.group_field_snapshots
  FOR EACH ROW EXECUTE FUNCTION public.validate_gfs_mode();
