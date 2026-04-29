-- Tabela para configurar regras de automação baseada em evidência
CREATE TABLE IF NOT EXISTS public.admin_automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_type TEXT NOT NULL, -- 'conversion', 'churn', 'saas'
    action_type TEXT NOT NULL,
    channel TEXT NOT NULL, -- 'email', 'notification', 'whatsapp'
    min_success_rate NUMERIC NOT NULL DEFAULT 15.0,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(risk_type, action_type, channel)
);

-- Habilitar RLS
ALTER TABLE public.admin_automation_rules ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para admin
CREATE POLICY "Admins can manage automation rules"
ON public.admin_automation_rules
FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND portal = 'admin'
));

-- Inserir regras semente baseadas nas sugestões do usuário
INSERT INTO public.admin_automation_rules (risk_type, action_type, channel, min_success_rate, is_active)
VALUES 
('conversion', 'Terminar Cartografia', 'email', 20.0, false),
('conversion', 'Terminar Cartografia', 'notification', 20.0, false),
('churn', 'Retomar Rota Atual', 'email', 15.0, false),
('saas', 'Tutorial Cabine', 'notification', 10.0, false)
ON CONFLICT DO NOTHING;
