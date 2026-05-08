-- bloco_06_tables_jardins_ia.sql
-- Jardins (Heroína/Psique/Ofício), IA (agentes/syntheia), Labirinto
-- Depende de: 01, 02a, 03, 04, 05
-- Idempotente: CREATE TABLE IF NOT EXISTS + ADD CONSTRAINT PK/UK via DO block

-- ========== agente_conversas ==========
CREATE TABLE IF NOT EXISTS public.agente_conversas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agente_id uuid NOT NULL,
    user_id uuid NOT NULL,
    titulo text DEFAULT 'Nova conversa'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_conversas_pkey') THEN
    ALTER TABLE ONLY public.agente_conversas
    ADD CONSTRAINT agente_conversas_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== agente_mensagens ==========
CREATE TABLE IF NOT EXISTS public.agente_mensagens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversa_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT agente_mensagens_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agente_mensagens_pkey') THEN
    ALTER TABLE ONLY public.agente_mensagens
    ADD CONSTRAINT agente_mensagens_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== agentes ==========
CREATE TABLE IF NOT EXISTS public.agentes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text NOT NULL,
    instrucoes_base text DEFAULT ''::text NOT NULL,
    icone text DEFAULT 'bot'::text,
    status public.agente_status DEFAULT 'ativo'::public.agente_status NOT NULL,
    portal_minimo public.portal_type DEFAULT 'pre_iniciada'::public.portal_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    prompt_personalidade text DEFAULT ''::text,
    contextos_permitidos public.block_context_type[] DEFAULT '{}'::public.block_context_type[],
    modelo_preferido text DEFAULT 'google/gemini-2.5-flash'::text,
    temperatura numeric(2,1) DEFAULT 0.7,
    max_tokens integer DEFAULT 1024
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agentes_pkey') THEN
    ALTER TABLE ONLY public.agentes
    ADD CONSTRAINT agentes_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== ai_global_settings ==========
CREATE TABLE IF NOT EXISTS public.ai_global_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chave text NOT NULL,
    valor text NOT NULL,
    descricao text,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_global_settings_chave_key') THEN
    ALTER TABLE ONLY public.ai_global_settings
    ADD CONSTRAINT ai_global_settings_chave_key UNIQUE (chave);
  END IF;
END 31918;

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_global_settings_pkey') THEN
    ALTER TABLE ONLY public.ai_global_settings
    ADD CONSTRAINT ai_global_settings_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== ai_interaction_logs ==========
CREATE TABLE IF NOT EXISTS public.ai_interaction_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    agente_id uuid,
    context_type public.block_context_type,
    context_id uuid,
    input_text text NOT NULL,
    output_text text,
    tokens_used integer,
    modelo_usado text,
    latency_ms integer,
    success boolean DEFAULT true,
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_interaction_logs_pkey') THEN
    ALTER TABLE ONLY public.ai_interaction_logs
    ADD CONSTRAINT ai_interaction_logs_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== ai_provider_prices ==========
CREATE TABLE IF NOT EXISTS public.ai_provider_prices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    model_name text NOT NULL,
    provider text NOT NULL,
    input_price_per_1m_tokens numeric(10,4) NOT NULL,
    output_price_per_1m_tokens numeric(10,4) NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_provider_prices_model_name_key') THEN
    ALTER TABLE ONLY public.ai_provider_prices
    ADD CONSTRAINT ai_provider_prices_model_name_key UNIQUE (model_name);
  END IF;
END 31918;

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_provider_prices_pkey') THEN
    ALTER TABLE ONLY public.ai_provider_prices
    ADD CONSTRAINT ai_provider_prices_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== ai_recommendations ==========
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    session_id uuid,
    tipo text DEFAULT 'proximo_passo'::text NOT NULL,
    titulo text,
    descricao text,
    tool_sugerida_id uuid,
    distrito_sugerido_id uuid,
    status text DEFAULT 'pendente'::text,
    created_at timestamp with time zone DEFAULT now(),
    resolved_at timestamp with time zone
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ai_recommendations_pkey') THEN
    ALTER TABLE ONLY public.ai_recommendations
    ADD CONSTRAINT ai_recommendations_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== client_labyrinths ==========
