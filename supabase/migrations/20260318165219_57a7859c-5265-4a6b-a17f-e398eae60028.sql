CREATE TABLE cartographer_training_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT,
  descricao TEXT,
  distrito_correto TEXT,
  ferramenta_correta TEXT,
  pergunta_correta TEXT,
  nivel TEXT DEFAULT 'iniciante',
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE cartographer_training_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_training_cases" ON public.cartographer_training_cases
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));