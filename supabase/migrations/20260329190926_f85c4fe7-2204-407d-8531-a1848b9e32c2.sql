
-- Tabela para armazenar conteúdos semanais do Clube de Leitura
CREATE TABLE public.clube_livro_semana (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ciclo_id UUID REFERENCES public.clube_livro_ciclos(id),
  semana_numero INTEGER NOT NULL DEFAULT 1,
  livro TEXT NOT NULL,
  capitulo_trecho TEXT NOT NULL,
  -- Conteúdos gerados
  podcast_roteiro TEXT,
  podcast_audio_url TEXT,
  carta_semana TEXT,
  pergunta_contemplativa TEXT,
  pratica_terapeutica TEXT,
  -- Metadados
  status TEXT NOT NULL DEFAULT 'rascunho',
  publicado_em TIMESTAMPTZ,
  gerado_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.clube_livro_semana ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "admin_full_access_semana" ON public.clube_livro_semana
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- Alunas podem ler publicados
CREATE POLICY "alunas_read_published_semana" ON public.clube_livro_semana
  FOR SELECT TO authenticated
  USING (status = 'publicado');

-- Trigger updated_at
CREATE TRIGGER update_clube_livro_semana_updated_at
  BEFORE UPDATE ON public.clube_livro_semana
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
