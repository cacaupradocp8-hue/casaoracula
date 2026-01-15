-- Create phases table for Journey of the Heroine
CREATE TABLE public.jornada_heroina_fases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero INTEGER NOT NULL UNIQUE CHECK (numero BETWEEN 1 AND 7),
  chave TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  nome_en TEXT,
  subtitulo TEXT,
  descricao TEXT NOT NULL,
  pergunta_central TEXT,
  perguntas_reflexao TEXT[] DEFAULT '{}',
  arquetipos_sugeridos TEXT[] DEFAULT '{}',
  praticas_simbolicas TEXT[] DEFAULT '{}',
  linguagem_contencao TEXT,
  microcopy TEXT,
  icone TEXT,
  cor_primaria TEXT,
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create journey records table
CREATE TABLE public.jornada_heroina_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  terapeuta_id UUID,
  modo TEXT NOT NULL DEFAULT 'pessoal' CHECK (modo IN ('pessoal', 'conducao')),
  fase_atual INTEGER DEFAULT 1,
  nome_simbolico TEXT,
  intencao_inicial TEXT,
  reflexao_final TEXT,
  status TEXT DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'pausado', 'concluido')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create phase responses table
CREATE TABLE public.jornada_heroina_respostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registro_id UUID NOT NULL REFERENCES public.jornada_heroina_registros(id) ON DELETE CASCADE,
  fase_numero INTEGER NOT NULL CHECK (fase_numero BETWEEN 1 AND 7),
  respostas_reflexao JSONB DEFAULT '{}',
  arquetipo_escolhido TEXT,
  tom_emocional TEXT,
  simbolo_pessoal TEXT,
  notas_pessoais TEXT,
  data_entrada TIMESTAMPTZ DEFAULT now(),
  data_conclusao TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(registro_id, fase_numero)
);

-- Create professional notes table (private to practitioner)
CREATE TABLE public.jornada_heroina_notas_profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registro_id UUID NOT NULL REFERENCES public.jornada_heroina_registros(id) ON DELETE CASCADE,
  fase_numero INTEGER NOT NULL CHECK (fase_numero BETWEEN 1 AND 7),
  terapeuta_id UUID NOT NULL,
  observacoes TEXT,
  padroes_observados TEXT,
  intervencoes_sugeridas TEXT,
  proximos_passos TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(registro_id, fase_numero, terapeuta_id)
);

-- Enable RLS
ALTER TABLE public.jornada_heroina_fases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jornada_heroina_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jornada_heroina_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jornada_heroina_notas_profissionais ENABLE ROW LEVEL SECURITY;

-- RLS for phases (read by all authenticated, manage by admin)
CREATE POLICY "Phases readable by authenticated" ON public.jornada_heroina_fases
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Phases manageable by admin" ON public.jornada_heroina_fases
  FOR ALL TO authenticated USING (public.get_user_portal(auth.uid()) = 'admin');

