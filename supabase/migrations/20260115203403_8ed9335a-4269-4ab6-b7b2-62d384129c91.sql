-- Tabela de templates de mensagens
CREATE TABLE public.message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'in_app')),
  type TEXT NOT NULL CHECK (type IN ('pre_expiracao', 'expiracao', 'retorno', 'info', 'boas_vindas')),
  subject TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  cta_label TEXT,
  cta_url TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(channel, type)
);

-- Tabela de campanhas manuais
CREATE TABLE public.message_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'in_app')),
  name TEXT NOT NULL,
  subject TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  cta_label TEXT,
  cta_url TEXT,
  segment_json JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'done', 'failed')),
  total_sent INTEGER DEFAULT 0,
  total_failed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de logs unificada
CREATE TABLE public.message_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'in_app')),
  type TEXT NOT NULL CHECK (type IN ('pre_expiracao', 'expiracao', 'retorno', 'manual', 'info', 'boas_vindas')),
  template_id UUID REFERENCES public.message_templates(id),
  campaign_id UUID REFERENCES public.message_campaigns(id),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT
);

-- Tabela de configurações de automação
CREATE TABLE public.automation_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_message_templates_channel_type ON public.message_templates(channel, type);
CREATE INDEX idx_message_campaigns_status ON public.message_campaigns(status);
CREATE INDEX idx_message_logs_user_id ON public.message_logs(user_id);
CREATE INDEX idx_message_logs_sent_at ON public.message_logs(sent_at DESC);
CREATE INDEX idx_message_logs_channel_type ON public.message_logs(channel, type);

-- Enable RLS
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_settings ENABLE ROW LEVEL SECURITY;

-- RLS: Apenas admin pode acessar todas as tabelas
CREATE POLICY "Admin full access message_templates"
ON public.message_templates FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND portal = 'admin')
);

CREATE POLICY "Admin full access message_campaigns"
ON public.message_campaigns FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND portal = 'admin')
);

CREATE POLICY "Admin full access message_logs"
ON public.message_logs FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND portal = 'admin')
);

CREATE POLICY "Admin full access automation_settings"
ON public.automation_settings FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND portal = 'admin')
);

-- Inserir templates padrão
INSERT INTO public.message_templates (channel, type, subject, title, body, cta_label, cta_url) VALUES
-- Email templates
('email', 'pre_expiracao', 'Seu acesso está prestes a encerrar', 'Seu acesso está prestes a encerrar', 'Seu acesso ao app se encerra em 7 dias. Seu histórico permanece. Para manter tudo ativo, veja os planos.', 'Ver planos', '/planos'),
('email', 'expiracao', 'Seu acesso foi encerrado', 'Seu acesso foi encerrado', 'As funções profissionais estão pausadas, mas seus dados continuam intactos. Reabra quando quiser.', 'Reativar acesso', '/planos'),
('email', 'retorno', 'Seu espaço continua aqui', 'Seu espaço continua aqui', 'Clientes, registros e ferramentas seguem guardados. Você pode reativar quando for o momento.', 'Ver planos', '/planos'),
-- In-app templates
('in_app', 'pre_expiracao', NULL, 'Seu acesso está prestes a encerrar', 'Seu acesso ao app se encerra em 7 dias. Seu histórico permanece. Para manter tudo ativo, veja os planos.', 'Ver planos', '/planos'),
('in_app', 'expiracao', NULL, 'Seu acesso foi encerrado', 'As funções profissionais estão pausadas, mas seus dados continuam intactos. Reabra quando quiser.', 'Reativar acesso', '/planos'),
('in_app', 'retorno', NULL, 'Seu espaço continua aqui', 'Clientes, registros e ferramentas seguem guardados. Você pode reativar quando for o momento.', 'Ver planos', '/planos');

-- Inserir configuração de automação padrão
INSERT INTO public.automation_settings (key, value) VALUES
('retention_automation', '{"enabled": true, "last_run": null, "total_today": 0}');