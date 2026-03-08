
CREATE TABLE public.circulos_sagrados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facilitadora_id uuid NOT NULL,
  nome_circulo text NOT NULL,
  ritual_base text NOT NULL,
  data_hora timestamptz NOT NULL,
  local_link text,
  participantes_ids uuid[] DEFAULT '{}',
  distritos_ativados text[] DEFAULT '{}',
  status_circulo text NOT NULL DEFAULT 'pendente',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.circulos_sagrados ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_circulos_sagrados_facilitadora ON public.circulos_sagrados(facilitadora_id);

-- Facilitadora can manage her own circles
CREATE POLICY "facilitadora_manage_own" ON public.circulos_sagrados
  FOR ALL TO authenticated
  USING (facilitadora_id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (facilitadora_id = auth.uid() OR public.is_admin(auth.uid()));

-- Clients can view circles they're invited to
CREATE POLICY "client_view_invited" ON public.circulos_sagrados
  FOR SELECT TO authenticated
  USING (auth.uid() = ANY(participantes_ids));

CREATE TRIGGER update_circulos_sagrados_updated_at
  BEFORE UPDATE ON public.circulos_sagrados
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
