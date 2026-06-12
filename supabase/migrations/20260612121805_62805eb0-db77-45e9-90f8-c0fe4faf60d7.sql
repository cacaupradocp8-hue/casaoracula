ALTER TABLE public.acessos_fundadora ADD COLUMN IF NOT EXISTS codigo_utilizado TEXT;
COMMENT ON COLUMN public.acessos_fundadora.codigo_utilizado IS 'O código de convite textual que foi utilizado para esta ativação.';
