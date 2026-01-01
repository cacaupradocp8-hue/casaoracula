-- Create enum for sala levels
CREATE TYPE public.nivel_sala AS ENUM ('NIVEL_0', 'NIVEL_1', 'NIVEL_2', 'NIVEL_3');

-- Create salas table
CREATE TABLE public.salas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nivel_minimo nivel_sala NOT NULL DEFAULT 'NIVEL_0',
  nome_exibicao TEXT NOT NULL,
  texto_entrada TEXT NOT NULL DEFAULT '',
  texto_bloqueio TEXT NOT NULL DEFAULT 'Esta sala ainda não está disponível para você. Continue sua jornada para desbloquear este conteúdo.',
  ativa BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.salas ENABLE ROW LEVEL SECURITY;

-- Function to map portal_type to nivel_sala hierarchy
CREATE OR REPLACE FUNCTION public.get_user_nivel_sala(_user_id uuid)
RETURNS nivel_sala
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT CASE get_user_portal(_user_id)
    WHEN 'visitante' THEN 'NIVEL_0'::nivel_sala
    WHEN 'pre_iniciada' THEN 'NIVEL_1'::nivel_sala
    WHEN 'iniciada' THEN 'NIVEL_2'::nivel_sala
    WHEN 'admin' THEN 'NIVEL_3'::nivel_sala
    ELSE 'NIVEL_0'::nivel_sala
  END
$$;

-- Function to check if user can access a sala
CREATE OR REPLACE FUNCTION public.can_access_sala(_user_id uuid, _nivel_minimo nivel_sala)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT CASE get_user_nivel_sala(_user_id)
    WHEN 'NIVEL_3' THEN true
    WHEN 'NIVEL_2' THEN _nivel_minimo IN ('NIVEL_0', 'NIVEL_1', 'NIVEL_2')
    WHEN 'NIVEL_1' THEN _nivel_minimo IN ('NIVEL_0', 'NIVEL_1')
    WHEN 'NIVEL_0' THEN _nivel_minimo = 'NIVEL_0'
    ELSE false
  END
$$;

-- RLS Policies
-- Anyone authenticated can view active salas
CREATE POLICY "Anyone can view active salas" 
ON public.salas 
FOR SELECT 
USING (ativa = true);

-- Admins can manage all salas
CREATE POLICY "Admins can manage all salas" 
ON public.salas 
FOR ALL 
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Trigger for updated_at
CREATE TRIGGER update_salas_updated_at
BEFORE UPDATE ON public.salas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default salas
INSERT INTO public.salas (nivel_minimo, nome_exibicao, texto_entrada, texto_bloqueio, ordem) VALUES
('NIVEL_0', 'Sala da Buscadora', 'Bem-vinda ao início da sua jornada. Aqui você encontrará os primeiros passos para explorar a Casa ORÁCULA.', 'Esta sala está disponível para todas as buscadoras.', 1),
('NIVEL_1', 'Sala da Pré-Iniciada', 'Você avançou na jornada. Esta sala contém ferramentas e práticas para aprofundar seu caminho.', 'Complete a etapa de Visitante para desbloquear esta sala.', 2),
('NIVEL_2', 'Sala da Iniciada', 'A sala das Iniciadas ORÁCULA oferece acesso completo às práticas avançadas e mentoria.', 'Complete as 4 Travessias para se tornar uma Iniciada e acessar esta sala.', 3),
('NIVEL_3', 'Sala da Guardiã', 'Espaço reservado às Guardiãs da Casa ORÁCULA para gestão e supervisão.', 'Esta sala é exclusiva para as Guardiãs da Casa.', 4);