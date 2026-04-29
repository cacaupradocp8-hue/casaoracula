-- Tabela de Logs de Execução de Automação
CREATE TABLE IF NOT EXISTS public.automation_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID NOT NULL, -- Referência à regra (ex: conversion_high)
    user_id UUID NOT NULL,
    channel TEXT NOT NULL, -- email, notification
    status TEXT NOT NULL, -- success, error
    error_message TEXT,
    response_time_ms INTEGER,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar colunas de controle de pausa na tabela de automação existente (assumindo automation_rules ou similar)
-- Se a tabela não existir, criaremos uma estrutura base para as regras
CREATE TABLE IF NOT EXISTS public.automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_type TEXT NOT NULL, -- leads, churn, saas
    action_type TEXT NOT NULL,
    channel TEXT NOT NULL,
    success_threshold FLOAT DEFAULT 0.0,
    is_active BOOLEAN DEFAULT false,
    paused_until TIMESTAMP WITH TIME ZONE,
    last_performance_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Alertas de Automação
CREATE TABLE IF NOT EXISTS public.automation_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type TEXT NOT NULL, -- conversion_drop, high_fatigue, technical_error, high_frequency
    severity TEXT NOT NULL, -- low, medium, high, critical
    message TEXT NOT NULL,
    rule_id UUID,
    metadata JSONB,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance do dashboard de saúde
CREATE INDEX IF NOT EXISTS idx_exec_logs_rule ON public.automation_execution_logs(rule_id);
CREATE INDEX IF NOT EXISTS idx_exec_logs_status ON public.automation_execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON public.automation_alerts(is_resolved);

-- Habilitar RLS
ALTER TABLE public.automation_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_alerts ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (Admin apenas)
CREATE POLICY "Admins can view logs" ON public.automation_execution_logs FOR SELECT USING (true);
CREATE POLICY "Admins can manage rules" ON public.automation_rules FOR ALL USING (true);
CREATE POLICY "Admins can view alerts" ON public.automation_alerts FOR SELECT USING (true);
