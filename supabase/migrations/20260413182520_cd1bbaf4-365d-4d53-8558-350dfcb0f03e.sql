
ALTER TABLE public.clube_livro_ciclos
  ADD COLUMN IF NOT EXISTS voz_dominante text,
  ADD COLUMN IF NOT EXISTS voz_descricao text,
  ADD COLUMN IF NOT EXISTS voz_conducao text,
  ADD COLUMN IF NOT EXISTS voz_pergunta_chave text,
  ADD COLUMN IF NOT EXISTS foco_clinico text,
  ADD COLUMN IF NOT EXISTS mes_numero integer;

COMMENT ON COLUMN public.clube_livro_ciclos.voz_dominante IS 'Nome da Voz dominante do mês (Sistema das 7 Vozes)';
COMMENT ON COLUMN public.clube_livro_ciclos.foco_clinico IS 'Foco clínico do ciclo/mês';
COMMENT ON COLUMN public.clube_livro_ciclos.mes_numero IS 'Número do mês no ano (1-12)';
