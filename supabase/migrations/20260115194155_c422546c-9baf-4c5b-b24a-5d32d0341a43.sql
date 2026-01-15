-- =============================================
-- PARTE A: ATUALIZAR TABELA PLANS COM PLANOS OFICIAIS
-- =============================================

-- Remover planos antigos
DELETE FROM plans;

-- Criar coluna para tipo de cobrança e duração
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS tipo_cobranca TEXT DEFAULT 'unico',
ADD COLUMN IF NOT EXISTS duracao_meses INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS preco_unico NUMERIC(10,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS url_checkout TEXT DEFAULT NULL;

-- Inserir os 4 planos oficiais
INSERT INTO plans (id, nome, descricao, preco_mensal, preco_unico, tipo_cobranca, duracao_meses, portal_resultante, max_clientes, features, destaque, ordem, ativo)
VALUES 
  ('visitante', 'Visitante', 'Acesso gratuito básico ao app', 0, NULL, 'gratuito', NULL, 'visitante', 2, 
   '["Acesso básico ao app", "Até 2 clientes ativos", "Exploração inicial"]', false, 1, true),
  
  ('fundadora', 'Fundadora — Formação ORÁCULA', 'Acesso completo por 12 meses', 0, 1500, 'unico', 12, 'iniciada', -1, 
   '["Arsenal de ferramentas ilimitado", "Acesso por 12 meses", "Formação completa", "Clientes ilimitados durante o período"]', true, 2, true),
  
  ('mentoria', 'Mentoria ORÁCULA', 'Acesso completo por 24 meses', 0, 2500, 'unico', 24, 'iniciada', -1, 
   '["Tudo da Formação Fundadora", "Acesso por 24 meses", "Mentoria especializada", "Clientes ilimitados durante o período"]', false, 3, true),
  
  ('assinatura', 'Assinatura Profissional', 'Acesso contínuo mensal', 49.90, NULL, 'mensal', NULL, 'iniciada', -1, 
   '["Acesso contínuo enquanto ativa", "Arsenal completo de ferramentas", "Clientes ilimitados", "Renovação automática mensal"]', false, 4, true);

-- =============================================
-- PARTE C: ADICIONAR CAMPOS DE CONTROLE NO PROFILES
-- =============================================

-- Adicionar campos de controle de acesso
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS portal TEXT DEFAULT 'visitante',
ADD COLUMN IF NOT EXISTS access_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none';

-- =============================================
-- PARTE E: FUNÇÃO PARA VERIFICAR E EXPIRAR ACESSOS
-- =============================================

-- Função que verifica e expira acessos vencidos
CREATE OR REPLACE FUNCTION public.check_and_expire_access()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  expired_count INTEGER;
BEGIN
  -- Atualizar usuários com acesso expirado
  UPDATE profiles
  SET 
    portal = 'visitante',
    subscription_status = 'expired'
  WHERE 
    subscription_status != 'active'
    AND access_expires_at IS NOT NULL
    AND access_expires_at < NOW()
    AND portal != 'visitante';
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  RETURN expired_count;
END;
$$;

-- Função para ativar plano Fundadora (12 meses)
CREATE OR REPLACE FUNCTION public.activate_fundadora_plan(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET 
    portal = 'iniciada',
    access_expires_at = NOW() + INTERVAL '12 months',
    subscription_status = 'none'
  WHERE id = user_id_param;
  
  -- Atualizar user_roles também
  UPDATE user_roles
  SET portal = 'iniciada'
  WHERE user_id = user_id_param;
END;
$$;

-- Função para ativar plano Mentoria (24 meses)
CREATE OR REPLACE FUNCTION public.activate_mentoria_plan(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET 
    portal = 'iniciada',
    access_expires_at = NOW() + INTERVAL '24 months',
    subscription_status = 'none'
  WHERE id = user_id_param;
  
  UPDATE user_roles
  SET portal = 'iniciada'
  WHERE user_id = user_id_param;
END;
$$;

-- Função para ativar assinatura mensal
CREATE OR REPLACE FUNCTION public.activate_subscription(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET 
    portal = 'iniciada',
    access_expires_at = NULL,
    subscription_status = 'active'
  WHERE id = user_id_param;
  
  UPDATE user_roles
  SET portal = 'iniciada'
  WHERE user_id = user_id_param;
END;
$$;

-- Função para cancelar assinatura
CREATE OR REPLACE FUNCTION public.cancel_subscription(user_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET 
    subscription_status = 'expired',
    portal = 'visitante'
  WHERE id = user_id_param;
  
  UPDATE user_roles
  SET portal = 'visitante'
  WHERE user_id = user_id_param;
END;
$$;

-- =============================================
-- TABELA DE LOG DE EXPIRAÇÕES
-- =============================================

CREATE TABLE IF NOT EXISTS public.access_expiration_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  expired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  previous_portal TEXT,
  reason TEXT DEFAULT 'auto_expiration'
);

ALTER TABLE public.access_expiration_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view expiration logs"
ON public.access_expiration_logs
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND portal = 'admin')
);