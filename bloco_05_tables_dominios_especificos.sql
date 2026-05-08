-- BLOCO 05: Tabelas de Domínios Específicos (Cidadela, Comunidade, Jardim, Mentoria, etc.)
-- Gerado para revisão.

CREATE TABLE IF NOT EXISTS public.cidadela_mapa_vivo (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    distrito text NOT NULL,
    nivel integer DEFAULT 1,
    status text DEFAULT 'ativo'::text,
    historico jsonb DEFAULT '[]'::jsonb,
    ultima_atualizacao timestamp with time zone DEFAULT now()
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

CREATE TABLE IF NOT EXISTS public.co_cartografia_profile (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    cartografia_id uuid,
    contexto text DEFAULT 'clube'::text NOT NULL,
    medias_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    profile_json jsonb DEFAULT '{}'::jsonb NOT NULL,
    oracula_inicial text,
    intensidade_oracular text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    client_user_id uuid,
    therapist_user_id uuid,
    CONSTRAINT co_cartografia_profile_contexto_check CHECK ((contexto = ANY (ARRAY['clube'::text, 'formacao'::text, 'casa_das_maquinas'::text])))
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

CREATE TABLE IF NOT EXISTS public.co_client_invites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    therapist_user_id uuid NOT NULL,
    client_email text NOT NULL,
    token text DEFAULT (gen_random_uuid())::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval) NOT NULL,
    accepted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT co_client_invites_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'expired'::text, 'canceled'::text])))
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

CREATE TABLE IF NOT EXISTS public.co_detectores_eventos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_user_id uuid NOT NULL,
    therapist_user_id uuid NOT NULL,
    session_id uuid,
    detector_tipo text NOT NULL,
    intensidade text DEFAULT 'media'::text NOT NULL,
    origem text DEFAULT 'sessao'::text NOT NULL,
    descricao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    contexto text,
    payload_hash text
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

CREATE TABLE IF NOT EXISTS public.co_intervencoes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    therapist_user_id uuid NOT NULL,
    client_user_id uuid NOT NULL,
    session_id uuid,
    tipo text NOT NULL,
    descricao text,
    houve_deslocamento boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_intervencoes_aplicadas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_user_id uuid NOT NULL,
    therapist_user_id uuid NOT NULL,
    session_id uuid,
    tipo_intervencao text NOT NULL,
    categoria_alvo text,
    resposta_cliente text,
    percepcao_terapeuta text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
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

CREATE TABLE IF NOT EXISTS public.co_laboratorio_casos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    titulo text NOT NULL,
    modo_entrada text DEFAULT 'texto_livre'::text NOT NULL,
    caso_texto text,
    fala_cliente text,
    duvida_terapeuta text,
    ja_tentou text,
    cliente_id uuid,
    analise_simbolica text,
    perguntas_sugeridas jsonb DEFAULT '[]'::jsonb,
    riscos_eticos text,
    simulacao_cliente text,
    ferramenta_sugerida text,
    status text DEFAULT 'rascunho'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT modo_entrada_check CHECK ((modo_entrada = ANY (ARRAY['texto_livre'::text, 'formulario'::text, 'cliente_vinculado'::text]))),
    CONSTRAINT status_check CHECK ((status = ANY (ARRAY['rascunho'::text, 'analisado'::text, 'arquivado'::text])))
);

