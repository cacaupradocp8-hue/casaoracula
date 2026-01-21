-- Tabela para armazenar pedidos de degustação de visitantes
CREATE TABLE public.degustacao_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'expirado')),
  motivo TEXT,
  admin_notes TEXT,
  aprovado_por UUID REFERENCES auth.users(id),
  aprovado_em TIMESTAMP WITH TIME ZONE,
  expira_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.degustacao_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own requests
CREATE POLICY "Users can view own requests"
ON public.degustacao_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own requests (only if not already pending)
CREATE POLICY "Users can create requests"
ON public.degustacao_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all requests
CREATE POLICY "Admins can view all requests"
ON public.degustacao_requests
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND portal = 'admin'
  )
);

-- Policy: Admins can update requests (approve/reject)
CREATE POLICY "Admins can update requests"
ON public.degustacao_requests
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND portal = 'admin'
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_degustacao_requests_updated_at
BEFORE UPDATE ON public.degustacao_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create notifications for admin when new request is created
CREATE OR REPLACE FUNCTION public.notify_admin_degustacao_request()
RETURNS TRIGGER AS $$
DECLARE
  admin_ids UUID[];
  admin_id UUID;
  user_name TEXT;
BEGIN
  -- Get all admin IDs
  SELECT ARRAY_AGG(id) INTO admin_ids
  FROM public.profiles
  WHERE portal = 'admin';
  
  -- Get user name
  SELECT COALESCE(full_name, email, 'Visitante') INTO user_name
  FROM public.profiles
  WHERE id = NEW.user_id;
  
  -- Create notification for each admin
  IF admin_ids IS NOT NULL THEN
    FOREACH admin_id IN ARRAY admin_ids
    LOOP
      INSERT INTO public.notificacoes (user_id, tipo, titulo, mensagem, dados)
      VALUES (
        admin_id,
        'degustacao_request',
        'Novo pedido de degustação',
        user_name || ' solicitou acesso de degustação por 24h.',
        jsonb_build_object(
          'request_id', NEW.id,
          'requester_id', NEW.user_id,
          'requester_name', user_name
        )
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to notify admins on new request
CREATE TRIGGER on_degustacao_request_created
AFTER INSERT ON public.degustacao_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_degustacao_request();