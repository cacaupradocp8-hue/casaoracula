-- =============================================
-- FEMININE ENNEAGRAM - THE LIVING ARCHETYPES
-- Symbolic, narrative-based archetypal system
-- =============================================

-- 1. Table for the 9 Feminine Archetypes (configurable in Admin)
CREATE TABLE public.eneagrama_feminino_arquetipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero INTEGER NOT NULL UNIQUE CHECK (numero >= 1 AND numero <= 9),
  chave TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  nome_en TEXT,
  essencia_simbolica TEXT NOT NULL,
  ferida_central TEXT,
  dom_central TEXT,
  expressao_sombra TEXT,
  caminho_expansao TEXT,
  pergunta_reflexiva TEXT,
  pratica_simbolica TEXT,
  icone TEXT,
  cor_primaria TEXT,
  cor_secundaria TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Table for quiz affirmations (linked to archetypes)
CREATE TABLE public.eneagrama_feminino_afirmacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arquetipo_id UUID NOT NULL REFERENCES public.eneagrama_feminino_arquetipos(id) ON DELETE CASCADE,
  texto_afirmacao TEXT NOT NULL,
  peso INTEGER NOT NULL DEFAULT 1,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Table for user results (symbolic, not numeric)
CREATE TABLE public.eneagrama_feminino_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID,
  terapeuta_id UUID,
  arquetipo_primario INTEGER NOT NULL CHECK (arquetipo_primario >= 1 AND arquetipo_primario <= 9),
  arquetipo_secundario INTEGER CHECK (arquetipo_secundario IS NULL OR (arquetipo_secundario >= 1 AND arquetipo_secundario <= 9)),
  arquetipo_sombra INTEGER CHECK (arquetipo_sombra IS NULL OR (arquetipo_sombra >= 1 AND arquetipo_sombra <= 9)),
  respostas_json JSONB,
  nome_simbolico TEXT,
  reflexao_final TEXT,
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE public.eneagrama_feminino_arquetipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eneagrama_feminino_afirmacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eneagrama_feminino_registros ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for arquetipos (public read, admin write)
CREATE POLICY "Anyone can read active archetypes"
ON public.eneagrama_feminino_arquetipos FOR SELECT
USING (ativo = true);

CREATE POLICY "Admin can manage archetypes"
ON public.eneagrama_feminino_arquetipos FOR ALL
USING (public.get_user_portal(auth.uid()) = 'admin');

-- 6. RLS Policies for afirmacoes (public read, admin write)
CREATE POLICY "Anyone can read active affirmations"
ON public.eneagrama_feminino_afirmacoes FOR SELECT
USING (ativo = true);

CREATE POLICY "Admin can manage affirmations"
ON public.eneagrama_feminino_afirmacoes FOR ALL
USING (public.get_user_portal(auth.uid()) = 'admin');

-- 7. RLS Policies for registros (user owns their records, therapist can see linked clients)
CREATE POLICY "Users can read own records"
ON public.eneagrama_feminino_registros FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Therapists can read linked client records"
ON public.eneagrama_feminino_registros FOR SELECT
USING (auth.uid() = terapeuta_id);

CREATE POLICY "Users can insert own records"
ON public.eneagrama_feminino_registros FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records"
ON public.eneagrama_feminino_registros FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all records"
ON public.eneagrama_feminino_registros FOR ALL
USING (public.get_user_portal(auth.uid()) = 'admin');

-- 8. Triggers for updated_at
CREATE TRIGGER update_eneagrama_feminino_arquetipos_updated_at
BEFORE UPDATE ON public.eneagrama_feminino_arquetipos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eneagrama_feminino_afirmacoes_updated_at
BEFORE UPDATE ON public.eneagrama_feminino_afirmacoes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eneagrama_feminino_registros_updated_at
BEFORE UPDATE ON public.eneagrama_feminino_registros
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Insert the 9 Feminine Archetypes
INSERT INTO public.eneagrama_feminino_arquetipos (numero, chave, nome, nome_en, essencia_simbolica, ferida_central, dom_central, expressao_sombra, caminho_expansao, pergunta_reflexiva, pratica_simbolica, icone, cor_primaria, ordem) VALUES
(1, 'cuidadora', 'A Cuidadora', 'The Caretaker', 
  'Aquela que sustenta o mundo com as mãos. Sua presença é abrigo, sua escuta é remédio. Carrega em si a memória ancestral de todas as mães.',
  'Acreditar que só é digna de amor quando cuida dos outros, esquecendo de si mesma.',
  'A capacidade de nutrir, acolher e criar espaços seguros onde a vida pode florescer.',
  'Ressentimento silencioso, martírio, manipulação através da culpa.',
  'Aprender a receber. Deixar-se cuidar. Reconhecer que seu valor não depende de sua utilidade.',
  'Quando foi a última vez que você deixou alguém cuidar de você sem sentir culpa?',
  'Prática do Receber: Por uma semana, aceite toda ajuda oferecida sem justificar ou retribuir imediatamente.',
  'Heart', '#E8B4B8', 1),

