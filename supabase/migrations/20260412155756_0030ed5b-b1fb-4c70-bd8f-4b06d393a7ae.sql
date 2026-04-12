
-- =========================================================
-- ALTER existing tables to add missing columns
-- =========================================================

ALTER TABLE public.oraculo_portais
  ADD COLUMN IF NOT EXISTS livro_base text,
  ADD COLUMN IF NOT EXISTS portal_categoria text,
  ADD COLUMN IF NOT EXISTS ciclo text DEFAULT 'jornada-da-heroina',
  ADD COLUMN IF NOT EXISTS nivel_acesso text DEFAULT 'clube',
  ADD COLUMN IF NOT EXISTS is_locked boolean NOT NULL DEFAULT false;

ALTER TABLE public.oraculo_portal_materiais
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;

-- Indexes on oraculo_portais
CREATE INDEX IF NOT EXISTS idx_oraculo_portais_ordem ON public.oraculo_portais(ordem);
CREATE INDEX IF NOT EXISTS idx_oraculo_portais_status ON public.oraculo_portais(status);
CREATE INDEX IF NOT EXISTS idx_oraculo_portais_ciclo ON public.oraculo_portais(ciclo);

-- Indexes on oraculo_portal_materiais
CREATE INDEX IF NOT EXISTS idx_oraculo_portal_materiais_tipo ON public.oraculo_portal_materiais(tipo);
CREATE INDEX IF NOT EXISTS idx_oraculo_portal_materiais_ordem ON public.oraculo_portal_materiais(portal_id, ordem);

-- set_updated_at function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger on oraculo_portais if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_oraculo_portais_updated_at') THEN
    CREATE TRIGGER trg_oraculo_portais_updated_at
    BEFORE UPDATE ON public.oraculo_portais
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- =========================================================
-- 3) ESSÊNCIA DO PORTAL
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_essencia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL UNIQUE REFERENCES public.oraculo_portais(id) ON DELETE CASCADE,
  onde_estamos text,
  habilidade text,
  tensao_central text,
  nucleo_80_20 text,
  o_que_nao_fazer text,
  leitura_etica text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_essencia_portal_id ON public.oraculo_portal_essencia(portal_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_oraculo_portal_essencia_updated_at') THEN
    CREATE TRIGGER trg_oraculo_portal_essencia_updated_at
    BEFORE UPDATE ON public.oraculo_portal_essencia
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- =========================================================
-- 4) ÁUDIOS DO PORTAL
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_audios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL REFERENCES public.oraculo_portais(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'principal',
  titulo text NOT NULL,
  duracao text,
  roteiro text,
  audio_url text,
  transcricao text,
  ordem integer NOT NULL DEFAULT 1,
  is_locked boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_oraculo_audio_tipo()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.tipo NOT IN ('principal','integracao','pratica_guiada','extra') THEN
    RAISE EXCEPTION 'tipo must be principal, integracao, pratica_guiada or extra';
  END IF;
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_validate_oraculo_audio_tipo') THEN
    CREATE TRIGGER trg_validate_oraculo_audio_tipo
    BEFORE INSERT OR UPDATE ON public.oraculo_portal_audios
    FOR EACH ROW EXECUTE FUNCTION public.validate_oraculo_audio_tipo();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_audios_portal_id ON public.oraculo_portal_audios(portal_id);
CREATE INDEX IF NOT EXISTS idx_oraculo_portal_audios_tipo ON public.oraculo_portal_audios(tipo);
CREATE INDEX IF NOT EXISTS idx_oraculo_portal_audios_ordem ON public.oraculo_portal_audios(portal_id, ordem);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_oraculo_portal_audios_updated_at') THEN
    CREATE TRIGGER trg_oraculo_portal_audios_updated_at
    BEFORE UPDATE ON public.oraculo_portal_audios
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- =========================================================
-- 5) LABORATÓRIO 80/20
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_laboratorios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL UNIQUE REFERENCES public.oraculo_portais(id) ON DELETE CASCADE,
  acao_minima text,
  regulacao_emocional text,
  resultado_esperado text,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_laboratorios_portal_id ON public.oraculo_portal_laboratorios(portal_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_oraculo_portal_laboratorios_updated_at') THEN
    CREATE TRIGGER trg_oraculo_portal_laboratorios_updated_at
    BEFORE UPDATE ON public.oraculo_portal_laboratorios
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- =========================================================
-- 6) PASSOS DO LABORATÓRIO
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_laboratorio_passos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  laboratorio_id uuid NOT NULL REFERENCES public.oraculo_portal_laboratorios(id) ON DELETE CASCADE,
  ordem integer NOT NULL,
  titulo text,
  descricao text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (laboratorio_id, ordem)
);

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_laboratorio_passos_lab_id ON public.oraculo_portal_laboratorio_passos(laboratorio_id);

