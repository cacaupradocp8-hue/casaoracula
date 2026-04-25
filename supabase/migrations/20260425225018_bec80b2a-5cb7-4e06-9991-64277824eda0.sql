-- 1. Criar Tipo para Referências Controladas
DO $$ BEGIN
    CREATE TYPE public.clube_rota_ref_tipo AS ENUM (
        'portal',
        'escuta',
        'aula',
        'encontro',
        'laboratorio',
        'integracao'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Criar Tabela de Itens da Rota (Playlist da Estação)
CREATE TABLE IF NOT EXISTS public.clube_rota_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estacao_id UUID NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    ordem INT NOT NULL,
    slug TEXT NOT NULL,
    titulo TEXT NOT NULL,
    subtitulo TEXT,
    icone TEXT,
    tipo TEXT NOT NULL, -- 'portal' | 'audio' | 'aula' | 'chat_livro' | 'laboratorio' | 'jardim' | 'encontro' | 'escuta' | 'aplicacao' | 'fechamento'
    
    -- Referência Controlada
    ref_tipo public.clube_rota_ref_tipo,
    ref_id UUID,
    
    -- Conteúdo Inline
    conteudo_inline JSONB DEFAULT '{}',
    
    rota_custom TEXT,
    publicado BOOLEAN DEFAULT false,
    obrigatorio BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(estacao_id, ordem),
    UNIQUE(estacao_id, slug)
);

-- 3. Criar Tabela de Progresso da Aluna
CREATE TABLE IF NOT EXISTS public.clube_rota_progresso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    estacao_id UUID NOT NULL REFERENCES public.clube_estacoes(id) ON DELETE CASCADE,
    rota_item_id UUID NOT NULL REFERENCES public.clube_rota_itens(id) ON DELETE CASCADE,
    
    status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started' | 'in_progress' | 'completed'
    data_inicio TIMESTAMPTZ,
    data_conclusao TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id, rota_item_id)
);

-- 4. Habilitar RLS
ALTER TABLE public.clube_rota_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_rota_progresso ENABLE ROW LEVEL SECURITY;

-- 5. Políticas para Itens da Rota (Usando is_admin(uuid))
CREATE POLICY "Itens publicados visíveis por todos autenticados"
ON public.clube_rota_itens FOR SELECT
TO authenticated
USING (publicado = true OR public.is_admin(auth.uid()));

CREATE POLICY "Apenas admins gerenciam itens da rota"
ON public.clube_rota_itens FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 6. Políticas para Progresso
CREATE POLICY "Usuárias veem seu próprio progresso"
ON public.clube_rota_progresso FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Usuárias gerenciam seu próprio progresso"
ON public.clube_rota_progresso FOR ALL
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- 7. Trigger para Updated_at
CREATE TRIGGER update_clube_rota_itens_updated_at
    BEFORE UPDATE ON public.clube_rota_itens
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clube_rota_progresso_updated_at
    BEFORE UPDATE ON public.clube_rota_progresso
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
