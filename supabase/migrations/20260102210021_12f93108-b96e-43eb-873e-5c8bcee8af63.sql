-- Tabela de matrículas (flexível para múltiplos cursos no futuro)
CREATE TABLE public.matriculas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  curso_id text NOT NULL DEFAULT 'formacao_oracula',
  ativa boolean NOT NULL DEFAULT true,
  data_inicio timestamp with time zone NOT NULL DEFAULT now(),
  data_fim timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, curso_id)
);

-- Enable RLS
ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own matriculas"
ON public.matriculas
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all matriculas"
ON public.matriculas
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Function to check if user is enrolled in a course
CREATE OR REPLACE FUNCTION public.is_matriculada(_user_id uuid, _curso_id text DEFAULT 'formacao_oracula')
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matriculas
    WHERE user_id = _user_id
      AND curso_id = _curso_id
      AND ativa = true
      AND (data_fim IS NULL OR data_fim > now())
  )
$$;

-- Trigger for updated_at
CREATE TRIGGER update_matriculas_updated_at
  BEFORE UPDATE ON public.matriculas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();