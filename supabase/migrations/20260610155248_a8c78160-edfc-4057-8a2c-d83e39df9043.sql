ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS jardim_psique_pergunta TEXT,
ADD COLUMN IF NOT EXISTS jardim_psique_subperguntas JSONB,
ADD COLUMN IF NOT EXISTS jardim_oficio_pergunta TEXT,
ADD COLUMN IF NOT EXISTS jardim_oficio_subperguntas JSONB;