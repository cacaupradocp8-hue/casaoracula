-- P2: Add connectivity fields to sala_ferramentas
ALTER TABLE public.sala_ferramentas 
  ADD COLUMN IF NOT EXISTS categoria_metodo text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS proximo_passo text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS ferramenta_pai_id uuid REFERENCES public.sala_ferramentas(id) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS e_complementar boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.sala_ferramentas.categoria_metodo IS 'diagnostico, conducao, cartografia, integracao, autoexploracao, comunidade, formacao';
COMMENT ON COLUMN public.sala_ferramentas.proximo_passo IS 'Rota ou ID da ferramenta seguinte no fluxo do método';
COMMENT ON COLUMN public.sala_ferramentas.ferramenta_pai_id IS 'Se complementar, aponta para a ferramenta principal';
COMMENT ON COLUMN public.sala_ferramentas.e_complementar IS 'Se true, é sub-ferramenta de outra';