-- =============================================
-- O LABIRINTO DA HEROÍNA INTERNA® - APENAS ESTRUTURA
-- =============================================

-- Verificar se as tabelas já existem e criar apenas se não existirem
DO $$
BEGIN
  -- Verificar tipo enum
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'labirinto_modo_uso') THEN
    CREATE TYPE labirinto_modo_uso AS ENUM ('individual', 'grupo', 'constelacao', 'mentoria');
  END IF;
END $$;

-- CAMADA 1: Fases da Jornada
CREATE TABLE IF NOT EXISTS public.labirinto_fases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ordem INTEGER NOT NULL DEFAULT 0,
  nome TEXT NOT NULL,
  subtitulo TEXT,
  descricao TEXT NOT NULL,
  icone TEXT,
  cor_acento TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CAMADA 2: Arquétipos Femininos (Luz & Sombra)
CREATE TABLE IF NOT EXISTS public.labirinto_arquetipos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ordem INTEGER NOT NULL DEFAULT 0,
  nome TEXT NOT NULL,
  descricao_luz TEXT NOT NULL,
  descricao_sombra TEXT NOT NULL,
  territorio TEXT,
  icone TEXT,
  cor_acento TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CAMADA 3: Metáforas do Labirinto
CREATE TABLE IF NOT EXISTS public.labirinto_metaforas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ordem INTEGER NOT NULL DEFAULT 0,
  nome TEXT NOT NULL,
  texto_evocativo TEXT NOT NULL,
  pergunta_reflexao TEXT,
  icone TEXT,
  cor_acento TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- CAMADA 4: Rituais / Ações Simbólicas
CREATE TABLE IF NOT EXISTS public.labirinto_rituais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ordem INTEGER NOT NULL DEFAULT 0,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  duracao TEXT,
  instrucoes TEXT,
  icone TEXT,
  cor_acento TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Registros de uso (persistência das escolhas da usuária)
CREATE TABLE IF NOT EXISTS public.labirinto_registros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  terapeuta_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_case_id UUID REFERENCES public.session_cases(id) ON DELETE SET NULL,
  modo_uso labirinto_modo_uso NOT NULL DEFAULT 'individual',
  
  -- Seleções das 4 camadas
  fase_id UUID REFERENCES public.labirinto_fases(id) ON DELETE SET NULL,
  arquetipo_id UUID REFERENCES public.labirinto_arquetipos(id) ON DELETE SET NULL,
  metafora_id UUID REFERENCES public.labirinto_metaforas(id) ON DELETE SET NULL,
  ritual_id UUID REFERENCES public.labirinto_rituais(id) ON DELETE SET NULL,
  
  -- Reflexões livres
  reflexao_fase TEXT,
  reflexao_arquetipo TEXT,
  reflexao_metafora TEXT,
  reflexao_ritual TEXT,
  reflexao_final TEXT,
  
  -- Metadados
  concluido BOOLEAN NOT NULL DEFAULT false,
  concluido_em TIMESTAMP WITH TIME ZONE,
  notas_terapeuta TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.labirinto_fases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labirinto_arquetipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labirinto_metaforas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labirinto_rituais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labirinto_registros ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura (conteúdo público para usuárias autenticadas)
CREATE POLICY "Authenticated users can view active fases" 
ON public.labirinto_fases FOR SELECT 
USING (ativo = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view active arquetipos" 
ON public.labirinto_arquetipos FOR SELECT 
USING (ativo = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view active metaforas" 
ON public.labirinto_metaforas FOR SELECT 
USING (ativo = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view active rituais" 
ON public.labirinto_rituais FOR SELECT 
USING (ativo = true AND auth.uid() IS NOT NULL);

-- Admin pode gerenciar tudo
CREATE POLICY "Admin can manage fases" 
ON public.labirinto_fases FOR ALL 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can manage arquetipos" 
ON public.labirinto_arquetipos FOR ALL 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can manage metaforas" 
ON public.labirinto_metaforas FOR ALL 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can manage rituais" 
ON public.labirinto_rituais FOR ALL 
USING (public.is_admin(auth.uid()));

-- Políticas para registros
CREATE POLICY "Users can view own registros" 
ON public.labirinto_registros FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = terapeuta_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own registros" 
ON public.labirinto_registros FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registros" 
ON public.labirinto_registros FOR UPDATE 
USING (auth.uid() = user_id OR auth.uid() = terapeuta_id OR public.is_admin(auth.uid()));

CREATE POLICY "Admin can delete registros" 
ON public.labirinto_registros FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_labirinto_fases_updated_at ON public.labirinto_fases;
CREATE TRIGGER update_labirinto_fases_updated_at
BEFORE UPDATE ON public.labirinto_fases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_labirinto_arquetipos_updated_at ON public.labirinto_arquetipos;
CREATE TRIGGER update_labirinto_arquetipos_updated_at
BEFORE UPDATE ON public.labirinto_arquetipos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_labirinto_metaforas_updated_at ON public.labirinto_metaforas;
CREATE TRIGGER update_labirinto_metaforas_updated_at
BEFORE UPDATE ON public.labirinto_metaforas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_labirinto_rituais_updated_at ON public.labirinto_rituais;
CREATE TRIGGER update_labirinto_rituais_updated_at
BEFORE UPDATE ON public.labirinto_rituais
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_labirinto_registros_updated_at ON public.labirinto_registros;
CREATE TRIGGER update_labirinto_registros_updated_at
BEFORE UPDATE ON public.labirinto_registros
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_labirinto_registros_user ON public.labirinto_registros(user_id);
CREATE INDEX IF NOT EXISTS idx_labirinto_registros_terapeuta ON public.labirinto_registros(terapeuta_id);
CREATE INDEX IF NOT EXISTS idx_labirinto_registros_session ON public.labirinto_registros(session_case_id);