-- =========================================================
-- 8) APLICAÇÃO PROFISSIONAL
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_aplicacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL UNIQUE REFERENCES public.oraculo_portais(id) ON DELETE CASCADE,
  uso_sessao text,
  uso_grupo text,
  uso_aula text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_aplicacoes_portal_id ON public.oraculo_portal_aplicacoes(portal_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_oraculo_portal_aplicacoes_updated_at') THEN
    CREATE TRIGGER trg_oraculo_portal_aplicacoes_updated_at
    BEFORE UPDATE ON public.oraculo_portal_aplicacoes
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- =========================================================
-- 9) NARROTERAPIA
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_narroterapia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL UNIQUE REFERENCES public.oraculo_portais(id) ON DELETE CASCADE,
  conto_sugerido text,
  script_abertura text,
  observacao_metodologica text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_narroterapia_portal_id ON public.oraculo_portal_narroterapia(portal_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_oraculo_portal_narroterapia_updated_at') THEN
    CREATE TRIGGER trg_oraculo_portal_narroterapia_updated_at
    BEFORE UPDATE ON public.oraculo_portal_narroterapia
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- =========================================================
-- 10) PERGUNTAS DA NARROTERAPIA
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_narroterapia_perguntas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  narroterapia_id uuid NOT NULL REFERENCES public.oraculo_portal_narroterapia(id) ON DELETE CASCADE,
  ordem integer NOT NULL,
  pergunta text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (narroterapia_id, ordem)
);

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_narroterapia_perguntas_nid ON public.oraculo_portal_narroterapia_perguntas(narroterapia_id);

-- =========================================================
-- 12) PASSOS DA FORJA
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_forja_passos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forja_id uuid NOT NULL REFERENCES public.oraculo_portal_forjas(id) ON DELETE CASCADE,
  ordem integer NOT NULL,
  titulo text,
  descricao text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (forja_id, ordem)
);

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_forja_passos_forja_id ON public.oraculo_portal_forja_passos(forja_id);

-- =========================================================
-- 13) ERROS COMUNS DA FORJA
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_forja_erros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forja_id uuid NOT NULL REFERENCES public.oraculo_portal_forjas(id) ON DELETE CASCADE,
  ordem integer NOT NULL,
  erro text NOT NULL,
  impacto text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (forja_id, ordem)
);

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_forja_erros_forja_id ON public.oraculo_portal_forja_erros(forja_id);

-- =========================================================
-- 14) FERRAMENTA DO PORTAL
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_ferramentas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL UNIQUE REFERENCES public.oraculo_portais(id) ON DELETE CASCADE,
  nome text NOT NULL,
  descricao text,
  uso_contexto text,
  instrucoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_ferramentas_portal_id ON public.oraculo_portal_ferramentas(portal_id);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_oraculo_portal_ferramentas_updated_at') THEN
    CREATE TRIGGER trg_oraculo_portal_ferramentas_updated_at
    BEFORE UPDATE ON public.oraculo_portal_ferramentas
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- =========================================================
-- 15) CAMPOS DA FERRAMENTA
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_ferramenta_campos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ferramenta_id uuid NOT NULL REFERENCES public.oraculo_portal_ferramentas(id) ON DELETE CASCADE,
  ordem integer NOT NULL,
  label text NOT NULL,
  field_key text NOT NULL,
  field_type text NOT NULL,
  placeholder text,
  help_text text,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  required boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ferramenta_id, field_key),
  UNIQUE (ferramenta_id, ordem)
);

CREATE OR REPLACE FUNCTION public.validate_oraculo_campo_field_type()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.field_type NOT IN ('text','textarea','select','multiselect','boolean','number') THEN
    RAISE EXCEPTION 'field_type must be text, textarea, select, multiselect, boolean or number';
  END IF;
  RETURN NEW;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_validate_oraculo_campo_field_type') THEN
    CREATE TRIGGER trg_validate_oraculo_campo_field_type
    BEFORE INSERT OR UPDATE ON public.oraculo_portal_ferramenta_campos
    FOR EACH ROW EXECUTE FUNCTION public.validate_oraculo_campo_field_type();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_ferramenta_campos_fid ON public.oraculo_portal_ferramenta_campos(ferramenta_id);

-- =========================================================
-- 16) RISCOS ÉTICOS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.oraculo_portal_riscos_eticos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid NOT NULL REFERENCES public.oraculo_portais(id) ON DELETE CASCADE,
  ordem integer NOT NULL,
  risco text NOT NULL,
  descricao text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (portal_id, ordem)
);

CREATE INDEX IF NOT EXISTS idx_oraculo_portal_riscos_eticos_portal_id ON public.oraculo_portal_riscos_eticos(portal_id);

