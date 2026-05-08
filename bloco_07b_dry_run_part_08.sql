-- BLOCO 07B - FOREIGN KEYS DRY RUN (PARTE 8 de 8)
-- Diagnóstico de FKs 351 a 384 (Total: 34)

DO $$
DECLARE
    v_total_analyzed INTEGER := 0;
    v_total_exists INTEGER := 0;
    v_total_ready INTEGER := 0;
    v_total_missing_source_table INTEGER := 0;
    v_total_missing_source_column INTEGER := 0;
    v_total_missing_target_table INTEGER := 0;
    v_total_missing_target_column INTEGER := 0;
    v_total_type_mismatch INTEGER := 0;
    v_total_target_not_unique INTEGER := 0;
    v_total_other INTEGER := 0;
    
    v_source_schema TEXT;
    v_source_table TEXT;
    v_target_schema TEXT;
    v_target_table TEXT;
    
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN
    RAISE NOTICE 'Iniciando diagnóstico PARTE 8...';

    -- Analisando simulador_progresso_cenario_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'simulador_progresso_cenario_id_fkey') THEN
        RAISE NOTICE 'FK: simulador_progresso_cenario_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'simulador_progresso') THEN
        RAISE NOTICE 'FK: simulador_progresso_cenario_id_fkey | Status: MISSING_SOURCE_TABLE | Table: simulador_progresso';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_progresso' AND column_name = 'cenario_id') THEN
        RAISE NOTICE 'FK: simulador_progresso_cenario_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: simulador_progresso.cenario_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'simulador_cenarios') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: simulador_progresso_cenario_id_fkey | Status: MISSING_TARGET_TABLE | Table: simulador_cenarios';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_cenarios' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: simulador_progresso_cenario_id_fkey | Status: MISSING_TARGET_COLUMN | Column: simulador_cenarios.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_progresso' AND column_name = 'cenario_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_cenarios' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: simulador_progresso_cenario_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'simulador_progresso.cenario_id', v_source_type, 'simulador_cenarios.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.simulador_cenarios')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: simulador_progresso_cenario_id_fkey | Status: TARGET_NOT_UNIQUE | Column: simulador_cenarios.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: simulador_progresso_cenario_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sonho_estruturado_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sonho_estruturado_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: sonho_estruturado_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sonho_estruturado') THEN
        RAISE NOTICE 'FK: sonho_estruturado_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sonho_estruturado';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonho_estruturado' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: sonho_estruturado_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sonho_estruturado.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sonho_estruturado_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sonho_estruturado_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonho_estruturado' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sonho_estruturado_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sonho_estruturado.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: sonho_estruturado_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sonho_estruturado_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sonhos_cabalisticos_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sonhos_cabalisticos_client_id_fkey') THEN
        RAISE NOTICE 'FK: sonhos_cabalisticos_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos') THEN
        RAISE NOTICE 'FK: sonhos_cabalisticos_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sonhos_cabalisticos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: sonhos_cabalisticos_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sonhos_cabalisticos.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sonhos_cabalisticos_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sonhos_cabalisticos_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sonhos_cabalisticos_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sonhos_cabalisticos.client_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: sonhos_cabalisticos_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sonhos_cabalisticos_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando station_progress_station_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'station_progress_station_id_fkey') THEN
        RAISE NOTICE 'FK: station_progress_station_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'station_progress') THEN
        RAISE NOTICE 'FK: station_progress_station_id_fkey | Status: MISSING_SOURCE_TABLE | Table: station_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'station_progress' AND column_name = 'station_id') THEN
        RAISE NOTICE 'FK: station_progress_station_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: station_progress.station_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: station_progress_station_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_estacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: station_progress_station_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_estacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'station_progress' AND column_name = 'station_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: station_progress_station_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'station_progress.station_id', v_source_type, 'clube_estacoes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_estacoes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: station_progress_station_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_estacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: station_progress_station_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando studio_episodes_eixo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_episodes_eixo_id_fkey') THEN
        RAISE NOTICE 'FK: studio_episodes_eixo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'studio_episodes') THEN
        RAISE NOTICE 'FK: studio_episodes_eixo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: studio_episodes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_episodes' AND column_name = 'eixo_id') THEN
        RAISE NOTICE 'FK: studio_episodes_eixo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: studio_episodes.eixo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'studio_method_axes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: studio_episodes_eixo_id_fkey | Status: MISSING_TARGET_TABLE | Table: studio_method_axes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_method_axes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: studio_episodes_eixo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: studio_method_axes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_episodes' AND column_name = 'eixo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_method_axes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: studio_episodes_eixo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'studio_episodes.eixo_id', v_source_type, 'studio_method_axes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.studio_method_axes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: studio_episodes_eixo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: studio_method_axes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: studio_episodes_eixo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando symbolic_template_sessions_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'symbolic_template_sessions_case_id_fkey') THEN
        RAISE NOTICE 'FK: symbolic_template_sessions_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions') THEN
        RAISE NOTICE 'FK: symbolic_template_sessions_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: symbolic_template_sessions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: symbolic_template_sessions_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: symbolic_template_sessions.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: symbolic_template_sessions_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: symbolic_template_sessions_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: symbolic_template_sessions_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'symbolic_template_sessions.case_id', v_source_type, 'session_cases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.session_cases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: symbolic_template_sessions_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: symbolic_template_sessions_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando symbolic_template_sessions_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'symbolic_template_sessions_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: symbolic_template_sessions_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions') THEN
        RAISE NOTICE 'FK: symbolic_template_sessions_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: symbolic_template_sessions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: symbolic_template_sessions_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: symbolic_template_sessions.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: symbolic_template_sessions_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: symbolic_template_sessions_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: symbolic_template_sessions_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'symbolic_template_sessions.cliente_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: symbolic_template_sessions_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: symbolic_template_sessions_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando syntheia_conversations_mode_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_mode_id_fkey') THEN
        RAISE NOTICE 'FK: syntheia_conversations_mode_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') THEN
        RAISE NOTICE 'FK: syntheia_conversations_mode_id_fkey | Status: MISSING_SOURCE_TABLE | Table: syntheia_conversations';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'mode_id') THEN
        RAISE NOTICE 'FK: syntheia_conversations_mode_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: syntheia_conversations.mode_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_modes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: syntheia_conversations_mode_id_fkey | Status: MISSING_TARGET_TABLE | Table: syntheia_modes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_modes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: syntheia_conversations_mode_id_fkey | Status: MISSING_TARGET_COLUMN | Column: syntheia_modes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'mode_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_modes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: syntheia_conversations_mode_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'syntheia_conversations.mode_id', v_source_type, 'syntheia_modes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.syntheia_modes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: syntheia_conversations_mode_id_fkey | Status: TARGET_NOT_UNIQUE | Column: syntheia_modes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: syntheia_conversations_mode_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando syntheia_conversations_voice_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_voice_id_fkey') THEN
        RAISE NOTICE 'FK: syntheia_conversations_voice_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') THEN
        RAISE NOTICE 'FK: syntheia_conversations_voice_id_fkey | Status: MISSING_SOURCE_TABLE | Table: syntheia_conversations';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'voice_id') THEN
        RAISE NOTICE 'FK: syntheia_conversations_voice_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: syntheia_conversations.voice_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_voices') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: syntheia_conversations_voice_id_fkey | Status: MISSING_TARGET_TABLE | Table: syntheia_voices';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_voices' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: syntheia_conversations_voice_id_fkey | Status: MISSING_TARGET_COLUMN | Column: syntheia_voices.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'voice_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_voices' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: syntheia_conversations_voice_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'syntheia_conversations.voice_id', v_source_type, 'syntheia_voices.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.syntheia_voices')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: syntheia_conversations_voice_id_fkey | Status: TARGET_NOT_UNIQUE | Column: syntheia_voices.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: syntheia_conversations_voice_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando syntheia_messages_conversation_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_messages_conversation_id_fkey') THEN
        RAISE NOTICE 'FK: syntheia_messages_conversation_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_messages') THEN
        RAISE NOTICE 'FK: syntheia_messages_conversation_id_fkey | Status: MISSING_SOURCE_TABLE | Table: syntheia_messages';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_messages' AND column_name = 'conversation_id') THEN
        RAISE NOTICE 'FK: syntheia_messages_conversation_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: syntheia_messages.conversation_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: syntheia_messages_conversation_id_fkey | Status: MISSING_TARGET_TABLE | Table: syntheia_conversations';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: syntheia_messages_conversation_id_fkey | Status: MISSING_TARGET_COLUMN | Column: syntheia_conversations.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_messages' AND column_name = 'conversation_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: syntheia_messages_conversation_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'syntheia_messages.conversation_id', v_source_type, 'syntheia_conversations.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.syntheia_conversations')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: syntheia_messages_conversation_id_fkey | Status: TARGET_NOT_UNIQUE | Column: syntheia_conversations.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: syntheia_messages_conversation_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando tecela_conselho_respostas_conselho_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_conselho_respostas_conselho_id_fkey') THEN
        RAISE NOTICE 'FK: tecela_conselho_respostas_conselho_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_conselho_respostas') THEN
        RAISE NOTICE 'FK: tecela_conselho_respostas_conselho_id_fkey | Status: MISSING_SOURCE_TABLE | Table: tecela_conselho_respostas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho_respostas' AND column_name = 'conselho_id') THEN
        RAISE NOTICE 'FK: tecela_conselho_respostas_conselho_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: tecela_conselho_respostas.conselho_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_conselho') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: tecela_conselho_respostas_conselho_id_fkey | Status: MISSING_TARGET_TABLE | Table: tecela_conselho';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: tecela_conselho_respostas_conselho_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tecela_conselho.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho_respostas' AND column_name = 'conselho_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: tecela_conselho_respostas_conselho_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'tecela_conselho_respostas.conselho_id', v_source_type, 'tecela_conselho.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.tecela_conselho')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: tecela_conselho_respostas_conselho_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tecela_conselho.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: tecela_conselho_respostas_conselho_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando tecela_ressonancias_registro_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_ressonancias_registro_id_fkey') THEN
        RAISE NOTICE 'FK: tecela_ressonancias_registro_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias') THEN
        RAISE NOTICE 'FK: tecela_ressonancias_registro_id_fkey | Status: MISSING_SOURCE_TABLE | Table: tecela_ressonancias';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias' AND column_name = 'registro_id') THEN
        RAISE NOTICE 'FK: tecela_ressonancias_registro_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: tecela_ressonancias.registro_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_registros_campo') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: tecela_ressonancias_registro_id_fkey | Status: MISSING_TARGET_TABLE | Table: tecela_registros_campo';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_registros_campo' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: tecela_ressonancias_registro_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tecela_registros_campo.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias' AND column_name = 'registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_registros_campo' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: tecela_ressonancias_registro_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'tecela_ressonancias.registro_id', v_source_type, 'tecela_registros_campo.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.tecela_registros_campo')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: tecela_ressonancias_registro_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tecela_registros_campo.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: tecela_ressonancias_registro_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando tecela_supervisoes_caso_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_supervisoes_caso_id_fkey') THEN
        RAISE NOTICE 'FK: tecela_supervisoes_caso_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes') THEN
        RAISE NOTICE 'FK: tecela_supervisoes_caso_id_fkey | Status: MISSING_SOURCE_TABLE | Table: tecela_supervisoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes' AND column_name = 'caso_id') THEN
        RAISE NOTICE 'FK: tecela_supervisoes_caso_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: tecela_supervisoes.caso_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: tecela_supervisoes_caso_id_fkey | Status: MISSING_TARGET_TABLE | Table: tecela_casos_espelho';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: tecela_supervisoes_caso_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tecela_casos_espelho.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes' AND column_name = 'caso_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: tecela_supervisoes_caso_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'tecela_supervisoes.caso_id', v_source_type, 'tecela_casos_espelho.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.tecela_casos_espelho')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: tecela_supervisoes_caso_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tecela_casos_espelho.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: tecela_supervisoes_caso_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando tool_districts_district_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tool_districts_district_id_fkey') THEN
        RAISE NOTICE 'FK: tool_districts_district_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_districts') THEN
        RAISE NOTICE 'FK: tool_districts_district_id_fkey | Status: MISSING_SOURCE_TABLE | Table: tool_districts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'district_id') THEN
        RAISE NOTICE 'FK: tool_districts_district_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: tool_districts.district_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: tool_districts_district_id_fkey | Status: MISSING_TARGET_TABLE | Table: city_districts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: tool_districts_district_id_fkey | Status: MISSING_TARGET_COLUMN | Column: city_districts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: tool_districts_district_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'tool_districts.district_id', v_source_type, 'city_districts.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.city_districts')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: tool_districts_district_id_fkey | Status: TARGET_NOT_UNIQUE | Column: city_districts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: tool_districts_district_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando tool_districts_tool_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tool_districts_tool_id_fkey') THEN
        RAISE NOTICE 'FK: tool_districts_tool_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_districts') THEN
        RAISE NOTICE 'FK: tool_districts_tool_id_fkey | Status: MISSING_SOURCE_TABLE | Table: tool_districts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'tool_id') THEN
        RAISE NOTICE 'FK: tool_districts_tool_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: tool_districts.tool_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: tool_districts_tool_id_fkey | Status: MISSING_TARGET_TABLE | Table: tools';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: tool_districts_tool_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tools.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: tool_districts_tool_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'tool_districts.tool_id', v_source_type, 'tools.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.tools')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: tool_districts_tool_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tools.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: tool_districts_tool_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando tools_district_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_district_id_fkey') THEN
        RAISE NOTICE 'FK: tools_district_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        RAISE NOTICE 'FK: tools_district_id_fkey | Status: MISSING_SOURCE_TABLE | Table: tools';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'district_id') THEN
        RAISE NOTICE 'FK: tools_district_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: tools.district_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: tools_district_id_fkey | Status: MISSING_TARGET_TABLE | Table: districts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: tools_district_id_fkey | Status: MISSING_TARGET_COLUMN | Column: districts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: tools_district_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'tools.district_id', v_source_type, 'districts.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.districts')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: tools_district_id_fkey | Status: TARGET_NOT_UNIQUE | Column: districts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: tools_district_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando tools_ferramenta_pai_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_ferramenta_pai_id_fkey') THEN
        RAISE NOTICE 'FK: tools_ferramenta_pai_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        RAISE NOTICE 'FK: tools_ferramenta_pai_id_fkey | Status: MISSING_SOURCE_TABLE | Table: tools';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'ferramenta_pai_id') THEN
        RAISE NOTICE 'FK: tools_ferramenta_pai_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: tools.ferramenta_pai_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: tools_ferramenta_pai_id_fkey | Status: MISSING_TARGET_TABLE | Table: tools';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: tools_ferramenta_pai_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tools.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'ferramenta_pai_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: tools_ferramenta_pai_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'tools.ferramenta_pai_id', v_source_type, 'tools.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.tools')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: tools_ferramenta_pai_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tools.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: tools_ferramenta_pai_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando tools_proximo_passo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_proximo_passo_id_fkey') THEN
        RAISE NOTICE 'FK: tools_proximo_passo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        RAISE NOTICE 'FK: tools_proximo_passo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: tools';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'proximo_passo_id') THEN
        RAISE NOTICE 'FK: tools_proximo_passo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: tools.proximo_passo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: tools_proximo_passo_id_fkey | Status: MISSING_TARGET_TABLE | Table: tools';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: tools_proximo_passo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tools.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'proximo_passo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: tools_proximo_passo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'tools.proximo_passo_id', v_source_type, 'tools.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.tools')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: tools_proximo_passo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tools.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: tools_proximo_passo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando torre_arquetipo_sugestao_arquetipo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_arquetipo_sugestao_arquetipo_id_fkey') THEN
        RAISE NOTICE 'FK: torre_arquetipo_sugestao_arquetipo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao') THEN
        RAISE NOTICE 'FK: torre_arquetipo_sugestao_arquetipo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: torre_arquetipo_sugestao';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao' AND column_name = 'arquetipo_id') THEN
        RAISE NOTICE 'FK: torre_arquetipo_sugestao_arquetipo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: torre_arquetipo_sugestao.arquetipo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: torre_arquetipo_sugestao_arquetipo_id_fkey | Status: MISSING_TARGET_TABLE | Table: atlas_arquetipos_femininos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: torre_arquetipo_sugestao_arquetipo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: atlas_arquetipos_femininos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: torre_arquetipo_sugestao_arquetipo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'torre_arquetipo_sugestao.arquetipo_id', v_source_type, 'atlas_arquetipos_femininos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.atlas_arquetipos_femininos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: torre_arquetipo_sugestao_arquetipo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: atlas_arquetipos_femininos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: torre_arquetipo_sugestao_arquetipo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando torre_porta_relacao_porta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_porta_relacao_porta_id_fkey') THEN
        RAISE NOTICE 'FK: torre_porta_relacao_porta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao') THEN
        RAISE NOTICE 'FK: torre_porta_relacao_porta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: torre_porta_relacao';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao' AND column_name = 'porta_id') THEN
        RAISE NOTICE 'FK: torre_porta_relacao_porta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: torre_porta_relacao.porta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: torre_porta_relacao_porta_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_portas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: torre_porta_relacao_porta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_portas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: torre_porta_relacao_porta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'torre_porta_relacao.porta_id', v_source_type, 'labirinto_portas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_portas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: torre_porta_relacao_porta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_portas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: torre_porta_relacao_porta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando towers_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_client_id_fkey') THEN
        RAISE NOTICE 'FK: towers_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'towers') THEN
        RAISE NOTICE 'FK: towers_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: towers';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: towers_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: towers.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: towers_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: towers_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: towers_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'towers.client_id', v_source_type, 'clientes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clientes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: towers_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: towers_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando towers_session_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_session_id_fkey') THEN
        RAISE NOTICE 'FK: towers_session_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'towers') THEN
        RAISE NOTICE 'FK: towers_session_id_fkey | Status: MISSING_SOURCE_TABLE | Table: towers';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'session_id') THEN
        RAISE NOTICE 'FK: towers_session_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: towers.session_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: towers_session_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: towers_session_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: towers_session_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'towers.session_id', v_source_type, 'sessions.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.sessions')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: towers_session_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: towers_session_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando travessia_comentarios_user_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_comentarios_user_id_fkey') THEN
        RAISE NOTICE 'FK: travessia_comentarios_user_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_comentarios') THEN
        RAISE NOTICE 'FK: travessia_comentarios_user_id_fkey | Status: MISSING_SOURCE_TABLE | Table: travessia_comentarios';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_comentarios' AND column_name = 'user_id') THEN
        RAISE NOTICE 'FK: travessia_comentarios_user_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: travessia_comentarios.user_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: travessia_comentarios_user_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: travessia_comentarios_user_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_comentarios' AND column_name = 'user_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: travessia_comentarios_user_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'travessia_comentarios.user_id', v_source_type, 'profiles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.profiles')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: travessia_comentarios_user_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: travessia_comentarios_user_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando travessia_day_unlocks_aula_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_day_unlocks_aula_id_fkey') THEN
        RAISE NOTICE 'FK: travessia_day_unlocks_aula_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks') THEN
        RAISE NOTICE 'FK: travessia_day_unlocks_aula_id_fkey | Status: MISSING_SOURCE_TABLE | Table: travessia_day_unlocks';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks' AND column_name = 'aula_id') THEN
        RAISE NOTICE 'FK: travessia_day_unlocks_aula_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: travessia_day_unlocks.aula_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: travessia_day_unlocks_aula_id_fkey | Status: MISSING_TARGET_TABLE | Table: conteudo_aulas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: travessia_day_unlocks_aula_id_fkey | Status: MISSING_TARGET_COLUMN | Column: conteudo_aulas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks' AND column_name = 'aula_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: travessia_day_unlocks_aula_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'travessia_day_unlocks.aula_id', v_source_type, 'conteudo_aulas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.conteudo_aulas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: travessia_day_unlocks_aula_id_fkey | Status: TARGET_NOT_UNIQUE | Column: conteudo_aulas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: travessia_day_unlocks_aula_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando travessia_library_items_familia_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_items_familia_id_fkey') THEN
        RAISE NOTICE 'FK: travessia_library_items_familia_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') THEN
        RAISE NOTICE 'FK: travessia_library_items_familia_id_fkey | Status: MISSING_SOURCE_TABLE | Table: travessia_library_items';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'familia_id') THEN
        RAISE NOTICE 'FK: travessia_library_items_familia_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: travessia_library_items.familia_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_familias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: travessia_library_items_familia_id_fkey | Status: MISSING_TARGET_TABLE | Table: travessia_familias';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: travessia_library_items_familia_id_fkey | Status: MISSING_TARGET_COLUMN | Column: travessia_familias.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'familia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: travessia_library_items_familia_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'travessia_library_items.familia_id', v_source_type, 'travessia_familias.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.travessia_familias')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: travessia_library_items_familia_id_fkey | Status: TARGET_NOT_UNIQUE | Column: travessia_familias.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: travessia_library_items_familia_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando travessia_library_media_item_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_media_item_id_fkey') THEN
        RAISE NOTICE 'FK: travessia_library_media_item_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_media') THEN
        RAISE NOTICE 'FK: travessia_library_media_item_id_fkey | Status: MISSING_SOURCE_TABLE | Table: travessia_library_media';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_media' AND column_name = 'item_id') THEN
        RAISE NOTICE 'FK: travessia_library_media_item_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: travessia_library_media.item_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: travessia_library_media_item_id_fkey | Status: MISSING_TARGET_TABLE | Table: travessia_library_items';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: travessia_library_media_item_id_fkey | Status: MISSING_TARGET_COLUMN | Column: travessia_library_items.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_media' AND column_name = 'item_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: travessia_library_media_item_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'travessia_library_media.item_id', v_source_type, 'travessia_library_items.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.travessia_library_items')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: travessia_library_media_item_id_fkey | Status: TARGET_NOT_UNIQUE | Column: travessia_library_items.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: travessia_library_media_item_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando travessia_library_tags_item_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_tags_item_id_fkey') THEN
        RAISE NOTICE 'FK: travessia_library_tags_item_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_tags') THEN
        RAISE NOTICE 'FK: travessia_library_tags_item_id_fkey | Status: MISSING_SOURCE_TABLE | Table: travessia_library_tags';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_tags' AND column_name = 'item_id') THEN
        RAISE NOTICE 'FK: travessia_library_tags_item_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: travessia_library_tags.item_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: travessia_library_tags_item_id_fkey | Status: MISSING_TARGET_TABLE | Table: travessia_library_items';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: travessia_library_tags_item_id_fkey | Status: MISSING_TARGET_COLUMN | Column: travessia_library_items.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_tags' AND column_name = 'item_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: travessia_library_tags_item_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'travessia_library_tags.item_id', v_source_type, 'travessia_library_items.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.travessia_library_items')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: travessia_library_tags_item_id_fkey | Status: TARGET_NOT_UNIQUE | Column: travessia_library_items.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: travessia_library_tags_item_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando treinamento_respostas_caso_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treinamento_respostas_caso_id_fkey') THEN
        RAISE NOTICE 'FK: treinamento_respostas_caso_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'treinamento_respostas') THEN
        RAISE NOTICE 'FK: treinamento_respostas_caso_id_fkey | Status: MISSING_SOURCE_TABLE | Table: treinamento_respostas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_respostas' AND column_name = 'caso_id') THEN
        RAISE NOTICE 'FK: treinamento_respostas_caso_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: treinamento_respostas.caso_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'treinamento_casos_simulados') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: treinamento_respostas_caso_id_fkey | Status: MISSING_TARGET_TABLE | Table: treinamento_casos_simulados';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_casos_simulados' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: treinamento_respostas_caso_id_fkey | Status: MISSING_TARGET_COLUMN | Column: treinamento_casos_simulados.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_respostas' AND column_name = 'caso_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_casos_simulados' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: treinamento_respostas_caso_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'treinamento_respostas.caso_id', v_source_type, 'treinamento_casos_simulados.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.treinamento_casos_simulados')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: treinamento_respostas_caso_id_fkey | Status: TARGET_NOT_UNIQUE | Column: treinamento_casos_simulados.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: treinamento_respostas_caso_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando upsell_opportunities_rule_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'upsell_opportunities_rule_id_fkey') THEN
        RAISE NOTICE 'FK: upsell_opportunities_rule_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'upsell_opportunities') THEN
        RAISE NOTICE 'FK: upsell_opportunities_rule_id_fkey | Status: MISSING_SOURCE_TABLE | Table: upsell_opportunities';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_opportunities' AND column_name = 'rule_id') THEN
        RAISE NOTICE 'FK: upsell_opportunities_rule_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: upsell_opportunities.rule_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'upsell_rules') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: upsell_opportunities_rule_id_fkey | Status: MISSING_TARGET_TABLE | Table: upsell_rules';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_rules' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: upsell_opportunities_rule_id_fkey | Status: MISSING_TARGET_COLUMN | Column: upsell_rules.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_opportunities' AND column_name = 'rule_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_rules' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: upsell_opportunities_rule_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'upsell_opportunities.rule_id', v_source_type, 'upsell_rules.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.upsell_rules')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: upsell_opportunities_rule_id_fkey | Status: TARGET_NOT_UNIQUE | Column: upsell_rules.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: upsell_opportunities_rule_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando user_aula_progress_aula_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_aula_progress_aula_id_fkey') THEN
        RAISE NOTICE 'FK: user_aula_progress_aula_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_aula_progress') THEN
        RAISE NOTICE 'FK: user_aula_progress_aula_id_fkey | Status: MISSING_SOURCE_TABLE | Table: user_aula_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_aula_progress' AND column_name = 'aula_id') THEN
        RAISE NOTICE 'FK: user_aula_progress_aula_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: user_aula_progress.aula_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: user_aula_progress_aula_id_fkey | Status: MISSING_TARGET_TABLE | Table: conteudo_aulas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: user_aula_progress_aula_id_fkey | Status: MISSING_TARGET_COLUMN | Column: conteudo_aulas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_aula_progress' AND column_name = 'aula_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: user_aula_progress_aula_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'user_aula_progress.aula_id', v_source_type, 'conteudo_aulas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.conteudo_aulas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: user_aula_progress_aula_id_fkey | Status: TARGET_NOT_UNIQUE | Column: conteudo_aulas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: user_aula_progress_aula_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando user_cidadela_estado_user_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_cidadela_estado_user_id_fkey') THEN
        RAISE NOTICE 'FK: user_cidadela_estado_user_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado') THEN
        RAISE NOTICE 'FK: user_cidadela_estado_user_id_fkey | Status: MISSING_SOURCE_TABLE | Table: user_cidadela_estado';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado' AND column_name = 'user_id') THEN
        RAISE NOTICE 'FK: user_cidadela_estado_user_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: user_cidadela_estado.user_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: user_cidadela_estado_user_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: user_cidadela_estado_user_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado' AND column_name = 'user_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: user_cidadela_estado_user_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'user_cidadela_estado.user_id', v_source_type, 'profiles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.profiles')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: user_cidadela_estado_user_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: user_cidadela_estado_user_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando user_favorites_library_item_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_favorites_library_item_id_fkey') THEN
        RAISE NOTICE 'FK: user_favorites_library_item_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_favorites') THEN
        RAISE NOTICE 'FK: user_favorites_library_item_id_fkey | Status: MISSING_SOURCE_TABLE | Table: user_favorites';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'library_item_id') THEN
        RAISE NOTICE 'FK: user_favorites_library_item_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: user_favorites.library_item_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'library_items') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: user_favorites_library_item_id_fkey | Status: MISSING_TARGET_TABLE | Table: library_items';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'library_items' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: user_favorites_library_item_id_fkey | Status: MISSING_TARGET_COLUMN | Column: library_items.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'library_item_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'library_items' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: user_favorites_library_item_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'user_favorites.library_item_id', v_source_type, 'library_items.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.library_items')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: user_favorites_library_item_id_fkey | Status: TARGET_NOT_UNIQUE | Column: library_items.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: user_favorites_library_item_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando user_progress_lesson_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_lesson_id_fkey') THEN
        RAISE NOTICE 'FK: user_progress_lesson_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
        RAISE NOTICE 'FK: user_progress_lesson_id_fkey | Status: MISSING_SOURCE_TABLE | Table: user_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'lesson_id') THEN
        RAISE NOTICE 'FK: user_progress_lesson_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: user_progress.lesson_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: user_progress_lesson_id_fkey | Status: MISSING_TARGET_TABLE | Table: lessons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: user_progress_lesson_id_fkey | Status: MISSING_TARGET_COLUMN | Column: lessons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'lesson_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: user_progress_lesson_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'user_progress.lesson_id', v_source_type, 'lessons.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.lessons')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: user_progress_lesson_id_fkey | Status: TARGET_NOT_UNIQUE | Column: lessons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: user_progress_lesson_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando user_unlocked_rewards_reward_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_unlocked_rewards_reward_id_fkey') THEN
        RAISE NOTICE 'FK: user_unlocked_rewards_reward_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_unlocked_rewards') THEN
        RAISE NOTICE 'FK: user_unlocked_rewards_reward_id_fkey | Status: MISSING_SOURCE_TABLE | Table: user_unlocked_rewards';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_unlocked_rewards' AND column_name = 'reward_id') THEN
        RAISE NOTICE 'FK: user_unlocked_rewards_reward_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: user_unlocked_rewards.reward_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_rewards') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: user_unlocked_rewards_reward_id_fkey | Status: MISSING_TARGET_TABLE | Table: symbolic_rewards';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_rewards' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: user_unlocked_rewards_reward_id_fkey | Status: MISSING_TARGET_COLUMN | Column: symbolic_rewards.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_unlocked_rewards' AND column_name = 'reward_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_rewards' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: user_unlocked_rewards_reward_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'user_unlocked_rewards.reward_id', v_source_type, 'symbolic_rewards.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.symbolic_rewards')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: user_unlocked_rewards_reward_id_fkey | Status: TARGET_NOT_UNIQUE | Column: symbolic_rewards.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: user_unlocked_rewards_reward_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    RAISE NOTICE '--------------------------------------------------';
    RAISE NOTICE 'RESUMO PARCIAL (PARTE 8):';
    RAISE NOTICE 'Total analisadas nesta parte: %', v_total_analyzed;
    RAISE NOTICE 'Total já existentes (EXISTS): %', v_total_exists;
    RAISE NOTICE 'Total prontas para criar (READY_TO_CREATE): %', v_total_ready;
    RAISE NOTICE 'Bloqueadas - Tabela Origem Ausente: %', v_total_missing_source_table;
    RAISE NOTICE 'Bloqueadas - Coluna Origem Ausente: %', v_total_missing_source_column;
    RAISE NOTICE 'Bloqueadas - Tabela Referência Ausente: %', v_total_missing_target_table;
    RAISE NOTICE 'Bloqueadas - Coluna Referência Ausente: %', v_total_missing_target_column;
    RAISE NOTICE 'Bloqueadas - Incompatibilidade de Tipos: %', v_total_type_mismatch;
    RAISE NOTICE 'Bloqueadas - Referência não é Única/PK: %', v_total_target_not_unique;
    RAISE NOTICE '--------------------------------------------------';
END $$;
