
-- Add sala_id column to conteudo_travessias
ALTER TABLE public.conteudo_travessias
ADD COLUMN sala_id UUID REFERENCES public.salas(id) ON DELETE SET NULL;

-- Create index for the foreign key
CREATE INDEX idx_conteudo_travessias_sala_id ON public.conteudo_travessias(sala_id);

-- Add comment for documentation
COMMENT ON COLUMN public.conteudo_travessias.sala_id IS 'Sala associada à travessia. Se null, travessia não está vinculada a nenhuma sala específica.';
