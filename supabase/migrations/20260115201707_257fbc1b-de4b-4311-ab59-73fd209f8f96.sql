-- Tabela para controle de envio de e-mails (evitar duplicatas)
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tipo_email TEXT NOT NULL CHECK (tipo_email IN ('pre_expiracao', 'expiracao', 'retorno')),
  data_envio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  success BOOLEAN DEFAULT true,
  error_message TEXT DEFAULT NULL,
  UNIQUE(user_id, tipo_email) -- Garante disparo único por tipo
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_tipo ON email_logs(tipo_email);

-- RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Admins podem ver todos os logs
CREATE POLICY "Admins can view email logs"
ON public.email_logs
FOR SELECT
USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND portal = 'admin')
);

-- Usuárias podem ver seus próprios logs
CREATE POLICY "Users can view own email logs"
ON public.email_logs
FOR SELECT
USING (user_id = auth.uid());

-- Service role pode inserir (via edge function)
CREATE POLICY "Service can insert email logs"
ON public.email_logs
FOR INSERT
WITH CHECK (true);