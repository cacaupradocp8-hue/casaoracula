-- Add pedagogical content fields to conteudo_travessias (Portais)
ALTER TABLE public.conteudo_travessias
ADD COLUMN IF NOT EXISTS texto_introducao text DEFAULT '',
ADD COLUMN IF NOT EXISTS descricao_pedagogica text DEFAULT '';