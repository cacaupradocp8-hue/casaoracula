
-- 1. Add observacao_segura to existing clientes table
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS observacao_segura TEXT;

-- 2. Create sessoes_casa_maquinas table
CREATE TYPE public.movimento_percebido AS ENUM ('avancou', 'tensao', 'ciclo_repetido', 'observacao');

CREATE TABLE public.sessoes_casa_maquinas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  data_sessao DATE NOT NULL DEFAULT CURRENT_DATE,
  movimento_percebido public.movimento_percebido NOT NULL DEFAULT 'observacao',
  nota_breve TEXT CHECK (char_length(nota_breve) <= 300),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessoes_cm_owner ON public.sessoes_casa_maquinas(owner_id);
CREATE INDEX idx_sessoes_cm_cliente ON public.sessoes_casa_maquinas(cliente_id);

ALTER TABLE public.sessoes_casa_maquinas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view own sessoes" ON public.sessoes_casa_maquinas
  FOR SELECT USING (auth.uid() = owner_id OR public.is_admin(auth.uid()));

CREATE POLICY "Owner can insert own sessoes" ON public.sessoes_casa_maquinas
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can update own sessoes" ON public.sessoes_casa_maquinas
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owner can delete own sessoes" ON public.sessoes_casa_maquinas
  FOR DELETE USING (auth.uid() = owner_id);

CREATE TRIGGER update_sessoes_cm_updated_at
  BEFORE UPDATE ON public.sessoes_casa_maquinas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Create gestos_integracao table
CREATE TYPE public.gesto_status AS ENUM ('ativo', 'em_pratica', 'integrado', 'em_revisao');

CREATE TABLE public.gestos_integracao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  sessao_id UUID REFERENCES public.sessoes_casa_maquinas(id) ON DELETE SET NULL,
  gesto_texto TEXT NOT NULL,
  status public.gesto_status NOT NULL DEFAULT 'ativo',
  jardim_registro_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gestos_owner ON public.gestos_integracao(owner_id);
CREATE INDEX idx_gestos_cliente ON public.gestos_integracao(cliente_id);
CREATE INDEX idx_gestos_status ON public.gestos_integracao(status);

ALTER TABLE public.gestos_integracao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can view own gestos" ON public.gestos_integracao
  FOR SELECT USING (auth.uid() = owner_id OR public.is_admin(auth.uid()));

CREATE POLICY "Owner can insert own gestos" ON public.gestos_integracao
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can update own gestos" ON public.gestos_integracao
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owner can delete own gestos" ON public.gestos_integracao
  FOR DELETE USING (auth.uid() = owner_id);

CREATE TRIGGER update_gestos_updated_at
  BEFORE UPDATE ON public.gestos_integracao
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Function to auto-archive previous active gesto when new one is created
CREATE OR REPLACE FUNCTION public.archive_previous_active_gesto()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'ativo' THEN
    UPDATE public.gestos_integracao
    SET status = 'integrado', updated_at = now()
    WHERE cliente_id = NEW.cliente_id
      AND owner_id = NEW.owner_id
      AND status = 'ativo'
      AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_archive_previous_gesto
  AFTER INSERT OR UPDATE ON public.gestos_integracao
  FOR EACH ROW EXECUTE FUNCTION public.archive_previous_active_gesto();
