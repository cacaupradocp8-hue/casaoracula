-- Adicionar campo imagem_url à tabela labirinto_arquetipos
ALTER TABLE public.labirinto_arquetipos 
ADD COLUMN IF NOT EXISTS imagem_url TEXT;

-- Criar tabela para registros de arquétipos no Mapa Pessoal da Heroína
CREATE TABLE IF NOT EXISTS public.heroina_arquetipo_registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  arquetipo_id UUID NOT NULL REFERENCES public.labirinto_arquetipos(id) ON DELETE CASCADE,
  polaridade_percebida TEXT, -- campo livre para a usuária registrar sua percepção
  registrado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_heroina_arquetipo_registros_user 
ON public.heroina_arquetipo_registros(user_id);

CREATE INDEX IF NOT EXISTS idx_heroina_arquetipo_registros_arquetipo 
ON public.heroina_arquetipo_registros(arquetipo_id);

-- Enable RLS
ALTER TABLE public.heroina_arquetipo_registros ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuária vê seus próprios registros de arquétipos"
ON public.heroina_arquetipo_registros
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuária registra seus próprios padrões arquetípicos"
ON public.heroina_arquetipo_registros
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuária pode atualizar seus registros"
ON public.heroina_arquetipo_registros
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admin acesso total a registros de arquétipos"
ON public.heroina_arquetipo_registros
FOR ALL
USING (public.is_admin(auth.uid()));

-- Inserir os 14 arquétipos base (nomes placeholder para edição via admin)
INSERT INTO public.labirinto_arquetipos (ordem, nome, territorio, descricao_luz, descricao_sombra, icone, ativo)
VALUES 
  (1, 'A Selvagem', 'Instinto', 'A força primordial que pulsa em cada mulher, conectada à natureza e aos ciclos.', 'O impulso destrutivo, a raiva sem direção, a desconexão do próprio corpo.', '🐺', true),
  (2, 'A Sábia', 'Conhecimento', 'A guardiã da sabedoria ancestral, aquela que vê além das aparências.', 'O cinismo, a arrogância intelectual, o isolamento na torre de marfim.', '🦉', true),
  (3, 'A Amante', 'Desejo', 'A presença que honra o prazer, a sensualidade sagrada e a entrega consciente.', 'A dependência afetiva, a objetificação de si, a busca vazia por validação.', '🌹', true),
  (4, 'A Mãe', 'Nutrição', 'O ventre acolhedor, a nutrição generosa, o cuidado que sustenta a vida.', 'A mãe devoradora, o controle sob disfarce de amor, a anulação de si.', '🌙', true),
  (5, 'A Guerreira', 'Ação', 'A força que defende limites, a coragem de agir, a proteção do sagrado.', 'A agressividade desmedida, a luta contra tudo, a exaustão do combate eterno.', '⚔️', true),
  (6, 'A Curandeira', 'Restauração', 'O dom de tocar feridas com compaixão, a alquimia que transforma dor em medicina.', 'A ferida que fere outros, o salvador compulsivo, a negação da própria cura.', '🌿', true),
  (7, 'A Visionária', 'Intuição', 'Os olhos que enxergam o invisível, a ponte entre mundos, a profetisa interior.', 'A dissociação da realidade, o escapismo espiritual, a desconexão do corpo.', '👁️', true),
  (8, 'A Criadora', 'Expressão', 'O útero criativo que gesta ideias, a expressão autêntica, a arte como ritual.', 'O perfeccionismo paralisante, a criação compulsiva, o vazio criativo.', '🎨', true),
  (9, 'A Anciã', 'Tempo', 'A que atravessou o tempo, guardiã dos mistérios da morte e renascimento.', 'A amargura pelo tempo perdido, o apego ao passado, o medo da transformação.', '🕯️', true),
  (10, 'A Donzela', 'Potência', 'O frescor do início, a potência não corrompida, a curiosidade sagrada.', 'A ingenuidade perigosa, a eterna menina, a recusa em amadurecer.', '🌸', true),
  (11, 'A Sacerdotisa', 'Mistério', 'A guardiã do véu, mediadora entre o visível e o invisível, a ritualista.', 'O fundamentalismo espiritual, o dogma, a desconexão do humano.', '🔮', true),
  (12, 'A Rainha', 'Soberania', 'A presença soberana, a autoridade natural, o comando de si mesma.', 'A tirania, o controle obsessivo, a coroa que esmaga.', '👑', true),
  (13, 'A Tecelã', 'Destino', 'Aquela que tece os fios do destino, conectando passado e futuro.', 'A manipulação sutil, o controle através das redes, o emaranhamento.', '🕸️', true),
  (14, 'A Sombria', 'Profundidade', 'A senhora do submundo, aquela que abraça o que foi rejeitado.', 'A identificação com a escuridão, a autodestruição, a recusa da luz.', '🌑', true)
ON CONFLICT DO NOTHING;