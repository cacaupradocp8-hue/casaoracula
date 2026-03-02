
-- Table for Estúdio de Materiais Oraculares projects
CREATE TABLE public.estudio_projetos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  titulo text NOT NULL DEFAULT 'Novo Projeto',
  modo text NOT NULL DEFAULT 'casa', -- 'casa' or 'externo'
  book_id uuid REFERENCES public.books(id) ON DELETE SET NULL,
  livro_externo_nome text,
  livro_externo_autor text,
  livro_externo_texto text,
  publico_alvo text,
  jornada text,
  estacao_simbolica text,
  num_encontros int DEFAULT 4,
  estrutura_gerada jsonb,
  logo_aluna_url text,
  nome_mentora text,
  nome_grupo text,
  paleta_secundaria text,
  playbook_url text,
  mapa_mental_url text,
  infografico_url text,
  status text NOT NULL DEFAULT 'rascunho',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.estudio_projetos ENABLE ROW LEVEL SECURITY;

-- Only owner with aluna_formacao+ can access
CREATE POLICY "Owner can view own projects"
ON public.estudio_projetos FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Formacao users can create projects"
ON public.estudio_projetos FOR INSERT
WITH CHECK (auth.uid() = owner_id AND public.has_portal_access(auth.uid(), 'aluna_formacao'));

CREATE POLICY "Owner can update own projects"
ON public.estudio_projetos FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Owner can delete own projects"
ON public.estudio_projetos FOR DELETE
USING (auth.uid() = owner_id);

-- Admin can see all
CREATE POLICY "Admin can view all projects"
ON public.estudio_projetos FOR SELECT
USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_estudio_projetos_updated_at
BEFORE UPDATE ON public.estudio_projetos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
