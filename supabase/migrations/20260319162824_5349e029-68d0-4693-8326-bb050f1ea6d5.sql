-- Círculo Oracular: registros individuais das participantes
CREATE TABLE IF NOT EXISTS public.circulo_oracular_registros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ciclo_id uuid NOT NULL,
  fase text NOT NULL DEFAULT 'abertura', -- abertura, leitura, reflexao, integracao
  passagem_atravessou text, -- "Qual passagem te atravessou?"
  onde_toca_vida text,     -- "Onde isso toca sua vida?"
  imagem_ficou text,       -- "Qual imagem ficou em você?"
  insights_encontro text,  -- insights do encontro ao vivo
  movimentos_internos text,-- movimentos internos
  decisoes_simbolicas text,-- decisões simbólicas
  gesto_pos_circulo text,  -- "Qual gesto você leva para sua vida?"
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.circulo_oracular_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own circulo registros"
  ON public.circulo_oracular_registros FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all circulo registros"
  ON public.circulo_oracular_registros FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Heroína App: jornada da cliente (interface separada)
CREATE TABLE IF NOT EXISTS public.heroina_jornada (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id uuid,
  fase_atual text NOT NULL DEFAULT 'limiar', -- limiar, emocao, torre, travessia, integracao
  porta_ativa text,
  torre_ativa text,
  mensagem_simbolica text,
  consentimento_terapeuta boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.heroina_jornada ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own heroina jornada"
  ON public.heroina_jornada FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Therapist reads linked heroina jornada"
  ON public.heroina_jornada FOR SELECT
  TO authenticated
  USING (auth.uid() = therapist_id AND consentimento_terapeuta = true);

CREATE POLICY "Admins manage all heroina jornada"
  ON public.heroina_jornada FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Heroína: exercícios / registros da jornada
CREATE TABLE IF NOT EXISTS public.heroina_registros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'exercicio', -- exercicio, espelho, reflexao
  pergunta text,
  resposta text,
  fase text, -- limiar, emocao, torre, travessia, integracao
  emocao_dominante text,
  arquetipo_ativo text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.heroina_registros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own heroina registros"
  ON public.heroina_registros FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Therapist reads linked heroina registros"
  ON public.heroina_registros FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.heroina_jornada hj
      WHERE hj.user_id = heroina_registros.user_id
        AND hj.therapist_id = auth.uid()
        AND hj.consentimento_terapeuta = true
    )
  );

CREATE POLICY "Admins manage all heroina registros"
  ON public.heroina_registros FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));