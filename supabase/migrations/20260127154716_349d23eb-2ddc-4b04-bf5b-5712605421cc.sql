-- Adicionar campos clínicos e de ritual à tabela clube_livro_ciclos
ALTER TABLE public.clube_livro_ciclos
ADD COLUMN IF NOT EXISTS tema_simbolico text,
ADD COLUMN IF NOT EXISTS orientacao_clinica_uso text,
ADD COLUMN IF NOT EXISTS orientacao_clinica_evitar text,
ADD COLUMN IF NOT EXISTS orientacao_clinica_riscos text,
ADD COLUMN IF NOT EXISTS orientacao_clinica_indicado text,
ADD COLUMN IF NOT EXISTS orientacao_clinica_contraindicado text,
ADD COLUMN IF NOT EXISTS ritual_aceite_obrigatorio boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS portal_minimo_clinico text DEFAULT 'aluna_formacao';

-- Adicionar campos de tipo e orientação à tabela clube_livro_fases
ALTER TABLE public.clube_livro_fases
ADD COLUMN IF NOT EXISTS tipo_fase text,
ADD COLUMN IF NOT EXISTS orientacao_curta text;

-- Criar tabela para registrar aceite do ritual por usuário/ciclo
CREATE TABLE IF NOT EXISTS public.clube_livro_ritual_aceites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  ciclo_id uuid NOT NULL REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  aceito_em timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, ciclo_id)
);

-- Habilitar RLS na tabela de aceites
ALTER TABLE public.clube_livro_ritual_aceites ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para aceites do ritual
CREATE POLICY "Users can view their own ritual acceptances"
  ON public.clube_livro_ritual_aceites
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ritual acceptances"
  ON public.clube_livro_ritual_aceites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Comentários para documentação
COMMENT ON COLUMN public.clube_livro_ciclos.tema_simbolico IS 'Tema simbólico do ciclo (ex: DESPERTAR, COLAPSO DO PERSONAGEM)';
COMMENT ON COLUMN public.clube_livro_ciclos.orientacao_clinica_uso IS 'Quando usar este livro com clientes';
COMMENT ON COLUMN public.clube_livro_ciclos.orientacao_clinica_evitar IS 'Quando não usar este livro';
COMMENT ON COLUMN public.clube_livro_ciclos.orientacao_clinica_riscos IS 'Riscos de projeção da terapeuta';
COMMENT ON COLUMN public.clube_livro_ciclos.orientacao_clinica_indicado IS 'Tipo de cliente indicado';
COMMENT ON COLUMN public.clube_livro_ciclos.orientacao_clinica_contraindicado IS 'Tipo de cliente contraindicado';
COMMENT ON COLUMN public.clube_livro_ciclos.ritual_aceite_obrigatorio IS 'Se requer aceite do ritual para entrar';
COMMENT ON COLUMN public.clube_livro_ciclos.portal_minimo_clinico IS 'Portal mínimo para ver aba clínica';
COMMENT ON COLUMN public.clube_livro_fases.tipo_fase IS 'Tipo da fase: chamado, ruptura, reorganizacao, integracao';
COMMENT ON COLUMN public.clube_livro_fases.orientacao_curta IS 'Texto curto de orientação para a fase';