
-- Tabela de configuração das dimensões Big5
CREATE TABLE public.big5_dimensoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  perguntas_reflexao TEXT[] DEFAULT '{}',
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela dos tipos do Eneagrama
CREATE TABLE public.eneagrama_tipos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero INTEGER NOT NULL UNIQUE CHECK (numero >= 1 AND numero <= 9),
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  palavras_chave TEXT[] DEFAULT '{}',
  virtude TEXT,
  fixacao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela dos instintos do Eneagrama
CREATE TABLE public.eneagrama_instintos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.big5_dimensoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eneagrama_tipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eneagrama_instintos ENABLE ROW LEVEL SECURITY;

-- Policies for big5_dimensoes
CREATE POLICY "Anyone can view active big5 dimensions" 
ON public.big5_dimensoes FOR SELECT USING (true);

CREATE POLICY "Admins can manage big5 dimensions" 
ON public.big5_dimensoes FOR ALL 
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Policies for eneagrama_tipos
CREATE POLICY "Anyone can view active eneagrama types" 
ON public.eneagrama_tipos FOR SELECT USING (true);

CREATE POLICY "Admins can manage eneagrama types" 
ON public.eneagrama_tipos FOR ALL 
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Policies for eneagrama_instintos
CREATE POLICY "Anyone can view active eneagrama instincts" 
ON public.eneagrama_instintos FOR SELECT USING (true);

CREATE POLICY "Admins can manage eneagrama instincts" 
ON public.eneagrama_instintos FOR ALL 
USING (get_user_portal(auth.uid()) = 'admin'::portal_type);

-- Triggers for updated_at
CREATE TRIGGER update_big5_dimensoes_updated_at
BEFORE UPDATE ON public.big5_dimensoes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eneagrama_tipos_updated_at
BEFORE UPDATE ON public.eneagrama_tipos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eneagrama_instintos_updated_at
BEFORE UPDATE ON public.eneagrama_instintos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add nivel_intensidade to oraculo_perguntas
ALTER TABLE public.oraculo_perguntas 
ADD COLUMN IF NOT EXISTS nivel_intensidade INTEGER DEFAULT 1 CHECK (nivel_intensidade >= 1 AND nivel_intensidade <= 5);

-- Insert default Big5 dimensions
INSERT INTO public.big5_dimensoes (chave, nome, descricao, perguntas_reflexao, ordem) VALUES
('abertura', 'Abertura (Openness)', 'Curiosidade intelectual, criatividade e abertura a novas experiências', ARRAY['Como você lida com ideias novas?', 'Qual sua relação com a arte e a criatividade?'], 1),
('conscienciosidade', 'Conscienciosidade (Conscientiousness)', 'Organização, disciplina e orientação para objetivos', ARRAY['Como você organiza suas tarefas?', 'Qual sua relação com prazos e compromissos?'], 2),
('extroversao', 'Extroversão (Extraversion)', 'Sociabilidade, energia e tendência a buscar estímulos externos', ARRAY['Como você se sente em grupos grandes?', 'De onde vem sua energia principal?'], 3),
('amabilidade', 'Amabilidade (Agreeableness)', 'Cooperação, confiança e preocupação com os outros', ARRAY['Como você lida com conflitos?', 'Qual sua tendência natural em negociações?'], 4),
('neuroticismo', 'Neuroticismo (Neuroticism)', 'Estabilidade emocional e tendência a emoções negativas', ARRAY['Como você reage sob pressão?', 'Qual sua relação com preocupações?'], 5);

-- Insert default Eneagrama types
INSERT INTO public.eneagrama_tipos (numero, nome, descricao, palavras_chave, virtude, fixacao) VALUES
(1, 'O Perfeccionista', 'Busca a perfeição e a integridade', ARRAY['perfeccionismo', 'ética', 'crítica'], 'Serenidade', 'Ressentimento'),
(2, 'O Prestativo', 'Busca ser amado através da ajuda', ARRAY['generosidade', 'orgulho', 'cuidado'], 'Humildade', 'Adulação'),
(3, 'O Realizador', 'Busca sucesso e reconhecimento', ARRAY['eficiência', 'imagem', 'conquista'], 'Autenticidade', 'Vaidade'),
(4, 'O Romântico', 'Busca autenticidade e significado', ARRAY['intensidade', 'melancolia', 'singularidade'], 'Equanimidade', 'Inveja'),
(5, 'O Observador', 'Busca conhecimento e compreensão', ARRAY['análise', 'privacidade', 'conhecimento'], 'Desapego', 'Avareza'),
(6, 'O Questionador', 'Busca segurança e lealdade', ARRAY['lealdade', 'ansiedade', 'dúvida'], 'Coragem', 'Medo'),
(7, 'O Entusiasta', 'Busca prazer e evita dor', ARRAY['otimismo', 'versatilidade', 'dispersão'], 'Sobriedade', 'Gula'),
(8, 'O Desafiador', 'Busca controle e justiça', ARRAY['força', 'proteção', 'confronto'], 'Inocência', 'Luxúria'),
(9, 'O Pacificador', 'Busca paz e harmonia', ARRAY['harmonia', 'mediação', 'acomodação'], 'Ação', 'Indolência');

-- Insert default instincts
INSERT INTO public.eneagrama_instintos (chave, nome, descricao) VALUES
('sp', 'Autopreservação (SP)', 'Foco em segurança, saúde, recursos e conforto físico'),
('so', 'Social (SO)', 'Foco em pertencimento, grupos, status e contribuição social'),
('sx', 'Sexual/Individual (SX)', 'Foco em conexões intensas, atração e energia vital');
