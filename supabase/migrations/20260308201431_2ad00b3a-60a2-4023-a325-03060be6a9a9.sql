
CREATE TABLE public.cartografia_psiquica (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  client_id uuid REFERENCES public.clientes(id) ON DELETE CASCADE,
  therapist_id uuid,
  cor_predominante text NOT NULL,
  atmosfera text[] NOT NULL DEFAULT '{}',
  territorios_principais text[] NOT NULL DEFAULT '{}',
  recursos_internos text,
  conflitos_tensoes text,
  simbolo_pessoal text,
  por_que_simbolo text,
  ponto_partida text,
  indice_equilibrio integer DEFAULT 50,
  resumo_narrativo text,
  sugestao_proximo_passo text,
  metadata_json jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cartografia_psiquica ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_cartografia_psiquica_user ON public.cartografia_psiquica(user_id);
CREATE INDEX idx_cartografia_psiquica_client ON public.cartografia_psiquica(client_id);

-- Users can read their own cartografias
CREATE POLICY "Users read own cartografia" ON public.cartografia_psiquica
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Users can insert their own
CREATE POLICY "Users insert own cartografia" ON public.cartografia_psiquica
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Users can update their own
CREATE POLICY "Users update own cartografia" ON public.cartografia_psiquica
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Therapists can read client cartografias
CREATE POLICY "Therapist reads client cartografia" ON public.cartografia_psiquica
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.clientes c
      WHERE c.id = cartografia_psiquica.client_id
        AND c.terapeuta_id = auth.uid()
    )
  );
