-- 1. Tabela de Rituais Simbólicos
CREATE TABLE public.rituais_simbolicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  porta_associada TEXT,
  material TEXT,
  instrucao TEXT NOT NULL,
  duracao_segundos INTEGER DEFAULT 60,
  frase_unica TEXT,
  silencio_obrigatorio BOOLEAN DEFAULT false,
  observacoes_facilitadora TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Mapeamento Big5 → Porta
CREATE TABLE public.big5_porta_mapeamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fator_alto TEXT NOT NULL,
  fator_baixo TEXT NOT NULL,
  porta_associada TEXT NOT NULL,
  porta_tipo_campo TEXT,
  ritual_id UUID REFERENCES public.rituais_simbolicos(id),
  descricao_combinacao TEXT,
  narrativa_curta TEXT,
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(fator_alto, fator_baixo)
);

-- 3. Tabela de Registros de Ritual
CREATE TABLE public.big5_ritual_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  big5_registro_id UUID REFERENCES public.big5_oracular_registros(id),
  ritual_id UUID REFERENCES public.rituais_simbolicos(id),
  porta_acessada TEXT,
  completado_em TIMESTAMPTZ,
  acessou_narroterapia BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_big5_ritual_registros_user ON public.big5_ritual_registros(user_id);
CREATE INDEX idx_big5_porta_mapeamento_fatores ON public.big5_porta_mapeamento(fator_alto, fator_baixo);

-- RLS
ALTER TABLE public.rituais_simbolicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.big5_porta_mapeamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.big5_ritual_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read rituais" ON public.rituais_simbolicos FOR SELECT USING (true);
CREATE POLICY "Public read mapeamento" ON public.big5_porta_mapeamento FOR SELECT USING (true);
CREATE POLICY "Users manage own ritual registros" ON public.big5_ritual_registros FOR ALL USING (auth.uid() = user_id);

-- Inserir Rituais Canônicos
INSERT INTO public.rituais_simbolicos (slug, nome, porta_associada, material, instrucao, duracao_segundos, frase_unica, silencio_obrigatorio, ordem) VALUES
('peso-nao-nomeia', 'O Peso que Não se Nomeia', 'Porta do Osso', 'uma pedra pequena', 'Segure a pedra por 1 minuto em silêncio. Depois, coloque-a no chão.', 60, 'Nem tudo que sustento precisa continuar comigo.', true, 1),
('traco-unico', 'O Traço Único', 'Porta do Labirinto', 'papel + lápis', 'Desenhe uma única linha contínua, sem levantar o lápis.', 60, 'Um caminho basta por agora.', false, 2),
('limite-invisivel', 'O Limite Invisível', 'Porta da Queda', NULL, 'Cruze os braços lentamente sobre o peito. Respire 3 vezes.', 45, 'Aqui termina o outro. Aqui começo eu.', false, 3),
('pausa-deliberada', 'A Pausa Deliberada', 'Porta do Limiar', NULL, '2 minutos de silêncio absoluto.', 120, NULL, true, 4),
('nomear-sem-explicar', 'Nomear sem Explicar', 'Porta da Descida', 'papel', 'Escreva uma palavra que represente seu estado. Não converse sobre ela. Guarde-a.', 60, NULL, true, 5);

-- Inserir Mapeamentos Fatores → Portas
INSERT INTO public.big5_porta_mapeamento (fator_alto, fator_baixo, porta_associada, porta_tipo_campo, ritual_id, narrativa_curta, ordem) VALUES
('torre_interna', 'porta_abalo', 'Porta do Osso', 'dissolucao', 
 (SELECT id FROM public.rituais_simbolicos WHERE slug = 'peso-nao-nomeia'),
 'Força externa, tensão interna. O campo pede contenção, não explicação.', 1),
('porta_possivel', 'torre_interna', 'Porta do Labirinto', 'limiar',
 (SELECT id FROM public.rituais_simbolicos WHERE slug = 'traco-unico'),
 'Visão sem contorno. O campo pede um único passo, não mil possibilidades.', 2),
('campo_outro', 'torre_interna', 'Porta da Queda', 'dissolucao',
 (SELECT id FROM public.rituais_simbolicos WHERE slug = 'limite-invisivel'),
 'Empatia sem eixo. O campo pede limite, não mais entrega.', 3),
('voz_mundo', 'campo_outro', 'Porta do Limiar', 'limiar',
 (SELECT id FROM public.rituais_simbolicos WHERE slug = 'pausa-deliberada'),
 'Ação sem escuta. O campo pede silêncio, não mais palavras.', 4),
('porta_abalo', 'voz_mundo', 'Porta da Descida', 'dissolucao',
 (SELECT id FROM public.rituais_simbolicos WHERE slug = 'nomear-sem-explicar'),
 'Tempestade interna, recolhimento externo. O campo pede nome, não história.', 5);