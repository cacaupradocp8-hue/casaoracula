-- 1) Criar tabela de casos clínicos
CREATE TABLE public.casos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  terapeuta_id UUID NOT NULL,
  cliente_id UUID NOT NULL,
  codinome TEXT NOT NULL,
  tema_central TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  historico_breve TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Garantir que não há casos duplicados para mesmo par terapeuta-cliente com mesmo codinome
  UNIQUE(terapeuta_id, cliente_id, codinome)
);

-- Trigger para updated_at
CREATE TRIGGER update_casos_updated_at
  BEFORE UPDATE ON public.casos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.casos ENABLE ROW LEVEL SECURITY;

-- 2) Função auxiliar para verificar se terapeuta pode criar caso para cliente
CREATE OR REPLACE FUNCTION public.can_create_caso(_terapeuta_id UUID, _cliente_id UUID)
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

-- 3) RLS policies para casos
-- Admin pode tudo
CREATE POLICY "Admins can manage all casos"
ON public.casos FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Terapeuta pode ver/criar/editar seus próprios casos
CREATE POLICY "Terapeutas can view own casos"
ON public.casos FOR SELECT
USING (auth.uid() = terapeuta_id);

CREATE POLICY "Terapeutas can create casos for linked clients"
ON public.casos FOR INSERT
WITH CHECK (
  auth.uid() = terapeuta_id
  AND can_create_caso(auth.uid(), cliente_id)
);

CREATE POLICY "Terapeutas can update own casos"
ON public.casos FOR UPDATE
USING (auth.uid() = terapeuta_id);

CREATE POLICY "Terapeutas can delete own casos"
ON public.casos FOR DELETE
USING (auth.uid() = terapeuta_id);

-- Cliente pode ver casos onde ela é a cliente
CREATE POLICY "Clientes can view own casos"
ON public.casos FOR SELECT
USING (auth.uid() = cliente_id);

-- 4) Adicionar foreign key de caso_id nas tabelas de registros (se não existir)
-- Nota: caso_id já existe mas sem FK, vamos adicionar
ALTER TABLE public.eneagrama_registros
  ADD CONSTRAINT fk_eneagrama_caso
  FOREIGN KEY (caso_id) REFERENCES public.casos(id) ON DELETE SET NULL;

ALTER TABLE public.big5_registros
  ADD CONSTRAINT fk_big5_caso
  FOREIGN KEY (caso_id) REFERENCES public.casos(id) ON DELETE SET NULL;

-- 5) Função para verificar se registro pertence a um caso do terapeuta
CREATE OR REPLACE FUNCTION public.registro_pertence_terapeuta(_caso_id UUID, _user_id UUID, _terapeuta_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN _caso_id IS NULL THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.casos c
      WHERE c.id = _caso_id
        AND c.terapeuta_id = _terapeuta_id
        AND c.cliente_id = _user_id
    )
  END
$$;

-- 6) Atualizar RLS de eneagrama_registros para usar caso como controle
-- Primeiro dropar policies antigas problemáticas
DROP POLICY IF EXISTS "Terapeutas can create client Eneagrama records" ON public.eneagrama_registros;
DROP POLICY IF EXISTS "Terapeutas can update own created Eneagrama records" ON public.eneagrama_registros;
DROP POLICY IF EXISTS "Terapeutas can view client Eneagrama records" ON public.eneagrama_registros;
DROP POLICY IF EXISTS "Users can create self Eneagrama assessment" ON public.eneagrama_registros;
DROP POLICY IF EXISTS "Users can view own Eneagrama records" ON public.eneagrama_registros;

-- Novas policies baseadas em caso
-- Cliente pode ver registros onde ela é o user_id (seus próprios)
CREATE POLICY "Clientes can view own Eneagrama records"
ON public.eneagrama_registros FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = cliente_id);

-- Cliente pode criar autoavaliação (sem caso, sem terapeuta)
CREATE POLICY "Clientes can create self Eneagrama assessment"
ON public.eneagrama_registros FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND terapeuta_id IS NULL 
  AND cliente_id IS NULL 
  AND caso_id IS NULL
);

-- Terapeuta pode ver registros de casos dela
CREATE POLICY "Terapeutas can view Eneagrama records via caso"
ON public.eneagrama_registros FOR SELECT
USING (
  auth.uid() = terapeuta_id
  OR (caso_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.casos c 
    WHERE c.id = eneagrama_registros.caso_id 
    AND c.terapeuta_id = auth.uid()
  ))
);

-- Terapeuta pode criar registro apenas se caso pertence a ela e cliente bate
CREATE POLICY "Terapeutas can create Eneagrama via caso"
ON public.eneagrama_registros FOR INSERT
WITH CHECK (
  auth.uid() = terapeuta_id
  AND caso_id IS NOT NULL
  AND cliente_id IS NOT NULL
  AND registro_pertence_terapeuta(caso_id, cliente_id, auth.uid())
);

-- Terapeuta pode atualizar registros de seus casos
CREATE POLICY "Terapeutas can update Eneagrama via caso"
ON public.eneagrama_registros FOR UPDATE
USING (
  auth.uid() = terapeuta_id
  AND caso_id IS NOT NULL
  AND registro_pertence_terapeuta(caso_id, cliente_id, auth.uid())
);

-- 7) Atualizar RLS de big5_registros da mesma forma
DROP POLICY IF EXISTS "Terapeutas can create client Big5 records" ON public.big5_registros;
DROP POLICY IF EXISTS "Terapeutas can update own created Big5 records" ON public.big5_registros;
DROP POLICY IF EXISTS "Terapeutas can view client Big5 records" ON public.big5_registros;
DROP POLICY IF EXISTS "Users can create self assessment" ON public.big5_registros;
DROP POLICY IF EXISTS "Users can view own Big5 records" ON public.big5_registros;

-- Novas policies baseadas em caso
CREATE POLICY "Clientes can view own Big5 records"
ON public.big5_registros FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = cliente_id);

CREATE POLICY "Clientes can create self Big5 assessment"
ON public.big5_registros FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND terapeuta_id IS NULL 
  AND cliente_id IS NULL 
  AND caso_id IS NULL
);

CREATE POLICY "Terapeutas can view Big5 records via caso"
ON public.big5_registros FOR SELECT
USING (
  auth.uid() = terapeuta_id
  OR (caso_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.casos c 
    WHERE c.id = big5_registros.caso_id 
    AND c.terapeuta_id = auth.uid()
  ))
);

CREATE POLICY "Terapeutas can create Big5 via caso"
ON public.big5_registros FOR INSERT
WITH CHECK (
  auth.uid() = terapeuta_id
  AND caso_id IS NOT NULL
  AND cliente_id IS NOT NULL
  AND registro_pertence_terapeuta(caso_id, cliente_id, auth.uid())
);

CREATE POLICY "Terapeutas can update Big5 via caso"
ON public.big5_registros FOR UPDATE
USING (
  auth.uid() = terapeuta_id
  AND caso_id IS NOT NULL
  AND registro_pertence_terapeuta(caso_id, cliente_id, auth.uid())
);