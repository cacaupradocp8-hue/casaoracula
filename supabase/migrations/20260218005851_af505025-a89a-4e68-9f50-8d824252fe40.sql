
-- ============================================================
-- PORTAL JUNGUIANO — TRAVESSIA DAS 9 FORÇAS DA PSIQUE
-- Estrutura de dados institucional Casa Orácula
-- ============================================================

-- Tabela principal do Portal Junguiano (configuração global)
CREATE TABLE IF NOT EXISTS public.portal_junguiano_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL DEFAULT 'Portal Junguiano — Travessia das 9 Forças da Psique',
  subtitulo text,
  descricao text,
  status text NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado', 'arquivado')),
  portal_minimo public.portal_type NOT NULL DEFAULT 'aluna_formacao',
  aviso_etico text,
  texto_encerramento text,
  modo_clinica_ativo boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Módulos do Portal Junguiano (ex: Módulo Zero, Travessia, Manual, Encerramento)
CREATE TABLE IF NOT EXISTS public.portal_junguiano_modulos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id uuid REFERENCES public.portal_junguiano_config(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  subtitulo text,
  descricao text,
  tipo text NOT NULL DEFAULT 'modulo' CHECK (tipo IN ('modulo_zero', 'travessia', 'manual_facilitadora', 'encerramento')),
  ordem integer NOT NULL DEFAULT 0,
  ativo boolean DEFAULT true,
  portal_minimo public.portal_type NOT NULL DEFAULT 'aluna_formacao',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Portais sequenciais (as 9 Forças + aulas do Módulo Zero)
CREATE TABLE IF NOT EXISTS public.portal_junguiano_portais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modulo_id uuid REFERENCES public.portal_junguiano_modulos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  subtitulo text,
  descricao text,
  numero_ordem integer NOT NULL DEFAULT 1,
  
  -- Conteúdo estruturado
  texto_aula_principal text,
  audio_url text,
  audio_titulo text,
  vivencia_guiada text,
  frase_oraculo text,
  
  -- Missão de Aplicação
  missao_titulo text,
  missao_descricao text,
  missao_criterio_conclusao text,
  
  -- Controles
  desbloqueio_tipo text DEFAULT 'sequencial' CHECK (desbloqueio_tipo IN ('livre', 'sequencial', 'registro_obrigatorio')),
  ativo boolean DEFAULT true,
  portal_minimo public.portal_type NOT NULL DEFAULT 'aluna_formacao',
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Registros reflexivos das usuárias por portal
CREATE TABLE IF NOT EXISTS public.portal_junguiano_registros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  portal_id uuid REFERENCES public.portal_junguiano_portais(id) ON DELETE CASCADE,
  reflexao text,
  missao_concluida boolean DEFAULT false,
  missao_concluida_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, portal_id)
);

-- Progresso geral da usuária no Portal Junguiano
CREATE TABLE IF NOT EXISTS public.portal_junguiano_progresso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  config_id uuid REFERENCES public.portal_junguiano_config(id),
  portais_concluidos integer DEFAULT 0,
  iniciado_em timestamptz DEFAULT now(),
  concluido_em timestamptz,
  modo_clinica boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.portal_junguiano_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_junguiano_modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_junguiano_portais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_junguiano_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portal_junguiano_progresso ENABLE ROW LEVEL SECURITY;

