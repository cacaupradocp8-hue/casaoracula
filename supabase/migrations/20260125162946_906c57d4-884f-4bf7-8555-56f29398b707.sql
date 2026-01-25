-- Tabela para tracking do ritual de autorização da Narroterapia
CREATE TABLE public.narroterapia_autorizacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  
  -- Movimentos do ritual (tracking sequencial)
  movimento_1_completado_em timestamp with time zone,
  movimento_2_aceite_em timestamp with time zone,
  movimento_3_pausa_iniciada_em timestamp with time zone,
  movimento_3_autorizado_em timestamp with time zone,
  movimento_4_selado_em timestamp with time zone,
  
  -- Status final
  autorizado boolean DEFAULT false NOT NULL,
  selo_ativo boolean DEFAULT false NOT NULL,
  
  -- Suspensão manual (admin)
  suspenso boolean DEFAULT false NOT NULL,
  suspenso_em timestamp with time zone,
  suspenso_por uuid,
  motivo_suspensao text,
  
  -- Metadata
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.narroterapia_autorizacao ENABLE ROW LEVEL SECURITY;

-- Trigger para updated_at
CREATE TRIGGER update_narroterapia_autorizacao_updated_at
  BEFORE UPDATE ON public.narroterapia_autorizacao
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Usuária lê apenas seu próprio registro ou admin lê todos
CREATE POLICY "Users read own narroterapia authorization"
  ON public.narroterapia_autorizacao FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Usuária insere apenas seu próprio registro
CREATE POLICY "Users insert own narroterapia authorization"
  ON public.narroterapia_autorizacao FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuária atualiza apenas seu registro se não estiver suspenso
CREATE POLICY "Users update own ritual progress"
  ON public.narroterapia_autorizacao FOR UPDATE
  USING (auth.uid() = user_id AND suspenso = false);

-- Admin pode atualizar qualquer registro (para suspensão)
CREATE POLICY "Admins can update narroterapia authorization"
  ON public.narroterapia_autorizacao FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Trigger para proteger campos de suspensão de alteração por não-admins
CREATE OR REPLACE FUNCTION public.protect_narroterapia_suspension_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Se não for admin e tentar alterar campos de suspensão, reverte
  IF NOT public.is_admin(auth.uid()) THEN
    NEW.suspenso := OLD.suspenso;
    NEW.suspenso_em := OLD.suspenso_em;
    NEW.suspenso_por := OLD.suspenso_por;
    NEW.motivo_suspensao := OLD.motivo_suspensao;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER protect_narroterapia_suspension
  BEFORE UPDATE ON public.narroterapia_autorizacao
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_narroterapia_suspension_fields();

-- Adicionar campos de pré-requisitos em profiles (se não existirem)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS formacao_oracula_concluida boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS termo_etico_aceito boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS supervisao_validada boolean DEFAULT false;

-- Índices para buscas
CREATE INDEX idx_narroterapia_autorizacao_user_id ON public.narroterapia_autorizacao(user_id);
CREATE INDEX idx_narroterapia_autorizacao_autorizado ON public.narroterapia_autorizacao(autorizado) WHERE autorizado = true;