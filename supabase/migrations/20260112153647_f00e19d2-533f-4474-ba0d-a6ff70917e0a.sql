-- Create enum for client status
CREATE TYPE public.cliente_status AS ENUM ('ativo', 'pausado', 'encerrado');

-- Create clientes table
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  terapeuta_id UUID NOT NULL,
  nome TEXT NOT NULL,
  status cliente_status NOT NULL DEFAULT 'ativo',
  objetivo_terapeutico TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- RLS: Terapeuta can only see own clients
CREATE POLICY "Terapeutas can view own clients"
ON public.clientes
FOR SELECT
USING (auth.uid() = terapeuta_id);

-- RLS: Terapeuta can create clients
CREATE POLICY "Terapeutas can create own clients"
ON public.clientes
FOR INSERT
WITH CHECK (auth.uid() = terapeuta_id);

-- RLS: Terapeuta can update own clients
CREATE POLICY "Terapeutas can update own clients"
ON public.clientes
FOR UPDATE
USING (auth.uid() = terapeuta_id);

-- RLS: Terapeuta can delete own clients
CREATE POLICY "Terapeutas can delete own clients"
ON public.clientes
FOR DELETE
USING (auth.uid() = terapeuta_id);

-- RLS: Admins can manage all clients
CREATE POLICY "Admins can manage all clients"
ON public.clientes
FOR ALL
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Trigger for updated_at
CREATE TRIGGER update_clientes_updated_at
BEFORE UPDATE ON public.clientes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();