-- =====================================================
-- LABIRINTO DAS 39 PORTAS - Database Structure
-- =====================================================

-- Main table for the 39 Doors
CREATE TABLE public.labirinto_portas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero INTEGER NOT NULL UNIQUE CHECK (numero >= 1 AND numero <= 99),
  nome TEXT NOT NULL,
  subtitulo TEXT,
  
  -- Symbolic content
  imagem_url TEXT,
  ai_generated_image_url TEXT,
  symbolic_focus TEXT,
  
  -- Core reading content
  cena_narrativa TEXT, -- Short narrative scene
  eixo_psiquico TEXT, -- Psychic axis
  risco_clinico TEXT, -- Clinical risk (symbolic, not diagnostic)
  pergunta_chave TEXT, -- Key question
  
  -- Mirror Case (professional layer)
  caso_espelho_titulo TEXT,
  caso_espelho_frase_chegada TEXT, -- "Arrival sentence"
  caso_espelho_erro_comum TEXT, -- Where facilitators usually make mistakes
  caso_espelho_como_sustentar TEXT, -- How to sustain the field
  
  -- Facilitator Key (restricted layer)
  chave_frase_ancora TEXT, -- Anchor phrase
  chave_o_que_nao_fazer TEXT, -- What NOT to do
  chave_quando_parar TEXT, -- When to stop the process
  chave_sinal_maturidade TEXT, -- Sign of clinical maturity
  
  -- Visibility & ordering
  ativa BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 0,
  portal_minimo public.portal_type NOT NULL DEFAULT 'pre_iniciada',
  portal_caso_espelho public.portal_type NOT NULL DEFAULT 'iniciada',
  portal_chave_facilitadora public.portal_type NOT NULL DEFAULT 'iniciada',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Facilitator notes per door per user
CREATE TABLE public.labirinto_anotacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  porta_id UUID NOT NULL REFERENCES public.labirinto_portas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  anotacao TEXT NOT NULL,
  tipo TEXT DEFAULT 'geral', -- 'geral', 'sessao', 'insight'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(porta_id, user_id, cliente_id, created_at)
);

-- Reading history (when a door is activated/consulted)
CREATE TABLE public.labirinto_leituras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  porta_id UUID NOT NULL REFERENCES public.labirinto_portas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  
  metodo_ativacao TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'oraculo'
  contexto TEXT, -- Optional context from user
  reflexoes TEXT, -- User's reflections after reading
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.labirinto_portas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labirinto_anotacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labirinto_leituras ENABLE ROW LEVEL SECURITY;

-- RLS Policies for labirinto_portas
CREATE POLICY "Portas are viewable by authenticated users with portal access"
  ON public.labirinto_portas
  FOR SELECT
  TO authenticated
  USING (
    ativa = true 
    AND has_portal_access(auth.uid(), portal_minimo)
  );

CREATE POLICY "Admins can manage all portas"
  ON public.labirinto_portas
  FOR ALL
  TO authenticated
  USING (get_user_portal(auth.uid()) = 'admin')
  WITH CHECK (get_user_portal(auth.uid()) = 'admin');

-- RLS Policies for labirinto_anotacoes
CREATE POLICY "Users can view their own notes"
  ON public.labirinto_anotacoes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own notes"
  ON public.labirinto_anotacoes
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND has_portal_access(auth.uid(), 'pre_iniciada'));

CREATE POLICY "Users can update their own notes"
  ON public.labirinto_anotacoes
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notes"
  ON public.labirinto_anotacoes
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notes"
  ON public.labirinto_anotacoes
  FOR ALL
  TO authenticated
  USING (get_user_portal(auth.uid()) = 'admin');

-- RLS Policies for labirinto_leituras
CREATE POLICY "Users can view their own readings"
  ON public.labirinto_leituras
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own readings"
  ON public.labirinto_leituras
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND has_portal_access(auth.uid(), 'pre_iniciada'));

CREATE POLICY "Admins can view all readings"
  ON public.labirinto_leituras
  FOR SELECT
  TO authenticated
  USING (get_user_portal(auth.uid()) = 'admin');

-- Triggers for updated_at
CREATE TRIGGER update_labirinto_portas_updated_at
  BEFORE UPDATE ON public.labirinto_portas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_labirinto_anotacoes_updated_at
  BEFORE UPDATE ON public.labirinto_anotacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create first 39 doors (placeholders for admin to fill)
INSERT INTO public.labirinto_portas (numero, nome, ordem) VALUES
  (1, 'Porta do Abandono', 1),
  (2, 'Porta da Raiva Sagrada', 2),
  (3, 'Porta do Silêncio', 3),
  (4, 'Porta da Vergonha', 4),
  (5, 'Porta do Luto', 5),
  (6, 'Porta da Culpa', 6),
  (7, 'Porta do Medo', 7),
  (8, 'Porta da Solidão', 8),
  (9, 'Porta do Desejo', 9),
  (10, 'Porta da Entrega', 10),
  (11, 'Porta do Controle', 11),
  (12, 'Porta da Submissão', 12),
  (13, 'Porta da Rebelião', 13),
  (14, 'Porta do Corpo', 14),
  (15, 'Porta da Voz', 15),
  (16, 'Porta do Espelho', 16),
  (17, 'Porta da Sombra', 17),
  (18, 'Porta da Máscara', 18),
  (19, 'Porta do Véu', 19),
  (20, 'Porta do Limiar', 20),
  (21, 'Porta da Descida', 21),
  (22, 'Porta do Renascimento', 22),
  (23, 'Porta da Ancestralidade', 23),
  (24, 'Porta da Maternidade', 24),
  (25, 'Porta da Filha', 25),
  (26, 'Porta da Irmã', 26),
  (27, 'Porta da Amante', 27),
  (28, 'Porta da Bruxa', 28),
  (29, 'Porta da Curandeira', 29),
  (30, 'Porta da Anciã', 30),
  (31, 'Porta do Sagrado Feminino', 31),
  (32, 'Porta da Criança Interior', 32),
  (33, 'Porta da Intuição', 33),
  (34, 'Porta dos Ciclos', 34),
  (35, 'Porta da Transformação', 35),
  (36, 'Porta do Vazio', 36),
  (37, 'Porta da Plenitude', 37),
  (38, 'Porta da Integração', 38),
  (39, 'Porta do Retorno', 39);

-- Add symbolic focuses for labirinto doors
INSERT INTO public.oracle_symbolic_focuses (nome, descricao, ordem) VALUES
  ('abandono', 'Porta do Abandono - vazio, ausência, desamparo', 50),
  ('raiva-sagrada', 'Porta da Raiva Sagrada - fogo interior, limite, força', 51),
  ('silencio', 'Porta do Silêncio - pausa, escuta, recolhimento', 52),
  ('vergonha', 'Porta da Vergonha - ocultação, ferida de exposição', 53),
  ('luto', 'Porta do Luto - perda, travessia, despedida', 54),
  ('ancestralidade', 'Porta da Ancestralidade - raízes, linhagem, herança', 55)
ON CONFLICT DO NOTHING;