ALTER TABLE public.clube_livro_ciclos 
ADD COLUMN IF NOT EXISTS chat_prompt TEXT,
ADD COLUMN IF NOT EXISTS chat_knowledge_base TEXT;