-- Tabela para comentários das alunas na Travessia Zero
CREATE TABLE IF NOT EXISTS public.travessia_comentarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  travessia_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  conteudo text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.travessia_comentarios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Todos autenticados podem ver comentários
CREATE POLICY "Authenticated users can view comments"
ON public.travessia_comentarios
FOR SELECT TO authenticated
USING (true);

-- Usuários podem criar seus próprios comentários
CREATE POLICY "Users can create own comments"
ON public.travessia_comentarios
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Usuários podem editar seus próprios comentários
CREATE POLICY "Users can update own comments"
ON public.travessia_comentarios
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seus próprios comentários
CREATE POLICY "Users can delete own comments"
ON public.travessia_comentarios
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Admins têm acesso total
CREATE POLICY "Admins have full access to comments"
ON public.travessia_comentarios
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

-- Índices para performance
CREATE INDEX idx_travessia_comentarios_travessia ON public.travessia_comentarios(travessia_id);
CREATE INDEX idx_travessia_comentarios_created ON public.travessia_comentarios(created_at DESC);

-- Trigger para updated_at
CREATE TRIGGER update_travessia_comentarios_updated_at
BEFORE UPDATE ON public.travessia_comentarios
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();