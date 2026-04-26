-- 1. Adicionar campo impacto_cidadela em clube_rota_itens
ALTER TABLE public.clube_rota_itens 
ADD COLUMN IF NOT EXISTS impacto_cidadela JSONB DEFAULT '[]'::jsonb;

-- 2. Criar tabela de progresso da rota
CREATE TABLE IF NOT EXISTS public.clube_rota_progresso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rota_id UUID REFERENCES public.clube_rotas(id) ON DELETE CASCADE NOT NULL,
    item_id UUID REFERENCES public.clube_rota_itens(id) ON DELETE CASCADE NOT NULL,
    concluido_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, item_id)
);

ALTER TABLE public.clube_rota_progresso ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuárias podem ver seu próprio progresso"
ON public.clube_rota_progresso FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuárias podem registrar seu progresso"
ON public.clube_rota_progresso FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Criar tabela do Mapa Vivo (Estado da CidaDELA)
CREATE TABLE IF NOT EXISTS public.cidadela_mapa_vivo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    distrito TEXT NOT NULL,
    nivel INTEGER DEFAULT 1,
    status TEXT DEFAULT 'ativo', -- 'bloqueado', 'ativo', 'evoluido'
    historico JSONB DEFAULT '[]'::jsonb,
    ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, distrito)
);

ALTER TABLE public.cidadela_mapa_vivo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuárias podem ver seu próprio mapa"
ON public.cidadela_mapa_vivo FOR SELECT
USING (auth.uid() = user_id);

-- 4. Função para aplicar impacto na CidaDELA
CREATE OR REPLACE FUNCTION public.aplicar_impacto_cidadela()
RETURNS TRIGGER AS $$
DECLARE
    impacto JSONB;
    item_impacto JSONB;
BEGIN
    -- Busca o impacto configurado no item da rota
    SELECT impacto_cidadela INTO impacto FROM public.clube_rota_itens WHERE id = NEW.item_id;
    
    IF impacto IS NOT NULL AND jsonb_array_length(impacto) > 0 THEN
        FOR item_impacto IN SELECT * FROM jsonb_array_elements(impacto)
        LOOP
            INSERT INTO public.cidadela_mapa_vivo (user_id, distrito, nivel, historico)
            VALUES (
                NEW.user_id, 
                item_impacto->>'distrito', 
                (item_impacto->>'intensidade')::integer,
                jsonb_build_array(jsonb_build_object('data', now(), 'origem', 'rota_item_concluido', 'item_id', NEW.item_id, 'tipo', item_impacto->>'tipo_impacto'))
            )
            ON CONFLICT (user_id, distrito) DO UPDATE
            SET 
                nivel = cidadela_mapa_vivo.nivel + (item_impacto->>'intensidade')::integer,
                historico = cidadela_mapa_vivo.historico || jsonb_build_object('data', now(), 'origem', 'rota_item_concluido', 'item_id', NEW.item_id, 'tipo', item_impacto->>'tipo_impacto'),
                ultima_atualizacao = now();
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para aplicar impacto ao concluir item
CREATE TRIGGER trigger_aplicar_impacto_rota
AFTER INSERT ON public.clube_rota_progresso
FOR EACH ROW
EXECUTE FUNCTION public.aplicar_impacto_cidadela();