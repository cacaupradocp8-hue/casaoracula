-- Enum para status de posts
CREATE TYPE public.post_status AS ENUM ('rascunho', 'publicado', 'arquivado');

-- Enum para tipo de post de mentoria
CREATE TYPE public.mentoria_tipo AS ENUM ('aviso', 'evento', 'supervisao');

-- Enum para status de agente
CREATE TYPE public.agente_status AS ENUM ('ativo', 'inativo');

-- Tabela de posts de mentoria
CREATE TABLE public.posts_mentoria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo mentoria_tipo NOT NULL DEFAULT 'aviso',
  titulo TEXT NOT NULL,
  texto TEXT NOT NULL,
  data_evento TIMESTAMP WITH TIME ZONE,
  link_evento TEXT,
  anexo_url TEXT,
  caso_id UUID,
  status post_status NOT NULL DEFAULT 'rascunho',
  portal_minimo portal_type NOT NULL DEFAULT 'pre_iniciada',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de agentes IA
CREATE TABLE public.agentes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  instrucoes_base TEXT NOT NULL DEFAULT '',
  icone TEXT DEFAULT 'bot',
  status agente_status NOT NULL DEFAULT 'ativo',
  portal_minimo portal_type NOT NULL DEFAULT 'pre_iniciada',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de conversas com agentes
CREATE TABLE public.agente_conversas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agente_id UUID NOT NULL REFERENCES public.agentes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT DEFAULT 'Nova conversa',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de mensagens das conversas
CREATE TABLE public.agente_mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id UUID NOT NULL REFERENCES public.agente_conversas(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de registros Big5
CREATE TABLE public.big5_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caso_id UUID,
  abertura INTEGER NOT NULL CHECK (abertura >= 0 AND abertura <= 100),
  conscienciosidade INTEGER NOT NULL CHECK (conscienciosidade >= 0 AND conscienciosidade <= 100),
  extroversao INTEGER NOT NULL CHECK (extroversao >= 0 AND extroversao <= 100),
  amabilidade INTEGER NOT NULL CHECK (amabilidade >= 0 AND amabilidade <= 100),
  neuroticismo INTEGER NOT NULL CHECK (neuroticismo >= 0 AND neuroticismo <= 100),
  notas TEXT,
  impacto_clinico TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de registros Eneagrama
CREATE TABLE public.eneagrama_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caso_id UUID,
  tipo_principal INTEGER NOT NULL CHECK (tipo_principal >= 1 AND tipo_principal <= 9),
  asa INTEGER CHECK (asa IS NULL OR (asa >= 1 AND asa <= 9)),
  instinto TEXT CHECK (instinto IS NULL OR instinto IN ('SP', 'SO', 'SX')),
  defesas TEXT,
  virtude TEXT,
  armadilhas TEXT,
  pratica_sugerida TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de perguntas do Oráculo
CREATE TABLE public.oraculo_perguntas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pergunta TEXT NOT NULL,
  tema TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  portal_minimo portal_type NOT NULL DEFAULT 'pre_iniciada',
  status agente_status NOT NULL DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de aplicações do Oráculo
CREATE TABLE public.oraculo_aplicacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pergunta_id UUID NOT NULL REFERENCES public.oraculo_perguntas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caso_id UUID,
  sessao_id UUID,
  contexto TEXT,
  resposta TEXT,
  devolutiva TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de modelos de texto (para Admin personalizar)
CREATE TABLE public.text_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'geral',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de favoritos do Oráculo
CREATE TABLE public.oraculo_favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pergunta_id UUID NOT NULL REFERENCES public.oraculo_perguntas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(pergunta_id, user_id)
);

-- Enable RLS em todas as tabelas
ALTER TABLE public.posts_mentoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agente_conversas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agente_mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.big5_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eneagrama_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oraculo_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oraculo_aplicacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.text_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oraculo_favoritos ENABLE ROW LEVEL SECURITY;

-- RLS para posts_mentoria
CREATE POLICY "Users can view published posts by portal level" ON public.posts_mentoria
  FOR SELECT USING (status = 'publicado' AND has_portal_access(auth.uid(), portal_minimo));

