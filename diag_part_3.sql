
CREATE TEMP TABLE results (name TEXT, status TEXT, source_table TEXT, source_column TEXT, target_table TEXT, target_column TEXT);
DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN

    -- Analyzing inventario_personas_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventario_personas_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('inventario_personas_cliente_id_fkey', 'EXISTS', 'inventario_personas', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inventario_personas') THEN
        INSERT INTO results VALUES ('inventario_personas_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'inventario_personas', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'inventario_personas' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('inventario_personas_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'inventario_personas', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('inventario_personas_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'inventario_personas', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('inventario_personas_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'inventario_personas', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'inventario_personas' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('inventario_personas_cliente_id_fkey', 'TYPE_MISMATCH', 'inventario_personas', 'cliente_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('inventario_personas_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'inventario_personas', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('inventario_personas_cliente_id_fkey', 'READY_TO_CREATE', 'inventario_personas', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_do_oficio_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('jardim_do_oficio_cliente_id_fkey', 'EXISTS', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio') THEN
        INSERT INTO results VALUES ('jardim_do_oficio_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('jardim_do_oficio_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jardim_do_oficio_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jardim_do_oficio_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jardim_do_oficio_cliente_id_fkey', 'TYPE_MISMATCH', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jardim_do_oficio_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('jardim_do_oficio_cliente_id_fkey', 'READY_TO_CREATE', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_do_oficio_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_sessao_id_fkey') THEN
        INSERT INTO results VALUES ('jardim_do_oficio_sessao_id_fkey', 'EXISTS', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio') THEN
        INSERT INTO results VALUES ('jardim_do_oficio_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'sessao_id') THEN
        INSERT INTO results VALUES ('jardim_do_oficio_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') 
          AND NOT ('sessoes_casa_maquinas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jardim_do_oficio_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jardim_do_oficio_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jardim_do_oficio_sessao_id_fkey', 'TYPE_MISMATCH', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sessoes_casa_maquinas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessoes_casa_maquinas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jardim_do_oficio_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id');
                ELSE
                    INSERT INTO results VALUES ('jardim_do_oficio_sessao_id_fkey', 'READY_TO_CREATE', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_grupo_registros_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_group_id_fkey') THEN
        INSERT INTO results VALUES ('jardim_grupo_registros_group_id_fkey', 'EXISTS', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros') THEN
        INSERT INTO results VALUES ('jardim_grupo_registros_group_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'group_id') THEN
        INSERT INTO results VALUES ('jardim_grupo_registros_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('therapeutic_groups' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jardim_grupo_registros_group_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jardim_grupo_registros_group_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jardim_grupo_registros_group_id_fkey', 'TYPE_MISMATCH', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'therapeutic_groups' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('therapeutic_groups') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jardim_grupo_registros_group_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id');
                ELSE
                    INSERT INTO results VALUES ('jardim_grupo_registros_group_id_fkey', 'READY_TO_CREATE', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_grupo_registros_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_session_id_fkey') THEN
        INSERT INTO results VALUES ('jardim_grupo_registros_session_id_fkey', 'EXISTS', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros') THEN
        INSERT INTO results VALUES ('jardim_grupo_registros_session_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('jardim_grupo_registros_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_sessions') 
          AND NOT ('group_sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jardim_grupo_registros_session_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jardim_grupo_registros_session_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jardim_grupo_registros_session_id_fkey', 'TYPE_MISMATCH', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'group_sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('group_sessions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jardim_grupo_registros_session_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('jardim_grupo_registros_session_id_fkey', 'READY_TO_CREATE', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_heroina_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_case_id_fkey') THEN
        INSERT INTO results VALUES ('jardim_heroina_case_id_fkey', 'EXISTS', 'jardim_heroina', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina') THEN
        INSERT INTO results VALUES ('jardim_heroina_case_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_heroina', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('jardim_heroina_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_heroina', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jardim_heroina_case_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_heroina', 'case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jardim_heroina_case_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina', 'case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jardim_heroina_case_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina', 'case_id', 'session_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'session_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('session_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jardim_heroina_case_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_heroina', 'case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('jardim_heroina_case_id_fkey', 'READY_TO_CREATE', 'jardim_heroina', 'case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_heroina_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_client_id_fkey') THEN
        INSERT INTO results VALUES ('jardim_heroina_client_id_fkey', 'EXISTS', 'jardim_heroina', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina') THEN
        INSERT INTO results VALUES ('jardim_heroina_client_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_heroina', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('jardim_heroina_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_heroina', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jardim_heroina_client_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_heroina', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jardim_heroina_client_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jardim_heroina_client_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jardim_heroina_client_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_heroina', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('jardim_heroina_client_id_fkey', 'READY_TO_CREATE', 'jardim_heroina', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_heroina_registros_mapa_vivo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_id_fkey') THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'EXISTS', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_id') THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
          AND NOT ('mapa_vivo_heroina' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'mapa_vivo_heroina' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('mapa_vivo_heroina') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id');
                ELSE
                    INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'READY_TO_CREATE', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_heroina_registros_mapa_vivo_origem_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_origem_id_fkey') THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'EXISTS', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_origem_id') THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
          AND NOT ('mapa_vivo_heroina' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_origem_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'mapa_vivo_heroina' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('mapa_vivo_heroina') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id');
                ELSE
                    INSERT INTO results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'READY_TO_CREATE', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_heroina_registros_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_session_case_id_fkey') THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'EXISTS', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'session_case_id') THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'session_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('session_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'READY_TO_CREATE', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jornada_heroina_notas_profissionais_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_notas_profissionais_registro_id_fkey') THEN
        INSERT INTO results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'EXISTS', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_notas_profissionais') THEN
        INSERT INTO results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_notas_profissionais' AND column_name = 'registro_id') THEN
        INSERT INTO results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
          AND NOT ('jornada_heroina_registros' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'MISSING_TARGET_TABLE', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_notas_profissionais' AND column_name = 'registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'jornada_heroina_registros' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('jornada_heroina_registros') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id');
                ELSE
                    INSERT INTO results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jornada_heroina_registros_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'EXISTS', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') THEN
        INSERT INTO results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jornada_heroina_registros_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_session_case_id_fkey') THEN
        INSERT INTO results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'EXISTS', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') THEN
        INSERT INTO results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'session_case_id') THEN
        INSERT INTO results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'session_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('session_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jornada_heroina_respostas_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_respostas_registro_id_fkey') THEN
        INSERT INTO results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'EXISTS', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas') THEN
        INSERT INTO results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas' AND column_name = 'registro_id') THEN
        INSERT INTO results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
          AND NOT ('jornada_heroina_registros' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'MISSING_TARGET_TABLE', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas' AND column_name = 'registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'jornada_heroina_registros' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('jornada_heroina_registros') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id');
                ELSE
                    INSERT INTO results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jornada_individuacao_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_individuacao_client_id_fkey') THEN
        INSERT INTO results VALUES ('jornada_individuacao_client_id_fkey', 'EXISTS', 'jornada_individuacao', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_individuacao') THEN
        INSERT INTO results VALUES ('jornada_individuacao_client_id_fkey', 'MISSING_SOURCE_TABLE', 'jornada_individuacao', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_individuacao' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('jornada_individuacao_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'jornada_individuacao', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('jornada_individuacao_client_id_fkey', 'MISSING_TARGET_TABLE', 'jornada_individuacao', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('jornada_individuacao_client_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_individuacao', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_individuacao' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('jornada_individuacao_client_id_fkey', 'TYPE_MISMATCH', 'jornada_individuacao', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('jornada_individuacao_client_id_fkey', 'TARGET_NOT_UNIQUE', 'jornada_individuacao', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('jornada_individuacao_client_id_fkey', 'READY_TO_CREATE', 'jornada_individuacao', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_districts_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_districts_district_id_fkey') THEN
        INSERT INTO results VALUES ('journey_districts_district_id_fkey', 'EXISTS', 'journey_districts', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_districts') THEN
        INSERT INTO results VALUES ('journey_districts_district_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_districts', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'district_id') THEN
        INSERT INTO results VALUES ('journey_districts_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_districts', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('journey_districts_district_id_fkey', 'MISSING_TARGET_TABLE', 'journey_districts', 'district_id', 'districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('journey_districts_district_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_districts', 'district_id', 'districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('journey_districts_district_id_fkey', 'TYPE_MISMATCH', 'journey_districts', 'district_id', 'districts', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'districts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('districts') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('journey_districts_district_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_districts', 'district_id', 'districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('journey_districts_district_id_fkey', 'READY_TO_CREATE', 'journey_districts', 'district_id', 'districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_districts_journey_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_districts_journey_id_fkey') THEN
        INSERT INTO results VALUES ('journey_districts_journey_id_fkey', 'EXISTS', 'journey_districts', 'journey_id', 'journeys', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_districts') THEN
        INSERT INTO results VALUES ('journey_districts_journey_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_districts', 'journey_id', 'journeys', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'journey_id') THEN
        INSERT INTO results VALUES ('journey_districts_journey_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_districts', 'journey_id', 'journeys', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') 
          AND NOT ('journeys' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('journey_districts_journey_id_fkey', 'MISSING_TARGET_TABLE', 'journey_districts', 'journey_id', 'journeys', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('journey_districts_journey_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_districts', 'journey_id', 'journeys', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'journey_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('journey_districts_journey_id_fkey', 'TYPE_MISMATCH', 'journey_districts', 'journey_id', 'journeys', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'journeys' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('journeys') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('journey_districts_journey_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_districts', 'journey_id', 'journeys', 'id');
                ELSE
                    INSERT INTO results VALUES ('journey_districts_journey_id_fkey', 'READY_TO_CREATE', 'journey_districts', 'journey_id', 'journeys', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_events_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_client_id_fkey') THEN
        INSERT INTO results VALUES ('journey_events_client_id_fkey', 'EXISTS', 'journey_events', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_events') THEN
        INSERT INTO results VALUES ('journey_events_client_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_events', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('journey_events_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_events', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('journey_events_client_id_fkey', 'MISSING_TARGET_TABLE', 'journey_events', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('journey_events_client_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_events', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('journey_events_client_id_fkey', 'TYPE_MISMATCH', 'journey_events', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('journey_events_client_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_events', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('journey_events_client_id_fkey', 'READY_TO_CREATE', 'journey_events', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_events_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_session_id_fkey') THEN
        INSERT INTO results VALUES ('journey_events_session_id_fkey', 'EXISTS', 'journey_events', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_events') THEN
        INSERT INTO results VALUES ('journey_events_session_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_events', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('journey_events_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_events', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('journey_events_session_id_fkey', 'MISSING_TARGET_TABLE', 'journey_events', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('journey_events_session_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_events', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('journey_events_session_id_fkey', 'TYPE_MISMATCH', 'journey_events', 'session_id', 'sessions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('journey_events_session_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_events', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('journey_events_session_id_fkey', 'READY_TO_CREATE', 'journey_events', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_media_journey_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_media_journey_id_fkey') THEN
        INSERT INTO results VALUES ('journey_media_journey_id_fkey', 'EXISTS', 'journey_media', 'journey_id', 'clube_jornadas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_media') THEN
        INSERT INTO results VALUES ('journey_media_journey_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_media', 'journey_id', 'clube_jornadas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_media' AND column_name = 'journey_id') THEN
        INSERT INTO results VALUES ('journey_media_journey_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_media', 'journey_id', 'clube_jornadas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') 
          AND NOT ('clube_jornadas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('journey_media_journey_id_fkey', 'MISSING_TARGET_TABLE', 'journey_media', 'journey_id', 'clube_jornadas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('journey_media_journey_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_media', 'journey_id', 'clube_jornadas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_media' AND column_name = 'journey_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('journey_media_journey_id_fkey', 'TYPE_MISMATCH', 'journey_media', 'journey_id', 'clube_jornadas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_jornadas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_jornadas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('journey_media_journey_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_media', 'journey_id', 'clube_jornadas', 'id');
                ELSE
                    INSERT INTO results VALUES ('journey_media_journey_id_fkey', 'READY_TO_CREATE', 'journey_media', 'journey_id', 'clube_jornadas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_reflections_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_reflections_client_id_fkey') THEN
        INSERT INTO results VALUES ('journey_reflections_client_id_fkey', 'EXISTS', 'journey_reflections', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_reflections') THEN
        INSERT INTO results VALUES ('journey_reflections_client_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_reflections', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_reflections' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('journey_reflections_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_reflections', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('journey_reflections_client_id_fkey', 'MISSING_TARGET_TABLE', 'journey_reflections', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('journey_reflections_client_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_reflections', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_reflections' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('journey_reflections_client_id_fkey', 'TYPE_MISMATCH', 'journey_reflections', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('journey_reflections_client_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_reflections', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('journey_reflections_client_id_fkey', 'READY_TO_CREATE', 'journey_reflections', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journeys_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_client_id_fkey') THEN
        INSERT INTO results VALUES ('journeys_client_id_fkey', 'EXISTS', 'journeys', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') THEN
        INSERT INTO results VALUES ('journeys_client_id_fkey', 'MISSING_SOURCE_TABLE', 'journeys', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('journeys_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'journeys', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('journeys_client_id_fkey', 'MISSING_TARGET_TABLE', 'journeys', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('journeys_client_id_fkey', 'MISSING_TARGET_COLUMN', 'journeys', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('journeys_client_id_fkey', 'TYPE_MISMATCH', 'journeys', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('journeys_client_id_fkey', 'TARGET_NOT_UNIQUE', 'journeys', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('journeys_client_id_fkey', 'READY_TO_CREATE', 'journeys', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journeys_current_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_current_district_id_fkey') THEN
        INSERT INTO results VALUES ('journeys_current_district_id_fkey', 'EXISTS', 'journeys', 'current_district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') THEN
        INSERT INTO results VALUES ('journeys_current_district_id_fkey', 'MISSING_SOURCE_TABLE', 'journeys', 'current_district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'current_district_id') THEN
        INSERT INTO results VALUES ('journeys_current_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'journeys', 'current_district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('journeys_current_district_id_fkey', 'MISSING_TARGET_TABLE', 'journeys', 'current_district_id', 'districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('journeys_current_district_id_fkey', 'MISSING_TARGET_COLUMN', 'journeys', 'current_district_id', 'districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'current_district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('journeys_current_district_id_fkey', 'TYPE_MISMATCH', 'journeys', 'current_district_id', 'districts', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'districts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('districts') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('journeys_current_district_id_fkey', 'TARGET_NOT_UNIQUE', 'journeys', 'current_district_id', 'districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('journeys_current_district_id_fkey', 'READY_TO_CREATE', 'journeys', 'current_district_id', 'districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing lab_8020_progress_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_book_id_fkey') THEN
        INSERT INTO results VALUES ('lab_8020_progress_book_id_fkey', 'EXISTS', 'lab_8020_progress', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_8020_progress') THEN
        INSERT INTO results VALUES ('lab_8020_progress_book_id_fkey', 'MISSING_SOURCE_TABLE', 'lab_8020_progress', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'book_id') THEN
        INSERT INTO results VALUES ('lab_8020_progress_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'lab_8020_progress', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('lab_8020_progress_book_id_fkey', 'MISSING_TARGET_TABLE', 'lab_8020_progress', 'book_id', 'books', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('lab_8020_progress_book_id_fkey', 'MISSING_TARGET_COLUMN', 'lab_8020_progress', 'book_id', 'books', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('lab_8020_progress_book_id_fkey', 'TYPE_MISMATCH', 'lab_8020_progress', 'book_id', 'books', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('lab_8020_progress_book_id_fkey', 'TARGET_NOT_UNIQUE', 'lab_8020_progress', 'book_id', 'books', 'id');
                ELSE
                    INSERT INTO results VALUES ('lab_8020_progress_book_id_fkey', 'READY_TO_CREATE', 'lab_8020_progress', 'book_id', 'books', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing lab_8020_progress_season_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_season_id_fkey') THEN
        INSERT INTO results VALUES ('lab_8020_progress_season_id_fkey', 'EXISTS', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_8020_progress') THEN
        INSERT INTO results VALUES ('lab_8020_progress_season_id_fkey', 'MISSING_SOURCE_TABLE', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'season_id') THEN
        INSERT INTO results VALUES ('lab_8020_progress_season_id_fkey', 'MISSING_SOURCE_COLUMN', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('lab_8020_progress_season_id_fkey', 'MISSING_TARGET_TABLE', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('lab_8020_progress_season_id_fkey', 'MISSING_TARGET_COLUMN', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'season_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('lab_8020_progress_season_id_fkey', 'TYPE_MISMATCH', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oracular_seasons' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracular_seasons') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('lab_8020_progress_season_id_fkey', 'TARGET_NOT_UNIQUE', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id');
                ELSE
                    INSERT INTO results VALUES ('lab_8020_progress_season_id_fkey', 'READY_TO_CREATE', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_39_portas_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_39_portas_client_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_39_portas_client_id_fkey', 'EXISTS', 'labirinto_39_portas', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas') THEN
        INSERT INTO results VALUES ('labirinto_39_portas_client_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_39_portas', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('labirinto_39_portas_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_39_portas', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_39_portas_client_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_39_portas', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_39_portas_client_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_39_portas', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_39_portas_client_id_fkey', 'TYPE_MISMATCH', 'labirinto_39_portas', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_39_portas_client_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_39_portas', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_39_portas_client_id_fkey', 'READY_TO_CREATE', 'labirinto_39_portas', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_anotacoes_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'EXISTS', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes') THEN
        INSERT INTO results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'TYPE_MISMATCH', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'READY_TO_CREATE', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_anotacoes_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_porta_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_anotacoes_porta_id_fkey', 'EXISTS', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes') THEN
        INSERT INTO results VALUES ('labirinto_anotacoes_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'porta_id') THEN
        INSERT INTO results VALUES ('labirinto_anotacoes_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('labirinto_portas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_anotacoes_porta_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_anotacoes_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_anotacoes_porta_id_fkey', 'TYPE_MISMATCH', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_portas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_portas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_anotacoes_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_anotacoes_porta_id_fkey', 'READY_TO_CREATE', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_leituras_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_leituras_cliente_id_fkey', 'EXISTS', 'labirinto_leituras', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_leituras') THEN
        INSERT INTO results VALUES ('labirinto_leituras_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_leituras', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('labirinto_leituras_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_leituras', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_leituras_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_leituras', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_leituras_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_leituras', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_leituras_cliente_id_fkey', 'TYPE_MISMATCH', 'labirinto_leituras', 'cliente_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_leituras_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_leituras', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_leituras_cliente_id_fkey', 'READY_TO_CREATE', 'labirinto_leituras', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_leituras_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_porta_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_leituras_porta_id_fkey', 'EXISTS', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_leituras') THEN
        INSERT INTO results VALUES ('labirinto_leituras_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'porta_id') THEN
        INSERT INTO results VALUES ('labirinto_leituras_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('labirinto_portas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_leituras_porta_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_leituras_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_leituras_porta_id_fkey', 'TYPE_MISMATCH', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_portas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_portas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_leituras_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_leituras_porta_id_fkey', 'READY_TO_CREATE', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_registros_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_arquetipo_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_registros_arquetipo_id_fkey', 'EXISTS', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        INSERT INTO results VALUES ('labirinto_registros_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'arquetipo_id') THEN
        INSERT INTO results VALUES ('labirinto_registros_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
          AND NOT ('labirinto_arquetipos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_registros_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_registros_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_registros_arquetipo_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_arquetipos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_arquetipos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_registros_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_registros_arquetipo_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_registros_fase_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_fase_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_registros_fase_id_fkey', 'EXISTS', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        INSERT INTO results VALUES ('labirinto_registros_fase_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'fase_id') THEN
        INSERT INTO results VALUES ('labirinto_registros_fase_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('labirinto_fases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_registros_fase_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_registros_fase_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'fase_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_registros_fase_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_fases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_fases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_registros_fase_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_registros_fase_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_registros_metafora_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_metafora_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_registros_metafora_id_fkey', 'EXISTS', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        INSERT INTO results VALUES ('labirinto_registros_metafora_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'metafora_id') THEN
        INSERT INTO results VALUES ('labirinto_registros_metafora_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
          AND NOT ('labirinto_metaforas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_registros_metafora_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_registros_metafora_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'metafora_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_registros_metafora_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_metaforas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_metaforas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_registros_metafora_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_registros_metafora_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_registros_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_ritual_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_registros_ritual_id_fkey', 'EXISTS', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        INSERT INTO results VALUES ('labirinto_registros_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'ritual_id') THEN
        INSERT INTO results VALUES ('labirinto_registros_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
          AND NOT ('labirinto_rituais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_registros_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_registros_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'ritual_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_registros_ritual_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_rituais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_rituais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_registros_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_registros_ritual_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_registros_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_session_case_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_registros_session_case_id_fkey', 'EXISTS', 'labirinto_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        INSERT INTO results VALUES ('labirinto_registros_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'session_case_id') THEN
        INSERT INTO results VALUES ('labirinto_registros_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_registros', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_registros_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_registros', 'session_case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'session_case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'session_case_id', 'session_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'session_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('session_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_registros_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_registros', 'session_case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_registros_session_case_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'session_case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_roteiros_gerados_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_arquetipo_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'EXISTS', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'arquetipo_id') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
          AND NOT ('labirinto_arquetipos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_arquetipos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_arquetipos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_roteiros_gerados_fase_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_fase_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'EXISTS', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'fase_id') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('labirinto_fases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'fase_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_fases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_fases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_roteiros_gerados_metafora_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_metafora_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'EXISTS', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'metafora_id') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
          AND NOT ('labirinto_metaforas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'metafora_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_metaforas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_metaforas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_roteiros_gerados_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_ritual_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'EXISTS', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'ritual_id') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
          AND NOT ('labirinto_rituais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'ritual_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_rituais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_rituais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_roteiros_gerados_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_session_case_id_fkey') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'EXISTS', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'session_case_id') THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'session_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('session_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labyrinth_records_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_client_id_fkey') THEN
        INSERT INTO results VALUES ('labyrinth_records_client_id_fkey', 'EXISTS', 'labyrinth_records', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labyrinth_records') THEN
        INSERT INTO results VALUES ('labyrinth_records_client_id_fkey', 'MISSING_SOURCE_TABLE', 'labyrinth_records', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('labyrinth_records_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'labyrinth_records', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labyrinth_records_client_id_fkey', 'MISSING_TARGET_TABLE', 'labyrinth_records', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labyrinth_records_client_id_fkey', 'MISSING_TARGET_COLUMN', 'labyrinth_records', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labyrinth_records_client_id_fkey', 'TYPE_MISMATCH', 'labyrinth_records', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labyrinth_records_client_id_fkey', 'TARGET_NOT_UNIQUE', 'labyrinth_records', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('labyrinth_records_client_id_fkey', 'READY_TO_CREATE', 'labyrinth_records', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labyrinth_records_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_session_id_fkey') THEN
        INSERT INTO results VALUES ('labyrinth_records_session_id_fkey', 'EXISTS', 'labyrinth_records', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labyrinth_records') THEN
        INSERT INTO results VALUES ('labyrinth_records_session_id_fkey', 'MISSING_SOURCE_TABLE', 'labyrinth_records', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('labyrinth_records_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'labyrinth_records', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('labyrinth_records_session_id_fkey', 'MISSING_TARGET_TABLE', 'labyrinth_records', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('labyrinth_records_session_id_fkey', 'MISSING_TARGET_COLUMN', 'labyrinth_records', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('labyrinth_records_session_id_fkey', 'TYPE_MISMATCH', 'labyrinth_records', 'session_id', 'sessions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sessions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('labyrinth_records_session_id_fkey', 'TARGET_NOT_UNIQUE', 'labyrinth_records', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('labyrinth_records_session_id_fkey', 'READY_TO_CREATE', 'labyrinth_records', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing lessons_album_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_album_book_id_fkey') THEN
        INSERT INTO results VALUES ('lessons_album_book_id_fkey', 'EXISTS', 'lessons_album', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons_album') THEN
        INSERT INTO results VALUES ('lessons_album_book_id_fkey', 'MISSING_SOURCE_TABLE', 'lessons_album', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons_album' AND column_name = 'book_id') THEN
        INSERT INTO results VALUES ('lessons_album_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'lessons_album', 'book_id', 'books', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('books' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('lessons_album_book_id_fkey', 'MISSING_TARGET_TABLE', 'lessons_album', 'book_id', 'books', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('lessons_album_book_id_fkey', 'MISSING_TARGET_COLUMN', 'lessons_album', 'book_id', 'books', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons_album' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('lessons_album_book_id_fkey', 'TYPE_MISMATCH', 'lessons_album', 'book_id', 'books', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'books' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('books') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('lessons_album_book_id_fkey', 'TARGET_NOT_UNIQUE', 'lessons_album', 'book_id', 'books', 'id');
                ELSE
                    INSERT INTO results VALUES ('lessons_album_book_id_fkey', 'READY_TO_CREATE', 'lessons_album', 'book_id', 'books', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing lessons_travessia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_travessia_id_fkey') THEN
        INSERT INTO results VALUES ('lessons_travessia_id_fkey', 'EXISTS', 'lessons', 'travessia_id', 'travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') THEN
        INSERT INTO results VALUES ('lessons_travessia_id_fkey', 'MISSING_SOURCE_TABLE', 'lessons', 'travessia_id', 'travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'travessia_id') THEN
        INSERT INTO results VALUES ('lessons_travessia_id_fkey', 'MISSING_SOURCE_COLUMN', 'lessons', 'travessia_id', 'travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessias') 
          AND NOT ('travessias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('lessons_travessia_id_fkey', 'MISSING_TARGET_TABLE', 'lessons', 'travessia_id', 'travessias', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessias' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('lessons_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'lessons', 'travessia_id', 'travessias', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'travessia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('lessons_travessia_id_fkey', 'TYPE_MISMATCH', 'lessons', 'travessia_id', 'travessias', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'travessias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('travessias') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('lessons_travessia_id_fkey', 'TARGET_NOT_UNIQUE', 'lessons', 'travessia_id', 'travessias', 'id');
                ELSE
                    INSERT INTO results VALUES ('lessons_travessia_id_fkey', 'READY_TO_CREATE', 'lessons', 'travessia_id', 'travessias', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapa_heroina_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_heroina_porta_id_fkey') THEN
        INSERT INTO results VALUES ('mapa_heroina_porta_id_fkey', 'EXISTS', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_heroina') THEN
        INSERT INTO results VALUES ('mapa_heroina_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_heroina' AND column_name = 'porta_id') THEN
        INSERT INTO results VALUES ('mapa_heroina_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('labirinto_fases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('mapa_heroina_porta_id_fkey', 'MISSING_TARGET_TABLE', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('mapa_heroina_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_heroina' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('mapa_heroina_porta_id_fkey', 'TYPE_MISMATCH', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'labirinto_fases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('labirinto_fases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('mapa_heroina_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id');
                ELSE
                    INSERT INTO results VALUES ('mapa_heroina_porta_id_fkey', 'READY_TO_CREATE', 'mapa_heroina', 'porta_id', 'labirinto_fases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapa_sombra_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_sombra_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('mapa_sombra_cliente_id_fkey', 'EXISTS', 'mapa_sombra', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_sombra') THEN
        INSERT INTO results VALUES ('mapa_sombra_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'mapa_sombra', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_sombra' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('mapa_sombra_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapa_sombra', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('mapa_sombra_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'mapa_sombra', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('mapa_sombra_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_sombra', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_sombra' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('mapa_sombra_cliente_id_fkey', 'TYPE_MISMATCH', 'mapa_sombra', 'cliente_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('mapa_sombra_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'mapa_sombra', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('mapa_sombra_cliente_id_fkey', 'READY_TO_CREATE', 'mapa_sombra', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapa_vivo_heroina_gesto_jardim_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_gesto_jardim_registro_id_fkey') THEN
        INSERT INTO results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'EXISTS', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') THEN
        INSERT INTO results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'gesto_jardim_registro_id') THEN
        INSERT INTO results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') 
          AND NOT ('jardim_heroina_registros' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'MISSING_TARGET_TABLE', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'gesto_jardim_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'TYPE_MISMATCH', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'jardim_heroina_registros' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('jardim_heroina_registros') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id');
                ELSE
                    INSERT INTO results VALUES ('mapa_vivo_heroina_gesto_jardim_registro_id_fkey', 'READY_TO_CREATE', 'mapa_vivo_heroina', 'gesto_jardim_registro_id', 'jardim_heroina_registros', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapa_vivo_heroina_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_session_case_id_fkey') THEN
        INSERT INTO results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'EXISTS', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') THEN
        INSERT INTO results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'session_case_id') THEN
        INSERT INTO results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'TYPE_MISMATCH', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'session_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('session_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('mapa_vivo_heroina_session_case_id_fkey', 'READY_TO_CREATE', 'mapa_vivo_heroina', 'session_case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapa_vivo_historico_mapa_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_historico_mapa_id_fkey') THEN
        INSERT INTO results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'EXISTS', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico') THEN
        INSERT INTO results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'MISSING_SOURCE_TABLE', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico' AND column_name = 'mapa_id') THEN
        INSERT INTO results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
          AND NOT ('mapa_vivo_heroina' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'MISSING_TARGET_TABLE', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'MISSING_TARGET_COLUMN', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico' AND column_name = 'mapa_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'TYPE_MISMATCH', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'mapa_vivo_heroina' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('mapa_vivo_heroina') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'TARGET_NOT_UNIQUE', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id');
                ELSE
                    INSERT INTO results VALUES ('mapa_vivo_historico_mapa_id_fkey', 'READY_TO_CREATE', 'mapa_vivo_historico', 'mapa_id', 'mapa_vivo_heroina', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mapeamento_complexos_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapeamento_complexos_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('mapeamento_complexos_cliente_id_fkey', 'EXISTS', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos') THEN
        INSERT INTO results VALUES ('mapeamento_complexos_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('mapeamento_complexos_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('mapeamento_complexos_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('mapeamento_complexos_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('mapeamento_complexos_cliente_id_fkey', 'TYPE_MISMATCH', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('mapeamento_complexos_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('mapeamento_complexos_cliente_id_fkey', 'READY_TO_CREATE', 'mapeamento_complexos', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing message_logs_campaign_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_campaign_id_fkey') THEN
        INSERT INTO results VALUES ('message_logs_campaign_id_fkey', 'EXISTS', 'message_logs', 'campaign_id', 'message_campaigns', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_logs') THEN
        INSERT INTO results VALUES ('message_logs_campaign_id_fkey', 'MISSING_SOURCE_TABLE', 'message_logs', 'campaign_id', 'message_campaigns', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'campaign_id') THEN
        INSERT INTO results VALUES ('message_logs_campaign_id_fkey', 'MISSING_SOURCE_COLUMN', 'message_logs', 'campaign_id', 'message_campaigns', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_campaigns') 
          AND NOT ('message_campaigns' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('message_logs_campaign_id_fkey', 'MISSING_TARGET_TABLE', 'message_logs', 'campaign_id', 'message_campaigns', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_campaigns' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('message_logs_campaign_id_fkey', 'MISSING_TARGET_COLUMN', 'message_logs', 'campaign_id', 'message_campaigns', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'campaign_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_campaigns' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('message_logs_campaign_id_fkey', 'TYPE_MISMATCH', 'message_logs', 'campaign_id', 'message_campaigns', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'message_campaigns' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('message_campaigns') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('message_logs_campaign_id_fkey', 'TARGET_NOT_UNIQUE', 'message_logs', 'campaign_id', 'message_campaigns', 'id');
                ELSE
                    INSERT INTO results VALUES ('message_logs_campaign_id_fkey', 'READY_TO_CREATE', 'message_logs', 'campaign_id', 'message_campaigns', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing message_logs_template_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'message_logs_template_id_fkey') THEN
        INSERT INTO results VALUES ('message_logs_template_id_fkey', 'EXISTS', 'message_logs', 'template_id', 'message_templates', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_logs') THEN
        INSERT INTO results VALUES ('message_logs_template_id_fkey', 'MISSING_SOURCE_TABLE', 'message_logs', 'template_id', 'message_templates', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'template_id') THEN
        INSERT INTO results VALUES ('message_logs_template_id_fkey', 'MISSING_SOURCE_COLUMN', 'message_logs', 'template_id', 'message_templates', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'message_templates') 
          AND NOT ('message_templates' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('message_logs_template_id_fkey', 'MISSING_TARGET_TABLE', 'message_logs', 'template_id', 'message_templates', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_templates' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('message_logs_template_id_fkey', 'MISSING_TARGET_COLUMN', 'message_logs', 'template_id', 'message_templates', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_logs' AND column_name = 'template_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'message_templates' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('message_logs_template_id_fkey', 'TYPE_MISMATCH', 'message_logs', 'template_id', 'message_templates', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'message_templates' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('message_templates') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('message_logs_template_id_fkey', 'TARGET_NOT_UNIQUE', 'message_logs', 'template_id', 'message_templates', 'id');
                ELSE
                    INSERT INTO results VALUES ('message_logs_template_id_fkey', 'READY_TO_CREATE', 'message_logs', 'template_id', 'message_templates', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mind_map_nodes_map_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_map_id_fkey') THEN
        INSERT INTO results VALUES ('mind_map_nodes_map_id_fkey', 'EXISTS', 'mind_map_nodes', 'map_id', 'mind_maps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') THEN
        INSERT INTO results VALUES ('mind_map_nodes_map_id_fkey', 'MISSING_SOURCE_TABLE', 'mind_map_nodes', 'map_id', 'mind_maps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'map_id') THEN
        INSERT INTO results VALUES ('mind_map_nodes_map_id_fkey', 'MISSING_SOURCE_COLUMN', 'mind_map_nodes', 'map_id', 'mind_maps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_maps') 
          AND NOT ('mind_maps' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('mind_map_nodes_map_id_fkey', 'MISSING_TARGET_TABLE', 'mind_map_nodes', 'map_id', 'mind_maps', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('mind_map_nodes_map_id_fkey', 'MISSING_TARGET_COLUMN', 'mind_map_nodes', 'map_id', 'mind_maps', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'map_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('mind_map_nodes_map_id_fkey', 'TYPE_MISMATCH', 'mind_map_nodes', 'map_id', 'mind_maps', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'mind_maps' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('mind_maps') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('mind_map_nodes_map_id_fkey', 'TARGET_NOT_UNIQUE', 'mind_map_nodes', 'map_id', 'mind_maps', 'id');
                ELSE
                    INSERT INTO results VALUES ('mind_map_nodes_map_id_fkey', 'READY_TO_CREATE', 'mind_map_nodes', 'map_id', 'mind_maps', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mind_map_nodes_parent_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_map_nodes_parent_id_fkey') THEN
        INSERT INTO results VALUES ('mind_map_nodes_parent_id_fkey', 'EXISTS', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') THEN
        INSERT INTO results VALUES ('mind_map_nodes_parent_id_fkey', 'MISSING_SOURCE_TABLE', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'parent_id') THEN
        INSERT INTO results VALUES ('mind_map_nodes_parent_id_fkey', 'MISSING_SOURCE_COLUMN', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_map_nodes') 
          AND NOT ('mind_map_nodes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('mind_map_nodes_parent_id_fkey', 'MISSING_TARGET_TABLE', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('mind_map_nodes_parent_id_fkey', 'MISSING_TARGET_COLUMN', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'parent_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_map_nodes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('mind_map_nodes_parent_id_fkey', 'TYPE_MISMATCH', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'mind_map_nodes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('mind_map_nodes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('mind_map_nodes_parent_id_fkey', 'TARGET_NOT_UNIQUE', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id');
                ELSE
                    INSERT INTO results VALUES ('mind_map_nodes_parent_id_fkey', 'READY_TO_CREATE', 'mind_map_nodes', 'parent_id', 'mind_map_nodes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing mind_maps_owner_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mind_maps_owner_id_fkey') THEN
        INSERT INTO results VALUES ('mind_maps_owner_id_fkey', 'EXISTS', 'mind_maps', 'owner_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mind_maps') THEN
        INSERT INTO results VALUES ('mind_maps_owner_id_fkey', 'MISSING_SOURCE_TABLE', 'mind_maps', 'owner_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'owner_id') THEN
        INSERT INTO results VALUES ('mind_maps_owner_id_fkey', 'MISSING_SOURCE_COLUMN', 'mind_maps', 'owner_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('mind_maps_owner_id_fkey', 'MISSING_TARGET_TABLE', 'mind_maps', 'owner_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('mind_maps_owner_id_fkey', 'MISSING_TARGET_COLUMN', 'mind_maps', 'owner_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mind_maps' AND column_name = 'owner_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('mind_maps_owner_id_fkey', 'TYPE_MISMATCH', 'mind_maps', 'owner_id', 'profiles', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'profiles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('profiles') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('mind_maps_owner_id_fkey', 'TARGET_NOT_UNIQUE', 'mind_maps', 'owner_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('mind_maps_owner_id_fkey', 'READY_TO_CREATE', 'mind_maps', 'owner_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing missoes_aula_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_aula_id_fkey') THEN
        INSERT INTO results VALUES ('missoes_aula_id_fkey', 'EXISTS', 'missoes', 'aula_id', 'aulas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'missoes') THEN
        INSERT INTO results VALUES ('missoes_aula_id_fkey', 'MISSING_SOURCE_TABLE', 'missoes', 'aula_id', 'aulas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'aula_id') THEN
        INSERT INTO results VALUES ('missoes_aula_id_fkey', 'MISSING_SOURCE_COLUMN', 'missoes', 'aula_id', 'aulas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'aulas') 
          AND NOT ('aulas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('missoes_aula_id_fkey', 'MISSING_TARGET_TABLE', 'missoes', 'aula_id', 'aulas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('missoes_aula_id_fkey', 'MISSING_TARGET_COLUMN', 'missoes', 'aula_id', 'aulas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'aula_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'aulas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('missoes_aula_id_fkey', 'TYPE_MISMATCH', 'missoes', 'aula_id', 'aulas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'aulas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('aulas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('missoes_aula_id_fkey', 'TARGET_NOT_UNIQUE', 'missoes', 'aula_id', 'aulas', 'id');
                ELSE
                    INSERT INTO results VALUES ('missoes_aula_id_fkey', 'READY_TO_CREATE', 'missoes', 'aula_id', 'aulas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing missoes_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'missoes_portal_id_fkey') THEN
        INSERT INTO results VALUES ('missoes_portal_id_fkey', 'EXISTS', 'missoes', 'portal_id', 'portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'missoes') THEN
        INSERT INTO results VALUES ('missoes_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'missoes', 'portal_id', 'portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('missoes_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'missoes', 'portal_id', 'portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') 
          AND NOT ('portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('missoes_portal_id_fkey', 'MISSING_TARGET_TABLE', 'missoes', 'portal_id', 'portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('missoes_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'missoes', 'portal_id', 'portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'missoes' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('missoes_portal_id_fkey', 'TYPE_MISMATCH', 'missoes', 'portal_id', 'portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('missoes_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'missoes', 'portal_id', 'portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('missoes_portal_id_fkey', 'READY_TO_CREATE', 'missoes', 'portal_id', 'portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narrative_maps_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_case_id_fkey') THEN
        INSERT INTO results VALUES ('narrative_maps_case_id_fkey', 'EXISTS', 'narrative_maps', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN
        INSERT INTO results VALUES ('narrative_maps_case_id_fkey', 'MISSING_SOURCE_TABLE', 'narrative_maps', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('narrative_maps_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'narrative_maps', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('narrative_maps_case_id_fkey', 'MISSING_TARGET_TABLE', 'narrative_maps', 'case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('narrative_maps_case_id_fkey', 'MISSING_TARGET_COLUMN', 'narrative_maps', 'case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('narrative_maps_case_id_fkey', 'TYPE_MISMATCH', 'narrative_maps', 'case_id', 'session_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'session_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('session_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('narrative_maps_case_id_fkey', 'TARGET_NOT_UNIQUE', 'narrative_maps', 'case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('narrative_maps_case_id_fkey', 'READY_TO_CREATE', 'narrative_maps', 'case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narrative_maps_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_client_id_fkey') THEN
        INSERT INTO results VALUES ('narrative_maps_client_id_fkey', 'EXISTS', 'narrative_maps', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN
        INSERT INTO results VALUES ('narrative_maps_client_id_fkey', 'MISSING_SOURCE_TABLE', 'narrative_maps', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('narrative_maps_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'narrative_maps', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('narrative_maps_client_id_fkey', 'MISSING_TARGET_TABLE', 'narrative_maps', 'client_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('narrative_maps_client_id_fkey', 'MISSING_TARGET_COLUMN', 'narrative_maps', 'client_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('narrative_maps_client_id_fkey', 'TYPE_MISMATCH', 'narrative_maps', 'client_id', 'profiles', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'profiles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('profiles') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('narrative_maps_client_id_fkey', 'TARGET_NOT_UNIQUE', 'narrative_maps', 'client_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('narrative_maps_client_id_fkey', 'READY_TO_CREATE', 'narrative_maps', 'client_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narrative_maps_therapist_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narrative_maps_therapist_id_fkey') THEN
        INSERT INTO results VALUES ('narrative_maps_therapist_id_fkey', 'EXISTS', 'narrative_maps', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') THEN
        INSERT INTO results VALUES ('narrative_maps_therapist_id_fkey', 'MISSING_SOURCE_TABLE', 'narrative_maps', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'therapist_id') THEN
        INSERT INTO results VALUES ('narrative_maps_therapist_id_fkey', 'MISSING_SOURCE_COLUMN', 'narrative_maps', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('narrative_maps_therapist_id_fkey', 'MISSING_TARGET_TABLE', 'narrative_maps', 'therapist_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('narrative_maps_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'narrative_maps', 'therapist_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'therapist_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('narrative_maps_therapist_id_fkey', 'TYPE_MISMATCH', 'narrative_maps', 'therapist_id', 'profiles', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'profiles' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('profiles') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('narrative_maps_therapist_id_fkey', 'TARGET_NOT_UNIQUE', 'narrative_maps', 'therapist_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('narrative_maps_therapist_id_fkey', 'READY_TO_CREATE', 'narrative_maps', 'therapist_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narroterapia_estudos_audio_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_estudos_audio_id_fkey') THEN
        INSERT INTO results VALUES ('narroterapia_estudos_audio_id_fkey', 'EXISTS', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos') THEN
        INSERT INTO results VALUES ('narroterapia_estudos_audio_id_fkey', 'MISSING_SOURCE_TABLE', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos' AND column_name = 'audio_id') THEN
        INSERT INTO results VALUES ('narroterapia_estudos_audio_id_fkey', 'MISSING_SOURCE_COLUMN', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
          AND NOT ('audio_assets' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('narroterapia_estudos_audio_id_fkey', 'MISSING_TARGET_TABLE', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('narroterapia_estudos_audio_id_fkey', 'MISSING_TARGET_COLUMN', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_estudos' AND column_name = 'audio_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('narroterapia_estudos_audio_id_fkey', 'TYPE_MISMATCH', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'audio_assets' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('audio_assets') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('narroterapia_estudos_audio_id_fkey', 'TARGET_NOT_UNIQUE', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id');
                ELSE
                    INSERT INTO results VALUES ('narroterapia_estudos_audio_id_fkey', 'READY_TO_CREATE', 'narroterapia_estudos', 'audio_id', 'audio_assets', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narroterapia_reacoes_simbolicas_audio_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_audio_id_fkey') THEN
        INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'EXISTS', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas') THEN
        INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'MISSING_SOURCE_TABLE', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'audio_id') THEN
        INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'MISSING_SOURCE_COLUMN', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_assets') 
          AND NOT ('audio_assets' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'MISSING_TARGET_TABLE', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'MISSING_TARGET_COLUMN', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'audio_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'audio_assets' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'TYPE_MISMATCH', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'audio_assets' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('audio_assets') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'TARGET_NOT_UNIQUE', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id');
                ELSE
                    INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_audio_id_fkey', 'READY_TO_CREATE', 'narroterapia_reacoes_simbolicas', 'audio_id', 'audio_assets', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing narroterapia_reacoes_simbolicas_conto_clinico_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'narroterapia_reacoes_simbolicas_conto_clinico_id_fkey') THEN
        INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'EXISTS', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas') THEN
        INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'MISSING_SOURCE_TABLE', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'conto_clinico_id') THEN
        INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'MISSING_SOURCE_COLUMN', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contos_clinicos') 
          AND NOT ('contos_clinicos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'MISSING_TARGET_TABLE', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'MISSING_TARGET_COLUMN', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narroterapia_reacoes_simbolicas' AND column_name = 'conto_clinico_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'contos_clinicos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'TYPE_MISMATCH', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'contos_clinicos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('contos_clinicos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'TARGET_NOT_UNIQUE', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id');
                ELSE
                    INSERT INTO results VALUES ('narroterapia_reacoes_simbolicas_conto_clinico_id_fkey', 'READY_TO_CREATE', 'narroterapia_reacoes_simbolicas', 'conto_clinico_id', 'contos_clinicos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_cards_archetype_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_archetype_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_cards_archetype_id_fkey', 'EXISTS', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        INSERT INTO results VALUES ('oracle_cards_archetype_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'archetype_id') THEN
        INSERT INTO results VALUES ('oracle_cards_archetype_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('founding_archetypes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_cards_archetype_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_cards_archetype_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'archetype_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_cards_archetype_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'founding_archetypes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('founding_archetypes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_cards_archetype_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_cards_archetype_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'archetype_id', 'founding_archetypes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_cards_deck_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_deck_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_cards_deck_id_fkey', 'EXISTS', 'oracle_cards', 'deck_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        INSERT INTO results VALUES ('oracle_cards_deck_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_cards', 'deck_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'deck_id') THEN
        INSERT INTO results VALUES ('oracle_cards_deck_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_cards', 'deck_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('oracle_decks' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_cards_deck_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_cards', 'deck_id', 'oracle_decks', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_cards_deck_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'deck_id', 'oracle_decks', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'deck_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_cards_deck_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'deck_id', 'oracle_decks', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oracle_decks' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_decks') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_cards_deck_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_cards', 'deck_id', 'oracle_decks', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_cards_deck_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'deck_id', 'oracle_decks', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_cards_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_district_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_cards_district_id_fkey', 'EXISTS', 'oracle_cards', 'district_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        INSERT INTO results VALUES ('oracle_cards_district_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_cards', 'district_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'district_id') THEN
        INSERT INTO results VALUES ('oracle_cards_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_cards', 'district_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('city_districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_cards_district_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_cards', 'district_id', 'city_districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_cards_district_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'district_id', 'city_districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_cards_district_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'district_id', 'city_districts', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'city_districts' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('city_districts') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_cards_district_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_cards', 'district_id', 'city_districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_cards_district_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'district_id', 'city_districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_cards_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_cards_tool_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_cards_tool_id_fkey', 'EXISTS', 'oracle_cards', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_cards') THEN
        INSERT INTO results VALUES ('oracle_cards_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_cards', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'tool_id') THEN
        INSERT INTO results VALUES ('oracle_cards_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_cards', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_cards_tool_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_cards', 'tool_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_cards_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_cards', 'tool_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_cards' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_cards_tool_id_fkey', 'TYPE_MISMATCH', 'oracle_cards', 'tool_id', 'tools', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tools' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tools') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_cards_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_cards', 'tool_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_cards_tool_id_fkey', 'READY_TO_CREATE', 'oracle_cards', 'tool_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_categories_oracle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_categories_oracle_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_categories_oracle_id_fkey', 'EXISTS', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_categories') THEN
        INSERT INTO results VALUES ('oracle_categories_oracle_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_categories' AND column_name = 'oracle_id') THEN
        INSERT INTO results VALUES ('oracle_categories_oracle_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('oracle_decks' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_categories_oracle_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_categories_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_categories' AND column_name = 'oracle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_categories_oracle_id_fkey', 'TYPE_MISMATCH', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oracle_decks' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_decks') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_categories_oracle_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_categories_oracle_id_fkey', 'READY_TO_CREATE', 'oracle_categories', 'oracle_id', 'oracle_decks', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_draws_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_client_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_draws_client_id_fkey', 'EXISTS', 'oracle_draws', 'client_id', 'oracle_clients', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN
        INSERT INTO results VALUES ('oracle_draws_client_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_draws', 'client_id', 'oracle_clients', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('oracle_draws_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_draws', 'client_id', 'oracle_clients', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_clients') 
          AND NOT ('oracle_clients' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_draws_client_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_draws', 'client_id', 'oracle_clients', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_clients' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_draws_client_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_draws', 'client_id', 'oracle_clients', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_clients' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_draws_client_id_fkey', 'TYPE_MISMATCH', 'oracle_draws', 'client_id', 'oracle_clients', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oracle_clients' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_clients') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_draws_client_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_draws', 'client_id', 'oracle_clients', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_draws_client_id_fkey', 'READY_TO_CREATE', 'oracle_draws', 'client_id', 'oracle_clients', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_draws_oracle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_oracle_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_draws_oracle_id_fkey', 'EXISTS', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN
        INSERT INTO results VALUES ('oracle_draws_oracle_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'oracle_id') THEN
        INSERT INTO results VALUES ('oracle_draws_oracle_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('oracle_decks' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_draws_oracle_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_draws_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'oracle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_draws_oracle_id_fkey', 'TYPE_MISMATCH', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oracle_decks' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_decks') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_draws_oracle_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_draws_oracle_id_fkey', 'READY_TO_CREATE', 'oracle_draws', 'oracle_id', 'oracle_decks', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_draws_spread_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_draws_spread_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_draws_spread_id_fkey', 'EXISTS', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_draws') THEN
        INSERT INTO results VALUES ('oracle_draws_spread_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'spread_id') THEN
        INSERT INTO results VALUES ('oracle_draws_spread_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
          AND NOT ('oracle_spreads' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_draws_spread_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_draws_spread_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_draws' AND column_name = 'spread_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_draws_spread_id_fkey', 'TYPE_MISMATCH', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oracle_spreads' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_spreads') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_draws_spread_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_draws_spread_id_fkey', 'READY_TO_CREATE', 'oracle_draws', 'spread_id', 'oracle_spreads', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_spread_positions_spread_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spread_positions_spread_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_spread_positions_spread_id_fkey', 'EXISTS', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions') THEN
        INSERT INTO results VALUES ('oracle_spread_positions_spread_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions' AND column_name = 'spread_id') THEN
        INSERT INTO results VALUES ('oracle_spread_positions_spread_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') 
          AND NOT ('oracle_spreads' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_spread_positions_spread_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_spread_positions_spread_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spread_positions' AND column_name = 'spread_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_spread_positions_spread_id_fkey', 'TYPE_MISMATCH', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oracle_spreads' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_spreads') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_spread_positions_spread_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_spread_positions_spread_id_fkey', 'READY_TO_CREATE', 'oracle_spread_positions', 'spread_id', 'oracle_spreads', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_spreads_oracle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_spreads_oracle_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_spreads_oracle_id_fkey', 'EXISTS', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_spreads') THEN
        INSERT INTO results VALUES ('oracle_spreads_oracle_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'oracle_id') THEN
        INSERT INTO results VALUES ('oracle_spreads_oracle_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_decks') 
          AND NOT ('oracle_decks' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_spreads_oracle_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_spreads_oracle_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_spreads' AND column_name = 'oracle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_decks' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_spreads_oracle_id_fkey', 'TYPE_MISMATCH', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oracle_decks' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oracle_decks') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_spreads_oracle_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_spreads_oracle_id_fkey', 'READY_TO_CREATE', 'oracle_spreads', 'oracle_id', 'oracle_decks', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oracle_usage_stats_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oracle_usage_stats_client_id_fkey') THEN
        INSERT INTO results VALUES ('oracle_usage_stats_client_id_fkey', 'EXISTS', 'oracle_usage_stats', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats') THEN
        INSERT INTO results VALUES ('oracle_usage_stats_client_id_fkey', 'MISSING_SOURCE_TABLE', 'oracle_usage_stats', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('oracle_usage_stats_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'oracle_usage_stats', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oracle_usage_stats_client_id_fkey', 'MISSING_TARGET_TABLE', 'oracle_usage_stats', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oracle_usage_stats_client_id_fkey', 'MISSING_TARGET_COLUMN', 'oracle_usage_stats', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracle_usage_stats' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oracle_usage_stats_client_id_fkey', 'TYPE_MISMATCH', 'oracle_usage_stats', 'client_id', 'clientes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clientes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clientes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oracle_usage_stats_client_id_fkey', 'TARGET_NOT_UNIQUE', 'oracle_usage_stats', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('oracle_usage_stats_client_id_fkey', 'READY_TO_CREATE', 'oracle_usage_stats', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_aplicacoes_pergunta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_aplicacoes_pergunta_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'EXISTS', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes') THEN
        INSERT INTO results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes' AND column_name = 'pergunta_id') THEN
        INSERT INTO results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas') 
          AND NOT ('oraculo_perguntas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_aplicacoes' AND column_name = 'pergunta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'TYPE_MISMATCH', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_perguntas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_perguntas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_aplicacoes_pergunta_id_fkey', 'READY_TO_CREATE', 'oraculo_aplicacoes', 'pergunta_id', 'oraculo_perguntas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_favoritos_pergunta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_favoritos_pergunta_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'EXISTS', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos') THEN
        INSERT INTO results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos' AND column_name = 'pergunta_id') THEN
        INSERT INTO results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas') 
          AND NOT ('oraculo_perguntas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_favoritos' AND column_name = 'pergunta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_perguntas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'TYPE_MISMATCH', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_perguntas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_perguntas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_favoritos_pergunta_id_fkey', 'READY_TO_CREATE', 'oraculo_favoritos', 'pergunta_id', 'oraculo_perguntas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_aplicacoes_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_aplicacoes_portal_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'EXISTS', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes') THEN
        INSERT INTO results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_aplicacoes' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_aplicacoes_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_aplicacoes', 'portal_id', 'oraculo_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_audios_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_audios_portal_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_audios_portal_id_fkey', 'EXISTS', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios') THEN
        INSERT INTO results VALUES ('oraculo_portal_audios_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_audios_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_audios_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_audios_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_audios' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_audios_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_audios_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_audios_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_audios', 'portal_id', 'oraculo_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_essencia_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_essencia_portal_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'EXISTS', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia') THEN
        INSERT INTO results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_essencia' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_essencia_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_essencia', 'portal_id', 'oraculo_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_ferramenta_campos_ferramenta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramenta_campos_ferramenta_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'EXISTS', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos') THEN
        INSERT INTO results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos' AND column_name = 'ferramenta_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas') 
          AND NOT ('oraculo_portal_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramenta_campos' AND column_name = 'ferramenta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portal_ferramentas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portal_ferramentas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_ferramenta_campos_ferramenta_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_ferramenta_campos', 'ferramenta_id', 'oraculo_portal_ferramentas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_ferramentas_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_ferramentas_portal_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'EXISTS', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas') THEN
        INSERT INTO results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_ferramentas' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_ferramentas_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_ferramentas', 'portal_id', 'oraculo_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_forja_erros_forja_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_erros_forja_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'EXISTS', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros') THEN
        INSERT INTO results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros' AND column_name = 'forja_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
          AND NOT ('oraculo_portal_forjas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_erros' AND column_name = 'forja_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portal_forjas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portal_forjas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_forja_erros_forja_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_forja_erros', 'forja_id', 'oraculo_portal_forjas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_forja_passos_forja_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forja_passos_forja_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'EXISTS', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos') THEN
        INSERT INTO results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos' AND column_name = 'forja_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') 
          AND NOT ('oraculo_portal_forjas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forja_passos' AND column_name = 'forja_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portal_forjas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portal_forjas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_forja_passos_forja_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_forja_passos', 'forja_id', 'oraculo_portal_forjas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_forjas_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_forjas_portal_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'EXISTS', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas') THEN
        INSERT INTO results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_forjas' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_forjas_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_forjas', 'portal_id', 'oraculo_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_jardins_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_jardins_portal_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'EXISTS', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins') THEN
        INSERT INTO results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_jardins' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_jardins_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_jardins', 'portal_id', 'oraculo_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_laboratorio_passos_laboratorio_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorio_passos_laboratorio_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'EXISTS', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos') THEN
        INSERT INTO results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos' AND column_name = 'laboratorio_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios') 
          AND NOT ('oraculo_portal_laboratorios' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorio_passos' AND column_name = 'laboratorio_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portal_laboratorios' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portal_laboratorios') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_laboratorio_passos_laboratorio_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_laboratorio_passos', 'laboratorio_id', 'oraculo_portal_laboratorios', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_laboratorios_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_laboratorios_portal_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'EXISTS', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios') THEN
        INSERT INTO results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_laboratorios' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_laboratorios_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_laboratorios', 'portal_id', 'oraculo_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_materiais_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_materiais_portal_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'EXISTS', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais') THEN
        INSERT INTO results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_materiais' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_materiais_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_materiais', 'portal_id', 'oraculo_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'EXISTS', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas') THEN
        INSERT INTO results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas' AND column_name = 'narroterapia_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia') 
          AND NOT ('oraculo_portal_narroterapia' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas' AND column_name = 'narroterapia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portal_narroterapia' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portal_narroterapia') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_narroterapia_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_portal_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'EXISTS', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia') THEN
        INSERT INTO results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_riscos_eticos_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_riscos_eticos_portal_id_fkey') THEN
        INSERT INTO results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'EXISTS', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos') THEN
        INSERT INTO results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('oraculo_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'oraculo_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('oraculo_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portais_jornada_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_jornada_id_fkey') THEN
        INSERT INTO results VALUES ('portais_jornada_id_fkey', 'EXISTS', 'portais', 'jornada_id', 'jornadas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') THEN
        INSERT INTO results VALUES ('portais_jornada_id_fkey', 'MISSING_SOURCE_TABLE', 'portais', 'jornada_id', 'jornadas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'jornada_id') THEN
        INSERT INTO results VALUES ('portais_jornada_id_fkey', 'MISSING_SOURCE_COLUMN', 'portais', 'jornada_id', 'jornadas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornadas') 
          AND NOT ('jornadas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('portais_jornada_id_fkey', 'MISSING_TARGET_TABLE', 'portais', 'jornada_id', 'jornadas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornadas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('portais_jornada_id_fkey', 'MISSING_TARGET_COLUMN', 'portais', 'jornada_id', 'jornadas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'jornada_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornadas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('portais_jornada_id_fkey', 'TYPE_MISMATCH', 'portais', 'jornada_id', 'jornadas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'jornadas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('jornadas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('portais_jornada_id_fkey', 'TARGET_NOT_UNIQUE', 'portais', 'jornada_id', 'jornadas', 'id');
                ELSE
                    INSERT INTO results VALUES ('portais_jornada_id_fkey', 'READY_TO_CREATE', 'portais', 'jornada_id', 'jornadas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portais_modulo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_modulo_id_fkey') THEN
        INSERT INTO results VALUES ('portais_modulo_id_fkey', 'EXISTS', 'portais', 'modulo_id', 'modulos_formativos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') THEN
        INSERT INTO results VALUES ('portais_modulo_id_fkey', 'MISSING_SOURCE_TABLE', 'portais', 'modulo_id', 'modulos_formativos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'modulo_id') THEN
        INSERT INTO results VALUES ('portais_modulo_id_fkey', 'MISSING_SOURCE_COLUMN', 'portais', 'modulo_id', 'modulos_formativos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'modulos_formativos') 
          AND NOT ('modulos_formativos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('portais_modulo_id_fkey', 'MISSING_TARGET_TABLE', 'portais', 'modulo_id', 'modulos_formativos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'modulos_formativos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('portais_modulo_id_fkey', 'MISSING_TARGET_COLUMN', 'portais', 'modulo_id', 'modulos_formativos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'modulo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'modulos_formativos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('portais_modulo_id_fkey', 'TYPE_MISMATCH', 'portais', 'modulo_id', 'modulos_formativos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'modulos_formativos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('modulos_formativos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('portais_modulo_id_fkey', 'TARGET_NOT_UNIQUE', 'portais', 'modulo_id', 'modulos_formativos', 'id');
                ELSE
                    INSERT INTO results VALUES ('portais_modulo_id_fkey', 'READY_TO_CREATE', 'portais', 'modulo_id', 'modulos_formativos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_junguiano_modulos_config_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_modulos_config_id_fkey') THEN
        INSERT INTO results VALUES ('portal_junguiano_modulos_config_id_fkey', 'EXISTS', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos') THEN
        INSERT INTO results VALUES ('portal_junguiano_modulos_config_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'config_id') THEN
        INSERT INTO results VALUES ('portal_junguiano_modulos_config_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config') 
          AND NOT ('portal_junguiano_config' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('portal_junguiano_modulos_config_id_fkey', 'MISSING_TARGET_TABLE', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('portal_junguiano_modulos_config_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'config_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('portal_junguiano_modulos_config_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'portal_junguiano_config' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portal_junguiano_config') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('portal_junguiano_modulos_config_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id');
                ELSE
                    INSERT INTO results VALUES ('portal_junguiano_modulos_config_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_junguiano_portais_modulo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_portais_modulo_id_fkey') THEN
        INSERT INTO results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'EXISTS', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais') THEN
        INSERT INTO results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'modulo_id') THEN
        INSERT INTO results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos') 
          AND NOT ('portal_junguiano_modulos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'MISSING_TARGET_TABLE', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'modulo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'portal_junguiano_modulos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portal_junguiano_modulos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id');
                ELSE
                    INSERT INTO results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_junguiano_progresso_config_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_progresso_config_id_fkey') THEN
        INSERT INTO results VALUES ('portal_junguiano_progresso_config_id_fkey', 'EXISTS', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso') THEN
        INSERT INTO results VALUES ('portal_junguiano_progresso_config_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso' AND column_name = 'config_id') THEN
        INSERT INTO results VALUES ('portal_junguiano_progresso_config_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config') 
          AND NOT ('portal_junguiano_config' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('portal_junguiano_progresso_config_id_fkey', 'MISSING_TARGET_TABLE', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('portal_junguiano_progresso_config_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso' AND column_name = 'config_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('portal_junguiano_progresso_config_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'portal_junguiano_config' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portal_junguiano_config') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('portal_junguiano_progresso_config_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id');
                ELSE
                    INSERT INTO results VALUES ('portal_junguiano_progresso_config_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_junguiano_registros_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_registros_portal_id_fkey') THEN
        INSERT INTO results VALUES ('portal_junguiano_registros_portal_id_fkey', 'EXISTS', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros') THEN
        INSERT INTO results VALUES ('portal_junguiano_registros_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('portal_junguiano_registros_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais') 
          AND NOT ('portal_junguiano_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('portal_junguiano_registros_portal_id_fkey', 'MISSING_TARGET_TABLE', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('portal_junguiano_registros_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('portal_junguiano_registros_portal_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'portal_junguiano_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('portal_junguiano_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('portal_junguiano_registros_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('portal_junguiano_registros_portal_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_progress_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_progress_portal_id_fkey') THEN
        INSERT INTO results VALUES ('portal_progress_portal_id_fkey', 'EXISTS', 'portal_progress', 'portal_id', 'clube_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_progress') THEN
        INSERT INTO results VALUES ('portal_progress_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_progress', 'portal_id', 'clube_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_progress' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('portal_progress_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_progress', 'portal_id', 'clube_portais', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
          AND NOT ('clube_portais' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('portal_progress_portal_id_fkey', 'MISSING_TARGET_TABLE', 'portal_progress', 'portal_id', 'clube_portais', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('portal_progress_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_progress', 'portal_id', 'clube_portais', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_progress' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('portal_progress_portal_id_fkey', 'TYPE_MISMATCH', 'portal_progress', 'portal_id', 'clube_portais', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_portais' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_portais') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('portal_progress_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_progress', 'portal_id', 'clube_portais', 'id');
                ELSE
                    INSERT INTO results VALUES ('portal_progress_portal_id_fkey', 'READY_TO_CREATE', 'portal_progress', 'portal_id', 'clube_portais', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_salas_sala_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_salas_sala_id_fkey') THEN
        INSERT INTO results VALUES ('portal_salas_sala_id_fkey', 'EXISTS', 'portal_salas', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_salas') THEN
        INSERT INTO results VALUES ('portal_salas_sala_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_salas', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_salas' AND column_name = 'sala_id') THEN
        INSERT INTO results VALUES ('portal_salas_sala_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_salas', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('salas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('portal_salas_sala_id_fkey', 'MISSING_TARGET_TABLE', 'portal_salas', 'sala_id', 'salas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('portal_salas_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_salas', 'sala_id', 'salas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_salas' AND column_name = 'sala_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('portal_salas_sala_id_fkey', 'TYPE_MISMATCH', 'portal_salas', 'sala_id', 'salas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'salas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('salas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('portal_salas_sala_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_salas', 'sala_id', 'salas', 'id');
                ELSE
                    INSERT INTO results VALUES ('portal_salas_sala_id_fkey', 'READY_TO_CREATE', 'portal_salas', 'sala_id', 'salas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing post_session_closures_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_case_id_fkey') THEN
        INSERT INTO results VALUES ('post_session_closures_case_id_fkey', 'EXISTS', 'post_session_closures', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') THEN
        INSERT INTO results VALUES ('post_session_closures_case_id_fkey', 'MISSING_SOURCE_TABLE', 'post_session_closures', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('post_session_closures_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'post_session_closures', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('post_session_closures_case_id_fkey', 'MISSING_TARGET_TABLE', 'post_session_closures', 'case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('post_session_closures_case_id_fkey', 'MISSING_TARGET_COLUMN', 'post_session_closures', 'case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('post_session_closures_case_id_fkey', 'TYPE_MISMATCH', 'post_session_closures', 'case_id', 'session_cases', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'session_cases' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('session_cases') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('post_session_closures_case_id_fkey', 'TARGET_NOT_UNIQUE', 'post_session_closures', 'case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('post_session_closures_case_id_fkey', 'READY_TO_CREATE', 'post_session_closures', 'case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

END $$;
SELECT * FROM results;
