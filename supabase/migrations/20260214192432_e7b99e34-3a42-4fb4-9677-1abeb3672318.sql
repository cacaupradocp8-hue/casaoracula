
-- Create supervision status enum
DO $$ BEGIN
  CREATE TYPE public.status_supervisao AS ENUM ('privado', 'enviado', 'discutido');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create jardim_do_oficio table
CREATE TABLE public.jardim_do_oficio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  sessao_id UUID REFERENCES public.sessoes_casa_maquinas(id) ON DELETE SET NULL,
  reflexao_profissional TEXT NOT NULL,
  tensao_etica TEXT,
  aprendizado_tecnico TEXT,
  pergunta_supervisao TEXT,
  enviar_para_supervisao BOOLEAN NOT NULL DEFAULT false,
  status_supervisao public.status_supervisao NOT NULL DEFAULT 'privado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jardim_do_oficio ENABLE ROW LEVEL SECURITY;

-- Users can view their own records
CREATE POLICY "Users can view own jardim records"
  ON public.jardim_do_oficio FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own records
CREATE POLICY "Users can insert own jardim records"
  ON public.jardim_do_oficio FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own records
CREATE POLICY "Users can update own jardim records"
  ON public.jardim_do_oficio FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own records
CREATE POLICY "Users can delete own jardim records"
  ON public.jardim_do_oficio FOR DELETE
  USING (auth.uid() = user_id);

-- Admin can view all records (for supervision panel)
CREATE POLICY "Admin can view all jardim records"
  ON public.jardim_do_oficio FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admin can update all records (to mark as discutido)
CREATE POLICY "Admin can update all jardim records"
  ON public.jardim_do_oficio FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Indexes
CREATE INDEX idx_jardim_oficio_user ON public.jardim_do_oficio(user_id);
CREATE INDEX idx_jardim_oficio_status ON public.jardim_do_oficio(status_supervisao);
CREATE INDEX idx_jardim_oficio_cliente ON public.jardim_do_oficio(cliente_id);

-- Updated_at trigger
CREATE TRIGGER update_jardim_oficio_updated_at
  BEFORE UPDATE ON public.jardim_do_oficio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