(2, 'soberana', 'A Soberana', 'The Sovereign',
  'Aquela que conhece seu valor e não pede permissão para existir. Sua dignidade é inabalável, sua presença comanda respeito.',
  'O medo de não ser suficiente, de não merecer o trono que ocupa.',
  'Liderança natural, capacidade de inspirar e elevar os outros através do exemplo.',
  'Rigidez, julgamento implacável, incapacidade de mostrar vulnerabilidade.',
  'Integrar a suavidade. Descobrir que a verdadeira força inclui a capacidade de dobrar-se.',
  'Em que momentos você sente que precisa provar seu valor?',
  'Prática da Coroa Gentil: Lidere uma situação mostrando vulnerabilidade primeiro.',
  'Crown', '#C9A45C', 2),

(3, 'realizadora', 'A Realizadora', 'The Achiever',
  'Aquela que transforma sonhos em realidade. Sua energia é contagiante, seu foco é inabalável. O mundo é seu canvas.',
  'Confundir quem ela é com o que ela conquista. O medo do vazio quando para.',
  'Capacidade de manifestar, de criar, de transformar visão em matéria.',
  'Workahólismo, competição destrutiva, incapacidade de descansar.',
  'Encontrar valor no ser, não apenas no fazer. Descobrir quem é ela quando não está produzindo.',
  'O que resta de você quando todas as conquistas são removidas?',
  'Prática do Vazio Sagrado: Um dia por semana, não produza nada. Apenas exista.',
  'Star', '#FFD700', 3),

(4, 'mistica', 'A Mística', 'The Mystic',
  'Aquela que habita os espaços entre os mundos. Sua sensibilidade é antena para o invisível. Carrega a sabedoria das águas profundas.',
  'Sentir-se fundamentalmente diferente, incompreendida, exilada do mundo comum.',
  'Profundidade emocional, criatividade única, capacidade de tocar o transcendente.',
  'Melancolia cultivada, drama existencial, identificação com o sofrimento.',
  'Enraizar-se no ordinário. Encontrar o sagrado no cotidiano, não apenas no extraordinário.',
  'O que você ganha permanecendo na margem?',
  'Prática da Beleza Comum: Encontre três coisas belas em sua rotina mais mundana.',
  'Moon', '#9B87F5', 4),

(5, 'observadora', 'A Observadora', 'The Observer',
  'Aquela que vê o que outros não veem. Sua mente é um jardim de possibilidades. O silêncio é seu território sagrado.',
  'O medo de ser invadida, de não ter recursos internos suficientes para enfrentar o mundo.',
  'Sabedoria, perspicácia, capacidade de síntese e compreensão profunda.',
  'Isolamento, desapego excessivo, incapacidade de participar da vida.',
  'Sair da torre. Descobrir que participar não esgota, e que a vida também alimenta.',
  'O que você está protegendo ao se manter à distância?',
  'Prática da Presença Ativa: Participe de algo sem antes planejar ou pesquisar.',
  'Eye', '#6366F1', 5),

(6, 'leal', 'A Leal', 'The Loyal One',
  'Aquela que constrói pontes de confiança no caos. Sua devoção é rochedo, sua coragem é testada e real.',
  'A ansiedade constante, a busca por segurança em um mundo que parece ameaçador.',
  'Lealdade inabalável, coragem em face do medo, capacidade de criar comunidade.',
  'Paranoia, dúvida paralisante, projeção de medos nos outros.',
  'Confiar em si mesma. Descobrir que a segurança verdadeira é interna.',
  'De quem você está esperando permissão para confiar em si mesma?',
  'Prática da Decisão Solitária: Tome uma decisão importante sem consultar ninguém.',
  'Shield', '#2DD4BF', 6),

