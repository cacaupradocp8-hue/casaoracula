
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS voz_primaria TEXT,
  ADD COLUMN IF NOT EXISTS voz_apoio TEXT,
  ADD COLUMN IF NOT EXISTS voz_ativa TEXT;

-- Table for voice history/evolution tracking
CREATE TABLE IF NOT EXISTS public.voz_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  voz_primaria TEXT,
  voz_apoio TEXT,
  quiz_response_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.voz_historico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own voz history" ON public.voz_historico
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can insert own voz history" ON public.voz_historico
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins full access voz_historico" ON public.voz_historico
  FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
