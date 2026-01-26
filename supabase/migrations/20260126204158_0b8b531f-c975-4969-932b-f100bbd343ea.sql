-- ============================================
-- BIG5 ORACULAR - Mapa Simbólico de Funcionamento Psíquico
-- ============================================

-- 1. Tabela de Fatores Simbólicos
CREATE TABLE public.big5_oracular_fatores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  nome_ocean TEXT NOT NULL,
  simbolo TEXT,
  cor_primaria TEXT DEFAULT '#C9A45C',
  descricao_simbolica TEXT,
  narrativa_elevada TEXT,
  narrativa_fragil TEXT,
  ordem INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Perguntas (30 exatas)
CREATE TABLE public.big5_oracular_perguntas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fator_id UUID NOT NULL REFERENCES big5_oracular_fatores(id) ON DELETE CASCADE,
  texto_pergunta TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Registros de Usuárias
CREATE TABLE public.big5_oracular_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  respostas_json JSONB NOT NULL DEFAULT '{}',
  medias_json JSONB NOT NULL DEFAULT '{}',
  fator_predominante TEXT,
  fator_fragilizado TEXT,
  reflexao_pessoal TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_big5_oracular_perguntas_fator ON big5_oracular_perguntas(fator_id);
CREATE INDEX idx_big5_oracular_registros_user ON big5_oracular_registros(user_id);

-- RLS
ALTER TABLE big5_oracular_fatores ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_oracular_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE big5_oracular_registros ENABLE ROW LEVEL SECURITY;

-- Políticas: Leitura pública para fatores e perguntas
CREATE POLICY "Public read fatores" ON big5_oracular_fatores FOR SELECT USING (true);
CREATE POLICY "Public read perguntas" ON big5_oracular_perguntas FOR SELECT USING (true);

-- Políticas: Usuários gerenciam próprios registros
CREATE POLICY "Users select own registros" ON big5_oracular_registros FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own registros" ON big5_oracular_registros FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own registros" ON big5_oracular_registros FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin full access registros" ON big5_oracular_registros FOR ALL USING (public.is_admin(auth.uid()));

-- Trigger updated_at
CREATE TRIGGER update_big5_oracular_registros_updated_at
  BEFORE UPDATE ON big5_oracular_registros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- INSERIR 5 FATORES SIMBÓLICOS
-- ============================================
INSERT INTO big5_oracular_fatores (chave, nome, nome_ocean, simbolo, cor_primaria, ordem, descricao_simbolica, narrativa_elevada, narrativa_fragil) VALUES
('porta_possivel', 'Porta do Possível', 'Abertura à Experiência', '🜁', '#9B59B6', 1,
  'A Porta do Possível representa sua abertura ao desconhecido, à transformação e ao mistério.',
  'Quando esta porta está aberta, você navega com curiosidade pelos territórios desconhecidos da psique. O novo não é ameaça — é convite. Você se permite ser atravessada pela vida.',
  'Quando esta porta está fechada, há uma tendência a repetir padrões conhecidos por medo do que pode emergir. O desconhecido se torna ameaça, não possibilidade.'),

('torre_interna', 'Torre Interna', 'Conscienciosidade', '🜂', '#3498DB', 2,
  'A Torre Interna representa sua estrutura, disciplina e capacidade de sustentar decisões.',
  'Quando a torre está firme, você consegue manter acordos consigo mesma. Há consistência entre intenção e ação. A estrutura não aprisiona — sustenta.',
  'Quando a torre está frágil, há dificuldade em manter compromissos internos. O entusiasmo vem e vai, mas falta a base que sustenta a travessia.'),

('campo_outro', 'Campo do Outro', 'Amabilidade', '🜄', '#27AE60', 3,
  'O Campo do Outro representa sua sensibilidade relacional e capacidade de acolher.',
  'Quando este campo está equilibrado, você sente com o outro sem se perder. A empatia flui, mas não te devora. Você cuida sem se anular.',
  'Quando este campo está em excesso, há risco de se dissolver no outro. Dizer não se torna quase impossível, e a culpa precede qualquer limite.'),

('voz_mundo', 'Voz no Mundo', 'Extroversão', '🜃', '#E74C3C', 4,
  'A Voz no Mundo representa como você se expressa e ocupa espaço.',
  'Quando sua voz está viva, você se expressa com autenticidade. Não precisa de plateia para existir, mas também não se esconde. Falar é um ato de presença.',
  'Quando sua voz está retraída, há uma tendência a se silenciar para evitar julgamento. O medo de ser vista apaga a potência do que você tem a dizer.'),

('porta_abalo', 'Porta do Abalo', 'Neuroticismo', '🜄', '#F39C12', 5,
  'A Porta do Abalo representa sua sensibilidade às turbulências emocionais.',
  'Quando esta porta está em equilíbrio, você sente intensamente, mas não se perde nas emoções. A sensibilidade se torna radar, não prisão.',
  'Quando esta porta está escancarada, pequenas mudanças geram grandes abalos. O corpo reage antes da mente processar, e a ruminação se torna companhia frequente.');