(7, 'alegria_selvagem', 'A Alegria Selvagem', 'The Wild Joy',
  'Aquela que dança com a vida. Sua energia é primavera perpétua. O mundo é um banquete de possibilidades.',
  'O terror da dor, do vazio, da limitação. A fuga para a superfície luminosa.',
  'Entusiasmo contagiante, capacidade de ver possibilidades, resiliência criativa.',
  'Superficialidade, fuga do comprometimento, incapacidade de sustentar a dor.',
  'Ficar. Descobrir que a profundidade não é prisão, e que a dor também transforma.',
  'Do que você está fugindo quando busca a próxima experiência?',
  'Prática da Permanência: Fique com uma emoção difícil por 10 minutos sem distrair-se.',
  'Sparkles', '#F97316', 7),

(8, 'protetora', 'A Protetora', 'The Protector',
  'Aquela que defende os vulneráveis e não teme a verdade. Sua força é escudo para os fracos. Sua voz não pode ser silenciada.',
  'O medo de ser controlada, traída, de mostrar a ternura que protege com garras.',
  'Força autêntica, proteção dos inocentes, capacidade de enfrentar a injustiça.',
  'Intimidação, controle excessivo, negação da própria vulnerabilidade.',
  'Revelar a ternura. Descobrir que a verdadeira força protege também a si mesma.',
  'Quem protege você enquanto você protege o mundo?',
  'Prática da Rendição: Peça ajuda em algo que você normalmente faria sozinha.',
  'Shield', '#EF4444', 8),

(9, 'pacificadora', 'A Pacificadora', 'The Peacemaker',
  'Aquela que tece harmonia onde há conflito. Sua presença acalma tempestades. Ela é o centro que não se move.',
  'O medo de perder a conexão, de que sua presença não importe, de ser invisível.',
  'Capacidade de mediar, de ver todos os lados, de criar união genuína.',
  'Passividade, autonegligência, fusão com os desejos dos outros.',
  'Despertar. Descobrir sua própria vontade, sua própria voz, seu próprio fogo.',
  'O que você quer — não o que manteria a paz — mas o que você realmente deseja?',
  'Prática do Desejo: Diga não para algo pequeno e sim para um desejo próprio.',
  'Flower', '#84CC16', 9);

