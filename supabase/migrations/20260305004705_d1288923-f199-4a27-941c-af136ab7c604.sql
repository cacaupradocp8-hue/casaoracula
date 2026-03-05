
CREATE TABLE public.district_state_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  changed_by_user_id UUID NOT NULL,
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.district_state_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can view their client state changes"
  ON public.district_state_changes FOR SELECT TO authenticated
  USING (
    public.is_admin(auth.uid())
    OR client_id IN (SELECT id FROM public.clientes WHERE terapeuta_id = auth.uid())
  );

CREATE POLICY "Therapists can insert state changes for their clients"
  ON public.district_state_changes FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin(auth.uid())
    OR client_id IN (SELECT id FROM public.clientes WHERE terapeuta_id = auth.uid())
  );