-- ============================================
-- INSERIR 30 PERGUNTAS (6 por fator)
-- ============================================

-- PORTA DO POSSÍVEL (Abertura)
INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Quando algo foge do que você conhece, sua primeira reação é curiosidade, não defesa.', 1
FROM big5_oracular_fatores WHERE chave = 'porta_possivel';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você se interessa mais por perguntas profundas do que por respostas prontas.', 2
FROM big5_oracular_fatores WHERE chave = 'porta_possivel';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Mudanças internas costumam te atrair, mesmo quando causam insegurança.', 3
FROM big5_oracular_fatores WHERE chave = 'porta_possivel';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você percebe quando está repetindo uma história antiga — e isso te incomoda.', 4
FROM big5_oracular_fatores WHERE chave = 'porta_possivel';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'O desconhecido te provoca mais fascínio do que medo.', 5
FROM big5_oracular_fatores WHERE chave = 'porta_possivel';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você sente que poderia viver versões muito diferentes de si mesma.', 6
FROM big5_oracular_fatores WHERE chave = 'porta_possivel';

-- TORRE INTERNA (Conscienciosidade)
INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você consegue sustentar decisões mesmo quando o entusiasmo inicial passa.', 1
FROM big5_oracular_fatores WHERE chave = 'torre_interna';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Quando algo é importante, você cria estrutura — não espera motivação.', 2
FROM big5_oracular_fatores WHERE chave = 'torre_interna';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você prefere avançar pouco, mas com consistência.', 3
FROM big5_oracular_fatores WHERE chave = 'torre_interna';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Costuma cumprir acordos consigo mesma.', 4
FROM big5_oracular_fatores WHERE chave = 'torre_interna';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você se sente desconfortável quando tudo está solto ou indefinido.', 5
FROM big5_oracular_fatores WHERE chave = 'torre_interna';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Ter rotina te fortalece mais do que te aprisiona.', 6
FROM big5_oracular_fatores WHERE chave = 'torre_interna';

-- CAMPO DO OUTRO (Amabilidade)
INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você percebe quando está se adaptando demais para não gerar conflito.', 1
FROM big5_oracular_fatores WHERE chave = 'campo_outro';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'É difícil dizer "não" sem sentir culpa.', 2
FROM big5_oracular_fatores WHERE chave = 'campo_outro';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você costuma priorizar o impacto das suas ações nos outros.', 3
FROM big5_oracular_fatores WHERE chave = 'campo_outro';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Em conflitos, tende a tentar manter o vínculo, mesmo que se silencie.', 4
FROM big5_oracular_fatores WHERE chave = 'campo_outro';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você sente responsabilidade emocional pelo bem-estar de quem está perto.', 5
FROM big5_oracular_fatores WHERE chave = 'campo_outro';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Quando alguém sofre, você sente no corpo.', 6
FROM big5_oracular_fatores WHERE chave = 'campo_outro';

-- VOZ NO MUNDO (Extroversão)
INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você se sente confortável sendo vista quando está alinhada com o que diz.', 1
FROM big5_oracular_fatores WHERE chave = 'voz_mundo';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Prefere falar depois de pensar — não para ocupar espaço.', 2
FROM big5_oracular_fatores WHERE chave = 'voz_mundo';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você percebe quando está se escondendo para não ser julgada.', 3
FROM big5_oracular_fatores WHERE chave = 'voz_mundo';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Se sente mais viva quando pode expressar sua verdade.', 4
FROM big5_oracular_fatores WHERE chave = 'voz_mundo';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'O silêncio, para você, é força — não fuga.', 5
FROM big5_oracular_fatores WHERE chave = 'voz_mundo';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você sabe quando sua voz está retraída.', 6
FROM big5_oracular_fatores WHERE chave = 'voz_mundo';

-- PORTA DO ABALO (Neuroticismo)
INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Mudanças inesperadas mexem profundamente com você.', 1
FROM big5_oracular_fatores WHERE chave = 'porta_abalo';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Você demora a se regular após conflitos emocionais.', 2
FROM big5_oracular_fatores WHERE chave = 'porta_abalo';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Situações simples podem gerar ruminações longas.', 3
FROM big5_oracular_fatores WHERE chave = 'porta_abalo';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Seu corpo reage antes da sua mente.', 4
FROM big5_oracular_fatores WHERE chave = 'porta_abalo';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Em momentos de pressão, você sente que perde o eixo.', 5
FROM big5_oracular_fatores WHERE chave = 'porta_abalo';

INSERT INTO big5_oracular_perguntas (fator_id, texto_pergunta, ordem)
SELECT id, 'Emoções intensas costumam te atravessar com força.', 6
FROM big5_oracular_fatores WHERE chave = 'porta_abalo';