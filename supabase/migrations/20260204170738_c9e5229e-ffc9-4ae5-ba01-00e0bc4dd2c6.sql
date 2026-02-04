-- Adicionar campo imagem_url à tabela labirinto_fases
ALTER TABLE public.labirinto_fases
ADD COLUMN IF NOT EXISTS imagem_url TEXT;

-- Adicionar campo texto_simbolico separado para o texto poético
ALTER TABLE public.labirinto_fases
ADD COLUMN IF NOT EXISTS texto_simbolico TEXT;

-- Criar tabela para rastrear a fase ativa de cada usuária no Mapa da Heroína
CREATE TABLE IF NOT EXISTS public.heroina_fase_ativa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fase_id UUID NOT NULL REFERENCES public.labirinto_fases(id) ON DELETE CASCADE,
  registrado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  ativa BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para busca rápida por usuário
CREATE INDEX IF NOT EXISTS idx_heroina_fase_ativa_user 
ON public.heroina_fase_ativa(user_id, ativa);

-- Habilitar RLS
ALTER TABLE public.heroina_fase_ativa ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: usuárias veem e gerenciam apenas seus próprios registros
CREATE POLICY "Users can view own phase registrations"
ON public.heroina_fase_ativa FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can register phases"
ON public.heroina_fase_ativa FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
ON public.heroina_fase_ativa FOR UPDATE
USING (auth.uid() = user_id);

-- Admin pode ver tudo
CREATE POLICY "Admin full access heroina_fase_ativa"
ON public.heroina_fase_ativa FOR ALL
USING (public.is_admin(auth.uid()));

-- Inserir as 7 fases fixas se não existirem
INSERT INTO public.labirinto_fases (ordem, nome, subtitulo, descricao, icone, ativo)
VALUES 
  (1, 'O Chamado Silenciado', 'A voz interior que insiste', 'Uma inquietação profunda começa a se manifestar. Algo em você pede mudança, mesmo que ainda não tenha nome.', '🌑', true),
  (2, 'A Descida', 'O mergulho no desconhecido', 'Você atravessa o limiar. O mundo conhecido fica para trás enquanto desce aos territórios interiores.', '🌘', true),
  (3, 'A Fragmentação', 'O desmonte do que foi', 'As estruturas antigas se desfazem. Peças do que você acreditava ser começam a se soltar.', '🌗', true),
  (4, 'A Morte Simbólica', 'O ponto de entrega total', 'O velho eu precisa morrer para que algo novo possa nascer. É o momento de maior escuridão e também de maior potencial.', '🌚', true),
  (5, 'A Travessia', 'O caminho entre mundos', 'Você atravessa o limiar interior, carregando apenas o essencial. O caminho de volta já não é o mesmo.', '🌓', true),
  (6, 'A Reintegração', 'A costura do novo eu', 'Os fragmentos se reorganizam em uma nova configuração. Você começa a reconhecer a mulher que está se tornando.', '🌔', true),
  (7, 'O Retorno com Sabedoria', 'A dádiva ao mundo', 'Você retorna transformada, trazendo consigo a sabedoria da travessia para oferecer ao mundo.', '🌕', true)
ON CONFLICT DO NOTHING;