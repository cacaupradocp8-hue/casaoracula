-- =====================================================
-- BIG5 SYMBOLIC: MAP OF THE SOUL FORCES
-- Symbolic, non-numeric assessment tool
-- =====================================================

-- 1. Symbolic Forces Table (the 5 dimensions)
CREATE TABLE public.big5_symbolic_forces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  nome_en TEXT,
  descricao_simbolica TEXT NOT NULL,
  narrativa_elevada TEXT,
  narrativa_fragil TEXT,
  microcopy_reflexao TEXT,
  pratica_sugerida TEXT,
  icone TEXT DEFAULT 'sparkles',
  cor_primaria TEXT DEFAULT '#D4AF37',
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Quiz Statements
CREATE TABLE public.big5_symbolic_afirmacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  force_id UUID NOT NULL REFERENCES public.big5_symbolic_forces(id) ON DELETE CASCADE,
  texto_afirmacao TEXT NOT NULL,
  peso INTEGER NOT NULL DEFAULT 1,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. User Results (symbolic, not numeric)
CREATE TABLE public.big5_symbolic_registros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cliente_id UUID,
  terapeuta_id UUID,
  abertura_intensidade TEXT DEFAULT 'medium' CHECK (abertura_intensidade IN ('low', 'medium', 'high', 'dominant')),
  suporte_intensidade TEXT DEFAULT 'medium' CHECK (suporte_intensidade IN ('low', 'medium', 'high', 'dominant')),
  relacional_intensidade TEXT DEFAULT 'medium' CHECK (relacional_intensidade IN ('low', 'medium', 'high', 'dominant')),
  expressao_intensidade TEXT DEFAULT 'medium' CHECK (expressao_intensidade IN ('low', 'medium', 'high', 'dominant')),
  sensibilidade_intensidade TEXT DEFAULT 'medium' CHECK (sensibilidade_intensidade IN ('low', 'medium', 'high', 'dominant')),
  respostas_json JSONB DEFAULT '{}',
  nome_simbolico TEXT,
  reflexao_final TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.big5_symbolic_forces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.big5_symbolic_afirmacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.big5_symbolic_registros ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active forces" ON public.big5_symbolic_forces FOR SELECT
  USING (ativo = true OR get_user_portal(auth.uid()) = 'admin');
CREATE POLICY "Admin can manage forces" ON public.big5_symbolic_forces FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Anyone can read active statements" ON public.big5_symbolic_afirmacoes FOR SELECT
  USING (ativo = true OR get_user_portal(auth.uid()) = 'admin');
CREATE POLICY "Admin can manage statements" ON public.big5_symbolic_afirmacoes FOR ALL
  USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can view own symbolic records" ON public.big5_symbolic_registros FOR SELECT
  USING (auth.uid() = user_id OR get_user_portal(auth.uid()) = 'admin' OR is_linked_therapist(auth.uid(), user_id));
CREATE POLICY "Users can create own symbolic records" ON public.big5_symbolic_registros FOR INSERT
  WITH CHECK (auth.uid() = user_id OR get_user_portal(auth.uid()) = 'admin');
CREATE POLICY "Users can update own symbolic records" ON public.big5_symbolic_registros FOR UPDATE
  USING (auth.uid() = user_id OR get_user_portal(auth.uid()) = 'admin');

