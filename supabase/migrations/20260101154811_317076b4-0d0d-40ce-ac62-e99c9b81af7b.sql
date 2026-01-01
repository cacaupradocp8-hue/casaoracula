-- Add function to validate agent access
CREATE OR REPLACE FUNCTION public.can_access_agent(_user_id UUID, _agent_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM agentes a 
    WHERE a.id = _agent_id 
      AND a.status = 'ativo'
      AND has_portal_access(_user_id, a.portal_minimo)
  )
$$;

-- Drop existing INSERT policy that allows any agente_id
DROP POLICY IF EXISTS "Users can manage own conversations" ON public.agente_conversas;

-- Create separate policies for different operations
CREATE POLICY "Users can create conversations with accessible agents"
ON public.agente_conversas
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND can_access_agent(auth.uid(), agente_id)
);

CREATE POLICY "Users can view own conversations"
ON public.agente_conversas
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
ON public.agente_conversas
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations"
ON public.agente_conversas
FOR DELETE
USING (auth.uid() = user_id);