-- =========================================================
-- RLS for ALL new tables
-- =========================================================

-- oraculo_portal_essencia
ALTER TABLE public.oraculo_portal_essencia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read essencia" ON public.oraculo_portal_essencia FOR SELECT USING (true);
CREATE POLICY "Admins manage essencia" ON public.oraculo_portal_essencia FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_audios
ALTER TABLE public.oraculo_portal_audios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read audios" ON public.oraculo_portal_audios FOR SELECT USING (true);
CREATE POLICY "Admins manage audios" ON public.oraculo_portal_audios FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_laboratorios
ALTER TABLE public.oraculo_portal_laboratorios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read laboratorios" ON public.oraculo_portal_laboratorios FOR SELECT USING (true);
CREATE POLICY "Admins manage laboratorios" ON public.oraculo_portal_laboratorios FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_laboratorio_passos
ALTER TABLE public.oraculo_portal_laboratorio_passos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lab passos" ON public.oraculo_portal_laboratorio_passos FOR SELECT USING (true);
CREATE POLICY "Admins manage lab passos" ON public.oraculo_portal_laboratorio_passos FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_aplicacoes
ALTER TABLE public.oraculo_portal_aplicacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read aplicacoes" ON public.oraculo_portal_aplicacoes FOR SELECT USING (true);
CREATE POLICY "Admins manage aplicacoes" ON public.oraculo_portal_aplicacoes FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_narroterapia
ALTER TABLE public.oraculo_portal_narroterapia ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read narroterapia" ON public.oraculo_portal_narroterapia FOR SELECT USING (true);
CREATE POLICY "Admins manage narroterapia" ON public.oraculo_portal_narroterapia FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_narroterapia_perguntas
ALTER TABLE public.oraculo_portal_narroterapia_perguntas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read narroterapia perguntas" ON public.oraculo_portal_narroterapia_perguntas FOR SELECT USING (true);
CREATE POLICY "Admins manage narroterapia perguntas" ON public.oraculo_portal_narroterapia_perguntas FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_forja_passos
ALTER TABLE public.oraculo_portal_forja_passos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read forja passos" ON public.oraculo_portal_forja_passos FOR SELECT USING (true);
CREATE POLICY "Admins manage forja passos" ON public.oraculo_portal_forja_passos FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_forja_erros
ALTER TABLE public.oraculo_portal_forja_erros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read forja erros" ON public.oraculo_portal_forja_erros FOR SELECT USING (true);
CREATE POLICY "Admins manage forja erros" ON public.oraculo_portal_forja_erros FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_ferramentas
ALTER TABLE public.oraculo_portal_ferramentas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ferramentas" ON public.oraculo_portal_ferramentas FOR SELECT USING (true);
CREATE POLICY "Admins manage ferramentas" ON public.oraculo_portal_ferramentas FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_ferramenta_campos
ALTER TABLE public.oraculo_portal_ferramenta_campos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read ferramenta campos" ON public.oraculo_portal_ferramenta_campos FOR SELECT USING (true);
CREATE POLICY "Admins manage ferramenta campos" ON public.oraculo_portal_ferramenta_campos FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- oraculo_portal_riscos_eticos
ALTER TABLE public.oraculo_portal_riscos_eticos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read riscos eticos" ON public.oraculo_portal_riscos_eticos FOR SELECT USING (true);
CREATE POLICY "Admins manage riscos eticos" ON public.oraculo_portal_riscos_eticos FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- =========================================================
-- 18) SEEDS INICIAIS DOS 8 PORTAIS
-- =========================================================
INSERT INTO public.oraculo_portais
(slug, nome, ordem, status, descricao_curta, objetivo_formativo, tempo_estimado, inspirado_em, ciclo, nivel_acesso)
VALUES
('o-chamado-selvagem', 'O Chamado Selvagem', 1, 'draft', 'Portal de abertura da travessia simbólica.', 'Reconhecer o chamado interno antes da fuga ou adaptação automática.', '1 semana', 'Mulheres que Correm com os Lobos', 'jornada-da-heroina', 'clube'),
('a-mulher-domesticada', 'A Mulher Domesticada', 2, 'draft', 'Portal de confronto com condicionamentos e domesticação psíquica.', 'Identificar padrões de contenção e obediência que atrofiaram a potência.', '1 semana', 'Mulheres que Correm com os Lobos', 'jornada-da-heroina', 'clube'),
('a-sombra-feminina', 'A Sombra Feminina', 3, 'draft', 'Portal de encontro com conteúdos evitados, negados ou projetados.', 'Desenvolver capacidade de sustentar ambivalência sem colapsar em moralismo.', '1 semana', 'Mulheres que Correm com os Lobos', 'jornada-da-heroina', 'clube'),
('a-queda-do-ideal', 'A Queda do Ideal', 4, 'draft', 'Portal de ruptura com imagens perfeitas de si.', 'Trocar performance simbólica por verdade psíquica.', '1 semana', 'Mulheres que Correm com os Lobos', 'jornada-da-heroina', 'clube'),
('o-instinto-recuperado', 'O Instinto Recuperado', 5, 'draft', 'Portal de reaproximação com o saber vivo do corpo e da psique.', 'Recuperar percepção, ritmo e discernimento.', '1 semana', 'Mulheres que Correm com os Lobos', 'jornada-da-heroina', 'clube'),
('a-integracao-da-sombra', 'A Integração da Sombra', 6, 'draft', 'Portal de maturidade prática e reintegração.', 'Aprender a usar a sombra como fonte de leitura e não como identidade.', '1 semana', 'Mulheres que Correm com os Lobos', 'jornada-da-heroina', 'clube'),
('a-voz-e-a-lideranca', 'A Voz e a Liderança', 7, 'draft', 'Portal de expressão sustentada no mundo.', 'Transformar leitura interna em presença, condução e posicionamento.', '1 semana', 'Mulheres que Correm com os Lobos', 'jornada-da-heroina', 'clube'),
('a-mulher-inteira', 'A Mulher Inteira', 8, 'draft', 'Portal de fechamento e consolidação da travessia.', 'Integrar eixo, instinto, sombra e expressão em uma prática coerente.', '1 semana', 'Mulheres que Correm com os Lobos', 'jornada-da-heroina', 'clube')
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- 19) VIEW
-- =========================================================
CREATE OR REPLACE VIEW public.vw_oraculo_portais_resumo AS
SELECT
  p.id, p.slug, p.nome, p.ordem, p.status,
  p.descricao_curta, p.tempo_estimado, p.updated_at,
  EXISTS (SELECT 1 FROM public.oraculo_portal_essencia e WHERE e.portal_id = p.id) AS tem_essencia,
  EXISTS (SELECT 1 FROM public.oraculo_portal_audios a WHERE a.portal_id = p.id AND a.tipo = 'principal') AS tem_audio_principal,
  EXISTS (SELECT 1 FROM public.oraculo_portal_laboratorios l WHERE l.portal_id = p.id) AS tem_laboratorio,
  EXISTS (SELECT 1 FROM public.oraculo_portal_jardins j WHERE j.portal_id = p.id) AS tem_jardins,
  EXISTS (SELECT 1 FROM public.oraculo_portal_aplicacoes ap WHERE ap.portal_id = p.id) AS tem_aplicacao,
  EXISTS (SELECT 1 FROM public.oraculo_portal_narroterapia n WHERE n.portal_id = p.id) AS tem_narroterapia,
  EXISTS (SELECT 1 FROM public.oraculo_portal_forjas f WHERE f.portal_id = p.id) AS tem_forja,
  EXISTS (SELECT 1 FROM public.oraculo_portal_ferramentas ft WHERE ft.portal_id = p.id) AS tem_ferramenta,
  EXISTS (SELECT 1 FROM public.oraculo_portal_riscos_eticos r WHERE r.portal_id = p.id) AS tem_risco_etico
