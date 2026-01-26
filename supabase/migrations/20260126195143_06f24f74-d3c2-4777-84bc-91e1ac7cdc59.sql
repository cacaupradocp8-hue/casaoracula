-- Tabela para rastrear primeiro acesso a cada dia da Travessia
CREATE TABLE public.travessia_day_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  aula_id UUID NOT NULL REFERENCES conteudo_aulas(id) ON DELETE CASCADE,
  first_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, aula_id)
);

-- RLS
ALTER TABLE public.travessia_day_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own unlocks"
  ON public.travessia_day_unlocks FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own unlocks"
  ON public.travessia_day_unlocks FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Index para performance
CREATE INDEX idx_travessia_day_unlocks_user 
  ON public.travessia_day_unlocks(user_id, aula_id);

-- Adicionar depoimentos iniciais na app_settings
INSERT INTO public.app_settings (key, value, description)
VALUES (
  'travessia_zero_depoimentos',
  '[{"nome":"Marina","texto":"Não mudou minha vida. Mas organizou algo que eu nunca tinha conseguido nomear."},{"nome":"Carla","texto":"Finalmente parei de correr atrás de respostas que não eram minhas."},{"nome":"Renata","texto":"Sete dias. Sem pressa. Foi o tempo certo."}]',
  'Depoimentos exibidos na Travessia 00'
) ON CONFLICT (key) DO NOTHING;