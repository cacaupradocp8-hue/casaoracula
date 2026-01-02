-- Create junction table for Portal-Sala relationship
CREATE TABLE public.portal_salas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portal_type portal_type NOT NULL,
  sala_id UUID NOT NULL REFERENCES public.salas(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(portal_type, sala_id)
);

-- Enable RLS
ALTER TABLE public.portal_salas ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage portal_salas"
  ON public.portal_salas FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Anyone can view portal_salas"
  ON public.portal_salas FOR SELECT
  USING (true);