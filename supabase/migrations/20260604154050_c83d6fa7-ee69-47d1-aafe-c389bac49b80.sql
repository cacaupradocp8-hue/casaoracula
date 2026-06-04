INSERT INTO public.app_settings (key, value, description)
VALUES 
  ('portal_rotas_welcome_audio_title', '"A Voz da Casa"', 'Título do bloco de áudio de boas-vindas no Portal das Rotas'),
  ('portal_rotas_welcome_audio_subtitle', '"Antes de escolher uma rota, escute a chegada."', 'Subtítulo do bloco de áudio de boas-vindas no Portal das Rotas'),
  ('portal_rotas_welcome_audio_description', '"Esta escuta foi criada para desacelerar sua entrada e abrir o primeiro silêncio da travessia."', 'Descrição do bloco de áudio de boas-vindas no Portal das Rotas'),
  ('portal_rotas_welcome_audio_url', '""', 'URL do arquivo de áudio de boas-vindas do Portal das Rotas'),
  ('portal_rotas_welcome_audio_image', '""', 'URL da imagem de fundo para o áudio de boas-vindas do Portal das Rotas')
ON CONFLICT (key) DO NOTHING;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;