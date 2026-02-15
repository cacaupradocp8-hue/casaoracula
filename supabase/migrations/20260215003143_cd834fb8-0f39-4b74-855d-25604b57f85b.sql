
-- Add contexto_origem field to jardim_do_oficio
ALTER TABLE public.jardim_do_oficio
ADD COLUMN contexto_origem TEXT NULL;

COMMENT ON COLUMN public.jardim_do_oficio.contexto_origem IS 'Contexto simbólico trazido do Jardim da Heroína (gesto, narrativa, etc.)';
