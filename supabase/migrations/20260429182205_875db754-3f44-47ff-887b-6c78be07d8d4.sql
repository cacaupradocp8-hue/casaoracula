-- Add missing columns to clube_estacoes if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_estacoes' AND column_name = 'banner_url') THEN
        ALTER TABLE public.clube_estacoes ADD COLUMN banner_url TEXT;
    END IF;
END $$;

-- Ensure clube_rota_itens has all cartography fields
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_rota_itens' AND column_name = 'porta') THEN
        ALTER TABLE public.clube_rota_itens ADD COLUMN porta TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_rota_itens' AND column_name = 'campo') THEN
        ALTER TABLE public.clube_rota_itens ADD COLUMN campo TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_rota_itens' AND column_name = 'torre') THEN
        ALTER TABLE public.clube_rota_itens ADD COLUMN torre TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_rota_itens' AND column_name = 'labirinto') THEN
        ALTER TABLE public.clube_rota_itens ADD COLUMN labirinto TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_rota_itens' AND column_name = 'frase_guia') THEN
        ALTER TABLE public.clube_rota_itens ADD COLUMN frase_guia TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_rota_itens' AND column_name = 'jardim_prompt') THEN
        ALTER TABLE public.clube_rota_itens ADD COLUMN jardim_prompt TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_rota_itens' AND column_name = 'cenario_treinamento') THEN
        ALTER TABLE public.clube_rota_itens ADD COLUMN cenario_treinamento TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clube_rota_itens' AND column_name = 'leitura_referencia') THEN
        ALTER TABLE public.clube_rota_itens ADD COLUMN leitura_referencia TEXT;
    END IF;
END $$;
