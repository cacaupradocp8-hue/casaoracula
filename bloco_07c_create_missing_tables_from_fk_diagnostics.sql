-- bloco_07c_create_missing_tables_from_fk_diagnostics.sql
-- Only CREATE TABLE IF NOT EXISTS and PK/UK constraints

CREATE TABLE IF NOT EXISTS public.access_expiration_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    expired_at timestamp with time zone DEFAULT now() NOT NULL,
    previous_portal text,
    reason text DEFAULT 'auto_expiration'::text
);

CREATE TABLE IF NOT EXISTS public.admin_action_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action_type text NOT NULL,
    channel text NOT NULL,
    sent_at timestamp with time zone DEFAULT now(),
    sent_by uuid,
    conversion_risk_at_action numeric DEFAULT 0,
    churn_risk_at_action numeric DEFAULT 0,
    saas_value_risk_at_action numeric DEFAULT 0,
    action_reason_at_action text,
    last_value_timestamp_at_action timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.admin_automation_audit (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    rule_id uuid,
    admin_id uuid,
    action text NOT NULL,
    reason text,
    snapshot_data jsonb,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_automation_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    risk_type text NOT NULL,
    action_type text NOT NULL,
    channel text NOT NULL,
    min_success_rate numeric DEFAULT 15.0 NOT NULL,
    is_active boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    portal text,
    measurement_window_days integer DEFAULT 7,
    approval_reason text,
    last_success_rate numeric,
    last_volume integer,
    last_snapshot_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.agente_conversas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agente_id uuid NOT NULL,
    user_id uuid NOT NULL,
    titulo text DEFAULT 'Nova conversa'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.agente_mensagens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversa_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT agente_mensagens_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text])))
);

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

CREATE TABLE IF NOT EXISTS public.archetypal_profile_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    dominant_archetype text,
    shadow_archetype text,
    psychic_movement text,
    evolution_call text,
    clinical_question text,
    source_data_json jsonb DEFAULT '{}'::jsonb,
    generated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.archetype_tools (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    archetype_id uuid NOT NULL,
    tool_id uuid NOT NULL,
    tipo text DEFAULT 'principal'::text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.atelie_conteudos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_id uuid,
    jornada text NOT NULL,
    portal text NOT NULL,
    objetivo text NOT NULL,
    ideias_chave text NOT NULL,
    tom text NOT NULL,
    duracao text,
    conteudo_gerado jsonb,
    status text DEFAULT 'rascunho'::text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT atelie_conteudos_status_check CHECK ((status = ANY (ARRAY['rascunho'::text, 'revisado'::text, 'publicado'::text])))
);

CREATE TABLE IF NOT EXISTS public.atelie_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    template_content text NOT NULL,
    is_default boolean DEFAULT false,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.atlas_arquetipos_femininos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chave text NOT NULL,
    nome text NOT NULL,
    territorio text NOT NULL,
    descricao_clinica text NOT NULL,
    manifestacoes_frequentes text[] DEFAULT '{}'::text[],
    perguntas_sessao text[] DEFAULT '{}'::text[],
    riscos_projecao text[] DEFAULT '{}'::text[],
    trabalhar_forca_sem_reforcar_ferida text,
    icone text DEFAULT 'Sparkles'::text,
    cor_acento text DEFAULT 'gold'::text,
    posicao_x double precision DEFAULT 0,
    posicao_y double precision DEFAULT 0,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT atlas_arquetipos_femininos_territorio_check CHECK ((territorio = ANY (ARRAY['sustentacao'::text, 'travessia'::text, 'profundidade'::text, 'integracao'::text])))
);

CREATE TABLE IF NOT EXISTS public.atlas_arquetipos_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    arquetipos_selecionados text[] DEFAULT '{}'::text[] NOT NULL,
    arquetipos_descricao jsonb DEFAULT '{}'::jsonb NOT NULL,
    arquetipos_atividade jsonb DEFAULT '{}'::jsonb NOT NULL,
    arquetipos_situacoes jsonb DEFAULT '{}'::jsonb NOT NULL,
    dinamica_geral text,
    conflitos_arquetipos text,
    harmonias_arquetipos text,
    arquetipo_dominante text,
    arquetipo_dormindo text,
    o_que_poderia_trazer text,
    reflexao_dominante text,
    atividade_media numeric(3,1) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audio_assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    descricao text,
    file_path text NOT NULL,
    duracao_segundos integer,
    capa_url text,
    portal_minimo public.portal_type DEFAULT 'visitante'::public.portal_type,
    publicado boolean DEFAULT false,
    ordem integer DEFAULT 0,
    categoria text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    porta_psiquica text
);

CREATE TABLE IF NOT EXISTS public.aulas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    titulo text NOT NULL,
    subtitulo text,
    conteudo_gerado jsonb,
    conteudo_raw text,
    ordem integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'rascunho'::text NOT NULL,
    motor_geracao text DEFAULT 'padrao'::text,
    nivel_conteudo text DEFAULT 'certificada'::text,
    duracao text,
    tom text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT aulas_motor_geracao_check CHECK ((motor_geracao = ANY (ARRAY['padrao'::text, 'agente_casa_oracula'::text]))),
    CONSTRAINT aulas_nivel_conteudo_check CHECK ((nivel_conteudo = ANY (ARRAY['certificada'::text, 'mentorada'::text]))),
    CONSTRAINT aulas_status_check CHECK ((status = ANY (ARRAY['rascunho'::text, 'revisado'::text, 'publicado'::text, 'arquivado'::text])))
);

CREATE TABLE IF NOT EXISTS public.biblioteca_casos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    torre_id text NOT NULL,
    porta_id uuid,
    porta_nome text,
    titulo text,
    cena text NOT NULL,
    erro_comum text NOT NULL,
    leitura_oracula text NOT NULL,
    resultado text NOT NULL,
    risco_tipo text,
    tags text[],
    fonte text,
    autor_id uuid,
    ativa boolean DEFAULT true,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT biblioteca_casos_risco_tipo_check CHECK ((risco_tipo = ANY (ARRAY['pressa'::text, 'interpretacao'::text, 'confronto'::text, 'moralizacao'::text, 'resiliencia'::text, 'explicacao'::text, 'outro'::text]))),
    CONSTRAINT biblioteca_casos_torre_id_check CHECK ((torre_id = ANY (ARRAY['controle'::text, 'performance'::text, 'silencio'::text, 'cuidado'::text, 'adaptacao'::text, 'espiritualizacao'::text, 'forca'::text])))
);

CREATE TABLE IF NOT EXISTS public.big5_funcional_dimensoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chave text NOT NULL,
    nome text NOT NULL,
    nome_ingles text NOT NULL,
    descricao text NOT NULL,
    cor text NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    interpretacao_alto text,
    interpretacao_baixo text,
    ponto_atencao_alto text,
    ponto_atencao_baixo text
);

CREATE TABLE IF NOT EXISTS public.big5_funcional_perguntas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    dimensao_id uuid NOT NULL,
    texto_pergunta text NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.big5_oracular_fatores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chave text NOT NULL,
    nome text NOT NULL,
    nome_ocean text NOT NULL,
    simbolo text,
    cor_primaria text DEFAULT '#C9A45C'::text,
    descricao_simbolica text,
    narrativa_elevada text,
    narrativa_fragil text,
    ordem integer NOT NULL,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.big5_oracular_perguntas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fator_id uuid NOT NULL,
    texto_pergunta text NOT NULL,
    ordem integer NOT NULL,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.big5_oracular_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    respostas_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    medias_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    fator_predominante text,
    fator_fragilizado text,
    reflexao_pessoal text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.big5_porta_mapeamento (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fator_alto text NOT NULL,
    fator_baixo text NOT NULL,
    porta_associada text NOT NULL,
    porta_tipo_campo text,
    ritual_id uuid,
    descricao_combinacao text,
    narrativa_curta text,
    ativo boolean DEFAULT true,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.big5_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    caso_id uuid,
    abertura integer NOT NULL,
    conscienciosidade integer NOT NULL,
    extroversao integer NOT NULL,
    amabilidade integer NOT NULL,
    neuroticismo integer NOT NULL,
    notas text,
    impacto_clinico text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    terapeuta_id uuid,
    cliente_id uuid,
    CONSTRAINT big5_registros_abertura_check CHECK (((abertura >= 0) AND (abertura <= 100))),
    CONSTRAINT big5_registros_amabilidade_check CHECK (((amabilidade >= 0) AND (amabilidade <= 100))),
    CONSTRAINT big5_registros_conscienciosidade_check CHECK (((conscienciosidade >= 0) AND (conscienciosidade <= 100))),
    CONSTRAINT big5_registros_extroversao_check CHECK (((extroversao >= 0) AND (extroversao <= 100))),
    CONSTRAINT big5_registros_neuroticismo_check CHECK (((neuroticismo >= 0) AND (neuroticismo <= 100)))
);

CREATE TABLE IF NOT EXISTS public.big5_ritual_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    big5_registro_id uuid,
    ritual_id uuid,
    porta_acessada text,
    completado_em timestamp with time zone,
    acessou_narroterapia boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.big5_symbolic_afirmacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    force_id uuid NOT NULL,
    texto_afirmacao text NOT NULL,
    peso integer DEFAULT 1 NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.big5_symbolic_forces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chave text NOT NULL,
    nome text NOT NULL,
    nome_en text,
    descricao_simbolica text NOT NULL,
    narrativa_elevada text,
    narrativa_fragil text,
    microcopy_reflexao text,
    pratica_sugerida text,
    icone text DEFAULT 'sparkles'::text,
    cor_primaria text DEFAULT '#D4AF37'::text,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    padrao_emocional text,
    conflito_recorrente text,
    repeticao_comportamental text,
    risco_clinico text,
    potencial_inexplorado text
);

CREATE TABLE IF NOT EXISTS public.big5_symbolic_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    cliente_id uuid,
    terapeuta_id uuid,
    abertura_intensidade text DEFAULT 'medium'::text,
    suporte_intensidade text DEFAULT 'medium'::text,
    relacional_intensidade text DEFAULT 'medium'::text,
    expressao_intensidade text DEFAULT 'medium'::text,
    sensibilidade_intensidade text DEFAULT 'medium'::text,
    respostas_json jsonb DEFAULT '{}'::jsonb,
    nome_simbolico text,
    reflexao_final text,
    notas text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    session_case_id uuid,
    narrativa_localizacao text,
    narrativa_editada boolean DEFAULT false,
    notas_terapeuta text,
    territorio_predominante text,
    CONSTRAINT big5_symbolic_registros_abertura_intensidade_check CHECK ((abertura_intensidade = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'dominant'::text]))),
    CONSTRAINT big5_symbolic_registros_expressao_intensidade_check CHECK ((expressao_intensidade = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'dominant'::text]))),
    CONSTRAINT big5_symbolic_registros_relacional_intensidade_check CHECK ((relacional_intensidade = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'dominant'::text]))),
    CONSTRAINT big5_symbolic_registros_sensibilidade_intensidade_check CHECK ((sensibilidade_intensidade = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'dominant'::text]))),
    CONSTRAINT big5_symbolic_registros_suporte_intensidade_check CHECK ((suporte_intensidade = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'dominant'::text])))
);

CREATE TABLE IF NOT EXISTS public.book_links (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    from_book_id uuid NOT NULL,
    to_book_id uuid NOT NULL,
    link_type text NOT NULL,
    note text,
    CONSTRAINT book_links_link_type_check CHECK ((link_type = ANY (ARRAY['SUPORTA'::text, 'ABRE'::text, 'INTEGRA'::text, 'FUNDA'::text])))
);

CREATE TABLE IF NOT EXISTS public.book_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    station_id uuid NOT NULL,
    type text NOT NULL,
    title text DEFAULT ''::text NOT NULL,
    file_url text NOT NULL,
    file_kind text DEFAULT 'image'::text NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    published boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    caption text DEFAULT ''::text,
    credit text DEFAULT ''::text,
    source_url text DEFAULT ''::text,
    CONSTRAINT book_media_file_kind_check CHECK ((file_kind = ANY (ARRAY['image'::text, 'pdf'::text]))),
    CONSTRAINT book_media_type_check CHECK ((type = ANY (ARRAY['cover'::text, 'banner'::text, 'gallery'::text])))
);

