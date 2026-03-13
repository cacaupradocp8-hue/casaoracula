
-- Table for weekly automated content
CREATE TABLE public.clube_conteudo_semanal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ciclo_id uuid REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE NOT NULL,
  semana_numero integer NOT NULL DEFAULT 1,
  data_inicio date NOT NULL DEFAULT CURRENT_DATE,
  data_fim date,
  -- Podcast
  podcast_titulo text,
  podcast_descricao text,
  podcast_audio_url text,
  podcast_externo_url text,
  -- Carta da Semana
  carta_nome text,
  carta_imagem_url text,
  carta_descricao_simbolica text,
  -- Pergunta Contemplativa
  pergunta_contemplativa text,
  -- Prática Terapêutica
  pratica_titulo text,
  pratica_descricao text,
  pratica_guia_url text,
  -- Meta
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User reflections for the clube
CREATE TABLE public.clube_reflexoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ciclo_id uuid REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  conteudo_semanal_id uuid REFERENCES public.clube_conteudo_semanal(id) ON DELETE SET NULL,
  texto text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- User engagement tracking for the clube
CREATE TABLE public.clube_engajamento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  ciclo_id uuid REFERENCES public.clube_livro_ciclos(id) ON DELETE CASCADE,
  acessos integer NOT NULL DEFAULT 0,
  reflexoes_salvas integer NOT NULL DEFAULT 0,
  encontros_participados integer NOT NULL DEFAULT 0,
  nivel text NOT NULL DEFAULT 'baixo' CHECK (nivel IN ('baixo', 'medio', 'alto')),
  progresso float NOT NULL DEFAULT 0.0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, ciclo_id)
);

-- RLS
ALTER TABLE public.clube_conteudo_semanal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_reflexoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clube_engajamento ENABLE ROW LEVEL SECURITY;

-- Conteudo semanal: anyone authenticated can read active content
CREATE POLICY "Authenticated users can read active weekly content"
  ON public.clube_conteudo_semanal FOR SELECT TO authenticated
  USING (ativo = true);

CREATE POLICY "Admins can manage weekly content"
  ON public.clube_conteudo_semanal FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- Reflexoes: users can CRUD their own
CREATE POLICY "Users can read own reflections"
  ON public.clube_reflexoes FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own reflections"
  ON public.clube_reflexoes FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reflections"
  ON public.clube_reflexoes FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins manage reflections"
  ON public.clube_reflexoes FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- Engajamento: users can read/update their own
CREATE POLICY "Users can read own engagement"
  ON public.clube_engajamento FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can upsert own engagement"
  ON public.clube_engajamento FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own engagement"
  ON public.clube_engajamento FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins manage engagement"
  ON public.clube_engajamento FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));