-- Config: leitura pública (publicado), escrita só admin
CREATE POLICY "config_select" ON public.portal_junguiano_config
  FOR SELECT USING (status = 'publicado' OR public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "config_admin_all" ON public.portal_junguiano_config
  FOR ALL USING (public.get_user_portal(auth.uid()) = 'admin');

-- Módulos: visíveis para usuárias com acesso ao portal
CREATE POLICY "modulos_select" ON public.portal_junguiano_modulos
  FOR SELECT USING (
    ativo = true
    OR public.get_user_portal(auth.uid()) = 'admin'
  );

CREATE POLICY "modulos_admin_all" ON public.portal_junguiano_modulos
  FOR ALL USING (public.get_user_portal(auth.uid()) = 'admin');

-- Portais: visíveis para usuárias com nível adequado
CREATE POLICY "portais_select" ON public.portal_junguiano_portais
  FOR SELECT USING (
    ativo = true
    OR public.get_user_portal(auth.uid()) = 'admin'
  );

CREATE POLICY "portais_admin_all" ON public.portal_junguiano_portais
  FOR ALL USING (public.get_user_portal(auth.uid()) = 'admin');

-- Registros: apenas a própria usuária ou admin
CREATE POLICY "registros_select_own" ON public.portal_junguiano_registros
  FOR SELECT USING (user_id = auth.uid() OR public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "registros_insert_own" ON public.portal_junguiano_registros
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "registros_update_own" ON public.portal_junguiano_registros
  FOR UPDATE USING (user_id = auth.uid());

-- Progresso: apenas a própria usuária ou admin
CREATE POLICY "progresso_select_own" ON public.portal_junguiano_progresso
  FOR SELECT USING (user_id = auth.uid() OR public.get_user_portal(auth.uid()) = 'admin');

CREATE POLICY "progresso_insert_own" ON public.portal_junguiano_progresso
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "progresso_update_own" ON public.portal_junguiano_progresso
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- TRIGGERS para updated_at
-- ============================================================

CREATE TRIGGER update_pj_config_updated_at
  BEFORE UPDATE ON public.portal_junguiano_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pj_modulos_updated_at
  BEFORE UPDATE ON public.portal_junguiano_modulos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pj_portais_updated_at
  BEFORE UPDATE ON public.portal_junguiano_portais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pj_registros_updated_at
  BEFORE UPDATE ON public.portal_junguiano_registros
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pj_progresso_updated_at
  BEFORE UPDATE ON public.portal_junguiano_progresso
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- SEED — Estrutura inicial (sem conteúdo — preenchimento via Ateliê)
-- ============================================================

-- Configuração principal
INSERT INTO public.portal_junguiano_config (
  titulo, subtitulo, descricao, status, portal_minimo,
  aviso_etico, texto_encerramento
) VALUES (
  'Portal Junguiano — Travessia das 9 Forças da Psique',
  'Formação simbólica em profundidade',
  'Um percurso iniciático de formação simbólica estruturado em 9 Forças da Psique, com fundamentos junguianos aplicados à prática facilitadora.',
  'rascunho',
  'aluna_formacao',
  'Esta travessia é formativa e simbólica. Não substitui acompanhamento psicológico ou médico.',
  'A travessia termina aqui. A responsabilidade começa agora.'
);

-- Referência ao config inserido
DO $$
DECLARE
  cfg_id uuid;
  mod_zero_id uuid;
  mod_travessia_id uuid;
  mod_manual_id uuid;
  mod_encerramento_id uuid;
BEGIN
  SELECT id INTO cfg_id FROM public.portal_junguiano_config
  WHERE titulo = 'Portal Junguiano — Travessia das 9 Forças da Psique'
  ORDER BY created_at DESC LIMIT 1;

  -- Módulo Zero
  INSERT INTO public.portal_junguiano_modulos (config_id, titulo, subtitulo, descricao, tipo, ordem, portal_minimo)
  VALUES (cfg_id, 'Módulo Zero — Fundamento Junguiano', 'Ler Símbolos Sem Violentar a Psique', 'Formar critério simbólico antes da travessia.', 'modulo_zero', 0, 'aluna_formacao')
  RETURNING id INTO mod_zero_id;

  -- Aulas do Módulo Zero
  INSERT INTO public.portal_junguiano_portais (modulo_id, titulo, subtitulo, numero_ordem, desbloqueio_tipo, portal_minimo) VALUES
  (mod_zero_id, '0.1 — Sinal, Símbolo e Arquétipo', 'Distinção fundamental', 1, 'sequencial', 'aluna_formacao'),
  (mod_zero_id, '0.2 — O Erro da Interpretação', 'O que não fazer com símbolos', 2, 'sequencial', 'aluna_formacao'),
  (mod_zero_id, '0.3 — Campo Ativo e Numinosidade', 'Quando o símbolo se move', 3, 'sequencial', 'aluna_formacao'),
  (mod_zero_id, '0.4 — O Lugar da Facilitadora', 'Posicionamento ético', 4, 'sequencial', 'aluna_formacao');

  -- Módulo Travessia das 9 Forças
  INSERT INTO public.portal_junguiano_modulos (config_id, titulo, subtitulo, descricao, tipo, ordem, portal_minimo)
  VALUES (cfg_id, 'Travessia das 9 Forças', 'O núcleo da formação simbólica', 'Nove portais sequenciais, cada um ativando uma força da psique feminina.', 'travessia', 1, 'aluna_formacao')
  RETURNING id INTO mod_travessia_id;

  -- 9 Portais da Travessia
  INSERT INTO public.portal_junguiano_portais (modulo_id, titulo, subtitulo, numero_ordem, frase_oraculo, desbloqueio_tipo, portal_minimo) VALUES
  (mod_travessia_id, 'Portal I — Encarnação', 'A força que ancora no corpo', 1, NULL, 'sequencial', 'aluna_formacao'),
  (mod_travessia_id, 'Portal II — Trama', 'A força que tece relações', 2, NULL, 'sequencial', 'aluna_formacao'),
  (mod_travessia_id, 'Portal III — Movimento Vivo', 'A força que impulsiona', 3, NULL, 'sequencial', 'aluna_formacao'),
  (mod_travessia_id, 'Portal IV — Sombra Lúcida', 'A força que ilumina o escuro', 4, NULL, 'sequencial', 'aluna_formacao'),
  (mod_travessia_id, 'Portal V — Lei Interna', 'A força que governa', 5, NULL, 'sequencial', 'aluna_formacao'),
  (mod_travessia_id, 'Portal VI — Sustentação', 'A força que nutre', 6, NULL, 'sequencial', 'aluna_formacao'),
  (mod_travessia_id, 'Portal VII — Valor', 'A força que reconhece o que importa', 7, NULL, 'sequencial', 'aluna_formacao'),
  (mod_travessia_id, 'Portal VIII — Origem', 'A força que retorna às raízes', 8, NULL, 'sequencial', 'aluna_formacao'),
  (mod_travessia_id, 'Portal IX — Consciência', 'A força que integra tudo', 9, NULL, 'sequencial', 'aluna_formacao');

  -- Manual da Facilitadora (acesso restrito)
  INSERT INTO public.portal_junguiano_modulos (config_id, titulo, subtitulo, descricao, tipo, ordem, portal_minimo)
  VALUES (cfg_id, 'Manual da Facilitadora ORÁCULA', 'Área restrita', 'Princípios éticos, limites do método e condutas de segurança.', 'manual_facilitadora', 2, 'oracula')
  RETURNING id INTO mod_manual_id;

  -- Encerramento
  INSERT INTO public.portal_junguiano_modulos (config_id, titulo, subtitulo, descricao, tipo, ordem, portal_minimo)
  VALUES (cfg_id, 'Encerramento — A Integração', 'O fim da travessia', 'A travessia termina aqui. A responsabilidade começa agora.', 'encerramento', 3, 'aluna_formacao')
  RETURNING id INTO mod_encerramento_id;

END $$;
