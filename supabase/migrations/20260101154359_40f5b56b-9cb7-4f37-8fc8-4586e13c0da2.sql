-- 1) Criar tabela terapeuta_clientes para vínculo terapeuta↔cliente
CREATE TABLE public.terapeuta_clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  terapeuta_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(terapeuta_id, cliente_id)
);

-- Enable RLS
ALTER TABLE public.terapeuta_clientes ENABLE ROW LEVEL SECURITY;

-- 2) Função helper para verificar se é terapeuta de um cliente
CREATE OR REPLACE FUNCTION public.is_terapeuta_of_cliente(_terapeuta_id UUID, _cliente_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.terapeuta_clientes
    WHERE terapeuta_id = _terapeuta_id
      AND cliente_id = _cliente_id
      AND ativo = true
  )
$$;

-- 3) RLS Policies para terapeuta_clientes
-- Admin pode tudo
CREATE POLICY "Admins can manage terapeuta_clientes"
ON public.terapeuta_clientes
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Terapeuta pode SELECT apenas seus vínculos
CREATE POLICY "Terapeutas can view own vinculo"
ON public.terapeuta_clientes
FOR SELECT
USING (auth.uid() = terapeuta_id);

-- Cliente pode SELECT apenas seus vínculos
CREATE POLICY "Clientes can view own vinculo"
ON public.terapeuta_clientes
FOR SELECT
USING (auth.uid() = cliente_id);

-- 4) Atualizar big5_registros: renomear therapist_id -> terapeuta_id e adicionar cliente_id
ALTER TABLE public.big5_registros RENAME COLUMN therapist_id TO terapeuta_id;
ALTER TABLE public.big5_registros ADD COLUMN cliente_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 5) Atualizar eneagrama_registros: adicionar terapeuta_id e cliente_id
ALTER TABLE public.eneagrama_registros ADD COLUMN terapeuta_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.eneagrama_registros ADD COLUMN cliente_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 6) Drop old RLS policies on big5_registros that allow self-assignment
DROP POLICY IF EXISTS "Users can manage own Big5 records" ON public.big5_registros;
DROP POLICY IF EXISTS "Therapists can manage client Big5 records" ON public.big5_registros;
DROP POLICY IF EXISTS "Admins can view all Big5 records" ON public.big5_registros;

-- 7) New RLS policies for big5_registros
-- Admin pode tudo
CREATE POLICY "Admins can manage all Big5 records"
ON public.big5_registros
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Usuários podem criar registros APENAS para si mesmos (autoavaliação) - user_id = auth.uid() e terapeuta_id = NULL
CREATE POLICY "Users can create self assessment"
ON public.big5_registros
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND terapeuta_id IS NULL 
  AND cliente_id IS NULL
);

-- Usuários podem ver seus próprios registros (onde são user_id OU cliente_id)
CREATE POLICY "Users can view own Big5 records"
ON public.big5_registros
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = cliente_id);

-- Terapeutas podem criar registros para clientes vinculados
CREATE POLICY "Terapeutas can create client Big5 records"
ON public.big5_registros
FOR INSERT
WITH CHECK (
  auth.uid() = terapeuta_id
  AND cliente_id IS NOT NULL
  AND is_terapeuta_of_cliente(auth.uid(), cliente_id)
);

-- Terapeutas podem ver registros de seus clientes
CREATE POLICY "Terapeutas can view client Big5 records"
ON public.big5_registros
FOR SELECT
USING (
  auth.uid() = terapeuta_id
  OR is_terapeuta_of_cliente(auth.uid(), cliente_id)
);

-- Terapeutas podem atualizar registros que criaram
CREATE POLICY "Terapeutas can update own created Big5 records"
ON public.big5_registros
FOR UPDATE
USING (auth.uid() = terapeuta_id);

-- 8) Drop old RLS policies on eneagrama_registros
DROP POLICY IF EXISTS "Users can manage own Enneagram records" ON public.eneagrama_registros;
DROP POLICY IF EXISTS "Admins can view all Enneagram records" ON public.eneagrama_registros;

-- 9) New RLS policies for eneagrama_registros
-- Admin pode tudo
CREATE POLICY "Admins can manage all Eneagrama records"
ON public.eneagrama_registros
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Usuários podem criar autoavaliação
CREATE POLICY "Users can create self Eneagrama assessment"
ON public.eneagrama_registros
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND terapeuta_id IS NULL 
  AND cliente_id IS NULL
);

-- Usuários podem ver seus próprios registros
CREATE POLICY "Users can view own Eneagrama records"
ON public.eneagrama_registros
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = cliente_id);

-- Terapeutas podem criar registros para clientes vinculados
CREATE POLICY "Terapeutas can create client Eneagrama records"
ON public.eneagrama_registros
FOR INSERT
WITH CHECK (
  auth.uid() = terapeuta_id
  AND cliente_id IS NOT NULL
  AND is_terapeuta_of_cliente(auth.uid(), cliente_id)
);

-- Terapeutas podem ver registros de seus clientes
CREATE POLICY "Terapeutas can view client Eneagrama records"
ON public.eneagrama_registros
FOR SELECT
USING (
  auth.uid() = terapeuta_id
  OR is_terapeuta_of_cliente(auth.uid(), cliente_id)
);

-- Terapeutas podem atualizar registros que criaram
CREATE POLICY "Terapeutas can update own created Eneagrama records"
ON public.eneagrama_registros
FOR UPDATE
USING (auth.uid() = terapeuta_id);

-- 10) Trigger para updated_at em terapeuta_clientes
CREATE TRIGGER update_terapeuta_clientes_updated_at
BEFORE UPDATE ON public.terapeuta_clientes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();