FROM public.oraculo_portais p;

-- =========================================================
-- 20) FUNÇÃO DE VALIDAÇÃO DE PUBLICAÇÃO
-- =========================================================
CREATE OR REPLACE FUNCTION public.oraculo_portal_pode_publicar(p_portal_id uuid)
RETURNS boolean LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT
    EXISTS (SELECT 1 FROM public.oraculo_portal_essencia e WHERE e.portal_id = p_portal_id)
    AND EXISTS (SELECT 1 FROM public.oraculo_portal_audios a WHERE a.portal_id = p_portal_id AND a.tipo = 'principal')
    AND EXISTS (SELECT 1 FROM public.oraculo_portal_laboratorios l WHERE l.portal_id = p_portal_id)
    AND EXISTS (SELECT 1 FROM public.oraculo_portal_jardins j WHERE j.portal_id = p_portal_id)
    AND EXISTS (SELECT 1 FROM public.oraculo_portal_aplicacoes ap WHERE ap.portal_id = p_portal_id)
    AND EXISTS (SELECT 1 FROM public.oraculo_portal_narroterapia n WHERE n.portal_id = p_portal_id)
    AND EXISTS (SELECT 1 FROM public.oraculo_portal_forjas f WHERE f.portal_id = p_portal_id)
    AND EXISTS (SELECT 1 FROM public.oraculo_portal_ferramentas ft WHERE ft.portal_id = p_portal_id)
    AND EXISTS (SELECT 1 FROM public.oraculo_portal_riscos_eticos r WHERE r.portal_id = p_portal_id);
$$;
