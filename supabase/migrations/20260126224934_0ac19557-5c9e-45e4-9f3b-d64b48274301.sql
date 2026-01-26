-- =============================================
-- BIG FIVE FUNCIONAL - TABELAS E DADOS
-- =============================================

-- Tabela de Dimensões
CREATE TABLE public.big5_funcional_dimensoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  nome_ingles TEXT NOT NULL,
  descricao TEXT NOT NULL,
  cor TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Perguntas
CREATE TABLE public.big5_funcional_perguntas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dimensao_id UUID NOT NULL REFERENCES public.big5_funcional_dimensoes(id) ON DELETE CASCADE,
  texto_pergunta TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Registros
CREATE TABLE public.big5_funcional_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  respostas_json JSONB NOT NULL DEFAULT '{}',
  medias_json JSONB NOT NULL DEFAULT '{}',
  dimensao_alta TEXT,
  dimensao_baixa TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.big5_funcional_dimensoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.big5_funcional_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.big5_funcional_registros ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Dimensões (public read)
CREATE POLICY "Dimensões são públicas para leitura"
  ON public.big5_funcional_dimensoes
  FOR SELECT
  USING (true);

CREATE POLICY "Admin pode gerenciar dimensões"
  ON public.big5_funcional_dimensoes
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for Perguntas (public read)
CREATE POLICY "Perguntas são públicas para leitura"
  ON public.big5_funcional_perguntas
  FOR SELECT
  USING (true);

CREATE POLICY "Admin pode gerenciar perguntas"
  ON public.big5_funcional_perguntas
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for Registros (user-owned)
CREATE POLICY "Usuários podem ver seus próprios registros"
  ON public.big5_funcional_registros
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios registros"
  ON public.big5_funcional_registros
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin pode ver todos os registros"
  ON public.big5_funcional_registros
  FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Indexes
