-- Add visual DNA system for oracles
-- 1. Add symbolic_focus column to oracle_cards (the ONLY variable per card)
ALTER TABLE public.oracle_cards 
ADD COLUMN IF NOT EXISTS symbolic_focus TEXT;

-- Add comment explaining the column
COMMENT ON COLUMN public.oracle_cards.symbolic_focus IS 'The only variable element for AI image generation (e.g., door, spiral, labyrinth, veil, key, descent, threshold)';

-- 2. Add generated image tracking
ALTER TABLE public.oracle_cards 
ADD COLUMN IF NOT EXISTS ai_generated_image_url TEXT;

-- 3. Insert the master visual prompt into ai_global_settings (immutable DNA)
INSERT INTO public.ai_global_settings (chave, valor, descricao, ativo)
VALUES (
  'oracle_visual_master_prompt',
  'Abstract archetypal symbolic art. Non-literal, non-illustrative. Ritualistic and contemplative mood. No text, no symbols with fixed meaning. No realistic human faces. Feminine archetypal energy without gender stereotypes. Soft light emerging from shadow. Depth, silence, liminality, inner threshold. Timeless aesthetic. Muted palette with gold, deep indigo, bone, charcoal and soft earth tones. High visual coherence. Feels like a symbolic mirror, not an explanation.',
  'Prompt-mãe visual IMUTÁVEL para todas as imagens de oráculos. Define o DNA visual da Casa Orácula.',
  true
)
ON CONFLICT (chave) DO UPDATE SET
  valor = EXCLUDED.valor,
  descricao = EXCLUDED.descricao,
  updated_at = now();

-- 4. Create predefined symbolic focus options table
CREATE TABLE IF NOT EXISTS public.oracle_symbolic_focuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.oracle_symbolic_focuses ENABLE ROW LEVEL SECURITY;

-- Everyone can read (needed for admin and generation)
CREATE POLICY "Anyone can read symbolic focuses"
ON public.oracle_symbolic_focuses
FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage symbolic focuses"
ON public.oracle_symbolic_focuses
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Insert predefined symbolic focuses
INSERT INTO public.oracle_symbolic_focuses (nome, descricao, ordem) VALUES
  ('portal', 'Limiar, passagem, entrada para o desconhecido', 1),
  ('espiral', 'Movimento interno, ciclos, retorno transformado', 2),
  ('labirinto', 'Jornada interior, perda criativa, centro oculto', 3),
  ('véu', 'O que separa mundos, revelação gradual', 4),
  ('chave', 'Acesso, poder de abrir, segredo guardado', 5),
  ('descida', 'Profundidade, submundo, encontro com sombra', 6),
  ('ascensão', 'Elevação, luz emergindo, transcendência', 7),
  ('espelho', 'Reflexo, duplo, autocontemplação', 8),
  ('fogo', 'Transformação, purificação, paixão essencial', 9),
  ('água', 'Emoção, fluxo, inconsciente coletivo', 10),
  ('lua', 'Ciclos femininos, intuição, mistério noturno', 11),
  ('semente', 'Potencial oculto, início, promessa latente', 12),
  ('raiz', 'Ancestralidade, fundamento, conexão profunda', 13),
  ('ponte', 'Travessia, conexão entre mundos, mediação', 14),
  ('ninho', 'Acolhimento, gestação, proteção sagrada', 15),
  ('teia', 'Interconexão, destino tecido, padrões ocultos', 16),
  ('máscara', 'Persona, o que se mostra, identidade fluida', 17),
  ('sombra', 'O não integrado, força oculta, potência negada', 18),
  ('coroa', 'Soberania interior, autoridade pessoal', 19),
  ('útero', 'Origem, criação, espaço de gestação', 20)
ON CONFLICT (nome) DO NOTHING;