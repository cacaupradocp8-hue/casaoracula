
-- Add portal_id column to sala_ferramentas to link tools directly to Portais
ALTER TABLE public.sala_ferramentas 
ADD COLUMN IF NOT EXISTS portal_id UUID REFERENCES public.conteudo_travessias(id) ON DELETE SET NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.sala_ferramentas.portal_id IS 'Optional: Link ferramenta directly to a Portal (conteudo_travessias). Ferramentas in Sala da Formação should always have a portal_id.';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_sala_ferramentas_portal_id ON public.sala_ferramentas(portal_id);