-- 10. Insert sample affirmations for each archetype
INSERT INTO public.eneagrama_feminino_afirmacoes (arquetipo_id, texto_afirmacao, peso, ordem)
SELECT id, 'Frequentemente me pego priorizando as necessidades dos outros antes das minhas.', 1, 1
FROM public.eneagrama_feminino_arquetipos WHERE numero = 1
UNION ALL
SELECT id, 'Sinto que meu valor está diretamente ligado ao quanto consigo ajudar.', 1, 2
FROM public.eneagrama_feminino_arquetipos WHERE numero = 1
UNION ALL
SELECT id, 'Tenho dificuldade em pedir ajuda, mesmo quando preciso muito.', 1, 3
FROM public.eneagrama_feminino_arquetipos WHERE numero = 1
UNION ALL
SELECT id, 'Tenho padrões elevados para mim mesma e para os outros.', 1, 1
FROM public.eneagrama_feminino_arquetipos WHERE numero = 2
UNION ALL
SELECT id, 'Sinto que devo ser exemplo de integridade e excelência.', 1, 2
FROM public.eneagrama_feminino_arquetipos WHERE numero = 2
UNION ALL
SELECT id, 'Critico-me duramente quando não atinjo a perfeição.', 1, 3
FROM public.eneagrama_feminino_arquetipos WHERE numero = 2
UNION ALL
SELECT id, 'Minha identidade está fortemente ligada às minhas conquistas.', 1, 1
FROM public.eneagrama_feminino_arquetipos WHERE numero = 3
UNION ALL
SELECT id, 'Adapto minha imagem para ser mais aceita em diferentes contextos.', 1, 2
FROM public.eneagrama_feminino_arquetipos WHERE numero = 3
UNION ALL
SELECT id, 'Tenho dificuldade em desacelerar — parece que sempre há mais a fazer.', 1, 3
FROM public.eneagrama_feminino_arquetipos WHERE numero = 3
UNION ALL
SELECT id, 'Sinto emoções muito intensamente, às vezes avassaladoras.', 1, 1
FROM public.eneagrama_feminino_arquetipos WHERE numero = 4
UNION ALL
SELECT id, 'Sinto que há algo fundamentalmente diferente em mim.', 1, 2
FROM public.eneagrama_feminino_arquetipos WHERE numero = 4
UNION ALL
SELECT id, 'Busco profundidade e autenticidade em todas as experiências.', 1, 3
FROM public.eneagrama_feminino_arquetipos WHERE numero = 4
UNION ALL
SELECT id, 'Preciso de muito tempo sozinha para recarregar.', 1, 1
FROM public.eneagrama_feminino_arquetipos WHERE numero = 5
UNION ALL
SELECT id, 'Observo muito antes de participar.', 1, 2
FROM public.eneagrama_feminino_arquetipos WHERE numero = 5
UNION ALL
SELECT id, 'Sinto-me mais segura com conhecimento e preparação.', 1, 3
FROM public.eneagrama_feminino_arquetipos WHERE numero = 5
UNION ALL
SELECT id, 'Questiono muito antes de confiar.', 1, 1
FROM public.eneagrama_feminino_arquetipos WHERE numero = 6
UNION ALL
SELECT id, 'Preparo-me para o pior cenário possível.', 1, 2
FROM public.eneagrama_feminino_arquetipos WHERE numero = 6
UNION ALL
SELECT id, 'A lealdade é um dos meus valores mais importantes.', 1, 3
FROM public.eneagrama_feminino_arquetipos WHERE numero = 6
UNION ALL
SELECT id, 'Tenho dificuldade em ficar parada — sempre há algo novo a explorar.', 1, 1
FROM public.eneagrama_feminino_arquetipos WHERE numero = 7
UNION ALL
SELECT id, 'Evito situações que possam trazer dor ou limitação.', 1, 2
FROM public.eneagrama_feminino_arquetipos WHERE numero = 7
UNION ALL
SELECT id, 'Vejo possibilidades onde outros veem obstáculos.', 1, 3
FROM public.eneagrama_feminino_arquetipos WHERE numero = 7
UNION ALL
SELECT id, 'Defendo os mais fracos, mesmo quando isso me custa.', 1, 1
FROM public.eneagrama_feminino_arquetipos WHERE numero = 8
UNION ALL
SELECT id, 'Tenho dificuldade em mostrar vulnerabilidade.', 1, 2
FROM public.eneagrama_feminino_arquetipos WHERE numero = 8
UNION ALL
SELECT id, 'Minha intensidade às vezes assusta as pessoas.', 1, 3
FROM public.eneagrama_feminino_arquetipos WHERE numero = 8
UNION ALL
SELECT id, 'Prefiro manter a paz a expressar minha opinião.', 1, 1
FROM public.eneagrama_feminino_arquetipos WHERE numero = 9
UNION ALL
SELECT id, 'Tenho dificuldade em saber o que eu realmente quero.', 1, 2
FROM public.eneagrama_feminino_arquetipos WHERE numero = 9
UNION ALL
SELECT id, 'Fusiono-me facilmente com as pessoas ao meu redor.', 1, 3
FROM public.eneagrama_feminino_arquetipos WHERE numero = 9;

-- 11. Add to sala_ferramentas
INSERT INTO public.sala_ferramentas (
  sala_id,
  ferramenta_chave,
  ferramenta_nome,
  ferramenta_descricao,
  icone,
  rota,
  ordem,
  ativa,
  tipo,
  portal_minimo,
  has_blocks,
  slug
) VALUES (
  'ebb6c62d-7de0-4787-9d46-6c6dbab285f7',
  'eneagrama_feminino',
  'Eneagrama Feminino',
  'Os Arquétipos Vivos da Psique — um mapa simbólico das estratégias femininas de sobrevivência, amor e pertencimento.',
  'Flower2',
  '/ferramenta/eneagrama-feminino',
  3,
  true,
  'quiz_simbolico',
  'pre_iniciada',
  true,
  'eneagrama-feminino'
);