CREATE TABLE IF NOT EXISTS public.book_tours (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    book_id uuid NOT NULL,
    jornada text DEFAULT 'Heroína'::text NOT NULL,
    onde_entra_jornada text,
    habilidade_simbolica text,
    o_que_nao_fazer text,
    como_atravessar text,
    quando_encerrar text,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.books (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    author text,
    category text NOT NULL,
    is_multipolar boolean DEFAULT false,
    cover_url text,
    description_short text,
    manifesto_short text,
    why_here text,
    how_to_read text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    summary_symbolic text,
    central_theme text,
    key_archetypes text[],
    key_symbols text[],
    tension_axis text,
    CONSTRAINT books_category_check CHECK ((category = ANY (ARRAY['TRAVESSIA'::text, 'PORTA'::text, 'PONTE'::text, 'FUNDACAO'::text, 'MATRIZ'::text])))
);

CREATE TABLE IF NOT EXISTS public.canteiro_reactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entry_id uuid NOT NULL,
    user_id uuid NOT NULL,
    reaction_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cartografia_complexos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    complexos_json jsonb DEFAULT '[]'::jsonb NOT NULL,
    gatilhos_gerais text,
    padrao_central text,
    complexo_dominante text,
    complexo_latente text,
    reflexao_origem text,
    reflexao_final text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cartografia_psiquica (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid,
    therapist_id uuid,
    cor_predominante text NOT NULL,
    atmosfera text[] DEFAULT '{}'::text[] NOT NULL,
    territorios_principais text[] DEFAULT '{}'::text[] NOT NULL,
    recursos_internos text,
    conflitos_tensoes text,
    simbolo_pessoal text,
    por_que_simbolo text,
    ponto_partida text,
    indice_equilibrio integer DEFAULT 50,
    resumo_narrativo text,
    sugestao_proximo_passo text,
    metadata_json jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cartographer_engine (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    session_id uuid,
    therapist_id uuid NOT NULL,
    trigger_type text DEFAULT 'manual'::text NOT NULL,
    fase_jornada text DEFAULT 'inicio'::text,
    modo_sessao text DEFAULT 'oracula'::text,
    distrito_ativo text,
    torre_ativa text,
    porta_ativa text,
    arquetipo_regente_id uuid,
    input_snapshot jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cartographer_recommendations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    engine_id uuid NOT NULL,
    tool_principal_id uuid,
    tool_complementar_id uuid,
    distrito_sugerido text,
    arquetipo_sugerido text,
    pergunta_sugerida text,
    ritual_sugerido text,
    confianca integer DEFAULT 70,
    aceita boolean,
    ferramenta_escolhida_id uuid,
    observacao_feedback text,
    respondido_em timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cartographies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    session_id uuid,
    date date DEFAULT CURRENT_DATE NOT NULL,
    scores_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    classification_json jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.casa_circulo_replies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    thread_id uuid NOT NULL,
    conteudo text NOT NULL,
    autor_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.casa_circulo_threads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    conteudo text NOT NULL,
    autor_id uuid NOT NULL,
    status text DEFAULT 'aberto'::text,
    fixado boolean DEFAULT false,
    respostas_count integer DEFAULT 0,
    ultima_atividade timestamp with time zone DEFAULT now(),
    portal_minimo public.portal_type DEFAULT 'iniciada'::public.portal_type,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT casa_circulo_threads_status_check CHECK ((status = ANY (ARRAY['aberto'::text, 'fechado'::text, 'moderado'::text])))
);

CREATE TABLE IF NOT EXISTS public.casos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    terapeuta_id uuid NOT NULL,
    cliente_id uuid NOT NULL,
    codinome text NOT NULL,
    tema_central text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    historico_breve text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cidadela_oracle_cards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    family text NOT NULL,
    district_id uuid,
    keyword text,
    description text,
    base_question text,
    suggested_tool_id uuid,
    suggested_intervention_id uuid,
    color_hex text,
    image_url text,
    is_active boolean DEFAULT true NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    suggested_tool text
);

CREATE TABLE IF NOT EXISTS public.cidadela_oracle_usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    card_id uuid NOT NULL,
    count integer DEFAULT 1 NOT NULL,
    last_used_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.circulos_sagrados (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    facilitadora_id uuid NOT NULL,
    nome_circulo text NOT NULL,
    ritual_base text NOT NULL,
    data_hora timestamp with time zone NOT NULL,
    local_link text,
    participantes_ids uuid[] DEFAULT '{}'::uuid[],
    distritos_ativados text[] DEFAULT '{}'::text[],
    status_circulo text DEFAULT 'pendente'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.city_districts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    slug text NOT NULL,
    descricao text,
    funcao_simbolica text,
    quando_ativo text,
    cor_principal text,
    icone text,
    ordem integer DEFAULT 1,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.client_archetype_state (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    arquitipo_regente_id uuid,
    arquitipo_sombra_id uuid,
    arquitipo_evolucao_id uuid,
    fonte text DEFAULT 'diagnostico'::text,
    observacoes text,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.client_cidadela_map (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    distrito_atual text,
    torres_identificadas text[] DEFAULT '{}'::text[],
    portas_cruzadas text[] DEFAULT '{}'::text[],
    arquetipos_emergentes text[] DEFAULT '{}'::text[],
    labirintos_visitados text[] DEFAULT '{}'::text[],
    ferramentas_utilizadas text[] DEFAULT '{}'::text[],
    historico_sessoes jsonb DEFAULT '[]'::jsonb,
    ultima_sessao timestamp with time zone,
    insights_ia jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.client_city_state (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    distrito_ativo text,
    distrito_id uuid,
    arquetipo_ativo uuid,
    ultima_ferramenta_id uuid,
    ultima_sessao_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.client_live_map_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_user_id uuid NOT NULL,
    therapist_user_id uuid NOT NULL,
    session_id uuid,
    estado_campo text NOT NULL,
    direcao_conducao text NOT NULL,
    risco text DEFAULT 'baixo'::text NOT NULL,
    estagio text DEFAULT 'meio'::text NOT NULL,
    tensao_ativa text,
    ferramenta_utilizada text,
    ritmo_travessia text,
    tipo_registro text DEFAULT 'sessao'::text NOT NULL,
    mensagem_simbolica text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.client_pattern_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    pattern_type public.pattern_stat_type NOT NULL,
    pattern_name text NOT NULL,
    occurrence_count integer DEFAULT 1 NOT NULL,
    last_seen_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.client_seasons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    estacao text NOT NULL,
    descricao text,
    energia_predominante text,
    necessidade_central text,
    intervencao_sugerida text,
    notas text,
    data_registro date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT client_seasons_estacao_check CHECK ((estacao = ANY (ARRAY['primavera'::text, 'verao'::text, 'outono'::text, 'inverno'::text])))
);

CREATE TABLE IF NOT EXISTS public.clientes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    terapeuta_id uuid NOT NULL,
    nome text NOT NULL,
    status public.cliente_status DEFAULT 'ativo'::public.cliente_status NOT NULL,
    objetivo_terapeutico text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    observacao_segura text,
    codigo_interno text,
    data_inicio date DEFAULT CURRENT_DATE,
    archetypal_profile_json jsonb,
    archetypal_profile_history jsonb DEFAULT '[]'::jsonb,
    cartografia_sessao jsonb,
    client_user_id uuid,
    invited_by uuid,
    invitation_sent_at timestamp with time zone,
    accepted_at timestamp with time zone,
    notes_internal text,
    data_nascimento date,
    estado_civil text,
    numero_filhos integer,
    informacoes_relevantes text,
    email text,
    telefone text,
    has_initial_cartography boolean DEFAULT false NOT NULL,
    has_initial_cidadela boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_audio_albums (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    estacao_id uuid NOT NULL,
    titulo text NOT NULL,
    descricao text,
    capa_url text,
    status public.album_status DEFAULT 'draft'::public.album_status NOT NULL,
    ordem integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_audio_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    track_id uuid NOT NULL,
    posicao_segundos numeric DEFAULT 0 NOT NULL,
    concluido boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_audio_tracks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    album_id uuid NOT NULL,
    titulo text NOT NULL,
    tipo public.track_type DEFAULT 'audio'::public.track_type NOT NULL,
    audio_url text NOT NULL,
    duracao_segundos integer,
    ordem integer DEFAULT 1 NOT NULL,
    publicado boolean DEFAULT false NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_carrossel_slides (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    estacao_id uuid,
    rota_slug text,
    titulo text,
    subtitulo text,
    texto text,
    ordem integer DEFAULT 0 NOT NULL,
    icone text,
    status text DEFAULT 'rascunho'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['rascunho'::text, 'publicado'::text])))
);

CREATE TABLE IF NOT EXISTS public.clube_engajamento (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ciclo_id uuid,
    acessos integer DEFAULT 0 NOT NULL,
    reflexoes_salvas integer DEFAULT 0 NOT NULL,
    encontros_participados integer DEFAULT 0 NOT NULL,
    nivel text DEFAULT 'baixo'::text NOT NULL,
    progresso double precision DEFAULT 0.0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    estacao_id uuid,
    CONSTRAINT clube_engajamento_nivel_check CHECK ((nivel = ANY (ARRAY['baixo'::text, 'medio'::text, 'alto'::text])))
);

CREATE TABLE IF NOT EXISTS public.clube_estacao_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    estacao_id uuid NOT NULL,
    texto text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_estacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero integer NOT NULL,
    titulo text NOT NULL,
    subtitulo text NOT NULL,
    fase_lunar text,
    livro_titulo text NOT NULL,
    livro_autor text,
    livro_capa_url text,
    essencia_nucleo text,
    essencia_tensao text,
    essencia_transformacao text,
    traducao_aula text,
    traducao_sessao text,
    traducao_circulo text,
    aplicacao_reflexao text,
    aplicacao_acao text,
    ativa boolean DEFAULT false,
    publicada boolean DEFAULT false,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    aplicar_mim_instrucao text,
    aplicar_mim_exercicio text,
    aplicar_sessao_pergunta text,
    aplicar_sessao_intervencao text,
    aplicar_sessao_risco text,
    aplicar_grupo_dinamica text,
    aplicar_grupo_regra text,
    aplicar_grupo_risco text,
    quiz_id uuid,
    cartografia_id uuid,
    banner_url text,
    descricao text,
    livro_imagem_banner_url text,
    status public.clube_status DEFAULT 'draft'::public.clube_status
);

CREATE TABLE IF NOT EXISTS public.clube_jornadas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    estacao_id uuid NOT NULL,
    slug text NOT NULL,
    nome text NOT NULL,
    subtitulo text,
    descricao text,
    icone text,
    cor text,
    ordem integer DEFAULT 0 NOT NULL,
    ativa boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    tipo public.clube_jornada_tipo DEFAULT 'heroina'::public.clube_jornada_tipo NOT NULL,
    conteudo_semanal_id uuid
);

CREATE TABLE IF NOT EXISTS public.clube_livro_aulas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ciclo_id uuid NOT NULL,
    titulo text NOT NULL,
    subtitulo text,
    descricao text,
    duracao text,
    conteudo text,
    media_url text,
    media_type text DEFAULT 'texto'::text,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    publicado boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    porta_id uuid
);

CREATE TABLE IF NOT EXISTS public.clube_livro_chat_interactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    book_id uuid,
    cycle_id uuid,
    rota_id uuid,
    portal_id uuid,
    message text NOT NULL,
    response text NOT NULL,
    interaction_type text DEFAULT 'chat'::text,
    tokens_estimated integer DEFAULT 0,
    saved_to_jardim boolean DEFAULT false,
    sent_to_forja boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clube_livro_encontros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ciclo_id uuid,
    titulo text NOT NULL,
    descricao text,
    orientacao_encontro text,
    data_encontro timestamp with time zone,
    link_ao_vivo text,
    replay_url text,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    estacao_id uuid
);

CREATE TABLE IF NOT EXISTS public.clube_livro_perguntas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fase_id uuid NOT NULL,
    texto_pergunta text NOT NULL,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_livro_portas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ciclo_id uuid NOT NULL,
    jornada text NOT NULL,
    titulo text NOT NULL,
    descricao text,
    icone text,
    cor text,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT clube_livro_portas_jornada_check CHECK ((jornada = ANY (ARRAY['heroina'::text, 'sombra'::text, 'corpo'::text, 'instinto'::text, 'lideranca'::text])))
);

CREATE TABLE IF NOT EXISTS public.clube_livro_respostas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ciclo_id uuid NOT NULL,
    fase_id uuid NOT NULL,
    pergunta_id uuid NOT NULL,
    resposta text,
    salvo_jardim boolean DEFAULT false,
    jardim_registro_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_obras_essencia_8020 (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    book_id uuid NOT NULL,
    nucleo_vivo text,
    tensao_central text,
    imagem_organizadora text,
    aplicacao_terapeutica text,
    distorcao_comum text,
    resumo_premium text,
    perguntas_clinicas text[],
    riscos_eticos text,
    exercicio text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_portais (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    jornada_id uuid NOT NULL,
    slug text NOT NULL,
    nome text NOT NULL,
    subtitulo text,
    icone text,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    texto_simbolico text,
    essencia_8020 text,
    raiz_psiquica text,
    aplicacao_pessoal text,
    aplicacao_profissional text,
    jardim_psique text,
    jardim_heroina text,
    laboratorio_8020 text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    tipo_portal text DEFAULT 'fundacional'::text,
    onde_estamos_jornada text,
    habilidade_simbolica text,
    tensao_central text,
    o_que_nao_fazer text,
    leitura_etica text,
    audio_url text,
    audio_titulo text,
    audio_duracao text,
    audio_roteiro text,
    acao_pequena text,
    estrutura_replicavel text[],
    regulacao_emocional text,
    laboratorio_integracao text,
    aplicacao_sessao text,
    aplicacao_aula text,
    aplicacao_circulo text,
    ferramenta_nome text,
    ferramenta_campos jsonb DEFAULT '[]'::jsonb,
    riscos_eticos text[],
    aula_titulo text,
    aula_data timestamp with time zone,
    aula_link text,
    aula_replay_url text,
    narroterapia_conto_sugerido text,
    narroterapia_abertura text,
    narroterapia_perguntas text[],
    forja_cenario text,
    forja_portal_ativo text,
    forja_conducao text[],
    forja_erros_comuns text[],
    forja_ajuste_fino text,
    ferramenta_descricao text,
    laboratorio_resultado_esperado text
);

CREATE TABLE IF NOT EXISTS public.clube_portal_audios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    titulo text NOT NULL,
    descricao text,
    audio_url text,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    status public.clube_audio_status DEFAULT 'pendente'::public.clube_audio_status,
    roteiro text,
    duracao_estimada text
);

CREATE TABLE IF NOT EXISTS public.clube_portal_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    estacao_id uuid,
    rota_slug text,
    frase text NOT NULL,
    intensidade text DEFAULT 'suave'::text,
    frequencia text DEFAULT 'diario'::text,
    ordem integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'ativo'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT valid_frequencia CHECK ((frequencia = ANY (ARRAY['diario'::text, 'por_acesso'::text, 'sorteio'::text]))),
    CONSTRAINT valid_intensidade CHECK ((intensidade = ANY (ARRAY['suave'::text, 'profunda'::text, 'impactante'::text]))),
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['ativo'::text, 'arquivado'::text])))
);

CREATE TABLE IF NOT EXISTS public.clube_portal_materiais (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    tipo text DEFAULT 'pdf'::text NOT NULL,
    titulo text NOT NULL,
    descricao text,
    file_url text,
    link_externo text,
    conteudo_texto text,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_progresso_passos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    passo_id uuid,
    concluido boolean DEFAULT false,
    concluido_em timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clube_reflexoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ciclo_id uuid,
    conteudo_semanal_id uuid,
    texto text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    estacao_id uuid
);

