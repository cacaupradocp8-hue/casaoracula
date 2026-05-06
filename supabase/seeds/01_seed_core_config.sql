-- 01_seed_core_config.sql (REVISADO)
-- Domínio: Core / Configurações Mestras
-- Objetivo: Preservar configurações da Sala de Visita e App.

-- 1. App Settings (Incluindo Sala de Visita)
INSERT INTO public.app_settings (key, value, description)
VALUES 
('portal_name', '"Casa Orácula"', 'Nome oficial da plataforma'),
('maintenance_mode', 'false', 'Status de manutenção global'),
('vitrine_hero_texto', '"Aqui, a travessia começa com presença"', 'Texto principal do banner da vitrine'),
('sala_visita_video_url', '"2f649a79ebaaae5f6f7f0dc4d11ef1a0"', 'URL do vídeo de boas-vindas da Sala da Visitante'),
('vitrine_hero_btn_texto', '"Continuar minha travessia"', 'Texto do botão do banner da vitrine'),
('vitrine_hero_btn_link', '"/salas"', 'Link do botão do banner da vitrine'),
('vitrine_hero_overlay_opacity', '30', 'Opacidade do overlay do banner'),
('vitrine_hero_ativo', 'true', 'Ativar/desativar banner da vitrine'),
('vitrine_ambient_audio_url', '"https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/audios/ambient/ambient-audio-1771163430778.mp3"', 'URL do áudio ambiente da vitrine'),
('vitrine_ambient_audio_ativo', 'true', 'Se o áudio ambiente está ativo na vitrine'),
('vitrine_ambient_audio_volume', '30', 'Volume padrão do áudio ambiente'),
('vitrine_hero_video_url', '"https://pvjiznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/banner/hero-banner-1771162221967.mp4"', 'URL do vídeo do banner principal da Vitrine'),
('cta_whatsapp_number', '"5511999999999"', 'Número do WhatsApp para contato'),
('cta_matricula_url', '"https://rockty.com/sua-matricula"', 'URL de matrícula na Rockty'),
('support_whatsapp_url', '"https://wa.me/5511999999999"', 'Link do WhatsApp para suporte'),
('support_email', '"contato@casaoracula.com"', 'Email de suporte')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Salas (Preservando Sala da Visitante)
INSERT INTO public.salas (id, nivel_minimo, nome_exibicao, texto_entrada, texto_bloqueio, ativa, ordem)
VALUES 
('be626211-4608-4232-b678-8c3edfac2798', 'NIVEL_0', 'Sala da Visitante', 'Bem-vinda ao início da sua jornada. Aqui você encontrará os primeiros passos para explorar a Casa ORÁCULA.', 'Esta sala está disponível para todas as Visitantes. Entrar na Sala da Visitante', true, 1)
ON CONFLICT (id) DO UPDATE SET 
    nome_exibicao = EXCLUDED.nome_exibicao,
    texto_entrada = EXCLUDED.texto_entrada;

-- 3. AI Settings
INSERT INTO public.ai_global_settings (setting_key, setting_value, description)
VALUES 
('default_model', '"gpt-4o"', 'Modelo padrão para agentes'),
('temperature_base', '0.7', 'Temperatura padrão para respostas')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;