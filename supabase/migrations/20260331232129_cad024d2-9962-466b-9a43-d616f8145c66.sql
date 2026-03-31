
CREATE TABLE public.treinamento_casos_simulados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  nivel TEXT NOT NULL DEFAULT 'guiado' CHECK (nivel IN ('guiado', 'semi-guiado', 'livre')),
  fala_inicial TEXT NOT NULL,
  sinais TEXT[] DEFAULT '{}',
  contexto_breve TEXT NOT NULL,
  perguntas_leitura TEXT[] DEFAULT ARRAY['O que está acontecendo aqui?', 'Isso parece o quê?'],
  distrito_referencia TEXT,
  estado_referencia TEXT,
  hipotese_referencia TEXT,
  vetor_referencia TEXT,
  ferramenta_referencia TEXT,
  feedback_json JSONB DEFAULT '{}',
  ordem INT DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.treinamento_casos_simulados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active training cases"
ON public.treinamento_casos_simulados FOR SELECT TO authenticated
USING (ativo = true);

CREATE POLICY "Admins can manage training cases"
ON public.treinamento_casos_simulados FOR ALL TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal = 'admin')
);

CREATE TABLE public.treinamento_respostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caso_id UUID NOT NULL REFERENCES public.treinamento_casos_simulados(id) ON DELETE CASCADE,
  leitura_texto TEXT,
  distrito_escolhido TEXT,
  estado_escolhido TEXT,
  hipotese_texto TEXT,
  vetor_texto TEXT,
  ferramenta_escolhida TEXT,
  feedback_recebido JSONB,
  nivel_usado TEXT,
  concluido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, caso_id)
);

ALTER TABLE public.treinamento_respostas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own training responses"
ON public.treinamento_respostas FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all training responses"
ON public.treinamento_respostas FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND portal = 'admin')
);

-- Seed initial training cases
INSERT INTO public.treinamento_casos_simulados (titulo, nivel, fala_inicial, sinais, contexto_breve, distrito_referencia, estado_referencia, hipotese_referencia, vetor_referencia, ferramenta_referencia, feedback_json, ordem) VALUES
(
  'A mulher que não consegue parar',
  'guiado',
  'Eu não consigo descansar. Mesmo quando paro, minha cabeça continua. Sinto que se eu parar, tudo desmorona.',
  ARRAY['Agitação corporal', 'Fala acelerada', 'Mãos inquietas', 'Evita silêncio'],
  'Mulher de 38 anos, empresária. Chegou à sessão após burnout. Primeira sessão.',
  'Torres',
  'contraída',
  'Sistema de defesa hiperativado. A produtividade funciona como torre de proteção contra o vazio interior.',
  'Reconhecer que parar não é desmoronar — é pousar.',
  'Torre Viva',
  '{"coerencia_alta": "A leitura reconhece o mecanismo de defesa sem patologizar. A torre está ativa e cumpre função.", "coerencia_media": "A leitura identifica o padrão mas pode estar interpretando literalmente a fala.", "riscos": ["Não forçar o descanso como prescrição", "Não interpretar a agitação como resistência", "Não nomear burnout como diagnóstico"]}',
  1
),
(
  'O sonho que volta',
  'guiado',
  'Tenho um sonho que se repete há meses. Estou numa casa antiga, procurando uma porta que nunca encontro.',
  ARRAY['Tom reflexivo', 'Olhar distante', 'Pausas longas', 'Conexão emocional com o sonho'],
  'Mulher de 45 anos, psicóloga. Em processo há 6 meses. Traz sonho recorrente.',
  'Casa dos Sonhos',
  'instável',
  'O inconsciente insiste numa passagem. A porta que não se encontra pode ser uma travessia que ainda não foi nomeada.',
  'Dar nome à porta — o que está pedindo passagem?',
  'Decodificação Onírica',
  '{"coerencia_alta": "A leitura honra o sonho como mensagem do inconsciente sem interpretá-lo literalmente.", "coerencia_media": "A leitura toca o tema mas pode estar projetando significado.", "riscos": ["Não interpretar o sonho pela cliente", "Não usar dicionário de símbolos fixo", "Deixar o sonho trabalhar no silêncio"]}',
  2
),
(
  'A raiva silenciosa',
  'semi-guiado',
  'Não estou com raiva. Estou cansada. Só quero que as pessoas parem de me pedir coisas.',
  ARRAY['Mandíbula tensa', 'Braços cruzados', 'Fala contida', 'Negação emocional'],
  'Mulher de 32 anos, mãe de dois filhos. Sessão 3. Padrão relacional de auto-anulação.',
  'Espelho dos Vínculos',
  'contraída',
  'A raiva está presente mas não autorizada. O cansaço é a máscara permitida. O corpo fala o que a boca nega.',
  'Autorizar a raiva como força legítima — não como destruição.',
  'Espelho Relacional',
  '{"coerencia_alta": "A leitura percebe a dissociação entre fala e corpo sem confrontar.", "coerencia_media": "A leitura nomeia a raiva mas pode ser prematura.", "riscos": ["Não forçar a nomeação da raiva", "Não invalidar o cansaço como defesa válida", "Respeitar o tempo da cliente"]}',
  3
),
(
  'O vazio depois da conquista',
  'semi-guiado',
  'Consegui tudo o que queria. A promoção, a casa, o relacionamento. Mas acordo todos os dias com uma sensação de... nada.',
  ARRAY['Tom monocórdico', 'Olhar vago', 'Postura recolhida', 'Dificuldade em nomear'],
  'Mulher de 41 anos, executiva. Sessão 2. Crise de sentido após atingir metas externas.',
  'Praça do Abalo',
  'instável',
  'O vazio não é ausência — é presença de algo que ainda não foi escutado. A persona realizou, mas o Self pede outra direção.',
  'Escutar o que o vazio está tentando dizer.',
  'Escrita Simbólica',
  '{"coerencia_alta": "A leitura diferencia conquista externa de realização interna sem julgar.", "coerencia_media": "A leitura toca o tema mas pode romantizar o vazio.", "riscos": ["Não minimizar a conquista", "Não patologizar o vazio como depressão", "Não oferecer propósito como solução"]}',
  4
),
(
  'A filha que cuida da mãe',
  'livre',
  'Minha mãe sempre precisou de mim. Desde pequena eu cuidava dela. Agora ela está doente e eu sinto que vou quebrar, mas não posso.',
  ARRAY['Olhos marejados', 'Voz controlada', 'Hipervigilância', 'Corpo rígido'],
  'Mulher de 36 anos, professora. Sessão 5. Padrão de parentificação e inversão geracional.',
  'Conselho Interior',
  'contraída',
  'A filha-cuidadora carrega uma missão que não é sua. O complexo materno invertido impede o próprio cuidado.',
  'Devolver à mãe o que é da mãe. Resgatar a filha que não pôde ser.',
  'Diálogo de Partes',
  '{"coerencia_alta": "A leitura reconhece a parentificação sem culpar a mãe ou vitimizar a cliente.", "coerencia_media": "A leitura identifica o padrão mas pode simplificar a dinâmica.", "riscos": ["Não culpar a mãe", "Não romantizar o sacrifício", "Não apressar a separação simbólica", "Atenção ao luto que virá"]}',
  5
);
