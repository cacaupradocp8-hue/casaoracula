-- Adicionar campos de copy padronizado para ferramentas
ALTER TABLE public.sala_ferramentas 
  ADD COLUMN IF NOT EXISTS texto_quando_usar TEXT,
  ADD COLUMN IF NOT EXISTS texto_o_que_sustenta TEXT,
  ADD COLUMN IF NOT EXISTS texto_como_atravessar TEXT,
  ADD COLUMN IF NOT EXISTS categoria_badge TEXT DEFAULT 'padrao' CHECK (categoria_badge IN ('padrao', 'autoral', 'metodo_oracula')),
  ADD COLUMN IF NOT EXISTS familia_simbolica TEXT;

-- Comentários para documentação
COMMENT ON COLUMN public.sala_ferramentas.texto_quando_usar IS 'Texto explicando o contexto de uso da ferramenta';
COMMENT ON COLUMN public.sala_ferramentas.texto_o_que_sustenta IS 'Texto ético sobre o que a ferramenta sustenta (sem promessas de cura)';
COMMENT ON COLUMN public.sala_ferramentas.texto_como_atravessar IS 'Orientação de uso: individual, sessão, grupo';
COMMENT ON COLUMN public.sala_ferramentas.categoria_badge IS 'Badge visual: padrao, autoral, metodo_oracula';
COMMENT ON COLUMN public.sala_ferramentas.familia_simbolica IS 'Família simbólica: ego_identidade, sombra, corpo, imprevisivel, narrativa, oraculares';