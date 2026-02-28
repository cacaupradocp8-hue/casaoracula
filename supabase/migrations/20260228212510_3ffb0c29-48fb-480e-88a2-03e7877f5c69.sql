
ALTER TABLE public.clube_livro_ciclos
  ADD COLUMN IF NOT EXISTS carga_horaria_base INTEGER NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS carga_horaria_ajuste INTEGER NOT NULL DEFAULT 0;
