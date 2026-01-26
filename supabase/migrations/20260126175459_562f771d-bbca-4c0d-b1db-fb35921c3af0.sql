-- Tabela para Diário de Bordo das Aulas
CREATE TABLE public.diario_bordo_aulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  aula_id UUID NOT NULL,
  conteudo TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, aula_id)
);

-- RLS: Apenas o próprio usuário pode ver/editar suas notas
ALTER TABLE public.diario_bordo_aulas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"
  ON public.diario_bordo_aulas
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON public.diario_bordo_aulas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON public.diario_bordo_aulas
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON public.diario_bordo_aulas
  FOR DELETE
  USING (auth.uid() = user_id);

-- Índice para busca rápida
CREATE INDEX idx_diario_bordo_user_aula 
  ON public.diario_bordo_aulas(user_id, aula_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_diario_bordo_updated_at
  BEFORE UPDATE ON public.diario_bordo_aulas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();