CREATE TABLE IF NOT EXISTS public.co_mapa_vivo (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_user_id uuid NOT NULL,
    eixo_movimento text DEFAULT 'estagnacao'::text NOT NULL,
    presenca_emocional text DEFAULT 'baixa'::text NOT NULL,
    eixo_confronto text DEFAULT 'evita'::text NOT NULL,
    regulacao text DEFAULT 'desorganizada'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_mentora_feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    session_id uuid,
    cliente_id uuid,
    sugestao_exibida text NOT NULL,
    sugestao_utilizada boolean DEFAULT false,
    ferramenta_sugerida text,
    ferramenta_escolhida text,
    tempo_uso_segundos integer,
    feedback_tipo text DEFAULT 'ignorada'::text,
    observacao text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.co_mentora_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tipo text DEFAULT 'sugestao'::text NOT NULL,
    titulo text NOT NULL,
    descricao text NOT NULL,
    baseado_em jsonb DEFAULT '{}'::jsonb,
    lido boolean DEFAULT false,
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

CREATE TABLE IF NOT EXISTS public.co_session_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    tema text,
    insight_principal text,
    tarefa_simbolica text,
    observacoes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
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

CREATE TABLE IF NOT EXISTS public.co_therapist_profile (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    estilo_conducao text DEFAULT 'exploratório'::text,
    linguagem text DEFAULT 'simbólica'::text,
    nivel_profundidade text DEFAULT 'médio'::text,
    padrao_decisao text DEFAULT 'intuitivo'::text,
    ferramentas_preferidas text[] DEFAULT '{}'::text[],
    ferramentas_evitadas text[] DEFAULT '{}'::text[],
    distritos_frequentes text[] DEFAULT '{}'::text[],
    tendencias_json jsonb DEFAULT '{}'::jsonb,
    pontos_fortes text[] DEFAULT '{}'::text[],
    pontos_cegos text[] DEFAULT '{}'::text[],
    total_sessoes integer DEFAULT 0,
    total_consultas_mentora integer DEFAULT 0,
    ultima_analise timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
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

CREATE TABLE IF NOT EXISTS public.jardim_psique_registros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ferramenta_nome text NOT NULL,
    ferramenta_chave text NOT NULL,
    data_aplicacao timestamp with time zone DEFAULT now() NOT NULL,
    conteudo jsonb DEFAULT '{}'::jsonb NOT NULL,
    resultado_simbolico jsonb,
    reflexao_pessoal text,
    tags text[] DEFAULT ARRAY[]::text[],
    arquivado boolean DEFAULT false NOT NULL,
    integrado boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    tipo_registro text DEFAULT 'ferramenta'::text,
    titulo text,
    fonte text,
    emocao_predominante text,
    CONSTRAINT jardim_tipo_registro_check CHECK ((tipo_registro = ANY (ARRAY['ferramenta'::text, 'sonho'::text, 'frase'::text, 'fragmento'::text, 'oraculo'::text, 'reflexao'::text])))
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

-- Constraints PK/UK (Idempotentes)
DO 27191 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_mapa_vivo_pkey') THEN
        ALTER TABLE public.cidadela_mapa_vivo ADD CONSTRAINT cidadela_mapa_vivo_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_mapa_vivo_user_id_distrito_key') THEN
        ALTER TABLE public.cidadela_mapa_vivo ADD CONSTRAINT cidadela_mapa_vivo_user_id_distrito_key UNIQUE (user_id, distrito);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_cards_pkey') THEN
        ALTER TABLE public.cidadela_oracle_cards ADD CONSTRAINT cidadela_oracle_cards_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_client_id_card_id_key') THEN
        ALTER TABLE public.cidadela_oracle_usage ADD CONSTRAINT cidadela_oracle_usage_client_id_card_id_key UNIQUE (client_id, card_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cidadela_oracle_usage_pkey') THEN
        ALTER TABLE public.cidadela_oracle_usage ADD CONSTRAINT cidadela_oracle_usage_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_pkey') THEN
        ALTER TABLE public.co_ai_recommendations ADD CONSTRAINT co_ai_recommendations_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_pkey') THEN
        ALTER TABLE public.co_appointments ADD CONSTRAINT co_appointments_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_camara_sussurro_casos_pkey') THEN
        ALTER TABLE public.co_camara_sussurro_casos ADD CONSTRAINT co_camara_sussurro_casos_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_cartografia_profile_cartografia_id_key') THEN
        ALTER TABLE public.co_cartografia_profile ADD CONSTRAINT co_cartografia_profile_cartografia_id_key UNIQUE (cartografia_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_cartografia_profile_pkey') THEN
        ALTER TABLE public.co_cartografia_profile ADD CONSTRAINT co_cartografia_profile_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_pkey') THEN
        ALTER TABLE public.co_city_history ADD CONSTRAINT co_city_history_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_invites_pkey') THEN
        ALTER TABLE public.co_client_invites ADD CONSTRAINT co_client_invites_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profile_client_id_therapist_id_key') THEN
        ALTER TABLE public.co_client_profile ADD CONSTRAINT co_client_profile_client_id_therapist_id_key UNIQUE (client_id, therapist_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profile_pkey') THEN
        ALTER TABLE public.co_client_profile ADD CONSTRAINT co_client_profile_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profiles_client_id_key') THEN
        ALTER TABLE public.co_client_profiles ADD CONSTRAINT co_client_profiles_client_id_key UNIQUE (client_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profiles_pkey') THEN
        ALTER TABLE public.co_client_profiles ADD CONSTRAINT co_client_profiles_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_convites_pkey') THEN
        ALTER TABLE public.co_convites ADD CONSTRAINT co_convites_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_convites_token_key') THEN
        ALTER TABLE public.co_convites ADD CONSTRAINT co_convites_token_key UNIQUE (token);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_detectores_eventos_pkey') THEN
        ALTER TABLE public.co_detectores_eventos ADD CONSTRAINT co_detectores_eventos_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_escutas_pkey') THEN
        ALTER TABLE public.co_escutas ADD CONSTRAINT co_escutas_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_pkey') THEN
        ALTER TABLE public.co_garden_flowers ADD CONSTRAINT co_garden_flowers_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_intervencoes_pkey') THEN
        ALTER TABLE public.co_intervencoes ADD CONSTRAINT co_intervencoes_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_intervencoes_aplicadas_pkey') THEN
        ALTER TABLE public.co_intervencoes_aplicadas ADD CONSTRAINT co_intervencoes_aplicadas_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardim_entries_pkey') THEN
        ALTER TABLE public.co_jardim_entries ADD CONSTRAINT co_jardim_entries_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardins_pkey') THEN
        ALTER TABLE public.co_jardins ADD CONSTRAINT co_jardins_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_pkey') THEN
        ALTER TABLE public.co_journey_records ADD CONSTRAINT co_journey_records_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_laboratorio_casos_pkey') THEN
        ALTER TABLE public.co_laboratorio_casos ADD CONSTRAINT co_laboratorio_casos_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_mapa_vivo_client_user_id_key') THEN
        ALTER TABLE public.co_mapa_vivo ADD CONSTRAINT co_mapa_vivo_client_user_id_key UNIQUE (client_user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_mapa_vivo_pkey') THEN
        ALTER TABLE public.co_mapa_vivo ADD CONSTRAINT co_mapa_vivo_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_mentora_feedback_pkey') THEN
        ALTER TABLE public.co_mentora_feedback ADD CONSTRAINT co_mentora_feedback_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_mentora_insights_pkey') THEN
        ALTER TABLE public.co_mentora_insights ADD CONSTRAINT co_mentora_insights_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_pkey') THEN
        ALTER TABLE public.co_orientacao_sugestoes_ia ADD CONSTRAINT co_orientacao_sugestoes_ia_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_pkey') THEN
        ALTER TABLE public.co_orientacoes ADD CONSTRAINT co_orientacoes_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_passport_entries_pkey') THEN
        ALTER TABLE public.co_passport_entries ADD CONSTRAINT co_passport_entries_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_praticas_pkey') THEN
        ALTER TABLE public.co_praticas ADD CONSTRAINT co_praticas_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_pkey') THEN
        ALTER TABLE public.co_registros_simbolicos ADD CONSTRAINT co_registros_simbolicos_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_session_notes_pkey') THEN
        ALTER TABLE public.co_session_notes ADD CONSTRAINT co_session_notes_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sessoes_pkey') THEN
        ALTER TABLE public.co_sessoes ADD CONSTRAINT co_sessoes_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_cases_pkey') THEN
        ALTER TABLE public.co_sim_cases ADD CONSTRAINT co_sim_cases_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_pkey') THEN
        ALTER TABLE public.co_sim_options ADD CONSTRAINT co_sim_options_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_pkey') THEN
        ALTER TABLE public.co_sim_progress ADD CONSTRAINT co_sim_progress_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_steps_pkey') THEN
        ALTER TABLE public.co_sim_steps ADD CONSTRAINT co_sim_steps_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_therapist_profile_pkey') THEN
        ALTER TABLE public.co_therapist_profile ADD CONSTRAINT co_therapist_profile_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_therapist_profile_user_id_key') THEN
        ALTER TABLE public.co_therapist_profile ADD CONSTRAINT co_therapist_profile_user_id_key UNIQUE (user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_pkey') THEN
        ALTER TABLE public.co_tool_flows ADD CONSTRAINT co_tool_flows_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_usage_pkey') THEN
        ALTER TABLE public.co_tool_usage ADD CONSTRAINT co_tool_usage_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_attempts_pkey') THEN
        ALTER TABLE public.co_training_attempts ADD CONSTRAINT co_training_attempts_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_feedbacks_pkey') THEN
        ALTER TABLE public.co_training_case_feedbacks ADD CONSTRAINT co_training_case_feedbacks_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_possible_readings_pkey') THEN
        ALTER TABLE public.co_training_case_possible_readings ADD CONSTRAINT co_training_case_possible_readings_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_signals_pkey') THEN
        ALTER TABLE public.co_training_case_signals ADD CONSTRAINT co_training_case_signals_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_cases_pkey') THEN
        ALTER TABLE public.co_training_cases ADD CONSTRAINT co_training_cases_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_pkey') THEN
        ALTER TABLE public.co_training_progress ADD CONSTRAINT co_training_progress_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_user_id_key') THEN
        ALTER TABLE public.co_training_progress ADD CONSTRAINT co_training_progress_user_id_key UNIQUE (user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_encontros_pkey') THEN
        ALTER TABLE public.co_travessia_encontros ADD CONSTRAINT co_travessia_encontros_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_encontros_travessia_id_numero_encontro_key') THEN
        ALTER TABLE public.co_travessia_encontros ADD CONSTRAINT co_travessia_encontros_travessia_id_numero_encontro_key UNIQUE (travessia_id, numero_encontro);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_pkey') THEN
        ALTER TABLE public.co_travessia_respostas ADD CONSTRAINT co_travessia_respostas_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_user_id_encontro_id_key') THEN
        ALTER TABLE public.co_travessia_respostas ADD CONSTRAINT co_travessia_respostas_user_id_encontro_id_key UNIQUE (user_id, encontro_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessias_pkey') THEN
        ALTER TABLE public.co_travessias ADD CONSTRAINT co_travessias_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspace_users_pkey') THEN
        ALTER TABLE public.co_workspace_users ADD CONSTRAINT co_workspace_users_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspace_users_workspace_id_user_id_key') THEN
        ALTER TABLE public.co_workspace_users ADD CONSTRAINT co_workspace_users_workspace_id_user_id_key UNIQUE (workspace_id, user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspaces_pkey') THEN
        ALTER TABLE public.co_workspaces ADD CONSTRAINT co_workspaces_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspaces_slug_key') THEN
        ALTER TABLE public.co_workspaces ADD CONSTRAINT co_workspaces_slug_key UNIQUE (slug);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_pkey') THEN
        ALTER TABLE public.jardim_do_oficio ADD CONSTRAINT jardim_do_oficio_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_pkey') THEN
        ALTER TABLE public.jardim_grupo_registros ADD CONSTRAINT jardim_grupo_registros_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_pkey') THEN
        ALTER TABLE public.jardim_heroina ADD CONSTRAINT jardim_heroina_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_pkey') THEN
        ALTER TABLE public.jardim_heroina_registros ADD CONSTRAINT jardim_heroina_registros_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_psique_registros_pkey') THEN
        ALTER TABLE public.jardim_psique_registros ADD CONSTRAINT jardim_psique_registros_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_pkey') THEN
        ALTER TABLE public.mapa_vivo_heroina ADD CONSTRAINT mapa_vivo_heroina_pkey PRIMARY KEY (id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_historico_pkey') THEN
        ALTER TABLE public.mapa_vivo_historico ADD CONSTRAINT mapa_vivo_historico_pkey PRIMARY KEY (id);
    END IF;
END 27191;

-- Validações do Bloco 05
SELECT count(*) as bloco_05_tables_present FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('cidadela_mapa_vivo', 'cidadela_oracle_cards', 'cidadela_oracle_usage', 'co_ai_recommendations', 'co_appointments', 'co_camara_sussurro_casos', 'co_cartografia_profile', 'co_city_history', 'co_client_invites', 'co_client_profile', 'co_client_profiles', 'co_convites', 'co_detectores_eventos', 'co_escutas', 'co_garden_flowers', 'co_intervencoes', 'co_intervencoes_aplicadas', 'co_jardim_entries', 'co_jardins', 'co_journey_records', 'co_laboratorio_casos', 'co_mapa_vivo', 'co_mentora_feedback', 'co_mentora_insights', 'co_orientacao_sugestoes_ia', 'co_orientacoes', 'co_passport_entries', 'co_praticas', 'co_registros_simbolicos', 'co_session_notes', 'co_sessoes', 'co_sim_cases', 'co_sim_options', 'co_sim_progress', 'co_sim_steps', 'co_therapist_profile', 'co_tool_flows', 'co_tool_usage', 'co_training_attempts', 'co_training_case_feedbacks', 'co_training_case_possible_readings', 'co_training_case_signals', 'co_training_cases', 'co_training_progress', 'co_travessia_encontros', 'co_travessia_respostas', 'co_travessias', 'co_workspace_users', 'co_workspaces', 'jardim_do_oficio', 'jardim_grupo_registros', 'jardim_heroina', 'jardim_heroina_registros', 'jardim_psique_registros', 'mapa_vivo_heroina', 'mapa_vivo_historico');
SELECT count(*) as bloco_05_pk_uk_constraints FROM pg_constraint WHERE conname IN ('cidadela_mapa_vivo_pkey', 'cidadela_mapa_vivo_user_id_distrito_key', 'cidadela_oracle_cards_pkey', 'cidadela_oracle_usage_client_id_card_id_key', 'cidadela_oracle_usage_pkey', 'co_ai_recommendations_pkey', 'co_appointments_pkey', 'co_camara_sussurro_casos_pkey', 'co_cartografia_profile_cartografia_id_key', 'co_cartografia_profile_pkey', 'co_city_history_pkey', 'co_client_invites_pkey', 'co_client_profile_client_id_therapist_id_key', 'co_client_profile_pkey', 'co_client_profiles_client_id_key', 'co_client_profiles_pkey', 'co_convites_pkey', 'co_convites_token_key', 'co_detectores_eventos_pkey', 'co_escutas_pkey', 'co_garden_flowers_pkey', 'co_intervencoes_pkey', 'co_intervencoes_aplicadas_pkey', 'co_jardim_entries_pkey', 'co_jardins_pkey', 'co_journey_records_pkey', 'co_laboratorio_casos_pkey', 'co_mapa_vivo_client_user_id_key', 'co_mapa_vivo_pkey', 'co_mentora_feedback_pkey', 'co_mentora_insights_pkey', 'co_orientacao_sugestoes_ia_pkey', 'co_orientacoes_pkey', 'co_passport_entries_pkey', 'co_praticas_pkey', 'co_registros_simbolicos_pkey', 'co_session_notes_pkey', 'co_sessoes_pkey', 'co_sim_cases_pkey', 'co_sim_options_pkey', 'co_sim_progress_pkey', 'co_sim_steps_pkey', 'co_therapist_profile_pkey', 'co_therapist_profile_user_id_key', 'co_tool_flows_pkey', 'co_tool_usage_pkey', 'co_training_attempts_pkey', 'co_training_case_feedbacks_pkey', 'co_training_case_possible_readings_pkey', 'co_training_case_signals_pkey', 'co_training_cases_pkey', 'co_training_progress_pkey', 'co_training_progress_user_id_key', 'co_travessia_encontros_pkey', 'co_travessia_encontros_travessia_id_numero_encontro_key', 'co_travessia_respostas_pkey', 'co_travessia_respostas_user_id_encontro_id_key', 'co_travessias_pkey', 'co_workspace_users_pkey', 'co_workspace_users_workspace_id_user_id_key', 'co_workspaces_pkey', 'co_workspaces_slug_key', 'jardim_do_oficio_pkey', 'jardim_grupo_registros_pkey', 'jardim_heroina_pkey', 'jardim_heroina_registros_pkey', 'jardim_psique_registros_pkey', 'mapa_vivo_heroina_pkey', 'mapa_vivo_historico_pkey');