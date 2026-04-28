ALTER TABLE public.clube_v2_ciclos 
ADD COLUMN IF NOT EXISTS chat_prompt TEXT,
ADD COLUMN IF NOT EXISTS chat_knowledge_base TEXT;