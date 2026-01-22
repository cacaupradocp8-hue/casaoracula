-- Tabela de relacionamento Porta ↔ Torre (integração funcional)
CREATE TABLE public.torre_porta_relacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  porta_id uuid REFERENCES public.labirinto_portas(id) ON DELETE CASCADE,
  torre_id text NOT NULL CHECK (torre_id IN ('controle', 'performance', 'silencio', 'cuidado', 'adaptacao', 'espiritualizacao', 'forca')),
  frequencia text DEFAULT 'comum' CHECK (frequencia IN ('muito_frequente', 'comum', 'ocasional')),
  risco_conducao text,
  ajuste_com_torre text,
  ordem integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(porta_id, torre_id)
);

-- Tabela de Casos-Clínicos Modelo (1 por Torre)
CREATE TABLE public.torre_casos_clinicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  torre_id text NOT NULL UNIQUE CHECK (torre_id IN ('controle', 'performance', 'silencio', 'cuidado', 'adaptacao', 'espiritualizacao', 'forca')),
  porta_ativa_nome text NOT NULL,
  cena text NOT NULL,
  leitura_sem_torre text NOT NULL,
  leitura_com_torre text NOT NULL,
  resultado text NOT NULL,
  ativa boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.torre_porta_relacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.torre_casos_clinicos ENABLE ROW LEVEL SECURITY;

-- RLS para torre_porta_relacao (leitura para autenticados, gestão para admin)
CREATE POLICY "Leitura para usuarios autenticados"
ON public.torre_porta_relacao FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin pode inserir torre_porta_relacao"
ON public.torre_porta_relacao FOR INSERT
WITH CHECK (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Admin pode atualizar torre_porta_relacao"
ON public.torre_porta_relacao FOR UPDATE
USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Admin pode deletar torre_porta_relacao"
ON public.torre_porta_relacao FOR DELETE
USING (public.get_user_portal(auth.uid()) = 'admin');

-- RLS para torre_casos_clinicos (restrito a oracula+ para leitura)
CREATE POLICY "Leitura para oracula e admin"
ON public.torre_casos_clinicos FOR SELECT
USING (public.get_user_portal(auth.uid()) IN ('oracula', 'admin'));

CREATE POLICY "Admin pode inserir torre_casos_clinicos"
ON public.torre_casos_clinicos FOR INSERT
WITH CHECK (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Admin pode atualizar torre_casos_clinicos"
ON public.torre_casos_clinicos FOR UPDATE
USING (public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "Admin pode deletar torre_casos_clinicos"
ON public.torre_casos_clinicos FOR DELETE
USING (public.get_user_portal(auth.uid()) = 'admin');

-- Trigger para updated_at
CREATE TRIGGER update_torre_porta_relacao_updated_at
BEFORE UPDATE ON public.torre_porta_relacao
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_torre_casos_clinicos_updated_at
BEFORE UPDATE ON public.torre_casos_clinicos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed dos 7 Casos-Clínicos Modelo
INSERT INTO public.torre_casos_clinicos (torre_id, porta_ativa_nome, cena, leitura_sem_torre, leitura_com_torre, resultado) VALUES
('controle', 'Porta da Incerteza', 
 'Mulher relata ansiedade constante, necessidade de planejar tudo, medo de errar decisões simples. Discurso organizado, racional, sem pausas.',
 'A terapeuta tenta trabalhar "confiança" e "entrega".',
 'Reconhece organização por controle como sobrevivência. Evita confrontar. Sustenta previsibilidade e ritmo lento.',
 'A ansiedade diminui sem precisar "resolver" nada.'),

('performance', 'Porta do Reconhecimento',
 'Cliente fala bem, usa linguagem terapêutica, entende tudo rapidamente, mas não sente nada no corpo.',
 'Reforçar insight e consciência.',
 'Silêncio maior, menos perguntas, retorno ao corpo.',
 'Primeiro contato real com afeto.'),

('silencio', 'Porta do Limiar',
 'Cliente responde "não sei" repetidamente. Longas pausas. Sensação de vazio.',
 'Forçar fala ou interpretação.',
 'Autorizar silêncio como linguagem. Sessão mais curta. Presença sustentada.',
 'Confiança no vínculo aumenta.'),

('cuidado', 'Porta da Exaustão',
 'Mulher cuida de todos, chega esgotada, mas fala dos outros.',
 'Estimular autocuidado rapidamente.',
 'Nomear limites na condução. Não aceitar deslocamento constante para o outro.',
 'Primeira experiência de receber atenção sem culpa.'),

('adaptacao', 'Porta da Identidade',
 'Cliente muda discurso conforme a terapeuta. Concorda com tudo.',
 'Exigir posicionamento.',
 'Não pedir escolha. Sustentar espaço sem expectativa.',
 'Emergência lenta de desejo próprio.'),

('espiritualizacao', 'Porta da Dor',
 'Cliente fala de tudo com significado elevado, mas não toca o sofrimento.',
 'Reforçar transcendência.',
 'Retorno ao corpo, ao concreto, ao agora.',
 'Contato real com afeto contido.'),

('forca', 'Porta do Colapso',
 'Mulher resiliente, "aguenta tudo", não pede ajuda.',
 'Confrontar resistência.',
 'Autorizar descanso simbólico. Não pedir mudança.',
 'Primeira permissão para parar.');