CREATE TABLE IF NOT EXISTS public.client_labyrinths (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    nome_padrao text NOT NULL,
    descricao text,
    tipo text DEFAULT 'repetitivo'::text NOT NULL,
    severidade text DEFAULT 'medio'::text NOT NULL,
    gatilhos text[] DEFAULT '{}'::text[],
    acoes_ruptura text[] DEFAULT '{}'::text[],
    status text DEFAULT 'ativo'::text NOT NULL,
    sessoes_relacionadas integer DEFAULT 0,
    ultima_ocorrencia date,
    notas text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT client_labyrinths_severidade_check CHECK ((severidade = ANY (ARRAY['leve'::text, 'medio'::text, 'intenso'::text]))),
    CONSTRAINT client_labyrinths_status_check CHECK ((status = ANY (ARRAY['ativo'::text, 'observacao'::text, 'integrado'::text]))),
    CONSTRAINT client_labyrinths_tipo_check CHECK ((tipo = ANY (ARRAY['repetitivo'::text, 'evitativo'::text, 'circular'::text, 'autoboicote'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_labyrinths_pkey') THEN
    ALTER TABLE ONLY public.client_labyrinths
    ADD CONSTRAINT client_labyrinths_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== heroina_arquetipo_registros ==========
CREATE TABLE IF NOT EXISTS public.heroina_arquetipo_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    arquetipo_id uuid NOT NULL,
    polaridade_percebida text,
    registrado_em timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_arquetipo_registros_pkey') THEN
    ALTER TABLE ONLY public.heroina_arquetipo_registros
    ADD CONSTRAINT heroina_arquetipo_registros_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== heroina_cenario_registros ==========
CREATE TABLE IF NOT EXISTS public.heroina_cenario_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    metafora_id uuid NOT NULL,
    anotacao_livre text,
    registrado_em timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_cenario_registros_pkey') THEN
    ALTER TABLE ONLY public.heroina_cenario_registros
    ADD CONSTRAINT heroina_cenario_registros_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== heroina_fase_ativa ==========
CREATE TABLE IF NOT EXISTS public.heroina_fase_ativa (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    fase_id uuid NOT NULL,
    registrado_em timestamp with time zone DEFAULT now() NOT NULL,
    ativa boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_fase_ativa_pkey') THEN
    ALTER TABLE ONLY public.heroina_fase_ativa
    ADD CONSTRAINT heroina_fase_ativa_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== heroina_insights ==========
CREATE TABLE IF NOT EXISTS public.heroina_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tipo text NOT NULL,
    texto text NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT heroina_insights_tipo_check CHECK ((tipo = ANY (ARRAY['reflexao'::text, 'alerta'::text, 'movimento'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_insights_pkey') THEN
    ALTER TABLE ONLY public.heroina_insights
    ADD CONSTRAINT heroina_insights_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== heroina_jornada ==========
CREATE TABLE IF NOT EXISTS public.heroina_jornada (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    therapist_id uuid,
    fase_atual text DEFAULT 'limiar'::text NOT NULL,
    porta_ativa text,
    torre_ativa text,
    mensagem_simbolica text,
    consentimento_terapeuta boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_jornada_pkey') THEN
    ALTER TABLE ONLY public.heroina_jornada
    ADD CONSTRAINT heroina_jornada_pkey PRIMARY KEY (id);
  END IF;
END 31918;

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_jornada_user_id_key') THEN
    ALTER TABLE ONLY public.heroina_jornada
    ADD CONSTRAINT heroina_jornada_user_id_key UNIQUE (user_id);
  END IF;
END 31918;

-- ========== heroina_registros ==========
CREATE TABLE IF NOT EXISTS public.heroina_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tipo text DEFAULT 'exercicio'::text NOT NULL,
    pergunta text,
    resposta text,
    fase text,
    emocao_dominante text,
    arquetipo_ativo text,
    created_at timestamp with time zone DEFAULT now()
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_registros_pkey') THEN
    ALTER TABLE ONLY public.heroina_registros
    ADD CONSTRAINT heroina_registros_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== heroina_ritual_registros ==========
CREATE TABLE IF NOT EXISTS public.heroina_ritual_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ritual_id uuid NOT NULL,
    reflexao text,
    completado_em timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_ritual_registros_pkey') THEN
    ALTER TABLE ONLY public.heroina_ritual_registros
    ADD CONSTRAINT heroina_ritual_registros_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== jornada_heroina_fases ==========
CREATE TABLE IF NOT EXISTS public.jornada_heroina_fases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero integer NOT NULL,
    chave text NOT NULL,
    nome text NOT NULL,
    nome_en text,
    subtitulo text,
    descricao text NOT NULL,
    pergunta_central text,
    perguntas_reflexao text[] DEFAULT '{}'::text[],
    arquetipos_sugeridos text[] DEFAULT '{}'::text[],
    praticas_simbolicas text[] DEFAULT '{}'::text[],
    linguagem_contencao text,
    microcopy text,
    icone text,
    cor_primaria text,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    foco_terapeutico text,
    risco_especifico text,
    tarefa_simbolica text,
    sinal_integracao text,
    CONSTRAINT jornada_heroina_fases_numero_check CHECK (((numero >= 1) AND (numero <= 7)))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_fases_chave_key') THEN
    ALTER TABLE ONLY public.jornada_heroina_fases
    ADD CONSTRAINT jornada_heroina_fases_chave_key UNIQUE (chave);
  END IF;
END 31918;

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_fases_numero_key') THEN
    ALTER TABLE ONLY public.jornada_heroina_fases
    ADD CONSTRAINT jornada_heroina_fases_numero_key UNIQUE (numero);
  END IF;
END 31918;

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_fases_pkey') THEN
    ALTER TABLE ONLY public.jornada_heroina_fases
    ADD CONSTRAINT jornada_heroina_fases_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== jornada_heroina_notas_profissionais ==========
CREATE TABLE IF NOT EXISTS public.jornada_heroina_notas_profissionais (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    registro_id uuid NOT NULL,
    fase_numero integer NOT NULL,
    terapeuta_id uuid NOT NULL,
    observacoes text,
    padroes_observados text,
    intervencoes_sugeridas text,
    proximos_passos text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT jornada_heroina_notas_profissionais_fase_numero_check CHECK (((fase_numero >= 1) AND (fase_numero <= 7)))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_notas_profiss_registro_id_fase_numero_terap_key') THEN
    ALTER TABLE ONLY public.jornada_heroina_notas_profissionais
    ADD CONSTRAINT jornada_heroina_notas_profiss_registro_id_fase_numero_terap_key UNIQUE (registro_id, fase_numero, terapeuta_id);
  END IF;
END 31918;

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_notas_profissionais_pkey') THEN
    ALTER TABLE ONLY public.jornada_heroina_notas_profissionais
    ADD CONSTRAINT jornada_heroina_notas_profissionais_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== jornada_heroina_registros ==========
CREATE TABLE IF NOT EXISTS public.jornada_heroina_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    cliente_id uuid,
    terapeuta_id uuid,
    modo text DEFAULT 'pessoal'::text NOT NULL,
    fase_atual integer DEFAULT 1,
    nome_simbolico text,
    intencao_inicial text,
    reflexao_final text,
    status text DEFAULT 'em_andamento'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    session_case_id uuid,
    notas_progresso jsonb DEFAULT '[]'::jsonb,
    CONSTRAINT jornada_heroina_registros_modo_check CHECK ((modo = ANY (ARRAY['pessoal'::text, 'conducao'::text]))),
    CONSTRAINT jornada_heroina_registros_status_check CHECK ((status = ANY (ARRAY['em_andamento'::text, 'pausado'::text, 'concluido'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_pkey') THEN
    ALTER TABLE ONLY public.jornada_heroina_registros
    ADD CONSTRAINT jornada_heroina_registros_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== jornada_heroina_respostas ==========
CREATE TABLE IF NOT EXISTS public.jornada_heroina_respostas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    registro_id uuid NOT NULL,
    fase_numero integer NOT NULL,
    respostas_reflexao jsonb DEFAULT '{}'::jsonb,
    arquetipo_escolhido text,
    tom_emocional text,
    simbolo_pessoal text,
    notas_pessoais text,
    data_entrada timestamp with time zone DEFAULT now(),
    data_conclusao timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT jornada_heroina_respostas_fase_numero_check CHECK (((fase_numero >= 1) AND (fase_numero <= 7)))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_respostas_pkey') THEN
    ALTER TABLE ONLY public.jornada_heroina_respostas
    ADD CONSTRAINT jornada_heroina_respostas_pkey PRIMARY KEY (id);
  END IF;
END 31918;

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_respostas_registro_id_fase_numero_key') THEN
    ALTER TABLE ONLY public.jornada_heroina_respostas
    ADD CONSTRAINT jornada_heroina_respostas_registro_id_fase_numero_key UNIQUE (registro_id, fase_numero);
  END IF;
END 31918;

-- ========== labirinto_39_portas ==========
CREATE TABLE IF NOT EXISTS public.labirinto_39_portas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    portas_json jsonb DEFAULT '[]'::jsonb NOT NULL,
    reflexao_abertas text,
    reflexao_fechadas text,
    reflexao_trancadas text,
    reflexao_grupo_acessivel text,
    reflexao_grupo_inacessivel text,
    grupo_mais_acessivel text,
    grupo_menos_acessivel text,
    total_abertas integer DEFAULT 0 NOT NULL,
    total_fechadas integer DEFAULT 0 NOT NULL,
    total_trancadas integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_39_portas_pkey') THEN
    ALTER TABLE ONLY public.labirinto_39_portas
    ADD CONSTRAINT labirinto_39_portas_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== labirinto_anotacoes ==========
CREATE TABLE IF NOT EXISTS public.labirinto_anotacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    porta_id uuid NOT NULL,
    user_id uuid NOT NULL,
    cliente_id uuid,
    anotacao text NOT NULL,
    tipo text DEFAULT 'geral'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_pkey') THEN
    ALTER TABLE ONLY public.labirinto_anotacoes
    ADD CONSTRAINT labirinto_anotacoes_pkey PRIMARY KEY (id);
  END IF;
END 31918;

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_porta_id_user_id_cliente_id_created_at_key') THEN
    ALTER TABLE ONLY public.labirinto_anotacoes
    ADD CONSTRAINT labirinto_anotacoes_porta_id_user_id_cliente_id_created_at_key UNIQUE (porta_id, user_id, cliente_id, created_at);
  END IF;
END 31918;

-- ========== labirinto_arquetipos ==========
CREATE TABLE IF NOT EXISTS public.labirinto_arquetipos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    nome text NOT NULL,
    descricao_luz text NOT NULL,
    descricao_sombra text NOT NULL,
    territorio text,
    icone text,
    cor_acento text,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    imagem_url text
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_arquetipos_pkey') THEN
    ALTER TABLE ONLY public.labirinto_arquetipos
    ADD CONSTRAINT labirinto_arquetipos_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== labirinto_fases ==========
CREATE TABLE IF NOT EXISTS public.labirinto_fases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    nome text NOT NULL,
    subtitulo text,
    descricao text NOT NULL,
    icone text,
    cor_acento text,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    imagem_url text,
    texto_simbolico text,
    nucleo text,
    tema_central text,
    pergunta_chave text,
    exercicio_titulo text,
    exercicio_instrucao text,
    ritual_texto text,
    codigo_interno text,
    versao_conteudo text DEFAULT '1.0'::text,
    observacoes_admin text
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_fases_pkey') THEN
    ALTER TABLE ONLY public.labirinto_fases
    ADD CONSTRAINT labirinto_fases_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== labirinto_leituras ==========
CREATE TABLE IF NOT EXISTS public.labirinto_leituras (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    porta_id uuid NOT NULL,
    user_id uuid NOT NULL,
    cliente_id uuid,
    metodo_ativacao text DEFAULT 'manual'::text NOT NULL,
    contexto text,
    reflexoes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_pkey') THEN
    ALTER TABLE ONLY public.labirinto_leituras
    ADD CONSTRAINT labirinto_leituras_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== labirinto_metaforas ==========
CREATE TABLE IF NOT EXISTS public.labirinto_metaforas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    nome text NOT NULL,
    texto_evocativo text NOT NULL,
    pergunta_reflexao text,
    icone text,
    cor_acento text,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    imagem_url text
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_metaforas_pkey') THEN
    ALTER TABLE ONLY public.labirinto_metaforas
    ADD CONSTRAINT labirinto_metaforas_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== labirinto_portas ==========
CREATE TABLE IF NOT EXISTS public.labirinto_portas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero integer NOT NULL,
    nome text NOT NULL,
    subtitulo text,
    imagem_url text,
    ai_generated_image_url text,
    symbolic_focus text,
    cena_narrativa text,
    eixo_psiquico text,
    risco_clinico text,
    pergunta_chave text,
    caso_espelho_titulo text,
    caso_espelho_frase_chegada text,
    caso_espelho_erro_comum text,
    caso_espelho_como_sustentar text,
    chave_frase_ancora text,
    chave_o_que_nao_fazer text,
    chave_quando_parar text,
    chave_sinal_maturidade text,
    ativa boolean DEFAULT true NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    portal_minimo public.portal_type DEFAULT 'pre_iniciada'::public.portal_type NOT NULL,
    portal_caso_espelho public.portal_type DEFAULT 'iniciada'::public.portal_type NOT NULL,
    portal_chave_facilitadora public.portal_type DEFAULT 'iniciada'::public.portal_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    tipo_campo text,
    forca_ativa text,
    campo_pede text,
    nao_fazer_aqui text,
    postura_facilitadora text,
    caso_espelho_situacao text,
    caso_espelho_erros_facilitadora text,
    caso_espelho_postura_correta text,
    audio_url text,
    audio_titulo text,
    CONSTRAINT labirinto_portas_numero_check CHECK (((numero >= 1) AND (numero <= 99)))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_portas_numero_key') THEN
    ALTER TABLE ONLY public.labirinto_portas
    ADD CONSTRAINT labirinto_portas_numero_key UNIQUE (numero);
  END IF;
END 31918;

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_portas_pkey') THEN
    ALTER TABLE ONLY public.labirinto_portas
    ADD CONSTRAINT labirinto_portas_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== labirinto_registros ==========
CREATE TABLE IF NOT EXISTS public.labirinto_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    terapeuta_id uuid,
    session_case_id uuid,
    modo_uso public.labirinto_modo_uso DEFAULT 'individual'::public.labirinto_modo_uso NOT NULL,
    fase_id uuid,
    arquetipo_id uuid,
    metafora_id uuid,
    ritual_id uuid,
    reflexao_fase text,
    reflexao_arquetipo text,
    reflexao_metafora text,
    reflexao_ritual text,
    reflexao_final text,
    concluido boolean DEFAULT false NOT NULL,
    concluido_em timestamp with time zone,
    notas_terapeuta text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    observacoes_clinicas text,
    hipotese_terapeutica text,
    nome_cliente text
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_pkey') THEN
    ALTER TABLE ONLY public.labirinto_registros
    ADD CONSTRAINT labirinto_registros_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== labirinto_rituais ==========
CREATE TABLE IF NOT EXISTS public.labirinto_rituais (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    nome text NOT NULL,
    descricao text NOT NULL,
    duracao text,
    instrucoes text,
    icone text,
    cor_acento text,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_rituais_pkey') THEN
    ALTER TABLE ONLY public.labirinto_rituais
    ADD CONSTRAINT labirinto_rituais_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== labirinto_roteiro_templates ==========
CREATE TABLE IF NOT EXISTS public.labirinto_roteiro_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tipo_camada text NOT NULL,
    camada_id uuid NOT NULL,
    secao text NOT NULL,
    texto_base text NOT NULL,
    ordem integer DEFAULT 1 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT labirinto_roteiro_templates_secao_check CHECK ((secao = ANY (ARRAY['abertura'::text, 'exploracao'::text, 'intervencao'::text, 'fechamento'::text]))),
    CONSTRAINT labirinto_roteiro_templates_tipo_camada_check CHECK ((tipo_camada = ANY (ARRAY['fase'::text, 'arquetipo'::text, 'metafora'::text, 'ritual'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiro_templates_pkey') THEN
    ALTER TABLE ONLY public.labirinto_roteiro_templates
    ADD CONSTRAINT labirinto_roteiro_templates_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== labirinto_roteiros_gerados ==========
CREATE TABLE IF NOT EXISTS public.labirinto_roteiros_gerados (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    session_case_id uuid,
    fase_id uuid,
    arquetipo_id uuid,
    metafora_id uuid,
    ritual_id uuid,
    abertura text,
    exploracao text,
    intervencao text,
    fechamento text,
    gerado_por text DEFAULT 'hibrido'::text NOT NULL,
    editado boolean DEFAULT false NOT NULL,
    notas_terapeuta text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT labirinto_roteiros_gerados_gerado_por_check CHECK ((gerado_por = ANY (ARRAY['template'::text, 'hibrido'::text, 'ia_completo'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_pkey') THEN
    ALTER TABLE ONLY public.labirinto_roteiros_gerados
    ADD CONSTRAINT labirinto_roteiros_gerados_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== labyrinth_records ==========
CREATE TABLE IF NOT EXISTS public.labyrinth_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    session_id uuid,
    fact text,
    emotional_field text,
    archetypal_image text,
    crossing text,
    facilitator_support text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_pkey') THEN
    ALTER TABLE ONLY public.labyrinth_records
    ADD CONSTRAINT labyrinth_records_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== mapa_heroina ==========
CREATE TABLE IF NOT EXISTS public.mapa_heroina (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    cliente_nome text,
    porta_id uuid,
    data_registro timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'ativa'::text NOT NULL,
    evolucao_texto text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT mapa_heroina_status_check CHECK ((status = ANY (ARRAY['ativa'::text, 'integrada'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_heroina_pkey') THEN
    ALTER TABLE ONLY public.mapa_heroina
    ADD CONSTRAINT mapa_heroina_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== posts_mentoria ==========
CREATE TABLE IF NOT EXISTS public.posts_mentoria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tipo public.mentoria_tipo DEFAULT 'aviso'::public.mentoria_tipo NOT NULL,
    titulo text NOT NULL,
    texto text NOT NULL,
    data_evento timestamp with time zone,
    link_evento text,
    anexo_url text,
    caso_id uuid,
    status public.post_status DEFAULT 'rascunho'::public.post_status NOT NULL,
    portal_minimo public.portal_type DEFAULT 'pre_iniciada'::public.portal_type NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'posts_mentoria_pkey') THEN
    ALTER TABLE ONLY public.posts_mentoria
    ADD CONSTRAINT posts_mentoria_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== sessoes_labirinto ==========
CREATE TABLE IF NOT EXISTS public.sessoes_labirinto (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    modo text DEFAULT 'pessoal'::text NOT NULL,
    cliente_nome text,
    porta_id uuid,
    data_sessao timestamp with time zone DEFAULT now() NOT NULL,
    observacoes_clinicas text,
    hipotese_terapeutica text,
    emocao_dominante text,
    padrao_defensivo text,
    direcionamento_terapeutico text,
    micro_acao_definida text,
    registro_acao text,
    registro_percepcao text,
    concluida boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sessoes_labirinto_modo_check CHECK ((modo = ANY (ARRAY['pessoal'::text, 'profissional'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_labirinto_pkey') THEN
    ALTER TABLE ONLY public.sessoes_labirinto
    ADD CONSTRAINT sessoes_labirinto_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== syntheia_conversations ==========
CREATE TABLE IF NOT EXISTS public.syntheia_conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    mode_id text,
    voice_id uuid,
    title text,
    context_data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_pkey') THEN
    ALTER TABLE ONLY public.syntheia_conversations
    ADD CONSTRAINT syntheia_conversations_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== syntheia_creations ==========
CREATE TABLE IF NOT EXISTS public.syntheia_creations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tipo text NOT NULL,
    publico_alvo text NOT NULL,
    momento_jornada text NOT NULL,
    tempo_disponivel text NOT NULL,
    tema_principal text NOT NULL,
    chave_simbolica text,
    intencao_terapeutica text,
    estrutura_pratica text,
    suporte_linguagem text,
    fechamento_integracao text,
    tags text[] DEFAULT '{}'::text[],
    titulo text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT syntheia_creations_momento_jornada_check CHECK ((momento_jornada = ANY (ARRAY['inicio'::text, 'crise_transicao'::text, 'integracao'::text, 'fechamento'::text]))),
    CONSTRAINT syntheia_creations_publico_alvo_check CHECK ((publico_alvo = ANY (ARRAY['mulher_individual'::text, 'grupo_mulheres'::text, 'publico_profissional'::text]))),
    CONSTRAINT syntheia_creations_tempo_disponivel_check CHECK ((tempo_disponivel = ANY (ARRAY['30min'::text, '50min'::text, '90min'::text, 'jornada_multipla'::text]))),
    CONSTRAINT syntheia_creations_tipo_check CHECK ((tipo = ANY (ARRAY['sessao_individual'::text, 'experiencia_grupo'::text, 'ritual'::text, 'produto_programa'::text, 'aula_conteudo'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_creations_pkey') THEN
    ALTER TABLE ONLY public.syntheia_creations
    ADD CONSTRAINT syntheia_creations_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== syntheia_messages ==========
CREATE TABLE IF NOT EXISTS public.syntheia_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    tokens_used integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT syntheia_messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_messages_pkey') THEN
    ALTER TABLE ONLY public.syntheia_messages
    ADD CONSTRAINT syntheia_messages_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== syntheia_modes ==========
CREATE TABLE IF NOT EXISTS public.syntheia_modes (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    system_prompt text NOT NULL,
    icon text,
    active boolean DEFAULT true NOT NULL,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_modes_pkey') THEN
    ALTER TABLE ONLY public.syntheia_modes
    ADD CONSTRAINT syntheia_modes_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== syntheia_voices ==========
CREATE TABLE IF NOT EXISTS public.syntheia_voices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    voice_prompt text NOT NULL,
    trigger_context jsonb,
    active boolean DEFAULT true NOT NULL,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT syntheia_voices_type_check CHECK ((type = ANY (ARRAY['quiz'::text, 'porta'::text, 'travessia'::text, 'arquetipo'::text, 'ferramenta'::text, 'ritual'::text])))
);

DO 31918 BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_voices_pkey') THEN
    ALTER TABLE ONLY public.syntheia_voices
    ADD CONSTRAINT syntheia_voices_pkey PRIMARY KEY (id);
  END IF;
END 31918;

-- ========== Validação ==========
SELECT count(*) AS bloco_06_tables_present FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('agente_conversas', 'agente_mensagens', 'agentes', 'ai_global_settings', 'ai_interaction_logs', 'ai_provider_prices', 'ai_recommendations', 'client_labyrinths', 'heroina_arquetipo_registros', 'heroina_cenario_registros', 'heroina_fase_ativa', 'heroina_insights', 'heroina_jornada', 'heroina_registros', 'heroina_ritual_registros', 'jornada_heroina_fases', 'jornada_heroina_notas_profissionais', 'jornada_heroina_registros', 'jornada_heroina_respostas', 'labirinto_39_portas', 'labirinto_anotacoes', 'labirinto_arquetipos', 'labirinto_fases', 'labirinto_leituras', 'labirinto_metaforas', 'labirinto_portas', 'labirinto_registros', 'labirinto_rituais', 'labirinto_roteiro_templates', 'labirinto_roteiros_gerados', 'labyrinth_records', 'mapa_heroina', 'posts_mentoria', 'sessoes_labirinto', 'syntheia_conversations', 'syntheia_creations', 'syntheia_messages', 'syntheia_modes', 'syntheia_voices');
SELECT count(*) AS bloco_06_pk_uk_constraints FROM pg_constraint WHERE conname IN ('agente_conversas_pkey', 'agente_mensagens_pkey', 'agentes_pkey', 'ai_global_settings_chave_key', 'ai_global_settings_pkey', 'ai_interaction_logs_pkey', 'ai_provider_prices_model_name_key', 'ai_provider_prices_pkey', 'ai_recommendations_pkey', 'client_labyrinths_pkey', 'heroina_arquetipo_registros_pkey', 'heroina_cenario_registros_pkey', 'heroina_fase_ativa_pkey', 'heroina_insights_pkey', 'heroina_jornada_pkey', 'heroina_jornada_user_id_key', 'heroina_registros_pkey', 'heroina_ritual_registros_pkey', 'jornada_heroina_fases_chave_key', 'jornada_heroina_fases_numero_key', 'jornada_heroina_fases_pkey', 'jornada_heroina_notas_profiss_registro_id_fase_numero_terap_key', 'jornada_heroina_notas_profissionais_pkey', 'jornada_heroina_registros_pkey', 'jornada_heroina_respostas_pkey', 'jornada_heroina_respostas_registro_id_fase_numero_key', 'labirinto_39_portas_pkey', 'labirinto_anotacoes_pkey', 'labirinto_anotacoes_porta_id_user_id_cliente_id_created_at_key', 'labirinto_arquetipos_pkey', 'labirinto_fases_pkey', 'labirinto_leituras_pkey', 'labirinto_metaforas_pkey', 'labirinto_portas_numero_key', 'labirinto_portas_pkey', 'labirinto_registros_pkey', 'labirinto_rituais_pkey', 'labirinto_roteiro_templates_pkey', 'labirinto_roteiros_gerados_pkey', 'labyrinth_records_pkey', 'mapa_heroina_pkey', 'posts_mentoria_pkey', 'sessoes_labirinto_pkey', 'syntheia_conversations_pkey', 'syntheia_creations_pkey', 'syntheia_messages_pkey', 'syntheia_modes_pkey', 'syntheia_voices_pkey');