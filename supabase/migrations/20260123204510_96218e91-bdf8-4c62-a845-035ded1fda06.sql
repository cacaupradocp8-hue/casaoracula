-- Add app setting for visitor room welcome video
INSERT INTO app_settings (key, value, description)
VALUES (
  'sala_visita_video_url',
  '',
  'URL do vídeo de boas-vindas da Sala da Visitante (YouTube, Vimeo ou embed)'
)
ON CONFLICT (key) DO NOTHING;