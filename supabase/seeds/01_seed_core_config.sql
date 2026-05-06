-- 01_seed_core_config.sql
-- Domínio: Core / Configurações Mestras
-- Objetivo: Garantir que o portal e a IA base funcionem no novo projeto.

-- Configurações globais do portal
-- SELECT * FROM app_settings;
INSERT INTO public.app_settings (key, value, description)
VALUES 
('portal_name', '"Casa Orácula"', 'Nome oficial da plataforma'),
('maintenance_mode', 'false', 'Status de manutenção global')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Configurações globais de IA
-- SELECT * FROM ai_global_settings;
INSERT INTO public.ai_global_settings (setting_key, setting_value, description)
VALUES 
('default_model', '"gpt-4o"', 'Modelo padrão para agentes'),
('temperature_base', '0.7', 'Temperatura padrão para respostas')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;
