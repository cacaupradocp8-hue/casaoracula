-- 1. Criar o enum para os tipos de passos se não existir
DO $$ BEGIN
    CREATE TYPE public.clube_item_type AS ENUM ('portal', 'escuta', 'aplicacao', 'registro', 'integracao');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Ajustar a tabela clube_rota_itens para ser o centro do fluxo
ALTER TABLE public.clube_rota_itens 
ADD COLUMN IF NOT EXISTS tipo_passo public.clube_item_type DEFAULT 'portal',
ADD COLUMN IF NOT EXISTS impacto_cidadela JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 3. Criar tabela de progresso simplificada se não existir
CREATE TABLE IF NOT EXISTS public.clube_progresso_passos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    passo_id UUID REFERENCES public.clube_rota_itens(id) ON DELETE CASCADE,
    concluido BOOLEAN DEFAULT false,
    concluido_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, passo_id)
);

ALTER TABLE public.clube_progresso_passos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuárias podem ver seu próprio progresso no clube"
ON public.clube_progresso_passos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuárias podem marcar progresso no clube"
ON public.clube_progresso_passos FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Função para buscar o próximo passo dinamicamente
CREATE OR REPLACE FUNCTION public.get_clube_proximo_passo(p_user_id UUID, p_rota_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_ultimo_passo_concluido UUID;
    v_proximo_passo UUID;
BEGIN
    -- Busca o último passo concluído nesta rota
    SELECT passo_id INTO v_ultimo_passo_concluido
    FROM public.clube_progresso_passos p
    JOIN public.clube_rota_itens i ON i.id = p.passo_id
    WHERE p.user_id = p_user_id AND i.rota_id = p_rota_id
    ORDER BY i.ordem DESC
    LIMIT 1;

    -- Se não tem nenhum, pega o primeiro
    IF v_ultimo_passo_concluido IS NULL THEN
        SELECT id INTO v_proximo_passo
        FROM public.clube_rota_itens
        WHERE rota_id = p_rota_id
        ORDER BY ordem ASC
        LIMIT 1;
    ELSE
        -- Pega o próximo por ordem
        SELECT id INTO v_proximo_passo
        FROM public.clube_rota_itens
        WHERE rota_id = p_rota_id 
          AND ordem > (SELECT ordem FROM public.clube_rota_itens WHERE id = v_ultimo_passo_concluido)
        ORDER BY ordem ASC
        LIMIT 1;
    END IF;

    RETURN v_proximo_passo;
END;
$$;