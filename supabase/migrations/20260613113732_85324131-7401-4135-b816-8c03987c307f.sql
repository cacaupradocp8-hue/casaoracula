
ALTER TABLE public.clube_camara_escuta_obras
  ADD COLUMN IF NOT EXISTS texto_antes_escuta text,
  ADD COLUMN IF NOT EXISTS pergunta_durante_escuta text,
  ADD COLUMN IF NOT EXISTS texto_leitura_simbolica text,
  ADD COLUMN IF NOT EXISTS mensagem_conclusao text;

ALTER TABLE public.clube_camara_escuta_registros
  ADD COLUMN IF NOT EXISTS primeira_impressao_tipo text,
  ADD COLUMN IF NOT EXISTS primeira_impressao_texto text;