CREATE POLICY "Admins can manage all posts" ON public.posts_mentoria
  FOR ALL USING (get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Users can create supervision posts" ON public.posts_mentoria
  FOR INSERT WITH CHECK (auth.uid() = created_by AND tipo = 'supervisao');

-- RLS para agentes
CREATE POLICY "Users can view active agents by portal level" ON public.agentes
  FOR SELECT USING (status = 'ativo' AND has_portal_access(auth.uid(), portal_minimo));

CREATE POLICY "Admins can manage all agents" ON public.agentes
  FOR ALL USING (get_user_portal(auth.uid()) = 'admin');

-- RLS para agente_conversas
CREATE POLICY "Users can manage own conversations" ON public.agente_conversas
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all conversations" ON public.agente_conversas
  FOR SELECT USING (get_user_portal(auth.uid()) = 'admin');

-- RLS para agente_mensagens
CREATE POLICY "Users can manage messages in own conversations" ON public.agente_mensagens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.agente_conversas 
      WHERE id = agente_mensagens.conversa_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages" ON public.agente_mensagens
  FOR SELECT USING (get_user_portal(auth.uid()) = 'admin');

-- RLS para big5_registros
CREATE POLICY "Users can manage own Big5 records" ON public.big5_registros
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all Big5 records" ON public.big5_registros
  FOR SELECT USING (get_user_portal(auth.uid()) = 'admin');

-- RLS para eneagrama_registros
CREATE POLICY "Users can manage own Enneagram records" ON public.eneagrama_registros
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all Enneagram records" ON public.eneagrama_registros
  FOR SELECT USING (get_user_portal(auth.uid()) = 'admin');

-- RLS para oraculo_perguntas
CREATE POLICY "Users can view active questions by portal level" ON public.oraculo_perguntas
  FOR SELECT USING (status = 'ativo' AND has_portal_access(auth.uid(), portal_minimo));

CREATE POLICY "Admins can manage all questions" ON public.oraculo_perguntas
  FOR ALL USING (get_user_portal(auth.uid()) = 'admin');

-- RLS para oraculo_aplicacoes
CREATE POLICY "Users can manage own applications" ON public.oraculo_aplicacoes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON public.oraculo_aplicacoes
  FOR SELECT USING (get_user_portal(auth.uid()) = 'admin');

-- RLS para text_models
CREATE POLICY "Anyone can view text models" ON public.text_models
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage text models" ON public.text_models
  FOR ALL USING (get_user_portal(auth.uid()) = 'admin');

-- RLS para oraculo_favoritos
CREATE POLICY "Users can manage own favorites" ON public.oraculo_favoritos
  FOR ALL USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE TRIGGER update_posts_mentoria_updated_at
  BEFORE UPDATE ON public.posts_mentoria
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agentes_updated_at
  BEFORE UPDATE ON public.agentes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agente_conversas_updated_at
  BEFORE UPDATE ON public.agente_conversas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_big5_registros_updated_at
  BEFORE UPDATE ON public.big5_registros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eneagrama_registros_updated_at
  BEFORE UPDATE ON public.eneagrama_registros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oraculo_perguntas_updated_at
  BEFORE UPDATE ON public.oraculo_perguntas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oraculo_aplicacoes_updated_at
  BEFORE UPDATE ON public.oraculo_aplicacoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_text_models_updated_at
  BEFORE UPDATE ON public.text_models
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir modelos de texto padrão
INSERT INTO public.text_models (chave, titulo, conteudo, categoria) VALUES
('boas_vindas_dashboard', 'Mensagem de Boas-Vindas', 'Bem-vinda à Casa ORÁCULA, um espaço sagrado de formação e transformação.', 'sistema'),
('intro_travessias', 'Introdução Travessias', 'As Quatro Travessias são jornadas de profundidade. Cada uma delas é um portal de iniciação.', 'conteudo'),
('intro_biblioteca', 'Introdução Biblioteca', 'A Biblioteca Simbólica guarda contos, arquétipos e rituais para nutrir sua prática clínica.', 'conteudo'),
('intro_mentoria', 'Introdução Mentoria', 'A área de Mentoria é o espaço de encontro, supervisão e acolhimento entre guardiãs.', 'conteudo'),
('camada_sintoma', 'Leitura - Camada Sintoma', 'O que se apresenta? Qual o sintoma manifesto?', 'leitura_5_camadas'),
('camada_ego', 'Leitura - Camada Ego', 'Como o ego reage? Quais defesas estão ativas?', 'leitura_5_camadas'),
('camada_projecao', 'Leitura - Camada Projeção', 'O que está sendo projetado? Qual sombra se manifesta?', 'leitura_5_camadas'),
('camada_arquetipo', 'Leitura - Camada Arquétipo', 'Qual arquétipo ressoa? Que imagem primordial emerge?', 'leitura_5_camadas'),
('camada_travessia', 'Leitura - Camada Travessia', 'Qual a travessia necessária? Que morte simbólica se anuncia?', 'leitura_5_camadas');

-- Inserir algumas perguntas do Oráculo como exemplo
INSERT INTO public.oraculo_perguntas (pergunta, tema, tags, portal_minimo) VALUES
('O que você está evitando olhar de frente?', 'sombra', ARRAY['confronto', 'evitação', 'verdade'], 'pre_iniciada'),
('Se não houvesse medo, o que você faria agora?', 'decisão', ARRAY['coragem', 'ação', 'transformação'], 'pre_iniciada'),
('Qual é a mentira que você conta a si mesma todos os dias?', 'verdade', ARRAY['autoengano', 'clareza', 'honestidade'], 'iniciada'),
('O que precisa morrer em você para que algo novo nasça?', 'travessia', ARRAY['morte simbólica', 'renascimento', 'transformação'], 'pre_iniciada'),
('Quem você seria se ninguém estivesse olhando?', 'identidade', ARRAY['autenticidade', 'máscara', 'essência'], 'pre_iniciada'),
('Qual ferida você ainda está tentando curar pelos outros?', 'projeção', ARRAY['sombra', 'cura', 'relacionamentos'], 'iniciada'),
('O que sua raiva está tentando proteger?', 'eixo', ARRAY['emoção', 'limites', 'proteção'], 'pre_iniciada'),
('Se sua vida fosse um conto, qual seria o capítulo atual?', 'narrativa', ARRAY['história', 'significado', 'jornada'], 'pre_iniciada');