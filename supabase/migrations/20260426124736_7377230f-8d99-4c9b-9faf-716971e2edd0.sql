ALTER TABLE public.clube_conteudo_semanal 
ADD COLUMN IF NOT EXISTS audio_roteiro TEXT,
ADD COLUMN IF NOT EXISTS chat_perguntas JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS treinamento_simulacao TEXT,
ADD COLUMN IF NOT EXISTS jardim_prompt TEXT,
ADD COLUMN IF NOT EXISTS aplicacao_clinica TEXT,
ADD COLUMN IF NOT EXISTS cartografia_detalhes JSONB DEFAULT '{"porta": "", "campo": "", "torre": "", "labirinto": ""}'::jsonb;