-- RLS for journey records
CREATE POLICY "Users can view own records" ON public.jornada_heroina_registros
  FOR SELECT TO authenticated USING (
    auth.uid() = user_id OR 
    auth.uid() = terapeuta_id OR
    public.get_user_portal(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can create own records" ON public.jornada_heroina_registros
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records" ON public.jornada_heroina_registros
  FOR UPDATE TO authenticated USING (
    auth.uid() = user_id OR 
    auth.uid() = terapeuta_id OR
    public.get_user_portal(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can delete own records" ON public.jornada_heroina_registros
  FOR DELETE TO authenticated USING (
    auth.uid() = user_id OR
    public.get_user_portal(auth.uid()) = 'admin'
  );

-- RLS for phase responses
CREATE POLICY "Users can manage responses via record" ON public.jornada_heroina_respostas
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.jornada_heroina_registros r
      WHERE r.id = registro_id AND (
        r.user_id = auth.uid() OR 
        r.terapeuta_id = auth.uid() OR
        public.get_user_portal(auth.uid()) = 'admin'
      )
    )
  );

-- RLS for professional notes
CREATE POLICY "Therapists can manage own notes" ON public.jornada_heroina_notas_profissionais
  FOR ALL TO authenticated USING (
    auth.uid() = terapeuta_id OR public.get_user_portal(auth.uid()) = 'admin'
  );

-- Insert the 7 phases
INSERT INTO public.jornada_heroina_fases (numero, chave, nome, subtitulo, descricao, pergunta_central, perguntas_reflexao, arquetipos_sugeridos, praticas_simbolicas, linguagem_contencao, microcopy, icone, cor_primaria, ordem) VALUES
(1, 'chamado', 'O Chamado', 'Algo já não cabe mais', 
  'A primeira fase marca o momento em que algo na vida comum começa a ranger. Um desconforto sutil, uma inquietação que não se explica, um vazio que nenhum preenchimento externo resolve. É o chamado da alma pedindo passagem.',
  'O que está pedindo passagem em mim agora?',
  ARRAY['O que já não me cabe mais?', 'Que voz interna tenho ignorado?', 'Onde sinto o ranger da minha vida atual?'],
  ARRAY['Perséfone', 'Inanna', 'A Donzela'],
  ARRAY['Escrever uma carta ao próprio chamado', 'Desenhar o limiar', 'Ritual do primeiro passo'],
  'Você não precisa entender o chamado. Precisa apenas reconhecê-lo.',
  'Algo está te chamando. Você não precisa saber para onde.',
  'Sparkles', '#F59E0B', 1),

(2, 'separacao', 'A Separação', 'Perda da identidade anterior', 
  'Nesta fase, a mulher é convidada a soltar — papéis, certezas, vínculos que sustentavam sua identidade anterior. É uma morte simbólica: ainda não sabe quem será, mas já não é mais quem era.',
  'O que preciso soltar para continuar?',
  ARRAY['Que papel social estou deixando para trás?', 'Quem eu pensava que era?', 'O que ainda me prende ao antigo?'],
  ARRAY['Ártemis', 'Lilith', 'A Viúva'],
  ARRAY['Ritual de despedida simbólica', 'Enterrar um objeto antigo', 'Carta de encerramento'],
  'Soltar não é abandonar. É permitir que algo novo nasça.',
  'Você está perdendo algo. E isso é necessário.',
  'Unlink', '#8B5CF6', 2),

(3, 'descida', 'A Descida', 'Contato com a sombra, o luto, o caos', 
  'A descida é o ventre escuro da jornada. Aqui a mulher encontra sua sombra, seu luto não chorado, seus pedaços rejeitados. Não há atalho. A descida exige presença, não solução.',
  'O que preciso atravessar — não resolver?',
  ARRAY['Que dor evitei sentir?', 'Que parte de mim foi exilada?', 'O que o escuro tem a me dizer?'],
  ARRAY['Hécate', 'Kali', 'Ereshkigal'],
  ARRAY['Escrita automática no escuro', 'Banho de sal grosso', 'Vigília simbólica'],
  'Você está na descida. Não tente subir antes da hora.',
  'Você não está atrasada. Você está na descida.',
  'ArrowDown', '#6366F1', 3),

(4, 'iniciacao', 'A Iniciação', 'Reorganização das forças internas', 
  'Após a descida, algo se reorganiza. Não é uma reconstrução — é uma reconfiguração. A mulher descobre recursos que não sabia ter, forças que estavam adormecidas, saberes que viviam no corpo.',
  'Que força está despertando em mim?',
  ARRAY['O que descobri sobre mim na descida?', 'Que sabedoria estava escondida?', 'Que poder ainda não nomeei?'],
  ARRAY['Atena', 'Durga', 'A Sacerdotisa'],
  ARRAY['Nomeação simbólica', 'Criação de um amuleto', 'Ritual de reivindicação'],
  'A força que você encontra aqui não precisa de permissão.',
  'Algo está nascendo. Ainda não tem nome.',
  'Flame', '#EC4899', 4),

(5, 'poder', 'A Retomada do Poder', 'Nova agência e clareza', 
  'Nesta fase, a mulher começa a ocupar espaço novamente — mas de outro lugar. Há clareza, direção, discernimento. Não é controle, é soberania. Não é força bruta, é presença enraizada.',
  'De que lugar novo eu falo agora?',
  ARRAY['Que limites preciso sustentar?', 'Que verdade agora posso dizer?', 'Onde minha presença precisa ser sentida?'],
  ARRAY['Sekhmet', 'Afrodite', 'A Rainha'],
  ARRAY['Declaração de soberania', 'Ritual de coroação simbólica', 'Ocupar espaço físico conscientemente'],
  'Seu poder não precisa ser reconhecido por ninguém.',
  'Você já sabe. Agora precisa sustentar.',
  'Crown', '#F97316', 5),

(6, 'integracao', 'A Integração', 'Encarnação no cotidiano', 
  'A integração acontece quando a jornada deixa de ser evento e vira modo de existir. A mulher retorna à vida comum, mas com outro olhar. O desafio é não abandonar o que conquistou quando a rotina apertar.',
  'Como encarno o que aprendi no dia-a-dia?',
  ARRAY['O que mudou na minha forma de estar no mundo?', 'Onde ainda escorrego para o antigo?', 'Que rituais sustentam minha presença?'],
  ARRAY['Deméter', 'Vesta', 'A Anciã Sábia'],
  ARRAY['Ritual de ancoragem diária', 'Criação de altar pessoal', 'Escrita de compromisso consigo'],
  'Integração acontece depois que o sentido assenta.',
  'A jornada não termina. Ela se enraíza.',
  'Anchor', '#10B981', 6),

(7, 'transmissao', 'A Transmissão', 'Capacidade de sustentar ou guiar outras', 
  'A última fase não é obrigatória, mas possível. Aqui a mulher descobre que pode sustentar o campo para outras. Não ensinar — sustentar. Não salvar — acompanhar. É a maturidade da jornada.',
  'O que posso oferecer sem me perder?',
  ARRAY['O que aprendi que pode servir a outras?', 'Como sustento sem carregar?', 'Qual é meu dom de transmissão?'],
  ARRAY['Sophia', 'Tara', 'A Guardiã'],
  ARRAY['Escrita de legado', 'Ritual de passagem simbólica', 'Oferta de presença a outra mulher'],
  'Transmitir não é ensinar. É sustentar presença.',
  'Você não precisa ter chegado para poder acompanhar.',
  'Users', '#0EA5E9', 7);

-- Add tool to sala_ferramentas (using Sala da Iniciada)
INSERT INTO public.sala_ferramentas (
  sala_id,
  ferramenta_chave,
  ferramenta_nome,
  ferramenta_descricao,
  icone,
  rota,
  slug,
  ordem,
  ativa,
  tipo,
  portal_minimo,
  has_blocks
) VALUES (
  '59911ef3-13a2-491e-b3aa-0c6658b1ba7e',
  'jornada_heroina',
  'Jornada da Heroína',
  'Mapa simbólico iniciático para leitura e condução de processos de transformação feminina',
  'Compass',
  '/ferramenta/jornada-heroina',
  'jornada-heroina',
  50,
  true,
  'avaliacao_simbolica',
  'pre_iniciada',
  false
);