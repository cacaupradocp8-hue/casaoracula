-- Atualizar Estações
ALTER TABLE public.clube_estacoes 
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS descricao TEXT,
ADD COLUMN IF NOT EXISTS livro_imagem_banner_url TEXT;

-- Atualizar Itens da Rota (Pontos)
ALTER TABLE public.clube_rota_itens
ADD COLUMN IF NOT EXISTS porta TEXT,
ADD COLUMN IF NOT EXISTS campo TEXT,
ADD COLUMN IF NOT EXISTS torre TEXT,
ADD COLUMN IF NOT EXISTS labirinto TEXT,
ADD COLUMN IF NOT EXISTS frase_guia TEXT,
ADD COLUMN IF NOT EXISTS jardim_prompt TEXT,
ADD COLUMN IF NOT EXISTS cenario_treinamento TEXT,
ADD COLUMN IF NOT EXISTS leitura_referencia TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Atualizar Conteúdos
ALTER TABLE public.clube_v2_conteudos
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Garantir que as tabelas v2 também tenham campos consistentes se usadas
ALTER TABLE public.clube_v2_obras
ADD COLUMN IF NOT EXISTS banner_url TEXT;
