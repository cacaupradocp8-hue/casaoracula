
-- Table for storing 39-door emotional mapping results
CREATE TABLE public.labirinto_39_portas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL,
  portas_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  reflexao_abertas TEXT,
  reflexao_fechadas TEXT,
  reflexao_trancadas TEXT,
  reflexao_grupo_acessivel TEXT,
  reflexao_grupo_inacessivel TEXT,
  grupo_mais_acessivel TEXT,
  grupo_menos_acessivel TEXT,
  total_abertas INTEGER NOT NULL DEFAULT 0,
  total_fechadas INTEGER NOT NULL DEFAULT 0,
  total_trancadas INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.labirinto_39_portas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists manage own client mappings"
  ON public.labirinto_39_portas
  FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (therapist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE TRIGGER update_labirinto_39_portas_updated_at
  BEFORE UPDATE ON public.labirinto_39_portas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
