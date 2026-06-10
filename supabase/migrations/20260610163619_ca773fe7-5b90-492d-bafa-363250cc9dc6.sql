-- 1. Adicionar metadados para as obras da Câmara da Escuta
ALTER TABLE public.clube_camara_escuta_obras ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Adicionar persistência do último passo na conclusão/progresso
ALTER TABLE public.clube_conclusao_estacoes ADD COLUMN IF NOT EXISTS ultimo_passo INTEGER DEFAULT 0;

-- 3. Migrar conteúdos fixos da Estação 1 para o Banco de Dados
-- Obra: FERA FERIDA
UPDATE public.clube_camara_escuta_obras 
SET metadata = '{
    "oQueEscutar": ["Não escute a letra.", "Escute a identidade.", "Observe como a ferida aparece quase como uma companheira inseparável.", "Pergunte-se: A ferida está sendo cuidada? Ou está sendo habitada?"],
    "oQueEvitar": ["Não transformar a música numa análise psicológica.", "Não procurar diagnósticos.", "Não procurar culpados.", "Apenas observe a relação da personagem com a própria dor."],
    "perguntaPsique": "O que em mim ainda canta, mesmo depois de ter sido ferido?",
    "perguntaOficio": "Que sinais de vitalidade soterrada eu consigo reconhecer nas mulheres que acompanho?",
    "rastroSimbolo": "🩸 A Ferida Habitável",
    "territorioImpactado": "Praça do Abalo"
}'::jsonb
WHERE titulo = 'Fera Ferida';

-- Obra: NOTURNO
UPDATE public.clube_camara_escuta_obras 
SET metadata = '{
    "oQueEscutar": ["Escute o vazio.", "Escute a ausência.", "Escute aquilo que não está sendo dito.", "Esta música não fala apenas de amor. Fala daquilo que continua presente mesmo quando desapareceu."],
    "oQueEvitar": ["Não interpretar literalmente.", "A ausência nem sempre é uma pessoa.", "Pode ser: um sonho, uma identidade, uma fase da vida ou uma potência esquecida."],
    "perguntaPsique": "O que continua vivendo dentro de mim mesmo depois de ter partido?",
    "perguntaOficio": "Como reconhecer quando a cliente está vivendo uma perda que ainda não conseguiu nomear?",
    "rastroSimbolo": "🌑 O Lugar Vazio",
    "territorioImpactado": "Casa dos Sonhos"
}'::jsonb
WHERE titulo = 'Noturno';

-- Obra: REVELAÇÃO
UPDATE public.clube_camara_escuta_obras 
SET metadata = '{
    "oQueEscutar": ["Escute o instante da percepção.", "O momento em que algo que sempre esteve presente finalmente se torna visível.", "Essa música trabalha um fenômeno fundamental da leitura simbólica: não descobrir algo novo, mas perceber algo que sempre esteve ali."],
    "oQueEvitar": ["Não procurar grandes epifanias.", "Às vezes a revelação é pequena. Mas muda tudo."],
    "perguntaPsique": "O que eu já sabia antes mesmo de conseguir explicar?",
    "perguntaOficio": "Como reconhecer quando a percepção da cliente chegou antes da linguagem?",
    "rastroSimbolo": "🔑 A Verdade Reconhecida",
    "territorioImpactado": "Portas"
}'::jsonb
WHERE titulo = 'Revelação';

-- Obra: MARIA MARIA
UPDATE public.clube_camara_escuta_obras 
SET metadata = '{
    "oQueEscutar": ["Escute a força. Mas não a força heroica.", "Escute a força cotidiana.", "Aquela que continua caminhando mesmo quando está cansada."],
    "oQueEvitar": ["Não romantizar sofrimento.", "A força desta música não está em suportar tudo. Está em continuar viva."],
    "perguntaPsique": "Qual parte de mim permaneceu viva mesmo durante os períodos mais difíceis?",
    "perguntaOficio": "Como ajudar uma mulher a reconhecer recursos internos que ela já possui?",
    "rastroSimbolo": "🌻 A Mulher que Continua",
    "territorioImpactado": "A Forja"
}'::jsonb
WHERE titulo = 'Maria Maria';