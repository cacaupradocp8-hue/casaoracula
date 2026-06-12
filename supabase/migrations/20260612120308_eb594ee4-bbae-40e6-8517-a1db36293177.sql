-- Tabela de Convites
CREATE TABLE public.convites_fundadora (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT true,
    limite_uso INTEGER NOT NULL DEFAULT 1,
    usos_realizados INTEGER NOT NULL DEFAULT 0,
    dias_acesso INTEGER NOT NULL DEFAULT 7,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Acessos dos Usuários
CREATE TABLE public.acessos_fundadora (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    codigo_id UUID NOT NULL REFERENCES public.convites_fundadora(id) ON DELETE CASCADE,
    data_ativacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    data_expiracao TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.convites_fundadora ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.acessos_fundadora ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT ON public.convites_fundadora TO authenticated;
GRANT ALL ON public.convites_fundadora TO service_role;

GRANT SELECT ON public.acessos_fundadora TO authenticated;
GRANT ALL ON public.acessos_fundadora TO service_role;

-- Policies
CREATE POLICY "Qualquer usuário autenticado pode validar um convite" ON public.convites_fundadora
    FOR SELECT TO authenticated USING (ativo = true);

CREATE POLICY "Usuários podem ver seus próprios acessos" ON public.acessos_fundadora
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_convites_fundadora_updated_at 
    BEFORE UPDATE ON public.convites_fundadora 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();