CREATE INDEX idx_big5_funcional_perguntas_dimensao ON public.big5_funcional_perguntas(dimensao_id);
CREATE INDEX idx_big5_funcional_registros_user ON public.big5_funcional_registros(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_big5_funcional_dimensoes_updated_at
  BEFORE UPDATE ON public.big5_funcional_dimensoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- INSERIR 5 DIMENSÕES
-- =============================================

INSERT INTO public.big5_funcional_dimensoes (chave, nome, nome_ingles, descricao, cor, ordem) VALUES
('abertura', 'Abertura à Experiência', 'Openness', 'Curiosidade intelectual, flexibilidade cognitiva e receptividade a novas ideias, experiências e perspectivas.', '#8B5CF6', 1),
('conscienciosidade', 'Conscienciosidade', 'Conscientiousness', 'Capacidade de organização, disciplina, confiabilidade e orientação a metas de médio e longo prazo.', '#22C55E', 2),
('extroversao', 'Extroversão', 'Extraversion', 'Energia social, iniciativa em interações, expressividade e orientação para o mundo externo.', '#F59E0B', 3),
('amabilidade', 'Amabilidade', 'Agreeableness', 'Cooperação, empatia, consideração pelo outro e preferência por harmonia nas relações.', '#EC4899', 4),
('neuroticismo', 'Neuroticismo', 'Neuroticism', 'Sensibilidade ao estresse, reatividade emocional e tendência à experiência de emoções negativas.', '#EF4444', 5);

-- =============================================
-- INSERIR 30 PERGUNTAS (6 por dimensão)
-- =============================================

-- Abertura (O)
INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Gosto de questionar ideias estabelecidas, mesmo quando funcionam bem.', 1
FROM public.big5_funcional_dimensoes WHERE chave = 'abertura';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Sinto necessidade de aprender algo novo com frequência.', 2
FROM public.big5_funcional_dimensoes WHERE chave = 'abertura';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Mudanças inesperadas despertam mais curiosidade do que medo em mim.', 3
FROM public.big5_funcional_dimensoes WHERE chave = 'abertura';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Consigo ver valor em perspectivas muito diferentes da minha.', 4
FROM public.big5_funcional_dimensoes WHERE chave = 'abertura';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Ideias abstratas ou conceituais me interessam mais do que instruções rígidas.', 5
FROM public.big5_funcional_dimensoes WHERE chave = 'abertura';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Costumo repensar crenças antigas à luz de novas experiências.', 6
FROM public.big5_funcional_dimensoes WHERE chave = 'abertura';

-- Conscienciosidade (C)
INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Cumpro prazos mesmo quando ninguém está acompanhando meu desempenho.', 1
FROM public.big5_funcional_dimensoes WHERE chave = 'conscienciosidade';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Planejo antes de agir, mesmo em tarefas simples.', 2
FROM public.big5_funcional_dimensoes WHERE chave = 'conscienciosidade';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Tenho facilidade em manter constância em projetos de médio e longo prazo.', 3
FROM public.big5_funcional_dimensoes WHERE chave = 'conscienciosidade';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Quando assumo um compromisso, sinto responsabilidade real em cumpri-lo.', 4
FROM public.big5_funcional_dimensoes WHERE chave = 'conscienciosidade';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Consigo priorizar tarefas mesmo quando estou cansada emocionalmente.', 5
FROM public.big5_funcional_dimensoes WHERE chave = 'conscienciosidade';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Organização me traz clareza, não rigidez.', 6
FROM public.big5_funcional_dimensoes WHERE chave = 'conscienciosidade';

-- Extroversão (E)
INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Falar em público ou em grupo me deixa energizada.', 1
FROM public.big5_funcional_dimensoes WHERE chave = 'extroversao';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Costumo tomar iniciativa em conversas ou projetos coletivos.', 2
FROM public.big5_funcional_dimensoes WHERE chave = 'extroversao';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Prefiro resolver questões conversando do que escrevendo.', 3
FROM public.big5_funcional_dimensoes WHERE chave = 'extroversao';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Me sinto à vontade sendo vista e ouvida.', 4
FROM public.big5_funcional_dimensoes WHERE chave = 'extroversao';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Interações sociais frequentes me estimulam mais do que me drenam.', 5
FROM public.big5_funcional_dimensoes WHERE chave = 'extroversao';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Tenho facilidade em expressar ideias em tempo real.', 6
FROM public.big5_funcional_dimensoes WHERE chave = 'extroversao';

-- Amabilidade (A)
INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Levo em conta o impacto das minhas decisões nas outras pessoas.', 1
FROM public.big5_funcional_dimensoes WHERE chave = 'amabilidade';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Evito conflitos diretos quando acredito que não valem o desgaste.', 2
FROM public.big5_funcional_dimensoes WHERE chave = 'amabilidade';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Consigo ouvir opiniões opostas sem sentir ataque pessoal.', 3
FROM public.big5_funcional_dimensoes WHERE chave = 'amabilidade';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Sou frequentemente vista como alguém acessível.', 4
FROM public.big5_funcional_dimensoes WHERE chave = 'amabilidade';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Me importo genuinamente com o bem-estar de quem convive comigo.', 5
FROM public.big5_funcional_dimensoes WHERE chave = 'amabilidade';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Prefiro acordos colaborativos a disputas de poder.', 6
FROM public.big5_funcional_dimensoes WHERE chave = 'amabilidade';

-- Neuroticismo (N)
INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Mudanças de rotina afetam meu equilíbrio emocional.', 1
FROM public.big5_funcional_dimensoes WHERE chave = 'neuroticismo';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Tenho dificuldade em "desligar" pensamentos preocupantes.', 2
FROM public.big5_funcional_dimensoes WHERE chave = 'neuroticismo';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Reajo intensamente a críticas, mesmo quando são construtivas.', 3
FROM public.big5_funcional_dimensoes WHERE chave = 'neuroticismo';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Situações de incerteza me geram ansiedade.', 4
FROM public.big5_funcional_dimensoes WHERE chave = 'neuroticismo';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Emoções negativas permanecem em mim por mais tempo do que gostaria.', 5
FROM public.big5_funcional_dimensoes WHERE chave = 'neuroticismo';

INSERT INTO public.big5_funcional_perguntas (dimensao_id, texto_pergunta, ordem)
SELECT id, 'Sinto meu corpo reagir rapidamente ao estresse.', 6
FROM public.big5_funcional_dimensoes WHERE chave = 'neuroticismo';