-- Índices para otimização das consultas do Dashboard
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON public.ai_interaction_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clube_progresso_updated ON public.clube_rota_progresso (updated_at DESC);

-- View de Travas da Jornada (Somente Leitura)
CREATE OR REPLACE VIEW public.view_user_stagnation AS
SELECT 
    p.id as user_id,
    p.nome,
    p.email,
    s.plan_id,
    s.status as subscription_status,
    (SELECT MAX(created_at) FROM public.ai_interaction_logs WHERE user_id = p.id) as last_ai_use,
    (SELECT MAX(updated_at) FROM public.clube_rota_progresso WHERE user_id = p.id) as last_clube_activity,
    CASE 
        WHEN s.status = 'active' AND NOT EXISTS (SELECT 1 FROM public.ai_interaction_logs WHERE user_id = p.id) 
            THEN 'SaaS ativo sem uso da Cabine'
        WHEN (SELECT MAX(updated_at) FROM public.clube_rota_progresso WHERE user_id = p.id) < NOW() - INTERVAL '7 days'
            AND EXISTS (SELECT 1 FROM public.clube_rota_progresso WHERE user_id = p.id)
            THEN 'Parada no mesmo portal > 7 dias'
        WHEN NOT EXISTS (SELECT 1 FROM public.clube_rota_progresso WHERE user_id = p.id)
            THEN 'Rota do Clube não iniciada'
        WHEN NOT EXISTS (SELECT 1 FROM public.voz_historico WHERE user_id = p.id)
            THEN 'Sem uso da Voz'
        WHEN NOT EXISTS (SELECT 1 FROM public.cartografia_psiquica WHERE user_id = p.id)
            THEN 'Sem Cartografia'
        WHEN NOT EXISTS (SELECT 1 FROM public.co_jardim_entries WHERE user_id = p.id)
            THEN 'Sem registro no Jardim'
        ELSE 'Ativa'
    END as stagnation_reason,
    GREATEST(
        (SELECT MAX(created_at) FROM public.ai_interaction_logs WHERE user_id = p.id),
        (SELECT MAX(updated_at) FROM public.clube_rota_progresso WHERE user_id = p.id)
    ) as last_any_activity
FROM public.profiles p
LEFT JOIN public.subscriptions s ON s.user_id = p.id;