-- Triggers
CREATE TRIGGER update_big5_symbolic_forces_updated_at BEFORE UPDATE ON public.big5_symbolic_forces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_big5_symbolic_afirmacoes_updated_at BEFORE UPDATE ON public.big5_symbolic_afirmacoes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_big5_symbolic_registros_updated_at BEFORE UPDATE ON public.big5_symbolic_registros FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the 5 Symbolic Forces
INSERT INTO public.big5_symbolic_forces (chave, nome, nome_en, descricao_simbolica, narrativa_elevada, narrativa_fragil, microcopy_reflexao, pratica_sugerida, cor_primaria, ordem) VALUES
('abertura_misterio', 'Abertura ao Mistério', 'Openness to Mystery', 'A capacidade de habitar o desconhecido sem precisar nomeá-lo imediatamente. A alma que dança com a incerteza.', 'Quando essa força está viva, você transita entre mundos com fluidez. O mistério não assusta — ele convida. Você permite que a vida te surpreenda, que os sonhos te guiem, que o simbólico fale mais alto que o literal.', 'Quando essa força está fragilizada, o desconhecido se torna ameaça. Há uma urgência por respostas, uma pressa por controle. O mistério vira problema a resolver, não portal a atravessar.', 'O que você tem evitado descobrir sobre si mesma?', 'Escolha uma imagem ou símbolo que te atraia sem saber por quê. Contemple-o por 3 dias sem buscar interpretação.', '#9B59B6', 1),
('eixo_suporte', 'Eixo de Sustentação Interior', 'Axis of Inner Support', 'A estrutura interna que te mantém de pé mesmo quando tudo balança. O centro que não depende do mundo.', 'Quando essa força está presente, você consegue manter clareza em meio ao caos. Há um lugar interno que não cede às opiniões alheias, às crises externas, às tempestades da vida. Você age a partir de si.', 'Quando essa força está fragilizada, você se sente refém das circunstâncias. A opinião do outro pesa mais que a sua verdade. Decisões ficam travadas. O centro parece perdido.', 'O que você sustenta por obrigação, e não por escolha?', 'Identifique uma decisão pequena que você tenha adiado. Tome-a hoje, sem consultar ninguém.', '#3498DB', 2),
('pulso_relacional', 'Pulso Relacional', 'Relational Pulse', 'O movimento entre estar com o outro e estar consigo. O ritmo da intimidade e do recolhimento.', 'Quando essa força está viva, você transita entre conexão e solidão com naturalidade. Sabe quando se aproximar e quando se afastar. O vínculo não te aprisiona, e a solidão não te esmaga.', 'Quando essa força está fragilizada, as relações se tornam fonte de exaustão ou dependência. Ou você se perde no outro, ou foge dele. O pulso se desregula.', 'Com quem você tem estado mais verdadeira — e com quem você performa?', 'Diga uma verdade simples a alguém que você ama. Sem adorno, sem justificativa.', '#27AE60', 3),
('fogo_expressao', 'Fogo da Expressão', 'Fire of Expression', 'A força que transforma o interno em visível. A voz, o gesto, a obra — tudo que nasce de dentro e ganha forma.', 'Quando essa força está acesa, você consegue dar forma ao que sente. A palavra flui, a criação acontece, a presença se impõe. Não há travas entre o que você vive e o que você expressa.', 'Quando essa força está apagada, as palavras entalham. O corpo silencia. Há muito dentro que não encontra saída. A expressão se torna risco, não libertação.', 'O que você tem engolido que precisava ser dito?', 'Escreva uma carta que nunca será enviada. Diga nela tudo que ficou preso.', '#E74C3C', 4),
('sensibilidade_caos', 'Sensibilidade ao Caos', 'Sensitivity to Chaos', 'A capacidade de sentir profundamente o que te atravessa — e metabolizar sem se dissolver.', 'Quando essa força está equilibrada, a sensibilidade é uma lente, não uma ferida. Você sente intensamente, mas não se fragmenta. Consegue acolher o que chega sem se perder no turbilhão.', 'Quando essa força está excessiva ou reprimida, ou você sente demais e se desorganiza, ou você sente de menos e se desconecta. O caos interno não encontra margem.', 'O que você tem sentido que ainda não nomeou?', 'Escolha uma emoção intensa que você viveu recentemente. Dê a ela uma cor, uma textura, um som — antes de dar um nome.', '#F39C12', 5);

-- Insert statements
INSERT INTO public.big5_symbolic_afirmacoes (force_id, texto_afirmacao, peso, ordem) VALUES
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'abertura_misterio'), 'Sinto-me confortável com a incerteza e o desconhecido.', 1, 1),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'abertura_misterio'), 'Permito que os sonhos me guiem mesmo quando não os entendo.', 1, 2),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'abertura_misterio'), 'Consigo habitar perguntas sem pressa por respostas.', 1, 3),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'abertura_misterio'), 'O simbólico me fala mais alto que o literal.', 1, 4),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'eixo_suporte'), 'Mantenho clareza interna mesmo quando tudo ao redor balança.', 1, 1),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'eixo_suporte'), 'Minhas decisões partem de um centro que não depende do mundo.', 1, 2),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'eixo_suporte'), 'Consigo dizer não quando necessário, sem culpa excessiva.', 1, 3),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'eixo_suporte'), 'Reconheço o que é meu e o que é do outro.', 1, 4),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'pulso_relacional'), 'Transito entre conexão e solidão com naturalidade.', 1, 1),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'pulso_relacional'), 'Sei quando me aproximar e quando me afastar.', 1, 2),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'pulso_relacional'), 'Meus vínculos me nutrem mais do que me esgotam.', 1, 3),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'pulso_relacional'), 'Consigo ser verdadeira nas minhas relações importantes.', 1, 4),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'fogo_expressao'), 'Consigo dar forma ao que sinto sem travar.', 1, 1),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'fogo_expressao'), 'Minha voz encontra espaço quando preciso falar.', 1, 2),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'fogo_expressao'), 'Expresso-me sem medo de julgamento.', 1, 3),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'fogo_expressao'), 'A criação é parte natural do meu cotidiano.', 1, 4),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'sensibilidade_caos'), 'Sinto intensamente sem me fragmentar.', 1, 1),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'sensibilidade_caos'), 'Consigo acolher emoções difíceis sem me perder nelas.', 1, 2),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'sensibilidade_caos'), 'Minha sensibilidade é uma lente, não uma ferida.', 1, 3),
((SELECT id FROM public.big5_symbolic_forces WHERE chave = 'sensibilidade_caos'), 'O caos interno encontra margem em mim.', 1, 4);

-- Add to sala_ferramentas with correct sala_id
INSERT INTO public.sala_ferramentas (sala_id, ferramenta_chave, ferramenta_nome, ferramenta_descricao, icone, rota, ordem, ativa, tipo, portal_minimo, has_blocks, slug)
VALUES ('ebb6c62d-7de0-4787-9d46-6c6dbab285f7', 'big5_simbolico', 'Mapa das Forças da Alma', 'Uma leitura simbólica das forças psíquicas atuais — sem diagnósticos, sem números, sem patologia. Apenas um espelho narrativo.', 'sparkles', '/ferramenta/big5-simbolico', 10, true, 'quiz_simbolico', 'pre_iniciada', true, 'big5-simbolico');