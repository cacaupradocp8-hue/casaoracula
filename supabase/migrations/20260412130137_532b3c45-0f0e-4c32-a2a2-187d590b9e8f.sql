-- Expand clube_portais with full CMS fields
ALTER TABLE public.clube_portais
  ADD COLUMN IF NOT EXISTS tipo_portal text DEFAULT 'fundacional',
  ADD COLUMN IF NOT EXISTS onde_estamos_jornada text,
  ADD COLUMN IF NOT EXISTS habilidade_simbolica text,
  ADD COLUMN IF NOT EXISTS tensao_central text,
  ADD COLUMN IF NOT EXISTS o_que_nao_fazer text,
  ADD COLUMN IF NOT EXISTS leitura_etica text,
  ADD COLUMN IF NOT EXISTS audio_url text,
  ADD COLUMN IF NOT EXISTS audio_titulo text,
  ADD COLUMN IF NOT EXISTS audio_duracao text,
  ADD COLUMN IF NOT EXISTS audio_roteiro text,
  ADD COLUMN IF NOT EXISTS acao_pequena text,
  ADD COLUMN IF NOT EXISTS estrutura_replicavel text[],
  ADD COLUMN IF NOT EXISTS regulacao_emocional text,
  ADD COLUMN IF NOT EXISTS laboratorio_integracao text,
  ADD COLUMN IF NOT EXISTS aplicacao_sessao text,
  ADD COLUMN IF NOT EXISTS aplicacao_aula text,
  ADD COLUMN IF NOT EXISTS aplicacao_circulo text,
  ADD COLUMN IF NOT EXISTS ferramenta_nome text,
  ADD COLUMN IF NOT EXISTS ferramenta_campos jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS riscos_eticos text[],
  ADD COLUMN IF NOT EXISTS aula_titulo text,
  ADD COLUMN IF NOT EXISTS aula_data timestamptz,
  ADD COLUMN IF NOT EXISTS aula_link text,
  ADD COLUMN IF NOT EXISTS aula_replay_url text;

-- Complementary audios table
CREATE TABLE IF NOT EXISTS public.clube_portal_audios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL REFERENCES public.clube_portais(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  audio_url text,
  ordem integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clube_portal_audios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read portal audios" ON public.clube_portal_audios FOR SELECT USING (true);
CREATE POLICY "Admins can manage portal audios" ON public.clube_portal_audios FOR ALL USING (public.is_admin(auth.uid()));

-- Materials table (PDFs, videos, slides, etc.)
CREATE TABLE IF NOT EXISTS public.clube_portal_materiais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL REFERENCES public.clube_portais(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'pdf', -- pdf, video, slide, texto
  titulo text NOT NULL,
  descricao text,
  file_url text,
  link_externo text,
  conteudo_texto text,
  ordem integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clube_portal_materiais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read portal materials" ON public.clube_portal_materiais FOR SELECT USING (true);
CREATE POLICY "Admins can manage portal materials" ON public.clube_portal_materiais FOR ALL USING (public.is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_clube_portal_audios_updated_at
  BEFORE UPDATE ON public.clube_portal_audios
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clube_portal_materiais_updated_at
  BEFORE UPDATE ON public.clube_portal_materiais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();