CREATE TABLE IF NOT EXISTS public.clube_rota_itens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    estacao_id uuid NOT NULL,
    ordem integer NOT NULL,
    slug text NOT NULL,
    titulo text NOT NULL,
    subtitulo text,
    icone text,
    tipo text NOT NULL,
    ref_tipo public.clube_rota_ref_tipo,
    ref_id uuid,
    conteudo_inline jsonb DEFAULT '{}'::jsonb,
    rota_custom text,
    publicado boolean DEFAULT false,
    obrigatorio boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    impacto_cidadela jsonb DEFAULT '[]'::jsonb,
    tipo_passo public.clube_item_type DEFAULT 'portal'::public.clube_item_type,
    metadata jsonb DEFAULT '{}'::jsonb,
    porta text,
    campo text,
    torre text,
    labirinto text,
    frase_guia text,
    jardim_prompt text,
    cenario_treinamento text,
    leitura_referencia text,
    image_url text,
    status text DEFAULT 'published'::text
);

CREATE TABLE IF NOT EXISTS public.clube_rota_progresso (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    estacao_id uuid NOT NULL,
    rota_item_id uuid NOT NULL,
    status text DEFAULT 'not_started'::text NOT NULL,
    data_inicio timestamp with time zone,
    data_conclusao timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.clube_v3_routes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    cover_image_url text,
    status text DEFAULT 'draft'::text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_v3_station_audios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    station_id uuid,
    title text NOT NULL,
    audio_url text NOT NULL,
    display_order integer DEFAULT 0,
    status text DEFAULT 'published'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_v3_station_content (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    station_id uuid,
    letter_content text,
    jungian_reflection text,
    contemplative_question text,
    therapeutic_practice text,
    support_material text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_v3_stations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    route_id uuid,
    title text NOT NULL,
    subtitle text,
    description text,
    display_order integer DEFAULT 0,
    status text DEFAULT 'draft'::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.clube_v3_user_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    station_id uuid,
    audio_completed boolean DEFAULT false,
    letter_completed boolean DEFAULT false,
    reflection_completed boolean DEFAULT false,
    question_completed boolean DEFAULT false,
    practice_completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_ai_recommendations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    session_id uuid,
    campo_psiquico text,
    distrito text,
    tool_sugerida_id uuid,
    tool_complementar_id uuid,
    motivo text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_appointments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid,
    client_id uuid NOT NULL,
    terapeuta_user_id uuid NOT NULL,
    inicio timestamp with time zone NOT NULL,
    fim timestamp with time zone NOT NULL,
    status text DEFAULT 'agendada'::text NOT NULL,
    origem text DEFAULT 'manual'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_camara_sussurro_casos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    idade text,
    contexto text,
    fala_inicial text,
    distrito_dominante text,
    torre_provavel text,
    erro_comum text,
    pergunta_ideal text,
    leitura_simbolica text,
    resposta_correta text,
    dificuldade text,
    tipo_cliente text,
    tema_emocional text,
    ativo boolean DEFAULT true NOT NULL,
    ciclo_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    distrito_esperado text,
    hipotese_esperada text,
    ferramenta_principal text,
    nivel text DEFAULT 'guiado'::text,
    categoria text,
    nivel_produto text DEFAULT 'formacao'::text NOT NULL,
    opcoes_leitura jsonb DEFAULT '[]'::jsonb,
    explicacao_simples text,
    camadas_leitura text,
    risco_etico text,
    feedback_tecnico text,
    proximo_treino_id uuid,
    explicacao_leve text,
    CONSTRAINT co_camara_sussurro_casos_nivel_produto_check CHECK ((nivel_produto = ANY (ARRAY['clube'::text, 'formacao'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_city_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    session_id uuid,
    tool_id uuid,
    evento text NOT NULL,
    distrito text,
    detalhe text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_client_profile (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    estrutural jsonb DEFAULT '{}'::jsonb NOT NULL,
    dinamico jsonb DEFAULT '{}'::jsonb NOT NULL,
    evolutivo jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_client_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    arquetipo_regente text,
    arquetipo_sombra text,
    arquetipo_evolucao text,
    torre_dominante text,
    porta_ativa text,
    distrito_ativo text,
    fase_jornada text,
    observacoes text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_convites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    terapeuta_id uuid NOT NULL,
    email text NOT NULL,
    token text DEFAULT encode(extensions.gen_random_bytes(32), 'hex'::text) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    accepted_at timestamp with time zone,
    expires_at timestamp with time zone DEFAULT (now() + '30 days'::interval) NOT NULL,
    CONSTRAINT co_convites_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'expired'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_escutas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_user_id uuid NOT NULL,
    therapist_user_id uuid NOT NULL,
    sessao_id uuid,
    created_by uuid NOT NULL,
    tipo text DEFAULT 'escuta'::text NOT NULL,
    conteudo text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT co_escutas_tipo_check CHECK ((tipo = ANY (ARRAY['escuta'::text, 'resposta'::text, 'reflexao'::text, 'devolutiva'::text, 'outro'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_garden_flowers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    tipo_flor text NOT NULL,
    origem_registro_id uuid,
    titulo text,
    descricao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_jardim_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    jardim_id uuid NOT NULL,
    client_user_id uuid NOT NULL,
    therapist_user_id uuid NOT NULL,
    created_by uuid NOT NULL,
    entry_type text DEFAULT 'anotacao'::text NOT NULL,
    content text,
    visibility_to_client boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shared_with_therapist boolean DEFAULT false NOT NULL,
    emocao text,
    padrao_detectado text,
    movimento text,
    analisado_ia boolean DEFAULT false NOT NULL,
    CONSTRAINT co_jardim_entries_type_check CHECK ((entry_type = ANY (ARRAY['reflexao'::text, 'pratica'::text, 'devolutiva'::text, 'leitura'::text, 'anotacao'::text, 'outro'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_jardins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_user_id uuid NOT NULL,
    therapist_user_id uuid NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    visibility_scope text DEFAULT 'client_owned'::text NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT co_jardins_status_check CHECK ((status = ANY (ARRAY['active'::text, 'archived'::text]))),
    CONSTRAINT co_jardins_visibility_check CHECK ((visibility_scope = ANY (ARRAY['therapist_only'::text, 'shared'::text, 'full'::text, 'client_owned'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_journey_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    tool_id uuid,
    tipo text NOT NULL,
    conteudo text NOT NULL,
    visivel_para_terapeuta boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_orientacao_sugestoes_ia (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid,
    cliente_id uuid NOT NULL,
    terapeuta_id uuid NOT NULL,
    sugestao_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    aceito_json jsonb,
    editado boolean DEFAULT false NOT NULL,
    ignorado boolean DEFAULT false NOT NULL,
    orientacao_id uuid,
    justificativa_clinica text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_orientacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    terapeuta_id uuid NOT NULL,
    session_id uuid,
    tipo text DEFAULT 'reflexao'::text NOT NULL,
    titulo text,
    mensagem text NOT NULL,
    conteudo_id text,
    status text DEFAULT 'pending'::text NOT NULL,
    resposta_cliente text,
    completada_em timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT co_orientacoes_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'viewed'::text, 'completed'::text]))),
    CONSTRAINT co_orientacoes_tipo_check CHECK ((tipo = ANY (ARRAY['pratica'::text, 'escuta'::text, 'reflexao'::text, 'territorio'::text, 'foco_semana'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_passport_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    selo text NOT NULL,
    descricao text,
    conquistado_em timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_praticas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_user_id uuid NOT NULL,
    therapist_user_id uuid NOT NULL,
    sessao_id uuid,
    titulo text NOT NULL,
    descricao text,
    status text DEFAULT 'proposta'::text NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT co_praticas_status_check CHECK ((status = ANY (ARRAY['proposta'::text, 'em_andamento'::text, 'concluida'::text, 'cancelada'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_registros_simbolicos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sessao_id uuid,
    jardim_id uuid,
    client_user_id uuid NOT NULL,
    therapist_user_id uuid NOT NULL,
    created_by uuid NOT NULL,
    tipo text DEFAULT 'outro'::text NOT NULL,
    conteudo text,
    shared_with_client boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT co_registros_tipo_check CHECK ((tipo = ANY (ARRAY['leitura'::text, 'porta'::text, 'travessia'::text, 'devolutiva'::text, 'hipotese'::text, 'sintese'::text, 'outro'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_sessoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_user_id uuid NOT NULL,
    therapist_user_id uuid NOT NULL,
    created_by uuid NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    session_date timestamp with time zone,
    shared_with_client boolean DEFAULT false NOT NULL,
    summary_internal text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    jardim_ref_id uuid,
    CONSTRAINT co_sessoes_status_check CHECK ((status = ANY (ARRAY['scheduled'::text, 'in_progress'::text, 'completed'::text, 'canceled'::text, 'archived'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_sim_cases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    descricao text,
    nivel integer DEFAULT 1 NOT NULL,
    tipo text DEFAULT 'misto'::text NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    leitura_mentora text,
    ferramenta_sugerida text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    distrito text,
    CONSTRAINT co_sim_cases_nivel_check CHECK (((nivel >= 1) AND (nivel <= 3))),
    CONSTRAINT co_sim_cases_tipo_check CHECK ((tipo = ANY (ARRAY['individual'::text, 'grupo'::text, 'misto'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_sim_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    step_id uuid NOT NULL,
    texto_opcao text NOT NULL,
    tipo_resultado text DEFAULT 'erro'::text NOT NULL,
    feedback_texto text,
    explicacao_simbolica text,
    proximo_step_id uuid,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT co_sim_options_tipo_resultado_check CHECK ((tipo_resultado = ANY (ARRAY['correto'::text, 'erro'::text, 'parcial'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_sim_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    case_id uuid NOT NULL,
    step_id uuid NOT NULL,
    escolha_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_sim_steps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    case_id uuid NOT NULL,
    ordem integer DEFAULT 1 NOT NULL,
    situacao_texto text NOT NULL,
    pergunta text DEFAULT 'O que você faz?'::text NOT NULL,
    objetivo_oculto text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_tool_flows (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tool_origem_id uuid NOT NULL,
    tool_destino_id uuid NOT NULL,
    ordem integer DEFAULT 1 NOT NULL,
    tipo text DEFAULT 'principal'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_tool_usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    tool_id uuid NOT NULL,
    entrada_registrada text,
    saida_registrada text,
    insights text,
    ordem_uso integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_training_attempts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    case_id uuid NOT NULL,
    resposta_o_que_acontece text,
    resposta_parece_o_que text,
    resposta_distrito text,
    resposta_estado text,
    resposta_movimento text,
    resposta_hipotese text,
    resposta_vetor text,
    resposta_ferramenta text,
    feedback_final text,
    status text DEFAULT 'rascunho'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    score_total integer DEFAULT 0,
    score_distrito integer DEFAULT 0,
    score_hipotese integer DEFAULT 0,
    score_ferramenta integer DEFAULT 0,
    feedback_json jsonb
);

CREATE TABLE IF NOT EXISTS public.co_training_case_feedbacks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    case_id uuid NOT NULL,
    tipo text NOT NULL,
    gatilho text,
    feedback_texto text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_training_case_possible_readings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    case_id uuid NOT NULL,
    leitura text NOT NULL,
    tipo text NOT NULL,
    observacao text
);

CREATE TABLE IF NOT EXISTS public.co_training_case_signals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    case_id uuid NOT NULL,
    sinal text NOT NULL,
    ordem integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.co_training_cases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    nivel text DEFAULT 'guiado'::text NOT NULL,
    tema text,
    caso_texto text NOT NULL,
    distrito_esperado text,
    estado_esperado text,
    movimento_esperado text,
    hipotese_esperada text,
    vetor_esperado text,
    ferramenta_principal text,
    ativo boolean DEFAULT true,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    distritos_alternativos text[] DEFAULT '{}'::text[],
    ferramentas_apoio text[] DEFAULT '{}'::text[],
    erro_comum text
);

CREATE TABLE IF NOT EXISTS public.co_training_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    nivel_atual text,
    casos_concluidos integer DEFAULT 0,
    ultimo_case_id uuid,
    updated_at timestamp with time zone DEFAULT now(),
    coerencia_media numeric DEFAULT 0,
    taxa_acerto numeric DEFAULT 0,
    total_casos integer DEFAULT 0,
    streak_days integer DEFAULT 0,
    last_training_at timestamp with time zone,
    activated_districts jsonb DEFAULT '[]'::jsonb,
    certification_potential integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.co_travessia_encontros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    travessia_id uuid NOT NULL,
    numero_encontro integer NOT NULL,
    titulo text NOT NULL,
    abertura_texto text,
    reflexoes text[] DEFAULT '{}'::text[],
    ferramenta_sugerida text,
    pratica_texto text,
    integracao_texto text,
    conducao_terapeuta text,
    objetivo_encontro text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT co_travessia_encontros_numero_encontro_check CHECK (((numero_encontro >= 1) AND (numero_encontro <= 4)))
);

CREATE TABLE IF NOT EXISTS public.co_travessia_respostas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    travessia_id uuid NOT NULL,
    encontro_id uuid NOT NULL,
    resposta_texto text,
    resposta_integracao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_travessias (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    descricao text,
    livro_base text,
    nivel public.co_travessia_nivel DEFAULT 'iniciante'::public.co_travessia_nivel NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_workspace_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    workspace_id uuid NOT NULL,
    user_id uuid NOT NULL,
    papel text DEFAULT 'cliente'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_workspaces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    slug text,
    owner_user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.collective_bed_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bed_id uuid NOT NULL,
    user_id uuid NOT NULL,
    season_id uuid NOT NULL,
    origem text DEFAULT 'psique'::text NOT NULL,
    texto text NOT NULL,
    aprovado_por_admin boolean DEFAULT false NOT NULL,
    publicado_em timestamp with time zone,
    exibicao_anonima boolean DEFAULT false NOT NULL,
    rejeitado boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    source_entry_id uuid,
    entry_type text DEFAULT 'reflexao'::text NOT NULL,
    published_title text,
    removed_at timestamp with time zone
);

CREATE TABLE IF NOT EXISTS public.collective_beds (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    season_id uuid NOT NULL,
    status text DEFAULT 'ativo'::text NOT NULL,
    aberto_em timestamp with time zone DEFAULT now() NOT NULL,
    encerrado_em timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    autor_id uuid NOT NULL,
    conteudo text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_event_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    data_evento timestamp with time zone NOT NULL,
    link text,
    tipo text DEFAULT 'webinar'::text,
    criador_id uuid,
    participantes_count integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_forums (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    icone text DEFAULT '💬'::text,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_group_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role text DEFAULT 'membro'::text,
    joined_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    criador_id uuid NOT NULL,
    privado boolean DEFAULT false,
    membros_count integer DEFAULT 1,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    post_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    autor_id uuid NOT NULL,
    conteudo text NOT NULL,
    imagem_url text,
    video_url text,
    curtidas_count integer DEFAULT 0,
    comentarios_count integer DEFAULT 0,
    publicado boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_topic_replies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    topic_id uuid NOT NULL,
    autor_id uuid NOT NULL,
    conteudo text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.community_topics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    forum_id uuid NOT NULL,
    autor_id uuid NOT NULL,
    titulo text NOT NULL,
    conteudo text NOT NULL,
    fixado boolean DEFAULT false,
    respostas_count integer DEFAULT 0,
    ultima_atividade timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conselho_partes_internas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    partes_json jsonb DEFAULT '[]'::jsonb NOT NULL,
    dialogos_json jsonb DEFAULT '[]'::jsonb NOT NULL,
    tema_conselho text,
    sabedoria_integrada text,
    decisao_conselho text,
    reflexao_final text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.content_blocks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    context_type public.block_context_type NOT NULL,
    context_id uuid NOT NULL,
    block_type public.content_block_type NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    portal_minimo public.portal_type DEFAULT 'visitante'::public.portal_type NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    agente_id uuid,
    titulo text,
    descricao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    cloudflare_video_id text
);

CREATE TABLE IF NOT EXISTS public.conteudo_aulas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    travessia_id uuid NOT NULL,
    titulo text NOT NULL,
    descricao_curta text DEFAULT ''::text NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    video_url text,
    materiais_url text,
    portal_minimo public.portal_type DEFAULT 'visitante'::public.portal_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    texto_aula text,
    audio_url text,
    pdf_url text,
    publicado boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS public.conteudo_travessias (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    descricao text DEFAULT ''::text NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    portal_minimo public.portal_type DEFAULT 'visitante'::public.portal_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    sala_id uuid,
    subtitulo text DEFAULT ''::text,
    capa_url text,
    publicado boolean DEFAULT true NOT NULL,
    texto_introducao text DEFAULT ''::text,
    descricao_pedagogica text DEFAULT ''::text
);

CREATE TABLE IF NOT EXISTS public.contos_clinicos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    titulo text NOT NULL,
    texto_conto text NOT NULL,
    quando_usar text NOT NULL,
    o_que_observar text NOT NULL,
    riscos_uso_inadequado text NOT NULL,
    origem_cultural text,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    porta_psiquica text,
    eixo_simbolico text,
    nivel_risco text DEFAULT 'baixo'::text,
    tipo_uso text DEFAULT 'estudo'::text,
    exige_certificacao boolean DEFAULT false,
    permite_grupo boolean DEFAULT true,
    permite_crise_aguda boolean DEFAULT false,
    restricoes_combinacao text[] DEFAULT '{}'::text[],
    exige_cartografia boolean DEFAULT false,
    audio_padrao_disponivel boolean DEFAULT false,
    audio_padrao_id uuid,
    aviso_etico text,
    CONSTRAINT contos_clinicos_nivel_risco_check CHECK ((nivel_risco = ANY (ARRAY['baixo'::text, 'medio'::text, 'alto'::text]))),
    CONSTRAINT contos_clinicos_tipo_uso_check CHECK ((tipo_uso = ANY (ARRAY['estudo'::text, 'clinico_autorizado'::text])))
);

CREATE TABLE IF NOT EXISTS public.corpo_inconsciente (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    tipo text DEFAULT 'mapeamento'::text NOT NULL,
    mapeamento_tensoes jsonb DEFAULT '[]'::jsonb,
    diario_corpo_mente jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    payment_provider text,
    payment_id text,
    data_inicio timestamp with time zone DEFAULT now() NOT NULL,
    data_fim timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.course_exercise_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    resposta text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.course_lesson_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    completed_at timestamp with time zone,
    progress_percent integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_id uuid NOT NULL,
    titulo text NOT NULL,
    descricao_curta text DEFAULT ''::text,
    content_type public.content_type DEFAULT 'mixed'::public.content_type NOT NULL,
    texto_aula text,
    video_url text,
    audio_url text,
    pdf_url text,
    materiais_url text,
    duracao_minutos integer,
    ordem integer DEFAULT 0 NOT NULL,
    publicado boolean DEFAULT true NOT NULL,
    is_preview boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    ritual_slides jsonb DEFAULT '[]'::jsonb,
    capa_url text,
    jornada text,
    portal text
);

CREATE TABLE IF NOT EXISTS public.course_module_forum_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_id uuid NOT NULL,
    user_id uuid NOT NULL,
    parent_id uuid,
    conteudo text NOT NULL,
    is_instructor_reply boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.course_modules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    titulo text NOT NULL,
    descricao text DEFAULT ''::text,
    ordem integer DEFAULT 0 NOT NULL,
    publicado boolean DEFAULT true NOT NULL,
    disponivel_em date,
    dias_apos_matricula integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    video_principal_url text,
    video_principal_titulo text,
    video_principal_duracao integer,
    cards_leitura jsonb DEFAULT '[]'::jsonb,
    ferramenta_pratica jsonb,
    estudos_caso jsonb DEFAULT '[]'::jsonb,
    check_maturidade jsonb DEFAULT '[]'::jsonb,
    subtitulo text,
    formato_pedagogico boolean DEFAULT false,
    metodo_formativo jsonb,
    roteiro_aula text
);

CREATE TABLE IF NOT EXISTS public.course_work_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_id uuid NOT NULL,
    user_id uuid NOT NULL,
    titulo text NOT NULL,
    descricao text,
    file_url text,
    status text DEFAULT 'pendente'::text NOT NULL,
    feedback text,
    nota numeric,
    reviewed_by uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.courses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    subtitulo text,
    descricao text DEFAULT ''::text NOT NULL,
    descricao_publica text,
    capa_url text,
    video_preview_url text,
    pricing_model public.pricing_model DEFAULT 'free'::public.pricing_model NOT NULL,
    preco numeric(10,2),
    preco_promocional numeric(10,2),
    stripe_product_id text,
    stripe_price_id text,
    portal_minimo public.portal_type DEFAULT 'visitante'::public.portal_type NOT NULL,
    requer_matricula boolean DEFAULT false NOT NULL,
    publicado boolean DEFAULT false NOT NULL,
    destaque boolean DEFAULT false NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    duracao_estimada text,
    nivel text,
    tags text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    sala_id uuid,
    tipo_curso text DEFAULT 'formacao'::text,
    requisitos text
);

CREATE TABLE IF NOT EXISTS public.custom_oracle_cards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    custom_oracle_id uuid NOT NULL,
    nome text NOT NULL,
    slug text NOT NULL,
    mensagem text,
    pergunta text,
    aplicacao text,
    ordem integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.custom_oracles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    slug text NOT NULL,
    descricao text,
    created_by uuid,
    status text DEFAULT 'draft'::text NOT NULL,
    ordem integer DEFAULT 1,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cycle_books (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cycle_id uuid NOT NULL,
    book_id uuid NOT NULL,
    layer_order integer DEFAULT 0,
    quadrant text,
    is_core boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    layer text,
    ring_index integer
);

CREATE TABLE IF NOT EXISTS public.cycles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    label text NOT NULL,
    year integer,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT cycles_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'archived'::text])))
);

CREATE TABLE IF NOT EXISTS public.decodificacao_onirica (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    terapeuta_id uuid NOT NULL,
    cliente_id uuid,
    session_case_id uuid,
    sonho_bruto text NOT NULL,
    imagem_central text,
    forca_psiquica text,
    movimento_interrompido text,
    mensagem_viva text,
    arquetipos_sugeridos uuid[] DEFAULT '{}'::uuid[],
    notas_terapeuta text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.diagnostico_ego (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    respostas_inflacao boolean[] DEFAULT '{}'::boolean[],
    respostas_deflacao boolean[] DEFAULT '{}'::boolean[],
    contagem_inflacao integer DEFAULT 0,
    contagem_deflacao integer DEFAULT 0,
    pergunta_integracao_resposta text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.district_state_changes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    district_id uuid NOT NULL,
    changed_by_user_id uuid NOT NULL,
    from_state text NOT NULL,
    to_state text NOT NULL,
    reason text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    motivo text
);

CREATE TABLE IF NOT EXISTS public.districts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero integer NOT NULL,
    nome text NOT NULL,
    descricao text,
    icone text,
    cor text,
    posicao_relogio text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.dreams (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    session_id uuid,
    date date DEFAULT CURRENT_DATE NOT NULL,
    dream_text text,
    central_image text,
    psychic_force text,
    interrupted_movement text,
    symbolic_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tipo_email text NOT NULL,
    data_envio timestamp with time zone DEFAULT now() NOT NULL,
    success boolean DEFAULT true,
    error_message text,
    CONSTRAINT email_logs_tipo_email_check CHECK ((tipo_email = ANY (ARRAY['pre_expiracao'::text, 'expiracao'::text, 'retorno'::text])))
);

CREATE TABLE IF NOT EXISTS public.eneagrama_feminino_afirmacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    arquetipo_id uuid NOT NULL,
    texto_afirmacao text NOT NULL,
    peso integer DEFAULT 1 NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.eneagrama_feminino_arquetipos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    numero integer NOT NULL,
    chave text NOT NULL,
    nome text NOT NULL,
    nome_en text,
    essencia_simbolica text NOT NULL,
    ferida_central text,
    dom_central text,
    expressao_sombra text,
    caminho_expansao text,
    pergunta_reflexiva text,
    pratica_simbolica text,
    icone text,
    cor_primaria text,
    cor_secundaria text,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    notas_leitura text,
    transferencias_comuns text,
    resistencias_tipicas text,
    linguagem_evitar text,
    linguagem_que_abre text,
    cautelas_eticas text,
    perguntas_abertura text[],
    espelhos_simbolicos text[],
    prompts_reenquadramento text[],
    convites_integracao text[],
    ritual_encerramento text,
    dinamica_relacional text,
    trabalho_sombra text,
    sugestoes_reenquadramento text[],
    CONSTRAINT eneagrama_feminino_arquetipos_numero_check CHECK (((numero >= 1) AND (numero <= 9)))
);

CREATE TABLE IF NOT EXISTS public.eneagrama_feminino_orientacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    arquetipo_id uuid,
    tipo text NOT NULL,
    titulo text,
    texto text NOT NULL,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT eneagrama_feminino_orientacoes_tipo_check CHECK ((tipo = ANY (ARRAY['abertura'::text, 'espelho'::text, 'reenquadramento'::text, 'integracao'::text, 'encerramento'::text])))
);

CREATE TABLE IF NOT EXISTS public.eneagrama_feminino_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    cliente_id uuid,
    terapeuta_id uuid,
    arquetipo_primario integer NOT NULL,
    arquetipo_secundario integer,
    arquetipo_sombra integer,
    respostas_json jsonb,
    nome_simbolico text,
    reflexao_final text,
    notas text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    modo_aplicacao text DEFAULT 'pessoal'::text,
    notas_profissionais text,
    campo_tensao text,
    vetor_integracao text,
    session_case_id uuid,
    arquetipo_exilado integer,
    narrativa_interpretacao text,
    narrativa_editada boolean DEFAULT false,
    campo_reflexao_cliente text,
    CONSTRAINT eneagrama_feminino_registros_arquetipo_primario_check CHECK (((arquetipo_primario >= 1) AND (arquetipo_primario <= 9))),
    CONSTRAINT eneagrama_feminino_registros_arquetipo_secundario_check CHECK (((arquetipo_secundario IS NULL) OR ((arquetipo_secundario >= 1) AND (arquetipo_secundario <= 9)))),
    CONSTRAINT eneagrama_feminino_registros_arquetipo_sombra_check CHECK (((arquetipo_sombra IS NULL) OR ((arquetipo_sombra >= 1) AND (arquetipo_sombra <= 9)))),
    CONSTRAINT eneagrama_feminino_registros_modo_aplicacao_check CHECK ((modo_aplicacao = ANY (ARRAY['pessoal'::text, 'profissional'::text])))
);

CREATE TABLE IF NOT EXISTS public.eneagrama_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    caso_id uuid,
    tipo_principal integer NOT NULL,
    asa integer,
    instinto text,
    defesas text,
    virtude text,
    armadilhas text,
    pratica_sugerida text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    terapeuta_id uuid,
    cliente_id uuid,
    CONSTRAINT eneagrama_registros_asa_check CHECK (((asa IS NULL) OR ((asa >= 1) AND (asa <= 9)))),
    CONSTRAINT eneagrama_registros_instinto_check CHECK (((instinto IS NULL) OR (instinto = ANY (ARRAY['SP'::text, 'SO'::text, 'SX'::text, 'sp'::text, 'so'::text, 'sx'::text])))),
    CONSTRAINT eneagrama_registros_tipo_principal_check CHECK (((tipo_principal >= 1) AND (tipo_principal <= 9)))
);

CREATE TABLE IF NOT EXISTS public.escrita_nao_censurada (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    conteudo_escrita text,
    prompt_utilizado text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.estudio_projetos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    titulo text DEFAULT 'Novo Projeto'::text NOT NULL,
    modo text DEFAULT 'casa'::text NOT NULL,
    book_id uuid,
    livro_externo_nome text,
    livro_externo_autor text,
    livro_externo_texto text,
    publico_alvo text,
    jornada text,
    estacao_simbolica text,
    num_encontros integer DEFAULT 4,
    estrutura_gerada jsonb,
    logo_aluna_url text,
    nome_mentora text,
    nome_grupo text,
    paleta_secundaria text,
    playbook_url text,
    mapa_mental_url text,
    infografico_url text,
    status text DEFAULT 'rascunho'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.estudos_caso (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    nivel text DEFAULT 'iniciante'::text NOT NULL,
    prontuario_ficticio text NOT NULL,
    mapa_cidadela_json jsonb DEFAULT '{}'::jsonb,
    perguntas_analise text[] DEFAULT '{}'::text[],
    feedback_especialista text NOT NULL,
    ativo boolean DEFAULT true,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.estudos_caso_respostas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    estudo_caso_id uuid NOT NULL,
    resposta text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.exercise_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    exercise_id uuid NOT NULL,
    response text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.exercises (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lesson_id uuid NOT NULL,
    order_number integer DEFAULT 1 NOT NULL,
    question text NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT exercises_type_check CHECK ((type = ANY (ARRAY['reflection'::text, 'writing'::text, 'symbolic'::text])))
);

CREATE TABLE IF NOT EXISTS public.ferramenta_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ferramenta_id uuid NOT NULL,
    cliente_id uuid,
    data_registro date DEFAULT CURRENT_DATE NOT NULL,
    dados jsonb DEFAULT '{}'::jsonb NOT NULL,
    notas text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.formacao_modulos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    formacao_id uuid NOT NULL,
    titulo text NOT NULL,
    descricao text,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.formacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    descricao text,
    status text DEFAULT 'ativo'::text NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.founding_archetypes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    slug text NOT NULL,
    titulo_simbolico text,
    descricao text,
    essencia text,
    ferida_central text,
    desejo_profundo text,
    estrategia_sobrevivencia text,
    sombra text,
    caminho_evolucao text,
    distrito_principal_id uuid,
    elemento text,
    cor_principal text,
    icone text,
    ativo boolean DEFAULT true,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gestos_integracao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    cliente_id uuid NOT NULL,
    sessao_id uuid,
    gesto_texto text NOT NULL,
    status public.gesto_status DEFAULT 'ativo'::public.gesto_status NOT NULL,
    jardim_registro_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.group_encounters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    theme text,
    archetype_worked text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.group_field_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid,
    circulo_id uuid,
    mode text DEFAULT 'grupo'::text NOT NULL,
    therapist_id uuid NOT NULL,
    estado_campo text NOT NULL,
    direcao text NOT NULL,
    risco text DEFAULT 'baixo'::text NOT NULL,
    tensao text,
    padrao text,
    pode_aprofundar boolean DEFAULT false NOT NULL,
    nivel_intervencao text DEFAULT 'baixo'::text NOT NULL,
    recomendacao text,
    frase_simbolica text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.group_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    client_id uuid NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.group_participants (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    cliente_id uuid NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    ativo boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS public.group_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    title text NOT NULL,
    notes text,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT group_sessions_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'archived'::text])))
);

CREATE TABLE IF NOT EXISTS public.heroina_arquetipo_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    arquetipo_id uuid NOT NULL,
    polaridade_percebida text,
    registrado_em timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.heroina_cenario_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    metafora_id uuid NOT NULL,
    anotacao_livre text,
    registrado_em timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.heroina_fase_ativa (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    fase_id uuid NOT NULL,
    registrado_em timestamp with time zone DEFAULT now() NOT NULL,
    ativa boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.heroina_ritual_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ritual_id uuid NOT NULL,
    reflexao text,
    completado_em timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.imaginacao_ativa (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    ponto_partida_tipo text,
    ponto_partida_detalhes text,
    descricao_figura text,
    dialogo_registros jsonb DEFAULT '[]'::jsonb,
    negociacao_registro text,
    registro_pos_sessao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.intervention_favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    intervention_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.interventions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type public.intervention_type NOT NULL,
    district_id uuid,
    tower_key text,
    archetype_key text,
    level public.intervention_level DEFAULT 'basico'::public.intervention_level NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    contraindications text,
    tags text[] DEFAULT '{}'::text[],
    ativa boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    descricao_breve text,
    objetivo text,
    passo_a_passo text,
    perguntas_chave text[] DEFAULT '{}'::text[],
    materiais text[] DEFAULT '{}'::text[],
    arquetipos_relacionados text[] DEFAULT '{}'::text[],
    usage_count integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.inventario_personas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    contextos_personas jsonb DEFAULT '[]'::jsonb NOT NULL,
    analise_discrepancia text,
    custo_energetico text,
    sombra_revelada text,
    pergunta_incomoda_resposta text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.jardim_do_oficio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    cliente_id uuid,
    sessao_id uuid,
    reflexao_profissional text NOT NULL,
    tensao_etica text,
    aprendizado_tecnico text,
    pergunta_supervisao text,
    enviar_para_supervisao boolean DEFAULT false NOT NULL,
    status_supervisao public.status_supervisao DEFAULT 'privado'::public.status_supervisao NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    espelho_toca_minha text,
    espelho_risco_projecao text,
    espelho_supervisao text,
    contexto_origem text
);

CREATE TABLE IF NOT EXISTS public.jardim_grupo_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    group_id uuid NOT NULL,
    session_id uuid,
    therapist_id uuid NOT NULL,
    fase_jornada_grupo text,
    tema_simbolico text,
    ritual_atual text,
    clima_movimento text,
    clima_descricao text,
    escuta_campo text,
    movimentos_repetidos text,
    escuta_coletiva text,
    resistencias_grupais text,
    ritual_realizado text,
    resposta_campo text,
    imagens_emergentes text,
    simbolos_coletivos text,
    frase_semente_grupo text,
    campo_fechado boolean DEFAULT false,
    ritual_fechamento text,
    cuidado_proximo_encontro text,
    notas_privadas text,
    data_registro date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT jardim_grupo_registros_clima_movimento_check CHECK ((clima_movimento = ANY (ARRAY['expansao'::text, 'recolhimento'::text, 'tensao'::text, 'fluidez'::text, 'outro'::text])))
);

CREATE TABLE IF NOT EXISTS public.jardim_heroina (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    case_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    client_id uuid NOT NULL,
    status public.jardim_heroina_status DEFAULT 'inactive'::public.jardim_heroina_status NOT NULL,
    chegada_vivo text,
    chegada_corpo text,
    integracao_observar text,
    gesto_descricao text,
    gesto_tipo public.jardim_gesto_tipo,
    gesto_prazo date,
    gesto_prazo_texto text,
    observacao_sustentou text,
    observacao_percebi text,
    fechamento_levo text,
    fechamento_deixo text,
    ativado_em timestamp with time zone,
    fechado_em timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT jardim_heroina_chegada_corpo_check CHECK ((char_length(chegada_corpo) <= 100)),
    CONSTRAINT jardim_heroina_chegada_vivo_check CHECK ((char_length(chegada_vivo) <= 240)),
    CONSTRAINT jardim_heroina_fechamento_deixo_check CHECK ((char_length(fechamento_deixo) <= 200)),
    CONSTRAINT jardim_heroina_fechamento_levo_check CHECK ((char_length(fechamento_levo) <= 200)),
    CONSTRAINT jardim_heroina_gesto_descricao_check CHECK ((char_length(gesto_descricao) <= 200)),
    CONSTRAINT jardim_heroina_gesto_prazo_texto_check CHECK ((char_length(gesto_prazo_texto) <= 50)),
    CONSTRAINT jardim_heroina_integracao_observar_check CHECK ((char_length(integracao_observar) <= 300)),
    CONSTRAINT jardim_heroina_observacao_percebi_check CHECK ((char_length(observacao_percebi) <= 180)),
    CONSTRAINT jardim_heroina_observacao_sustentou_check CHECK ((observacao_sustentou = ANY (ARRAY['sim'::text, 'parcialmente'::text, 'nao'::text])))
);

CREATE TABLE IF NOT EXISTS public.jardim_heroina_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_case_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    mapa_vivo_id uuid,
    tipo_registro text DEFAULT 'sessao'::text NOT NULL,
    fase_jornada_snapshot text,
    arquetipo_snapshot text,
    aterramento_ficou_vivo text,
    aterramento_imagem_central text,
    aterramento_corpo_sentiu text,
    ritual_vivendo text,
    ritual_resistencia text,
    ritual_movimento text,
    sonhos_imagens text,
    sinais_sincronicidades text,
    memorias_emergentes text,
    frase_semente text,
    notas_privadas text,
    data_registro date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    gesto_origem text,
    gesto_revisao_status text,
    mapa_vivo_origem_id uuid,
    CONSTRAINT jardim_heroina_registros_gesto_revisao_status_check CHECK ((gesto_revisao_status = ANY (ARRAY['sustentado'::text, 'parcial'::text, 'nao_sustentado'::text, NULL::text]))),
    CONSTRAINT jardim_heroina_registros_tipo_registro_check CHECK ((tipo_registro = ANY (ARRAY['sessao'::text, 'entre_sessoes'::text, 'reflexao'::text])))
);

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

CREATE TABLE IF NOT EXISTS public.jornada_individuacao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    etapa_jornada text NOT NULL,
    reflexao_cliente text DEFAULT ''::text NOT NULL,
    distritos_ativos text[] DEFAULT '{}'::text[],
    arquetipos_emergentes text[] DEFAULT '{}'::text[],
    data_registro timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.jornadas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    icone text DEFAULT 'Compass'::text,
    cor_acento text DEFAULT 'amber'::text,
    ordem integer DEFAULT 0 NOT NULL,
    ativa boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.journey_districts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    journey_id uuid NOT NULL,
    district_id uuid NOT NULL,
    state text DEFAULT 'inativo'::text NOT NULL,
    sessions_count integer DEFAULT 0,
    last_session_at timestamp with time zone,
    notes text,
    CONSTRAINT journey_districts_state_check CHECK ((state = ANY (ARRAY['inativo'::text, 'ativo'::text, 'integrado'::text])))
);

CREATE TABLE IF NOT EXISTS public.journey_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    tipo text NOT NULL,
    titulo text NOT NULL,
    descricao text,
    data_evento timestamp with time zone DEFAULT now() NOT NULL,
    metadata_json jsonb DEFAULT '{}'::jsonb,
    session_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.journey_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    journey_id uuid NOT NULL,
    header_image_url text,
    infographic_url text,
    infographic_kind text DEFAULT 'image'::text,
    gallery_items jsonb DEFAULT '[]'::jsonb,
    published boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT journey_media_infographic_kind_check CHECK ((infographic_kind = ANY (ARRAY['image'::text, 'pdf'::text])))
);

CREATE TABLE IF NOT EXISTS public.journey_reflections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    conteudo text DEFAULT ''::text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.journeys (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    current_district_id uuid,
    process_state text DEFAULT 'travessia'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT journeys_process_state_check CHECK ((process_state = ANY (ARRAY['crise'::text, 'travessia'::text, 'integracao'::text])))
);

CREATE TABLE IF NOT EXISTS public.lab_8020_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    season_id uuid,
    resposta_1 text,
    resposta_2 text,
    insight_livre text,
    concluido boolean DEFAULT false NOT NULL,
    concluido_em timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    aplicacao_onde text,
    aplicacao_comportamento text,
    aplicacao_gesto text,
    registro_reflexivo text,
    notas_profissionais text,
    book_id uuid,
    cart_torre text,
    cart_porta text,
    cart_labirinto text,
    cart_distrito text,
    cart_arquetipos text[],
    cart_observacoes text,
    cart_analise_ia jsonb,
    cart_status text DEFAULT 'not_started'::text,
    esp_onde_ve text,
    esp_manifestacao text,
    esp_risco text,
    esp_nao_fazer text,
    esp_categorias_selecionadas text[],
    esp_analise_ia jsonb,
    esp_status text DEFAULT 'not_started'::text,
    forja_objetivo text,
    forja_estrategia text,
    forja_perguntas text,
    forja_intervencao text,
    forja_fechamento text,
    forja_riscos text,
    forja_respostas_cliente text,
    forja_ajustes_rota text,
    forja_plano_ia jsonb,
    forja_status text DEFAULT 'not_started'::text
);

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

CREATE TABLE IF NOT EXISTS public.lessons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    travessia_id uuid NOT NULL,
    order_number integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    video_url text,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lessons_album (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    book_id uuid NOT NULL,
    week_number integer NOT NULL,
    phase text NOT NULL,
    title text NOT NULL,
    description text,
    guided_reading text,
    closing_text text,
    clinical_alert text,
    clinical_notes text,
    misuse_list text,
    questions jsonb,
    audio_script text,
    audio_url text,
    podcast_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT lessons_album_phase_check CHECK ((phase = ANY (ARRAY['CHAMADO'::text, 'RUPTURA'::text, 'REORGANIZACAO'::text, 'INTEGRACAO'::text])))
);

CREATE TABLE IF NOT EXISTS public.library_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    portal_level_required public.portal_type DEFAULT 'visitante'::public.portal_type NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    origem_cultural text,
    observacoes_leitura text,
    CONSTRAINT library_items_type_check CHECK ((type = ANY (ARRAY['conto'::text, 'arquetipo'::text, 'pergunta'::text, 'ritual'::text])))
);

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

CREATE TABLE IF NOT EXISTS public.mapa_sombra (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    irritacoes jsonb DEFAULT '[]'::jsonb NOT NULL,
    admiracoes jsonb DEFAULT '[]'::jsonb NOT NULL,
    sintese_sombra_negativa text,
    sintese_sombra_dourada text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mapa_vivo_heroina (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_case_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    client_id uuid NOT NULL,
    fase_jornada text,
    fase_descricao text,
    arquetipo_predominante text,
    arquetipo_tensao text,
    arquetipo_emergente text,
    dinamica_arquetipal text,
    simbolo_recorrente text,
    mito_pessoal text,
    metafora_central text,
    ritual_tipo text,
    ritual_descricao text,
    ritual_realizado boolean DEFAULT false,
    ritual_observacoes text,
    movimento_heroina text,
    movimento_descricao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    gesto_integracao text,
    gesto_sem_indicacao boolean DEFAULT false,
    gesto_justificativa text,
    gesto_jardim_registro_id uuid,
    CONSTRAINT mapa_vivo_heroina_fase_jornada_check CHECK ((fase_jornada = ANY (ARRAY['chamado_silenciado'::text, 'descida'::text, 'fragmentacao'::text, 'sombra_revelada'::text, 'travessia'::text, 'reintegracao'::text, 'retorno_sabedoria'::text]))),
    CONSTRAINT mapa_vivo_heroina_movimento_heroina_check CHECK ((movimento_heroina = ANY (ARRAY['avancou'::text, 'resistiu'::text, 'ciclou'::text]))),
    CONSTRAINT mapa_vivo_heroina_ritual_tipo_check CHECK ((ritual_tipo = ANY (ARRAY['interno'::text, 'corporal'::text, 'relacional'::text, 'simbolico_concreto'::text, 'ritual_tempo'::text])))
);

CREATE TABLE IF NOT EXISTS public.mapa_vivo_historico (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    mapa_id uuid NOT NULL,
    session_case_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    fase_anterior text,
    fase_nova text,
    movimento text,
    observacao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mapeamento_complexos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    registros_gatilhos jsonb DEFAULT '[]'::jsonb NOT NULL,
    padroes_identificados text,
    personagem_ativado text,
    nome_complexo text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.message_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    channel text NOT NULL,
    name text NOT NULL,
    subject text,
    title text NOT NULL,
    body text NOT NULL,
    cta_label text,
    cta_url text,
    segment_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    total_sent integer DEFAULT 0,
    total_failed integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid,
    sent_at timestamp with time zone,
    CONSTRAINT message_campaigns_channel_check CHECK ((channel = ANY (ARRAY['email'::text, 'in_app'::text]))),
    CONSTRAINT message_campaigns_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'sending'::text, 'done'::text, 'failed'::text])))
);

CREATE TABLE IF NOT EXISTS public.message_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    channel text NOT NULL,
    type text NOT NULL,
    template_id uuid,
    campaign_id uuid,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    success boolean DEFAULT true NOT NULL,
    error_message text,
    CONSTRAINT message_logs_channel_check CHECK ((channel = ANY (ARRAY['email'::text, 'in_app'::text]))),
    CONSTRAINT message_logs_type_check CHECK ((type = ANY (ARRAY['pre_expiracao'::text, 'expiracao'::text, 'retorno'::text, 'manual'::text, 'info'::text, 'boas_vindas'::text])))
);

CREATE TABLE IF NOT EXISTS public.message_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    channel text NOT NULL,
    type text NOT NULL,
    subject text,
    title text NOT NULL,
    body text NOT NULL,
    cta_label text,
    cta_url text,
    is_enabled boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid,
    CONSTRAINT message_templates_channel_check CHECK ((channel = ANY (ARRAY['email'::text, 'in_app'::text]))),
    CONSTRAINT message_templates_type_check CHECK ((type = ANY (ARRAY['pre_expiracao'::text, 'expiracao'::text, 'retorno'::text, 'info'::text, 'boas_vindas'::text])))
);

CREATE TABLE IF NOT EXISTS public.mind_map_nodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    map_id uuid NOT NULL,
    parent_id uuid,
    title text DEFAULT 'Novo Nó'::text NOT NULL,
    notes text,
    color text,
    tags text[],
    position_x numeric DEFAULT 0 NOT NULL,
    position_y numeric DEFAULT 0 NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mind_maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    title text DEFAULT 'Novo Mapa'::text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.missoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid,
    aula_id uuid,
    titulo text NOT NULL,
    descricao text,
    criterios_conclusao text,
    compartilhamento_opcional boolean DEFAULT true NOT NULL,
    status text DEFAULT 'pendente'::text NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT missoes_status_check CHECK ((status = ANY (ARRAY['pendente'::text, 'ativa'::text, 'concluida'::text, 'arquivada'::text])))
);

CREATE TABLE IF NOT EXISTS public.modulos_formativos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome_modulo text NOT NULL,
    tipo_modulo public.tipo_modulo DEFAULT 'curso'::public.tipo_modulo NOT NULL,
    descricao_curta text,
    imagem_capa text,
    ordem_exibicao integer DEFAULT 0 NOT NULL,
    nivel_acesso public.nivel_acesso_modulo DEFAULT 'aberta'::public.nivel_acesso_modulo NOT NULL,
    status_publicacao public.status_publicacao DEFAULT 'rascunho'::public.status_publicacao NOT NULL,
    destaque_vitrine boolean DEFAULT false NOT NULL,
    rota_destino text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.narrative_maps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    case_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    client_id uuid NOT NULL,
    layer1_fact_event text,
    layer1_context text,
    layer1_trigger text,
    layer2_emotion_main text,
    layer2_intensity integer,
    layer2_emotion_secondary text,
    layer3_scene text,
    layer3_central_element text,
    layer3_climate text,
    layer4_archetype_main text,
    layer4_archetype_conflict text,
    layer4_protects text,
    layer5_prohibition text,
    layer5_strategy text,
    layer5_cost text,
    layer6_first_memory text,
    layer6_pattern text,
    layer6_current_repeat text,
    layer7_invitation text,
    layer7_ego_resistance text,
    layer7_small_gesture text,
    summary_core text,
    summary_archetype text,
    summary_repetition text,
    summary_invitation text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT narrative_maps_layer2_intensity_check CHECK (((layer2_intensity >= 0) AND (layer2_intensity <= 10)))
);

CREATE TABLE IF NOT EXISTS public.narroterapia_estudos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    audio_id uuid NOT NULL,
    estudado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.narroterapia_reacoes_simbolicas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    conto_clinico_id uuid,
    audio_id uuid,
    tipo_uso text,
    observacoes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT narroterapia_reacoes_simbolicas_tipo_uso_check CHECK ((tipo_uso = ANY (ARRAY['individual'::text, 'grupo'::text, 'ritualistico'::text])))
);

CREATE TABLE IF NOT EXISTS public.oracle_cards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    slug text NOT NULL,
    familia text NOT NULL,
    numero integer NOT NULL,
    subtitulo text,
    descricao_curta text,
    mensagem_simbolica text,
    pergunta_oracular text,
    aplicacao_terapeutica text,
    archetype_id uuid NOT NULL,
    district_id uuid,
    tool_id uuid,
    elemento text,
    cor_principal text,
    icone text,
    ativa boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deck_id uuid,
    main_image_url text,
    ordem integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.oracle_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    oracle_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    icon text,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oracle_clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    therapist_user_id uuid NOT NULL,
    display_name text NOT NULL,
    notes_private text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oracle_decks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    subtitle text,
    description text,
    cover_image_url text,
    theme_json jsonb DEFAULT '{"fontFamily": "serif", "primaryColor": "#8B5CF6", "cardBackImage": null, "cardFrameStyle": "classic", "backgroundColor": "#0F0D1A"}'::jsonb,
    voice_settings_json jsonb DEFAULT '{"tone": "mystical", "closingText": null, "openingText": null, "revealPacing": 2}'::jsonb,
    onboarding_json jsonb DEFAULT '{"howToUse": null, "safetyText": null, "welcomeText": null}'::jsonb,
    disclaimer_text text,
    is_sensitive_mode_available boolean DEFAULT false,
    enable_journal boolean DEFAULT true,
    enable_professional_mode boolean DEFAULT false,
    minimum_portal public.portal_type DEFAULT 'pre_iniciada'::public.portal_type,
    show_locked_teaser boolean DEFAULT true,
    lock_message_title text DEFAULT 'Oráculo Bloqueado'::text,
    lock_message_body text DEFAULT 'Este oráculo está disponível apenas para membros. Faça sua inscrição para ter acesso.'::text,
    upgrade_cta_text text DEFAULT 'Quero me inscrever'::text,
    upgrade_cta_route text DEFAULT '/welcome'::text,
    status public.oracle_content_status DEFAULT 'draft'::public.oracle_content_status,
    ordem integer DEFAULT 0,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oracle_draws (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    oracle_id uuid NOT NULL,
    spread_id uuid NOT NULL,
    user_id uuid NOT NULL,
    drawn_cards_json jsonb DEFAULT '[]'::jsonb NOT NULL,
    user_notes text,
    is_professional_session boolean DEFAULT false,
    client_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oracle_spread_positions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    spread_id uuid NOT NULL,
    posicao integer NOT NULL,
    nome text NOT NULL,
    pergunta text,
    descricao text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.oracle_spreads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    oracle_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    number_of_cards integer DEFAULT 1 NOT NULL,
    layout_type public.oracle_spread_layout DEFAULT 'line'::public.oracle_spread_layout,
    positions_json jsonb DEFAULT '[]'::jsonb,
    rules_json jsonb DEFAULT '{"revealMode": "one_by_one", "allowRepetition": false, "imageFirstDefault": true, "requireShadowCard": false}'::jsonb,
    opening_text text,
    closing_text text,
    status public.oracle_content_status DEFAULT 'draft'::public.oracle_content_status,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oracle_usage_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    oracle_card_id uuid NOT NULL,
    count integer DEFAULT 1 NOT NULL,
    last_used_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oracular_seasons (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome_estacao text NOT NULL,
    simbolo text,
    periodo text,
    foco_travessia text,
    aplicacao_profissional text,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'planejada'::text,
    visivel boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.oraculo_aplicacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pergunta_id uuid NOT NULL,
    user_id uuid NOT NULL,
    caso_id uuid,
    sessao_id uuid,
    contexto text,
    resposta text,
    devolutiva text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_favoritos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pergunta_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_perguntas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pergunta text NOT NULL,
    tema text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    portal_minimo public.portal_type DEFAULT 'pre_iniciada'::public.portal_type NOT NULL,
    status public.agente_status DEFAULT 'ativo'::public.agente_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    nivel_intensidade integer DEFAULT 1,
    CONSTRAINT oraculo_perguntas_nivel_intensidade_check CHECK (((nivel_intensidade >= 1) AND (nivel_intensidade <= 5)))
);

CREATE TABLE IF NOT EXISTS public.oraculo_portais (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    nome text NOT NULL,
    subtitulo text,
    ordem integer NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    descricao_curta text,
    objetivo_formativo text,
    inspirado_em text DEFAULT 'Mulheres que Correm com os Lobos'::text,
    cover_image_url text,
    icon_name text,
    tempo_estimado text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    livro_base text,
    portal_categoria text,
    ciclo text DEFAULT 'jornada-da-heroina'::text,
    nivel_acesso text DEFAULT 'clube'::text,
    is_locked boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_aplicacoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    uso_sessao text,
    uso_grupo text,
    uso_aula text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_audios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    tipo text DEFAULT 'principal'::text NOT NULL,
    titulo text NOT NULL,
    duracao text,
    roteiro text,
    audio_url text,
    transcricao text,
    ordem integer DEFAULT 1 NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_essencia (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    onde_estamos text,
    habilidade text,
    tensao_central text,
    nucleo_80_20 text,
    o_que_nao_fazer text,
    leitura_etica text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_ferramenta_campos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ferramenta_id uuid NOT NULL,
    ordem integer NOT NULL,
    label text NOT NULL,
    field_key text NOT NULL,
    field_type text NOT NULL,
    placeholder text,
    help_text text,
    options jsonb DEFAULT '[]'::jsonb NOT NULL,
    required boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_ferramentas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    nome text NOT NULL,
    descricao text,
    uso_contexto text,
    instrucoes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_forja_erros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    forja_id uuid NOT NULL,
    ordem integer NOT NULL,
    erro text NOT NULL,
    impacto text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_forja_passos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    forja_id uuid NOT NULL,
    ordem integer NOT NULL,
    titulo text,
    descricao text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_forjas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    cenario text,
    portal_ativo text,
    conto_sugerido text,
    ajuste_fino text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_jardins (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    jardim_psique text,
    jardim_oficio text,
    laboratorio_integracao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_laboratorio_passos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    laboratorio_id uuid NOT NULL,
    ordem integer NOT NULL,
    titulo text,
    descricao text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_laboratorios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    acao_minima text,
    regulacao_emocional text,
    resultado_esperado text,
    observacoes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_materiais (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    tipo text NOT NULL,
    titulo text NOT NULL,
    descricao text,
    url text,
    ordem integer DEFAULT 1 NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    thumbnail_url text,
    is_published boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_narroterapia (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    conto_sugerido text,
    script_abertura text,
    observacao_metodologica text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_narroterapia_perguntas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    narroterapia_id uuid NOT NULL,
    ordem integer NOT NULL,
    pergunta text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.oraculo_portal_riscos_eticos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_id uuid NOT NULL,
    ordem integer NOT NULL,
    risco text NOT NULL,
    descricao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.portais (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    jornada_id uuid NOT NULL,
    modulo_id uuid,
    titulo text NOT NULL,
    subtitulo text,
    objetivo text,
    descricao text,
    ordem integer DEFAULT 0 NOT NULL,
    status text DEFAULT 'rascunho'::text NOT NULL,
    motor_geracao text DEFAULT 'padrao'::text,
    nivel_conteudo text DEFAULT 'certificada'::text,
    portal_minimo text DEFAULT 'visitante'::text,
    capa_url text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT portais_motor_geracao_check CHECK ((motor_geracao = ANY (ARRAY['padrao'::text, 'agente_casa_oracula'::text]))),
    CONSTRAINT portais_nivel_conteudo_check CHECK ((nivel_conteudo = ANY (ARRAY['certificada'::text, 'mentorada'::text]))),
    CONSTRAINT portais_status_check CHECK ((status = ANY (ARRAY['rascunho'::text, 'revisado'::text, 'publicado'::text, 'arquivado'::text])))
);

CREATE TABLE IF NOT EXISTS public.portal_junguiano_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text DEFAULT 'Portal Junguiano — Travessia das 9 Forças da Psique'::text NOT NULL,
    subtitulo text,
    descricao text,
    status text DEFAULT 'rascunho'::text NOT NULL,
    portal_minimo public.portal_type DEFAULT 'aluna_formacao'::public.portal_type NOT NULL,
    aviso_etico text,
    texto_encerramento text,
    modo_clinica_ativo boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT portal_junguiano_config_status_check CHECK ((status = ANY (ARRAY['rascunho'::text, 'publicado'::text, 'arquivado'::text])))
);

CREATE TABLE IF NOT EXISTS public.portal_junguiano_modulos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    config_id uuid,
    titulo text NOT NULL,
    subtitulo text,
    descricao text,
    tipo text DEFAULT 'modulo'::text NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true,
    portal_minimo public.portal_type DEFAULT 'aluna_formacao'::public.portal_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT portal_junguiano_modulos_tipo_check CHECK ((tipo = ANY (ARRAY['modulo_zero'::text, 'travessia'::text, 'manual_facilitadora'::text, 'encerramento'::text])))
);

CREATE TABLE IF NOT EXISTS public.portal_junguiano_portais (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    modulo_id uuid,
    titulo text NOT NULL,
    subtitulo text,
    descricao text,
    numero_ordem integer DEFAULT 1 NOT NULL,
    texto_aula_principal text,
    audio_url text,
    audio_titulo text,
    vivencia_guiada text,
    frase_oraculo text,
    missao_titulo text,
    missao_descricao text,
    missao_criterio_conclusao text,
    desbloqueio_tipo text DEFAULT 'sequencial'::text,
    ativo boolean DEFAULT true,
    portal_minimo public.portal_type DEFAULT 'aluna_formacao'::public.portal_type NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT portal_junguiano_portais_desbloqueio_tipo_check CHECK ((desbloqueio_tipo = ANY (ARRAY['livre'::text, 'sequencial'::text, 'registro_obrigatorio'::text])))
);

CREATE TABLE IF NOT EXISTS public.portal_junguiano_progresso (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    config_id uuid,
    portais_concluidos integer DEFAULT 0,
    iniciado_em timestamp with time zone DEFAULT now(),
    concluido_em timestamp with time zone,
    modo_clinica boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.portal_junguiano_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    portal_id uuid,
    reflexao text,
    missao_concluida boolean DEFAULT false,
    missao_concluida_em timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.portal_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    portal_id uuid NOT NULL,
    state text DEFAULT 'nao_iniciado'::text NOT NULL,
    last_position integer DEFAULT 0,
    has_minimum_record boolean DEFAULT false NOT NULL,
    last_activity_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT portal_progress_state_check CHECK ((state = ANY (ARRAY['nao_iniciado'::text, 'em_andamento'::text, 'integrado'::text])))
);

CREATE TABLE IF NOT EXISTS public.portal_salas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    portal_type public.portal_type NOT NULL,
    sala_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.post_session_closures (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    case_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    client_id uuid NOT NULL,
    moved text,
    left_open text,
    do_not_touch text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.praticas_mudra (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    mudra_nome text NOT NULL,
    distrito_associado text,
    anotacoes_pratica text,
    data_pratica timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL,
    email text,
    nome text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    role text DEFAULT 'aluna'::text NOT NULL,
    access_status text DEFAULT 'visitor'::text NOT NULL,
    is_professional_verified boolean DEFAULT false NOT NULL,
    portal text DEFAULT 'visitante'::text,
    access_expires_at timestamp with time zone,
    subscription_status text DEFAULT 'none'::text,
    entry_archetype text,
    entry_symbol text,
    onboarding_completed boolean DEFAULT false NOT NULL,
    formacao_oracula_concluida boolean DEFAULT false,
    termo_etico_aceito boolean DEFAULT false,
    supervisao_validada boolean DEFAULT false,
    cartografia_base jsonb,
    voz_primaria text,
    voz_apoio text,
    voz_ativa text,
    CONSTRAINT profiles_access_status_check CHECK ((access_status = ANY (ARRAY['visitor'::text, 'member_free'::text, 'member_continuity'::text]))),
    CONSTRAINT profiles_entry_archetype_check CHECK ((entry_archetype = ANY (ARRAY['therapist'::text, 'mentor'::text, 'seeker'::text]))),
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['aluna'::text, 'terapeuta'::text, 'admin'::text])))
);

CREATE TABLE IF NOT EXISTS public.progresso_aluna (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    formacao_id uuid NOT NULL,
    modulo_id uuid NOT NULL,
    status text DEFAULT 'em_progresso'::text NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.projetos_mestria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    course_id uuid NOT NULL,
    titulo text NOT NULL,
    descricao text,
    arquivo_url text,
    status text DEFAULT 'pendente'::text NOT NULL,
    feedback text,
    avaliador_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.protocolo_oracula (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_case_id uuid NOT NULL,
    terapeuta_id uuid NOT NULL,
    cliente_id uuid NOT NULL,
    status text DEFAULT 'iniciado'::text NOT NULL,
    mapa_registro_id uuid,
    oraculo_registro_id uuid,
    caminho_registro_id uuid,
    objetivo_terapeutico text,
    sintese_narrativa text,
    proximos_passos text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT protocolo_oracula_status_check CHECK ((status = ANY (ARRAY['iniciado'::text, 'em_andamento'::text, 'concluido'::text, 'pausado'::text])))
);

CREATE TABLE IF NOT EXISTS public.quiz_opcoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    pergunta_id uuid NOT NULL,
    texto text NOT NULL,
    valor_pontuacao integer DEFAULT 0 NOT NULL,
    categoria text,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_perguntas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quiz_id uuid NOT NULL,
    texto text NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_respostas_usuario (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    quiz_id uuid NOT NULL,
    resultado_id uuid,
    respostas jsonb DEFAULT '[]'::jsonb,
    pontuacao_total integer DEFAULT 0,
    categoria_resultado text,
    completed_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_resultados (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quiz_id uuid NOT NULL,
    titulo_simbolico text NOT NULL,
    texto_interpretativo text NOT NULL,
    pontuacao_minima integer,
    pontuacao_maxima integer,
    categoria text,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    agente_id uuid,
    imagem_url text,
    audio_url text,
    video_url text,
    cta_texto text,
    cta_rota text
);

CREATE TABLE IF NOT EXISTS public.quizzes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    descricao text DEFAULT ''::text,
    portal_id uuid,
    sala_id uuid,
    ativo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    capa_url text,
    slug text
);

CREATE TABLE IF NOT EXISTS public.reflexoes_jornada (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    texto text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.relacionamentos_espelho (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    relacionamentos_json jsonb DEFAULT '[]'::jsonb NOT NULL,
    qualidades_admiradas jsonb DEFAULT '{}'::jsonb NOT NULL,
    qualidades_irritantes jsonb DEFAULT '{}'::jsonb NOT NULL,
    projecoes_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    padroes_recorrentes text,
    padrao_central text,
    reflexao_final text,
    sintese_json jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.respostas_exercicios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sessao_id uuid NOT NULL,
    pergunta_1 text,
    pergunta_2 text,
    pergunta_3 text,
    campo_corporal text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.rituais_integracao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    aprendizados_json jsonb DEFAULT '[]'::jsonb NOT NULL,
    o_que_deixo text,
    o_que_levo text,
    simbolo_transicao text,
    elementos_ritual jsonb DEFAULT '[]'::jsonb NOT NULL,
    intencao text,
    compromisso text,
    data_ritual date,
    reflexao_final text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.rituais_simbolicos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    nome text NOT NULL,
    porta_associada text,
    material text,
    instrucao text NOT NULL,
    duracao_segundos integer DEFAULT 60,
    frase_unica text,
    silencio_obrigatorio boolean DEFAULT false,
    observacoes_facilitadora text,
    ativo boolean DEFAULT true,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ritual_definitions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    tipo public.ritual_type NOT NULL,
    descricao text,
    trigger_event text NOT NULL,
    trigger_context_type text,
    trigger_context_id uuid,
    texto_ritual text NOT NULL,
    pergunta_compromisso text,
    campos_reflexao jsonb DEFAULT '[]'::jsonb,
    microcopy text,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    autoriza_acesso boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ritual_passages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ritual_id uuid NOT NULL,
    status public.ritual_status DEFAULT 'pending'::public.ritual_status NOT NULL,
    context_type text,
    context_id uuid,
    respostas jsonb DEFAULT '{}'::jsonb,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    admin_marked_by uuid,
    admin_note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sala_ferramentas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    sala_id uuid NOT NULL,
    ferramenta_chave text NOT NULL,
    ferramenta_nome text NOT NULL,
    ferramenta_descricao text DEFAULT ''::text,
    icone text DEFAULT 'wrench'::text,
    rota text NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    ativa boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    tipo text DEFAULT 'custom'::text,
    portal_minimo public.portal_type DEFAULT 'pre_iniciada'::public.portal_type,
    has_blocks boolean DEFAULT false,
    slug text,
    portal_id uuid,
    tipo_ferramenta text,
    origem_metodologica text,
    vinculo_metodologico text,
    finalidade_pratica text,
    familia_id uuid,
    texto_quando_usar text,
    texto_o_que_sustenta text,
    texto_como_atravessar text,
    categoria_badge text DEFAULT 'padrao'::text,
    familia_simbolica text,
    modo_uso text[] DEFAULT '{}'::text[],
    tipo_fechamento text,
    bloco_interativo_requerido boolean DEFAULT true,
    status_criacao text DEFAULT 'rascunho'::text,
    categoria_metodo text,
    proximo_passo text,
    ferramenta_pai_id uuid,
    e_complementar boolean DEFAULT false,
    CONSTRAINT sala_ferramentas_categoria_badge_check CHECK ((categoria_badge = ANY (ARRAY['padrao'::text, 'autoral'::text, 'metodo_oracula'::text])))
);

CREATE TABLE IF NOT EXISTS public.salas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nivel_minimo public.nivel_sala DEFAULT 'NIVEL_0'::public.nivel_sala NOT NULL,
    nome_exibicao text NOT NULL,
    texto_entrada text DEFAULT ''::text NOT NULL,
    texto_bloqueio text DEFAULT 'Esta sala ainda não está disponível para você. Continue sua jornada para desbloquear este conteúdo.'::text NOT NULL,
    ativa boolean DEFAULT true NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.season_books (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    season_id uuid NOT NULL,
    book_id uuid NOT NULL,
    tipo text DEFAULT 'satelite'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT season_books_tipo_check CHECK ((tipo = ANY (ARRAY['eixo'::text, 'satelite'::text])))
);

CREATE TABLE IF NOT EXISTS public.season_labs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    season_id uuid,
    nucleo_vivo text,
    tensao_central text,
    essencia_transformadora text,
    traducao_aula text,
    traducao_sessao text,
    traducao_circulo text,
    pergunta_aplicacao_1 text,
    pergunta_aplicacao_2 text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    arquetipo_central text,
    imagem_organizadora text,
    transformacao_exigida text,
    aula_objetivo text,
    aula_vivencia text,
    aula_pergunta_fechamento text,
    sessao_tema text,
    sessao_pergunta_acesso text,
    sessao_cuidado_etico text,
    sessao_resistencia text,
    palestra_imagem text,
    palestra_narrativa text,
    palestra_chamada text,
    palestra_encerramento text,
    ciclo_id uuid,
    grupo_terapeutico jsonb,
    cart_torre_sugerida text,
    cart_porta_sugerida text,
    cart_labirinto_sugerido text,
    cart_distrito_sugerido text,
    cart_arquetipos_sugeridos text[],
    cart_observacoes_obra text,
    esp_exemplos_manifestacao text,
    esp_categorias_padrao text[],
    esp_riscos_clinicos text,
    esp_contraindicacoes text,
    forja_template_objetivo text,
    forja_template_estrategia text,
    forja_perguntas_chave text[],
    forja_intervencao_modelo text,
    forja_fechamento_sugerido text
);

CREATE TABLE IF NOT EXISTS public.session_archetypes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    client_id uuid NOT NULL,
    archetype_id uuid NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.session_cases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    therapist_id uuid NOT NULL,
    client_id uuid NOT NULL,
    title text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT session_cases_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'archived'::text])))
);

CREATE TABLE IF NOT EXISTS public.session_interventions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    intervention_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.session_oracle_draws (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    therapist_id uuid NOT NULL,
    client_id uuid,
    case_id uuid,
    mode text NOT NULL,
    axis_narrative text,
    axis_archetype text,
    axis_movement text,
    oracle_image text,
    mediator_symbol text,
    suggested_rite text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT session_oracle_draws_mode_check CHECK ((mode = ANY (ARRAY['symbolic_card'::text, 'tarot'::text, 'numerology'::text, 'radiesthesia'::text])))
);

CREATE TABLE IF NOT EXISTS public.session_scripts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    case_id uuid NOT NULL,
    narrative_map_id uuid,
    therapist_id uuid NOT NULL,
    client_id uuid NOT NULL,
    opening_question text,
    opening_gesture text,
    exploration_questions text,
    intervention_type text,
    intervention_prompt text,
    closing_name text,
    closing_seal text,
    closing_leave_open text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT session_scripts_intervention_type_check CHECK ((intervention_type = ANY (ARRAY['short_story'::text, 'metaphor'::text, 'writing'::text, 'visualization'::text])))
);

CREATE TABLE IF NOT EXISTS public.sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid DEFAULT auth.uid() NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    district_id uuid,
    tool_id uuid,
    checkin_state text,
    checkin_notes text,
    insight text,
    task text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    gps_suggestion_json jsonb,
    used_intervention_ids uuid[] DEFAULT '{}'::uuid[],
    oracle_card_id uuid,
    cidadela_card_id uuid,
    voz_utilizada text,
    completed_at timestamp with time zone,
    session_without_profile boolean DEFAULT false NOT NULL,
    sintese_json jsonb,
    cabine_data jsonb
);

CREATE TABLE IF NOT EXISTS public.sessoes_casa_maquinas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    cliente_id uuid NOT NULL,
    data_sessao date DEFAULT CURRENT_DATE NOT NULL,
    movimento_percebido public.movimento_percebido DEFAULT 'observacao'::public.movimento_percebido NOT NULL,
    nota_breve text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sessoes_casa_maquinas_nota_breve_check CHECK ((char_length(nota_breve) <= 300))
);

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

CREATE TABLE IF NOT EXISTS public.simulador_cenarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    contexto text NOT NULL,
    nivel text DEFAULT 'iniciante'::text NOT NULL,
    passos_json jsonb DEFAULT '[]'::jsonb NOT NULL,
    ativo boolean DEFAULT true,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.simulador_progresso (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    cenario_id uuid NOT NULL,
    respostas_json jsonb DEFAULT '[]'::jsonb,
    pontuacao integer DEFAULT 0,
    concluido boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sonho_estruturado (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cliente_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    imagens_principais text,
    emocao_predominante text,
    sensacao_corporal text,
    amplificacao_pessoal jsonb DEFAULT '[]'::jsonb,
    amplificacao_arquetipica jsonb DEFAULT '[]'::jsonb,
    pergunta_compensar text,
    pergunta_perspectiva text,
    pergunta_conselho text,
    resposta_ao_sonho text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sonhos_cabalisticos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    therapist_id uuid NOT NULL,
    descricao_sonho text NOT NULL,
    simbolos_chave text[] DEFAULT '{}'::text[] NOT NULL,
    interpretacao_ia text,
    distritos_relacionados text[] DEFAULT '{}'::text[],
    labirintos_potenciais text[] DEFAULT '{}'::text[],
    praticas_sugeridas text[] DEFAULT '{}'::text[],
    data_registro timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.station_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    station_id uuid NOT NULL,
    status text DEFAULT 'latente'::text NOT NULL,
    last_activity_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT station_progress_status_check CHECK ((status = ANY (ARRAY['latente'::text, 'em_travessia'::text, 'integrado'::text])))
);

CREATE TABLE IF NOT EXISTS public.studio_episodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    livro text NOT NULL,
    capitulo text DEFAULT ''::text NOT NULL,
    eixo_id uuid,
    texto_base text DEFAULT ''::text NOT NULL,
    intencao_terapeutica text DEFAULT ''::text NOT NULL,
    visibility public.studio_episode_visibility DEFAULT 'exclusive'::public.studio_episode_visibility NOT NULL,
    status public.studio_episode_status DEFAULT 'draft'::public.studio_episode_status NOT NULL,
    roteiro_completo text,
    versao_resumida text,
    voz_escolhida text DEFAULT 'suave'::text,
    audio_full_url text,
    audio_public_url text,
    titulo text,
    descricao text,
    duracao_segundos integer,
    imagem_capa_url text,
    created_by uuid,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    formato text DEFAULT 'narrativo'::text NOT NULL,
    audio_narradora_url text,
    audio_oracular_url text,
    audio_final_url text,
    vinheta_abertura_url text,
    vinheta_encerramento_url text,
    trilha_fundo_url text,
    trilha_ativa boolean DEFAULT false,
    trilha_volume integer DEFAULT 20,
    fade_in_seconds integer DEFAULT 2,
    fade_out_seconds integer DEFAULT 3,
    tipo_episodio text DEFAULT 'podcast'::text NOT NULL,
    ciclo_id uuid
);

CREATE TABLE IF NOT EXISTS public.studio_method_axes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text DEFAULT ''::text NOT NULL,
    instrucao_especifica text DEFAULT ''::text NOT NULL,
    ativo boolean DEFAULT true NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.symbolic_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    rarity text DEFAULT 'comum'::text,
    icon_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.symbolic_template_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    template_type text NOT NULL,
    title text NOT NULL,
    cliente_id uuid,
    sections jsonb DEFAULT '{}'::jsonb NOT NULL,
    notes jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    case_id uuid
);

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

CREATE TABLE IF NOT EXISTS public.syntheia_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    role text NOT NULL,
    content text NOT NULL,
    tokens_used integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT syntheia_messages_role_check CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text])))
);

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

CREATE TABLE IF NOT EXISTS public.tecela_casos_espelho (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    contexto_anonimizado text NOT NULL,
    demanda_simbolica text NOT NULL,
    leitura_oracula text,
    erro_evitar text,
    resultado text,
    alerta_etico text DEFAULT 'Este caso foi anonimizado. Qualquer semelhança é coincidência.'::text,
    district_id text,
    tags text[] DEFAULT '{}'::text[],
    created_by uuid NOT NULL,
    aprovado boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tecela_conselho (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    autor_id uuid NOT NULL,
    situacao text NOT NULL,
    territorio_cidadela text,
    torre_envolvida text,
    pergunta_facilitadora text NOT NULL,
    visivel boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tecela_conselho_respostas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conselho_id uuid NOT NULL,
    autor_id uuid NOT NULL,
    conteudo text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tecela_registros_campo (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    autor_id uuid NOT NULL,
    titulo_simbolico text NOT NULL,
    texto text NOT NULL,
    torre_ativa text,
    porta_ativa text,
    arquetipo_presente text,
    estado_campo text DEFAULT 'travessia'::text NOT NULL,
    visivel boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT tecela_registros_campo_estado_campo_check CHECK ((estado_campo = ANY (ARRAY['retencao'::text, 'travessia'::text, 'emergencia'::text])))
);

CREATE TABLE IF NOT EXISTS public.tecela_ressonancias (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    registro_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tecela_supervisoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    descricao text,
    tema text,
    data_evento timestamp with time zone NOT NULL,
    link_ao_vivo text,
    link_replay text,
    caso_id uuid,
    created_by uuid NOT NULL,
    status text DEFAULT 'agendada'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.therapeutic_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    therapist_id uuid NOT NULL,
    nome text NOT NULL,
    descricao text,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT therapeutic_groups_status_check CHECK ((status = ANY (ARRAY['active'::text, 'archived'::text])))
);

CREATE TABLE IF NOT EXISTS public.therapy_groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid DEFAULT auth.uid() NOT NULL,
    name text NOT NULL,
    theme text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tool_districts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tool_id uuid NOT NULL,
    district_id uuid NOT NULL,
    tipo text DEFAULT 'principal'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tools (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    district_id uuid,
    rota text,
    tipo text DEFAULT 'placeholder'::text,
    icone text,
    ordem integer DEFAULT 0,
    ativa boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    slug text,
    categoria_metodo text,
    funcao_principal text,
    quando_usar text,
    entrada text,
    acao_central text,
    saida text,
    proximo_passo_id uuid,
    ferramenta_pai_id uuid,
    e_complementar boolean DEFAULT false,
    ambiente text DEFAULT 'maquinas'::text NOT NULL,
    nivel text DEFAULT 'essencial'::text NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.torre_arquetipo_sugestao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    torre_id text NOT NULL,
    arquetipo_id uuid,
    frequencia text DEFAULT 'comum'::text,
    nota_clinica text,
    ordem integer DEFAULT 0,
    CONSTRAINT torre_arquetipo_sugestao_frequencia_check CHECK ((frequencia = ANY (ARRAY['muito_frequente'::text, 'comum'::text, 'ocasional'::text]))),
    CONSTRAINT torre_arquetipo_sugestao_torre_id_check CHECK ((torre_id = ANY (ARRAY['controle'::text, 'performance'::text, 'silencio'::text, 'cuidado'::text, 'adaptacao'::text, 'espiritualizacao'::text, 'forca'::text])))
);

CREATE TABLE IF NOT EXISTS public.torre_porta_relacao (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    porta_id uuid,
    torre_id text NOT NULL,
    frequencia text DEFAULT 'comum'::text,
    risco_conducao text,
    ajuste_com_torre text,
    ordem integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    natureza_porta text,
    CONSTRAINT torre_porta_relacao_frequencia_check CHECK ((frequencia = ANY (ARRAY['muito_frequente'::text, 'comum'::text, 'ocasional'::text]))),
    CONSTRAINT torre_porta_relacao_torre_id_check CHECK ((torre_id = ANY (ARRAY['controle'::text, 'performance'::text, 'silencio'::text, 'cuidado'::text, 'adaptacao'::text, 'espiritualizacao'::text, 'forca'::text])))
);

CREATE TABLE IF NOT EXISTS public.towers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    session_id uuid,
    date date DEFAULT CURRENT_DATE NOT NULL,
    tower_primary text,
    tower_secondary text,
    notes text,
    clinical_posture text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.travessia_comentarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    travessia_id text NOT NULL,
    user_id uuid NOT NULL,
    conteudo text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.travessia_day_unlocks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    aula_id uuid NOT NULL,
    first_accessed_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.travessia_familias (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    nome text NOT NULL,
    descricao text,
    icone text DEFAULT 'Sparkles'::text,
    ordem integer DEFAULT 0,
    ativa boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    slug text,
    quando_usar text,
    o_que_sustenta text
);

CREATE TABLE IF NOT EXISTS public.travessia_library_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    titulo_ritual text NOT NULL,
    subtitulo text,
    categoria text DEFAULT 'Travessias do Campo'::text NOT NULL,
    quando_chamada text DEFAULT ''::text NOT NULL,
    o_que_sustenta text DEFAULT ''::text NOT NULL,
    como_atravessar text DEFAULT ''::text NOT NULL,
    capa_url text,
    portal_minimo public.portal_type DEFAULT 'pre_iniciada'::public.portal_type NOT NULL,
    publicado boolean DEFAULT false NOT NULL,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    familia_id uuid
);

CREATE TABLE IF NOT EXISTS public.travessia_library_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item_id uuid NOT NULL,
    tipo text NOT NULL,
    url text NOT NULL,
    titulo text,
    ordem integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT travessia_library_media_tipo_check CHECK ((tipo = ANY (ARRAY['image'::text, 'video'::text, 'audio'::text, 'pdf'::text, 'link'::text])))
);

CREATE TABLE IF NOT EXISTS public.travessia_library_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item_id uuid NOT NULL,
    tag text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.travessias (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    number integer NOT NULL,
    title text NOT NULL,
    subtitle text NOT NULL,
    description text NOT NULL,
    closing_ritual text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    slug text,
    icone text DEFAULT 'Compass'::text,
    cor_acento text DEFAULT 'amber'::text,
    temas text[] DEFAULT '{}'::text[],
    portal_minimo public.portal_type DEFAULT 'visitante'::public.portal_type,
    requer_profissional boolean DEFAULT false,
    ativa boolean DEFAULT true,
    ordem integer DEFAULT 0,
    CONSTRAINT travessias_number_check CHECK ((number >= 0))
);

CREATE TABLE IF NOT EXISTS public.treinamento_casos_simulados (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo text NOT NULL,
    nivel text DEFAULT 'guiado'::text NOT NULL,
    fala_inicial text NOT NULL,
    sinais text[] DEFAULT '{}'::text[],
    contexto_breve text NOT NULL,
    perguntas_leitura text[] DEFAULT ARRAY['O que está acontecendo aqui?'::text, 'Isso parece o quê?'::text],
    distrito_referencia text,
    estado_referencia text,
    hipotese_referencia text,
    vetor_referencia text,
    ferramenta_referencia text,
    feedback_json jsonb DEFAULT '{}'::jsonb,
    ordem integer DEFAULT 0,
    ativo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT treinamento_casos_simulados_nivel_check CHECK ((nivel = ANY (ARRAY['guiado'::text, 'semi-guiado'::text, 'livre'::text])))
);

CREATE TABLE IF NOT EXISTS public.treinamento_respostas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    caso_id uuid NOT NULL,
    leitura_texto text,
    distrito_escolhido text,
    estado_escolhido text,
    hipotese_texto text,
    vetor_texto text,
    ferramenta_escolhida text,
    feedback_recebido jsonb,
    nivel_usado text,
    concluido boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.upsell_opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    rule_id uuid,
    segment_from text NOT NULL,
    segment_to text NOT NULL,
    reason text,
    engagement_score double precision,
    churn_risk double precision,
    status public.upsell_status DEFAULT 'pending'::public.upsell_status,
    last_action_at timestamp with time zone,
    converted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    channel_used text,
    refusal_count integer DEFAULT 0,
    last_offered_at timestamp with time zone,
    paused_until timestamp with time zone,
    ignored_count integer DEFAULT 0,
    declined_count integer DEFAULT 0,
    historical_segment_rate double precision,
    timing_factor double precision,
    probability_score double precision,
    probability_reason text,
    first_touch_channel text,
    last_touch_channel text,
    touch_count integer DEFAULT 0,
    days_to_conversion integer,
    estimated_value numeric(10,2)
);

CREATE TABLE IF NOT EXISTS public.upsell_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    segment_from text NOT NULL,
    segment_to text NOT NULL,
    min_engagement_score double precision DEFAULT 0.7,
    max_churn_risk double precision DEFAULT 0.3,
    min_recurrent_use_days integer DEFAULT 15,
    estimated_value_increase numeric(10,2),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_aula_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    aula_id uuid NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_cidadela_estado (
    user_id uuid NOT NULL,
    voz text,
    distrito_atual text,
    distritos_ativados text[] DEFAULT '{}'::text[],
    intensidade_por_distrito jsonb DEFAULT '{}'::jsonb,
    competencias jsonb DEFAULT '{}'::jsonb,
    historico_travessias jsonb DEFAULT '[]'::jsonb,
    ultimo_movimento timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    library_item_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    lesson_id uuid NOT NULL,
    completed_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_unlocked_rewards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    reward_id uuid NOT NULL,
    unlocked_at timestamp with time zone DEFAULT now() NOT NULL
);

