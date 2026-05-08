
CREATE TEMP TABLE results (name TEXT, status TEXT, source_table TEXT, source_column TEXT, target_table TEXT, target_column TEXT);
DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN

    -- Analyzing post_session_closures_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_client_id_fkey') THEN
        INSERT INTO results VALUES ('post_session_closures_client_id_fkey', 'EXISTS', 'post_session_closures', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') THEN
        INSERT INTO results VALUES ('post_session_closures_client_id_fkey', 'MISSING_SOURCE_TABLE', 'post_session_closures', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('post_session_closures_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'post_session_closures', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('post_session_closures_client_id_fkey', 'MISSING_TARGET_TABLE', 'post_session_closures', 'client_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('post_session_closures_client_id_fkey', 'MISSING_TARGET_COLUMN', 'post_session_closures', 'client_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('post_session_closures_client_id_fkey', 'TYPE_MISMATCH', 'post_session_closures', 'client_id', 'profiles', 'id');
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
                    INSERT INTO results VALUES ('post_session_closures_client_id_fkey', 'TARGET_NOT_UNIQUE', 'post_session_closures', 'client_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('post_session_closures_client_id_fkey', 'READY_TO_CREATE', 'post_session_closures', 'client_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing post_session_closures_therapist_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_therapist_id_fkey') THEN
        INSERT INTO results VALUES ('post_session_closures_therapist_id_fkey', 'EXISTS', 'post_session_closures', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') THEN
        INSERT INTO results VALUES ('post_session_closures_therapist_id_fkey', 'MISSING_SOURCE_TABLE', 'post_session_closures', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'therapist_id') THEN
        INSERT INTO results VALUES ('post_session_closures_therapist_id_fkey', 'MISSING_SOURCE_COLUMN', 'post_session_closures', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('post_session_closures_therapist_id_fkey', 'MISSING_TARGET_TABLE', 'post_session_closures', 'therapist_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('post_session_closures_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'post_session_closures', 'therapist_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'therapist_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('post_session_closures_therapist_id_fkey', 'TYPE_MISMATCH', 'post_session_closures', 'therapist_id', 'profiles', 'id');
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
                    INSERT INTO results VALUES ('post_session_closures_therapist_id_fkey', 'TARGET_NOT_UNIQUE', 'post_session_closures', 'therapist_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('post_session_closures_therapist_id_fkey', 'READY_TO_CREATE', 'post_session_closures', 'therapist_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing praticas_mudra_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'praticas_mudra_client_id_fkey') THEN
        INSERT INTO results VALUES ('praticas_mudra_client_id_fkey', 'EXISTS', 'praticas_mudra', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'praticas_mudra') THEN
        INSERT INTO results VALUES ('praticas_mudra_client_id_fkey', 'MISSING_SOURCE_TABLE', 'praticas_mudra', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'praticas_mudra' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('praticas_mudra_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'praticas_mudra', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('praticas_mudra_client_id_fkey', 'MISSING_TARGET_TABLE', 'praticas_mudra', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('praticas_mudra_client_id_fkey', 'MISSING_TARGET_COLUMN', 'praticas_mudra', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'praticas_mudra' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('praticas_mudra_client_id_fkey', 'TYPE_MISMATCH', 'praticas_mudra', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('praticas_mudra_client_id_fkey', 'TARGET_NOT_UNIQUE', 'praticas_mudra', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('praticas_mudra_client_id_fkey', 'READY_TO_CREATE', 'praticas_mudra', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing progresso_aluna_formacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progresso_aluna_formacao_id_fkey') THEN
        INSERT INTO results VALUES ('progresso_aluna_formacao_id_fkey', 'EXISTS', 'progresso_aluna', 'formacao_id', 'formacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'progresso_aluna') THEN
        INSERT INTO results VALUES ('progresso_aluna_formacao_id_fkey', 'MISSING_SOURCE_TABLE', 'progresso_aluna', 'formacao_id', 'formacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'formacao_id') THEN
        INSERT INTO results VALUES ('progresso_aluna_formacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'progresso_aluna', 'formacao_id', 'formacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacoes') 
          AND NOT ('formacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('progresso_aluna_formacao_id_fkey', 'MISSING_TARGET_TABLE', 'progresso_aluna', 'formacao_id', 'formacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('progresso_aluna_formacao_id_fkey', 'MISSING_TARGET_COLUMN', 'progresso_aluna', 'formacao_id', 'formacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'formacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('progresso_aluna_formacao_id_fkey', 'TYPE_MISMATCH', 'progresso_aluna', 'formacao_id', 'formacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'formacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('formacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('progresso_aluna_formacao_id_fkey', 'TARGET_NOT_UNIQUE', 'progresso_aluna', 'formacao_id', 'formacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('progresso_aluna_formacao_id_fkey', 'READY_TO_CREATE', 'progresso_aluna', 'formacao_id', 'formacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing progresso_aluna_modulo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progresso_aluna_modulo_id_fkey') THEN
        INSERT INTO results VALUES ('progresso_aluna_modulo_id_fkey', 'EXISTS', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'progresso_aluna') THEN
        INSERT INTO results VALUES ('progresso_aluna_modulo_id_fkey', 'MISSING_SOURCE_TABLE', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'modulo_id') THEN
        INSERT INTO results VALUES ('progresso_aluna_modulo_id_fkey', 'MISSING_SOURCE_COLUMN', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacao_modulos') 
          AND NOT ('formacao_modulos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('progresso_aluna_modulo_id_fkey', 'MISSING_TARGET_TABLE', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('progresso_aluna_modulo_id_fkey', 'MISSING_TARGET_COLUMN', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'modulo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('progresso_aluna_modulo_id_fkey', 'TYPE_MISMATCH', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'formacao_modulos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('formacao_modulos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('progresso_aluna_modulo_id_fkey', 'TARGET_NOT_UNIQUE', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id');
                ELSE
                    INSERT INTO results VALUES ('progresso_aluna_modulo_id_fkey', 'READY_TO_CREATE', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing projetos_mestria_course_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projetos_mestria_course_id_fkey') THEN
        INSERT INTO results VALUES ('projetos_mestria_course_id_fkey', 'EXISTS', 'projetos_mestria', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projetos_mestria') THEN
        INSERT INTO results VALUES ('projetos_mestria_course_id_fkey', 'MISSING_SOURCE_TABLE', 'projetos_mestria', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projetos_mestria' AND column_name = 'course_id') THEN
        INSERT INTO results VALUES ('projetos_mestria_course_id_fkey', 'MISSING_SOURCE_COLUMN', 'projetos_mestria', 'course_id', 'courses', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('courses' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('projetos_mestria_course_id_fkey', 'MISSING_TARGET_TABLE', 'projetos_mestria', 'course_id', 'courses', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('projetos_mestria_course_id_fkey', 'MISSING_TARGET_COLUMN', 'projetos_mestria', 'course_id', 'courses', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projetos_mestria' AND column_name = 'course_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('projetos_mestria_course_id_fkey', 'TYPE_MISMATCH', 'projetos_mestria', 'course_id', 'courses', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'courses' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('courses') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('projetos_mestria_course_id_fkey', 'TARGET_NOT_UNIQUE', 'projetos_mestria', 'course_id', 'courses', 'id');
                ELSE
                    INSERT INTO results VALUES ('projetos_mestria_course_id_fkey', 'READY_TO_CREATE', 'projetos_mestria', 'course_id', 'courses', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing protocolo_oracula_caminho_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_caminho_registro_id_fkey') THEN
        INSERT INTO results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'EXISTS', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        INSERT INTO results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'caminho_registro_id') THEN
        INSERT INTO results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
          AND NOT ('jornada_heroina_registros' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'MISSING_TARGET_TABLE', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'caminho_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id');
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
                    INSERT INTO results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id');
                ELSE
                    INSERT INTO results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing protocolo_oracula_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('protocolo_oracula_cliente_id_fkey', 'EXISTS', 'protocolo_oracula', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        INSERT INTO results VALUES ('protocolo_oracula_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'protocolo_oracula', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('protocolo_oracula_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'protocolo_oracula', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('protocolo_oracula_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'protocolo_oracula', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('protocolo_oracula_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('protocolo_oracula_cliente_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('protocolo_oracula_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'protocolo_oracula', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('protocolo_oracula_cliente_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing protocolo_oracula_mapa_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_mapa_registro_id_fkey') THEN
        INSERT INTO results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'EXISTS', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        INSERT INTO results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'mapa_registro_id') THEN
        INSERT INTO results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros') 
          AND NOT ('big5_symbolic_registros' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'MISSING_TARGET_TABLE', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'mapa_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'big5_symbolic_registros' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('big5_symbolic_registros') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id');
                ELSE
                    INSERT INTO results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing protocolo_oracula_oraculo_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_oraculo_registro_id_fkey') THEN
        INSERT INTO results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'EXISTS', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        INSERT INTO results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'oraculo_registro_id') THEN
        INSERT INTO results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros') 
          AND NOT ('eneagrama_feminino_registros' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'MISSING_TARGET_TABLE', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'oraculo_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'eneagrama_feminino_registros' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('eneagrama_feminino_registros') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id');
                ELSE
                    INSERT INTO results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing protocolo_oracula_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_session_case_id_fkey') THEN
        INSERT INTO results VALUES ('protocolo_oracula_session_case_id_fkey', 'EXISTS', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        INSERT INTO results VALUES ('protocolo_oracula_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'session_case_id') THEN
        INSERT INTO results VALUES ('protocolo_oracula_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('protocolo_oracula_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('protocolo_oracula_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('protocolo_oracula_session_case_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id');
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
                    INSERT INTO results VALUES ('protocolo_oracula_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('protocolo_oracula_session_case_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_opcoes_pergunta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_opcoes_pergunta_id_fkey') THEN
        INSERT INTO results VALUES ('quiz_opcoes_pergunta_id_fkey', 'EXISTS', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_opcoes') THEN
        INSERT INTO results VALUES ('quiz_opcoes_pergunta_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_opcoes' AND column_name = 'pergunta_id') THEN
        INSERT INTO results VALUES ('quiz_opcoes_pergunta_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_perguntas') 
          AND NOT ('quiz_perguntas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('quiz_opcoes_pergunta_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('quiz_opcoes_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_opcoes' AND column_name = 'pergunta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('quiz_opcoes_pergunta_id_fkey', 'TYPE_MISMATCH', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'quiz_perguntas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('quiz_perguntas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('quiz_opcoes_pergunta_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id');
                ELSE
                    INSERT INTO results VALUES ('quiz_opcoes_pergunta_id_fkey', 'READY_TO_CREATE', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_perguntas_quiz_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_perguntas_quiz_id_fkey') THEN
        INSERT INTO results VALUES ('quiz_perguntas_quiz_id_fkey', 'EXISTS', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_perguntas') THEN
        INSERT INTO results VALUES ('quiz_perguntas_quiz_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'quiz_id') THEN
        INSERT INTO results VALUES ('quiz_perguntas_quiz_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('quizzes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('quiz_perguntas_quiz_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('quiz_perguntas_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'quiz_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('quiz_perguntas_quiz_id_fkey', 'TYPE_MISMATCH', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'quizzes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('quizzes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('quiz_perguntas_quiz_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id');
                ELSE
                    INSERT INTO results VALUES ('quiz_perguntas_quiz_id_fkey', 'READY_TO_CREATE', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_respostas_usuario_quiz_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_quiz_id_fkey') THEN
        INSERT INTO results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'EXISTS', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario') THEN
        INSERT INTO results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'quiz_id') THEN
        INSERT INTO results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('quizzes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'quiz_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'TYPE_MISMATCH', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'quizzes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('quizzes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id');
                ELSE
                    INSERT INTO results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'READY_TO_CREATE', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_respostas_usuario_resultado_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_resultado_id_fkey') THEN
        INSERT INTO results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'EXISTS', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario') THEN
        INSERT INTO results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'resultado_id') THEN
        INSERT INTO results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') 
          AND NOT ('quiz_resultados' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'resultado_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'TYPE_MISMATCH', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'quiz_resultados' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('quiz_resultados') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id');
                ELSE
                    INSERT INTO results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'READY_TO_CREATE', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_resultados_agente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_agente_id_fkey') THEN
        INSERT INTO results VALUES ('quiz_resultados_agente_id_fkey', 'EXISTS', 'quiz_resultados', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') THEN
        INSERT INTO results VALUES ('quiz_resultados_agente_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_resultados', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'agente_id') THEN
        INSERT INTO results VALUES ('quiz_resultados_agente_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_resultados', 'agente_id', 'agentes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
          AND NOT ('agentes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('quiz_resultados_agente_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_resultados', 'agente_id', 'agentes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('quiz_resultados_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_resultados', 'agente_id', 'agentes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'agente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('quiz_resultados_agente_id_fkey', 'TYPE_MISMATCH', 'quiz_resultados', 'agente_id', 'agentes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'agentes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('agentes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('quiz_resultados_agente_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_resultados', 'agente_id', 'agentes', 'id');
                ELSE
                    INSERT INTO results VALUES ('quiz_resultados_agente_id_fkey', 'READY_TO_CREATE', 'quiz_resultados', 'agente_id', 'agentes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_resultados_quiz_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_quiz_id_fkey') THEN
        INSERT INTO results VALUES ('quiz_resultados_quiz_id_fkey', 'EXISTS', 'quiz_resultados', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') THEN
        INSERT INTO results VALUES ('quiz_resultados_quiz_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_resultados', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'quiz_id') THEN
        INSERT INTO results VALUES ('quiz_resultados_quiz_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_resultados', 'quiz_id', 'quizzes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('quizzes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('quiz_resultados_quiz_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_resultados', 'quiz_id', 'quizzes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('quiz_resultados_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_resultados', 'quiz_id', 'quizzes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'quiz_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('quiz_resultados_quiz_id_fkey', 'TYPE_MISMATCH', 'quiz_resultados', 'quiz_id', 'quizzes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'quizzes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('quizzes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('quiz_resultados_quiz_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_resultados', 'quiz_id', 'quizzes', 'id');
                ELSE
                    INSERT INTO results VALUES ('quiz_resultados_quiz_id_fkey', 'READY_TO_CREATE', 'quiz_resultados', 'quiz_id', 'quizzes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quizzes_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_portal_id_fkey') THEN
        INSERT INTO results VALUES ('quizzes_portal_id_fkey', 'EXISTS', 'quizzes', 'portal_id', 'conteudo_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') THEN
        INSERT INTO results VALUES ('quizzes_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'quizzes', 'portal_id', 'conteudo_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('quizzes_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'quizzes', 'portal_id', 'conteudo_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
          AND NOT ('conteudo_travessias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('quizzes_portal_id_fkey', 'MISSING_TARGET_TABLE', 'quizzes', 'portal_id', 'conteudo_travessias', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('quizzes_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'quizzes', 'portal_id', 'conteudo_travessias', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('quizzes_portal_id_fkey', 'TYPE_MISMATCH', 'quizzes', 'portal_id', 'conteudo_travessias', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'conteudo_travessias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('conteudo_travessias') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('quizzes_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'quizzes', 'portal_id', 'conteudo_travessias', 'id');
                ELSE
                    INSERT INTO results VALUES ('quizzes_portal_id_fkey', 'READY_TO_CREATE', 'quizzes', 'portal_id', 'conteudo_travessias', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quizzes_sala_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_sala_id_fkey') THEN
        INSERT INTO results VALUES ('quizzes_sala_id_fkey', 'EXISTS', 'quizzes', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') THEN
        INSERT INTO results VALUES ('quizzes_sala_id_fkey', 'MISSING_SOURCE_TABLE', 'quizzes', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'sala_id') THEN
        INSERT INTO results VALUES ('quizzes_sala_id_fkey', 'MISSING_SOURCE_COLUMN', 'quizzes', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('salas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('quizzes_sala_id_fkey', 'MISSING_TARGET_TABLE', 'quizzes', 'sala_id', 'salas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('quizzes_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'quizzes', 'sala_id', 'salas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'sala_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('quizzes_sala_id_fkey', 'TYPE_MISMATCH', 'quizzes', 'sala_id', 'salas', 'id');
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
                    INSERT INTO results VALUES ('quizzes_sala_id_fkey', 'TARGET_NOT_UNIQUE', 'quizzes', 'sala_id', 'salas', 'id');
                ELSE
                    INSERT INTO results VALUES ('quizzes_sala_id_fkey', 'READY_TO_CREATE', 'quizzes', 'sala_id', 'salas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing reflexoes_jornada_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reflexoes_jornada_client_id_fkey') THEN
        INSERT INTO results VALUES ('reflexoes_jornada_client_id_fkey', 'EXISTS', 'reflexoes_jornada', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada') THEN
        INSERT INTO results VALUES ('reflexoes_jornada_client_id_fkey', 'MISSING_SOURCE_TABLE', 'reflexoes_jornada', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('reflexoes_jornada_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'reflexoes_jornada', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('reflexoes_jornada_client_id_fkey', 'MISSING_TARGET_TABLE', 'reflexoes_jornada', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('reflexoes_jornada_client_id_fkey', 'MISSING_TARGET_COLUMN', 'reflexoes_jornada', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('reflexoes_jornada_client_id_fkey', 'TYPE_MISMATCH', 'reflexoes_jornada', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('reflexoes_jornada_client_id_fkey', 'TARGET_NOT_UNIQUE', 'reflexoes_jornada', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('reflexoes_jornada_client_id_fkey', 'READY_TO_CREATE', 'reflexoes_jornada', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing relacionamentos_espelho_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'relacionamentos_espelho_client_id_fkey') THEN
        INSERT INTO results VALUES ('relacionamentos_espelho_client_id_fkey', 'EXISTS', 'relacionamentos_espelho', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho') THEN
        INSERT INTO results VALUES ('relacionamentos_espelho_client_id_fkey', 'MISSING_SOURCE_TABLE', 'relacionamentos_espelho', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('relacionamentos_espelho_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'relacionamentos_espelho', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('relacionamentos_espelho_client_id_fkey', 'MISSING_TARGET_TABLE', 'relacionamentos_espelho', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('relacionamentos_espelho_client_id_fkey', 'MISSING_TARGET_COLUMN', 'relacionamentos_espelho', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('relacionamentos_espelho_client_id_fkey', 'TYPE_MISMATCH', 'relacionamentos_espelho', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('relacionamentos_espelho_client_id_fkey', 'TARGET_NOT_UNIQUE', 'relacionamentos_espelho', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('relacionamentos_espelho_client_id_fkey', 'READY_TO_CREATE', 'relacionamentos_espelho', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing respostas_exercicios_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'respostas_exercicios_sessao_id_fkey') THEN
        INSERT INTO results VALUES ('respostas_exercicios_sessao_id_fkey', 'EXISTS', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'respostas_exercicios') THEN
        INSERT INTO results VALUES ('respostas_exercicios_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'respostas_exercicios' AND column_name = 'sessao_id') THEN
        INSERT INTO results VALUES ('respostas_exercicios_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto') 
          AND NOT ('sessoes_labirinto' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('respostas_exercicios_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('respostas_exercicios_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'respostas_exercicios' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('respostas_exercicios_sessao_id_fkey', 'TYPE_MISMATCH', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sessoes_labirinto' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sessoes_labirinto') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('respostas_exercicios_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id');
                ELSE
                    INSERT INTO results VALUES ('respostas_exercicios_sessao_id_fkey', 'READY_TO_CREATE', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing rituais_integracao_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rituais_integracao_client_id_fkey') THEN
        INSERT INTO results VALUES ('rituais_integracao_client_id_fkey', 'EXISTS', 'rituais_integracao', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_integracao') THEN
        INSERT INTO results VALUES ('rituais_integracao_client_id_fkey', 'MISSING_SOURCE_TABLE', 'rituais_integracao', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_integracao' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('rituais_integracao_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'rituais_integracao', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('rituais_integracao_client_id_fkey', 'MISSING_TARGET_TABLE', 'rituais_integracao', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('rituais_integracao_client_id_fkey', 'MISSING_TARGET_COLUMN', 'rituais_integracao', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_integracao' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('rituais_integracao_client_id_fkey', 'TYPE_MISMATCH', 'rituais_integracao', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('rituais_integracao_client_id_fkey', 'TARGET_NOT_UNIQUE', 'rituais_integracao', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('rituais_integracao_client_id_fkey', 'READY_TO_CREATE', 'rituais_integracao', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ritual_passages_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ritual_passages_ritual_id_fkey') THEN
        INSERT INTO results VALUES ('ritual_passages_ritual_id_fkey', 'EXISTS', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ritual_passages') THEN
        INSERT INTO results VALUES ('ritual_passages_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_passages' AND column_name = 'ritual_id') THEN
        INSERT INTO results VALUES ('ritual_passages_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ritual_definitions') 
          AND NOT ('ritual_definitions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('ritual_passages_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_definitions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('ritual_passages_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_passages' AND column_name = 'ritual_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_definitions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('ritual_passages_ritual_id_fkey', 'TYPE_MISMATCH', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'ritual_definitions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('ritual_definitions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('ritual_passages_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id');
                ELSE
                    INSERT INTO results VALUES ('ritual_passages_ritual_id_fkey', 'READY_TO_CREATE', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sala_ferramentas_familia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_familia_id_fkey') THEN
        INSERT INTO results VALUES ('sala_ferramentas_familia_id_fkey', 'EXISTS', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        INSERT INTO results VALUES ('sala_ferramentas_familia_id_fkey', 'MISSING_SOURCE_TABLE', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'familia_id') THEN
        INSERT INTO results VALUES ('sala_ferramentas_familia_id_fkey', 'MISSING_SOURCE_COLUMN', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_familias') 
          AND NOT ('travessia_familias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sala_ferramentas_familia_id_fkey', 'MISSING_TARGET_TABLE', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sala_ferramentas_familia_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'familia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sala_ferramentas_familia_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'travessia_familias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('travessia_familias') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('sala_ferramentas_familia_id_fkey', 'TARGET_NOT_UNIQUE', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id');
                ELSE
                    INSERT INTO results VALUES ('sala_ferramentas_familia_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sala_ferramentas_ferramenta_pai_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_ferramenta_pai_id_fkey') THEN
        INSERT INTO results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'EXISTS', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        INSERT INTO results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'MISSING_SOURCE_TABLE', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'ferramenta_pai_id') THEN
        INSERT INTO results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'MISSING_SOURCE_COLUMN', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('sala_ferramentas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'MISSING_TARGET_TABLE', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'ferramenta_pai_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'sala_ferramentas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('sala_ferramentas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'TARGET_NOT_UNIQUE', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id');
                ELSE
                    INSERT INTO results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sala_ferramentas_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_portal_id_fkey') THEN
        INSERT INTO results VALUES ('sala_ferramentas_portal_id_fkey', 'EXISTS', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        INSERT INTO results VALUES ('sala_ferramentas_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'portal_id') THEN
        INSERT INTO results VALUES ('sala_ferramentas_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
          AND NOT ('conteudo_travessias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sala_ferramentas_portal_id_fkey', 'MISSING_TARGET_TABLE', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sala_ferramentas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sala_ferramentas_portal_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'conteudo_travessias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('conteudo_travessias') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('sala_ferramentas_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id');
                ELSE
                    INSERT INTO results VALUES ('sala_ferramentas_portal_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sala_ferramentas_sala_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_sala_id_fkey') THEN
        INSERT INTO results VALUES ('sala_ferramentas_sala_id_fkey', 'EXISTS', 'sala_ferramentas', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        INSERT INTO results VALUES ('sala_ferramentas_sala_id_fkey', 'MISSING_SOURCE_TABLE', 'sala_ferramentas', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'sala_id') THEN
        INSERT INTO results VALUES ('sala_ferramentas_sala_id_fkey', 'MISSING_SOURCE_COLUMN', 'sala_ferramentas', 'sala_id', 'salas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('salas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sala_ferramentas_sala_id_fkey', 'MISSING_TARGET_TABLE', 'sala_ferramentas', 'sala_id', 'salas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sala_ferramentas_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'sala_id', 'salas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'sala_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sala_ferramentas_sala_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'sala_id', 'salas', 'id');
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
                    INSERT INTO results VALUES ('sala_ferramentas_sala_id_fkey', 'TARGET_NOT_UNIQUE', 'sala_ferramentas', 'sala_id', 'salas', 'id');
                ELSE
                    INSERT INTO results VALUES ('sala_ferramentas_sala_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'sala_id', 'salas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing season_books_season_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_books_season_id_fkey') THEN
        INSERT INTO results VALUES ('season_books_season_id_fkey', 'EXISTS', 'season_books', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'season_books') THEN
        INSERT INTO results VALUES ('season_books_season_id_fkey', 'MISSING_SOURCE_TABLE', 'season_books', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_books' AND column_name = 'season_id') THEN
        INSERT INTO results VALUES ('season_books_season_id_fkey', 'MISSING_SOURCE_COLUMN', 'season_books', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('season_books_season_id_fkey', 'MISSING_TARGET_TABLE', 'season_books', 'season_id', 'oracular_seasons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('season_books_season_id_fkey', 'MISSING_TARGET_COLUMN', 'season_books', 'season_id', 'oracular_seasons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_books' AND column_name = 'season_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('season_books_season_id_fkey', 'TYPE_MISMATCH', 'season_books', 'season_id', 'oracular_seasons', 'id');
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
                    INSERT INTO results VALUES ('season_books_season_id_fkey', 'TARGET_NOT_UNIQUE', 'season_books', 'season_id', 'oracular_seasons', 'id');
                ELSE
                    INSERT INTO results VALUES ('season_books_season_id_fkey', 'READY_TO_CREATE', 'season_books', 'season_id', 'oracular_seasons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing season_labs_season_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_labs_season_id_fkey') THEN
        INSERT INTO results VALUES ('season_labs_season_id_fkey', 'EXISTS', 'season_labs', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'season_labs') THEN
        INSERT INTO results VALUES ('season_labs_season_id_fkey', 'MISSING_SOURCE_TABLE', 'season_labs', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_labs' AND column_name = 'season_id') THEN
        INSERT INTO results VALUES ('season_labs_season_id_fkey', 'MISSING_SOURCE_COLUMN', 'season_labs', 'season_id', 'oracular_seasons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('oracular_seasons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('season_labs_season_id_fkey', 'MISSING_TARGET_TABLE', 'season_labs', 'season_id', 'oracular_seasons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('season_labs_season_id_fkey', 'MISSING_TARGET_COLUMN', 'season_labs', 'season_id', 'oracular_seasons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_labs' AND column_name = 'season_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('season_labs_season_id_fkey', 'TYPE_MISMATCH', 'season_labs', 'season_id', 'oracular_seasons', 'id');
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
                    INSERT INTO results VALUES ('season_labs_season_id_fkey', 'TARGET_NOT_UNIQUE', 'season_labs', 'season_id', 'oracular_seasons', 'id');
                ELSE
                    INSERT INTO results VALUES ('season_labs_season_id_fkey', 'READY_TO_CREATE', 'season_labs', 'season_id', 'oracular_seasons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_archetypes_archetype_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_archetype_id_fkey') THEN
        INSERT INTO results VALUES ('session_archetypes_archetype_id_fkey', 'EXISTS', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') THEN
        INSERT INTO results VALUES ('session_archetypes_archetype_id_fkey', 'MISSING_SOURCE_TABLE', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'archetype_id') THEN
        INSERT INTO results VALUES ('session_archetypes_archetype_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos') 
          AND NOT ('atlas_arquetipos_femininos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_archetypes_archetype_id_fkey', 'MISSING_TARGET_TABLE', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_archetypes_archetype_id_fkey', 'MISSING_TARGET_COLUMN', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'archetype_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_archetypes_archetype_id_fkey', 'TYPE_MISMATCH', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'atlas_arquetipos_femininos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('atlas_arquetipos_femininos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('session_archetypes_archetype_id_fkey', 'TARGET_NOT_UNIQUE', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_archetypes_archetype_id_fkey', 'READY_TO_CREATE', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_archetypes_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_client_id_fkey') THEN
        INSERT INTO results VALUES ('session_archetypes_client_id_fkey', 'EXISTS', 'session_archetypes', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') THEN
        INSERT INTO results VALUES ('session_archetypes_client_id_fkey', 'MISSING_SOURCE_TABLE', 'session_archetypes', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('session_archetypes_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_archetypes', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_archetypes_client_id_fkey', 'MISSING_TARGET_TABLE', 'session_archetypes', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_archetypes_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_archetypes', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_archetypes_client_id_fkey', 'TYPE_MISMATCH', 'session_archetypes', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('session_archetypes_client_id_fkey', 'TARGET_NOT_UNIQUE', 'session_archetypes', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_archetypes_client_id_fkey', 'READY_TO_CREATE', 'session_archetypes', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_archetypes_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_session_id_fkey') THEN
        INSERT INTO results VALUES ('session_archetypes_session_id_fkey', 'EXISTS', 'session_archetypes', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') THEN
        INSERT INTO results VALUES ('session_archetypes_session_id_fkey', 'MISSING_SOURCE_TABLE', 'session_archetypes', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('session_archetypes_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_archetypes', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_archetypes_session_id_fkey', 'MISSING_TARGET_TABLE', 'session_archetypes', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_archetypes_session_id_fkey', 'MISSING_TARGET_COLUMN', 'session_archetypes', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_archetypes_session_id_fkey', 'TYPE_MISMATCH', 'session_archetypes', 'session_id', 'sessions', 'id');
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
                    INSERT INTO results VALUES ('session_archetypes_session_id_fkey', 'TARGET_NOT_UNIQUE', 'session_archetypes', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_archetypes_session_id_fkey', 'READY_TO_CREATE', 'session_archetypes', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_cases_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_client_id_fkey') THEN
        INSERT INTO results VALUES ('session_cases_client_id_fkey', 'EXISTS', 'session_cases', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') THEN
        INSERT INTO results VALUES ('session_cases_client_id_fkey', 'MISSING_SOURCE_TABLE', 'session_cases', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('session_cases_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_cases', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_cases_client_id_fkey', 'MISSING_TARGET_TABLE', 'session_cases', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_cases_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_cases', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_cases_client_id_fkey', 'TYPE_MISMATCH', 'session_cases', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('session_cases_client_id_fkey', 'TARGET_NOT_UNIQUE', 'session_cases', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_cases_client_id_fkey', 'READY_TO_CREATE', 'session_cases', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_cases_therapist_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_therapist_id_fkey') THEN
        INSERT INTO results VALUES ('session_cases_therapist_id_fkey', 'EXISTS', 'session_cases', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') THEN
        INSERT INTO results VALUES ('session_cases_therapist_id_fkey', 'MISSING_SOURCE_TABLE', 'session_cases', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'therapist_id') THEN
        INSERT INTO results VALUES ('session_cases_therapist_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_cases', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_cases_therapist_id_fkey', 'MISSING_TARGET_TABLE', 'session_cases', 'therapist_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_cases_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'session_cases', 'therapist_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'therapist_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_cases_therapist_id_fkey', 'TYPE_MISMATCH', 'session_cases', 'therapist_id', 'profiles', 'id');
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
                    INSERT INTO results VALUES ('session_cases_therapist_id_fkey', 'TARGET_NOT_UNIQUE', 'session_cases', 'therapist_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_cases_therapist_id_fkey', 'READY_TO_CREATE', 'session_cases', 'therapist_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_interventions_intervention_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_intervention_id_fkey') THEN
        INSERT INTO results VALUES ('session_interventions_intervention_id_fkey', 'EXISTS', 'session_interventions', 'intervention_id', 'interventions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_interventions') THEN
        INSERT INTO results VALUES ('session_interventions_intervention_id_fkey', 'MISSING_SOURCE_TABLE', 'session_interventions', 'intervention_id', 'interventions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'intervention_id') THEN
        INSERT INTO results VALUES ('session_interventions_intervention_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_interventions', 'intervention_id', 'interventions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') 
          AND NOT ('interventions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_interventions_intervention_id_fkey', 'MISSING_TARGET_TABLE', 'session_interventions', 'intervention_id', 'interventions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_interventions_intervention_id_fkey', 'MISSING_TARGET_COLUMN', 'session_interventions', 'intervention_id', 'interventions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'intervention_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_interventions_intervention_id_fkey', 'TYPE_MISMATCH', 'session_interventions', 'intervention_id', 'interventions', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'interventions' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('interventions') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('session_interventions_intervention_id_fkey', 'TARGET_NOT_UNIQUE', 'session_interventions', 'intervention_id', 'interventions', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_interventions_intervention_id_fkey', 'READY_TO_CREATE', 'session_interventions', 'intervention_id', 'interventions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_interventions_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_session_id_fkey') THEN
        INSERT INTO results VALUES ('session_interventions_session_id_fkey', 'EXISTS', 'session_interventions', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_interventions') THEN
        INSERT INTO results VALUES ('session_interventions_session_id_fkey', 'MISSING_SOURCE_TABLE', 'session_interventions', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('session_interventions_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_interventions', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_interventions_session_id_fkey', 'MISSING_TARGET_TABLE', 'session_interventions', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_interventions_session_id_fkey', 'MISSING_TARGET_COLUMN', 'session_interventions', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_interventions_session_id_fkey', 'TYPE_MISMATCH', 'session_interventions', 'session_id', 'sessions', 'id');
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
                    INSERT INTO results VALUES ('session_interventions_session_id_fkey', 'TARGET_NOT_UNIQUE', 'session_interventions', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_interventions_session_id_fkey', 'READY_TO_CREATE', 'session_interventions', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_oracle_draws_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_case_id_fkey') THEN
        INSERT INTO results VALUES ('session_oracle_draws_case_id_fkey', 'EXISTS', 'session_oracle_draws', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') THEN
        INSERT INTO results VALUES ('session_oracle_draws_case_id_fkey', 'MISSING_SOURCE_TABLE', 'session_oracle_draws', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('session_oracle_draws_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_oracle_draws', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_oracle_draws_case_id_fkey', 'MISSING_TARGET_TABLE', 'session_oracle_draws', 'case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_oracle_draws_case_id_fkey', 'MISSING_TARGET_COLUMN', 'session_oracle_draws', 'case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_oracle_draws_case_id_fkey', 'TYPE_MISMATCH', 'session_oracle_draws', 'case_id', 'session_cases', 'id');
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
                    INSERT INTO results VALUES ('session_oracle_draws_case_id_fkey', 'TARGET_NOT_UNIQUE', 'session_oracle_draws', 'case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_oracle_draws_case_id_fkey', 'READY_TO_CREATE', 'session_oracle_draws', 'case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_oracle_draws_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_client_id_fkey') THEN
        INSERT INTO results VALUES ('session_oracle_draws_client_id_fkey', 'EXISTS', 'session_oracle_draws', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') THEN
        INSERT INTO results VALUES ('session_oracle_draws_client_id_fkey', 'MISSING_SOURCE_TABLE', 'session_oracle_draws', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('session_oracle_draws_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_oracle_draws', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_oracle_draws_client_id_fkey', 'MISSING_TARGET_TABLE', 'session_oracle_draws', 'client_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_oracle_draws_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_oracle_draws', 'client_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_oracle_draws_client_id_fkey', 'TYPE_MISMATCH', 'session_oracle_draws', 'client_id', 'profiles', 'id');
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
                    INSERT INTO results VALUES ('session_oracle_draws_client_id_fkey', 'TARGET_NOT_UNIQUE', 'session_oracle_draws', 'client_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_oracle_draws_client_id_fkey', 'READY_TO_CREATE', 'session_oracle_draws', 'client_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_oracle_draws_therapist_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_therapist_id_fkey') THEN
        INSERT INTO results VALUES ('session_oracle_draws_therapist_id_fkey', 'EXISTS', 'session_oracle_draws', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') THEN
        INSERT INTO results VALUES ('session_oracle_draws_therapist_id_fkey', 'MISSING_SOURCE_TABLE', 'session_oracle_draws', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'therapist_id') THEN
        INSERT INTO results VALUES ('session_oracle_draws_therapist_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_oracle_draws', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_oracle_draws_therapist_id_fkey', 'MISSING_TARGET_TABLE', 'session_oracle_draws', 'therapist_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_oracle_draws_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'session_oracle_draws', 'therapist_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'therapist_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_oracle_draws_therapist_id_fkey', 'TYPE_MISMATCH', 'session_oracle_draws', 'therapist_id', 'profiles', 'id');
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
                    INSERT INTO results VALUES ('session_oracle_draws_therapist_id_fkey', 'TARGET_NOT_UNIQUE', 'session_oracle_draws', 'therapist_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_oracle_draws_therapist_id_fkey', 'READY_TO_CREATE', 'session_oracle_draws', 'therapist_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_scripts_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_case_id_fkey') THEN
        INSERT INTO results VALUES ('session_scripts_case_id_fkey', 'EXISTS', 'session_scripts', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        INSERT INTO results VALUES ('session_scripts_case_id_fkey', 'MISSING_SOURCE_TABLE', 'session_scripts', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('session_scripts_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_scripts', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_scripts_case_id_fkey', 'MISSING_TARGET_TABLE', 'session_scripts', 'case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_scripts_case_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_scripts_case_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'case_id', 'session_cases', 'id');
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
                    INSERT INTO results VALUES ('session_scripts_case_id_fkey', 'TARGET_NOT_UNIQUE', 'session_scripts', 'case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_scripts_case_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_scripts_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_client_id_fkey') THEN
        INSERT INTO results VALUES ('session_scripts_client_id_fkey', 'EXISTS', 'session_scripts', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        INSERT INTO results VALUES ('session_scripts_client_id_fkey', 'MISSING_SOURCE_TABLE', 'session_scripts', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('session_scripts_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_scripts', 'client_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_scripts_client_id_fkey', 'MISSING_TARGET_TABLE', 'session_scripts', 'client_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_scripts_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'client_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_scripts_client_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'client_id', 'profiles', 'id');
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
                    INSERT INTO results VALUES ('session_scripts_client_id_fkey', 'TARGET_NOT_UNIQUE', 'session_scripts', 'client_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_scripts_client_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'client_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_scripts_narrative_map_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_narrative_map_id_fkey') THEN
        INSERT INTO results VALUES ('session_scripts_narrative_map_id_fkey', 'EXISTS', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        INSERT INTO results VALUES ('session_scripts_narrative_map_id_fkey', 'MISSING_SOURCE_TABLE', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'narrative_map_id') THEN
        INSERT INTO results VALUES ('session_scripts_narrative_map_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') 
          AND NOT ('narrative_maps' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_scripts_narrative_map_id_fkey', 'MISSING_TARGET_TABLE', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_scripts_narrative_map_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'narrative_map_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_scripts_narrative_map_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'narrative_maps' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('narrative_maps') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('session_scripts_narrative_map_id_fkey', 'TARGET_NOT_UNIQUE', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_scripts_narrative_map_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_scripts_therapist_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_therapist_id_fkey') THEN
        INSERT INTO results VALUES ('session_scripts_therapist_id_fkey', 'EXISTS', 'session_scripts', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        INSERT INTO results VALUES ('session_scripts_therapist_id_fkey', 'MISSING_SOURCE_TABLE', 'session_scripts', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'therapist_id') THEN
        INSERT INTO results VALUES ('session_scripts_therapist_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_scripts', 'therapist_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('session_scripts_therapist_id_fkey', 'MISSING_TARGET_TABLE', 'session_scripts', 'therapist_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('session_scripts_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'therapist_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'therapist_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('session_scripts_therapist_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'therapist_id', 'profiles', 'id');
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
                    INSERT INTO results VALUES ('session_scripts_therapist_id_fkey', 'TARGET_NOT_UNIQUE', 'session_scripts', 'therapist_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('session_scripts_therapist_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'therapist_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessions_cidadela_card_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_cidadela_card_id_fkey') THEN
        INSERT INTO results VALUES ('sessions_cidadela_card_id_fkey', 'EXISTS', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        INSERT INTO results VALUES ('sessions_cidadela_card_id_fkey', 'MISSING_SOURCE_TABLE', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'cidadela_card_id') THEN
        INSERT INTO results VALUES ('sessions_cidadela_card_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') 
          AND NOT ('cidadela_oracle_cards' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sessions_cidadela_card_id_fkey', 'MISSING_TARGET_TABLE', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sessions_cidadela_card_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'cidadela_card_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sessions_cidadela_card_id_fkey', 'TYPE_MISMATCH', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'cidadela_oracle_cards' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('cidadela_oracle_cards') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('sessions_cidadela_card_id_fkey', 'TARGET_NOT_UNIQUE', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id');
                ELSE
                    INSERT INTO results VALUES ('sessions_cidadela_card_id_fkey', 'READY_TO_CREATE', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessions_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_client_id_fkey') THEN
        INSERT INTO results VALUES ('sessions_client_id_fkey', 'EXISTS', 'sessions', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        INSERT INTO results VALUES ('sessions_client_id_fkey', 'MISSING_SOURCE_TABLE', 'sessions', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('sessions_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessions', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sessions_client_id_fkey', 'MISSING_TARGET_TABLE', 'sessions', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sessions_client_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sessions_client_id_fkey', 'TYPE_MISMATCH', 'sessions', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('sessions_client_id_fkey', 'TARGET_NOT_UNIQUE', 'sessions', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('sessions_client_id_fkey', 'READY_TO_CREATE', 'sessions', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessions_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_district_id_fkey') THEN
        INSERT INTO results VALUES ('sessions_district_id_fkey', 'EXISTS', 'sessions', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        INSERT INTO results VALUES ('sessions_district_id_fkey', 'MISSING_SOURCE_TABLE', 'sessions', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'district_id') THEN
        INSERT INTO results VALUES ('sessions_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessions', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sessions_district_id_fkey', 'MISSING_TARGET_TABLE', 'sessions', 'district_id', 'districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sessions_district_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'district_id', 'districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sessions_district_id_fkey', 'TYPE_MISMATCH', 'sessions', 'district_id', 'districts', 'id');
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
                    INSERT INTO results VALUES ('sessions_district_id_fkey', 'TARGET_NOT_UNIQUE', 'sessions', 'district_id', 'districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('sessions_district_id_fkey', 'READY_TO_CREATE', 'sessions', 'district_id', 'districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessions_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_tool_id_fkey') THEN
        INSERT INTO results VALUES ('sessions_tool_id_fkey', 'EXISTS', 'sessions', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        INSERT INTO results VALUES ('sessions_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'sessions', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'tool_id') THEN
        INSERT INTO results VALUES ('sessions_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessions', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sessions_tool_id_fkey', 'MISSING_TARGET_TABLE', 'sessions', 'tool_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sessions_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'tool_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sessions_tool_id_fkey', 'TYPE_MISMATCH', 'sessions', 'tool_id', 'tools', 'id');
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
                    INSERT INTO results VALUES ('sessions_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'sessions', 'tool_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('sessions_tool_id_fkey', 'READY_TO_CREATE', 'sessions', 'tool_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessoes_casa_maquinas_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_casa_maquinas_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'EXISTS', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') THEN
        INSERT INTO results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'TYPE_MISMATCH', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'READY_TO_CREATE', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessoes_labirinto_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_labirinto_porta_id_fkey') THEN
        INSERT INTO results VALUES ('sessoes_labirinto_porta_id_fkey', 'EXISTS', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto') THEN
        INSERT INTO results VALUES ('sessoes_labirinto_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'porta_id') THEN
        INSERT INTO results VALUES ('sessoes_labirinto_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('labirinto_fases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sessoes_labirinto_porta_id_fkey', 'MISSING_TARGET_TABLE', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sessoes_labirinto_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sessoes_labirinto_porta_id_fkey', 'TYPE_MISMATCH', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id');
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
                    INSERT INTO results VALUES ('sessoes_labirinto_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id');
                ELSE
                    INSERT INTO results VALUES ('sessoes_labirinto_porta_id_fkey', 'READY_TO_CREATE', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing simulador_progresso_cenario_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'simulador_progresso_cenario_id_fkey') THEN
        INSERT INTO results VALUES ('simulador_progresso_cenario_id_fkey', 'EXISTS', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'simulador_progresso') THEN
        INSERT INTO results VALUES ('simulador_progresso_cenario_id_fkey', 'MISSING_SOURCE_TABLE', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_progresso' AND column_name = 'cenario_id') THEN
        INSERT INTO results VALUES ('simulador_progresso_cenario_id_fkey', 'MISSING_SOURCE_COLUMN', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'simulador_cenarios') 
          AND NOT ('simulador_cenarios' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('simulador_progresso_cenario_id_fkey', 'MISSING_TARGET_TABLE', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_cenarios' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('simulador_progresso_cenario_id_fkey', 'MISSING_TARGET_COLUMN', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_progresso' AND column_name = 'cenario_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_cenarios' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('simulador_progresso_cenario_id_fkey', 'TYPE_MISMATCH', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'simulador_cenarios' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('simulador_cenarios') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('simulador_progresso_cenario_id_fkey', 'TARGET_NOT_UNIQUE', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id');
                ELSE
                    INSERT INTO results VALUES ('simulador_progresso_cenario_id_fkey', 'READY_TO_CREATE', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sonho_estruturado_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sonho_estruturado_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('sonho_estruturado_cliente_id_fkey', 'EXISTS', 'sonho_estruturado', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sonho_estruturado') THEN
        INSERT INTO results VALUES ('sonho_estruturado_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'sonho_estruturado', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonho_estruturado' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('sonho_estruturado_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'sonho_estruturado', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sonho_estruturado_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'sonho_estruturado', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sonho_estruturado_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'sonho_estruturado', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonho_estruturado' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sonho_estruturado_cliente_id_fkey', 'TYPE_MISMATCH', 'sonho_estruturado', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('sonho_estruturado_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'sonho_estruturado', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('sonho_estruturado_cliente_id_fkey', 'READY_TO_CREATE', 'sonho_estruturado', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sonhos_cabalisticos_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sonhos_cabalisticos_client_id_fkey') THEN
        INSERT INTO results VALUES ('sonhos_cabalisticos_client_id_fkey', 'EXISTS', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos') THEN
        INSERT INTO results VALUES ('sonhos_cabalisticos_client_id_fkey', 'MISSING_SOURCE_TABLE', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('sonhos_cabalisticos_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('sonhos_cabalisticos_client_id_fkey', 'MISSING_TARGET_TABLE', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('sonhos_cabalisticos_client_id_fkey', 'MISSING_TARGET_COLUMN', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('sonhos_cabalisticos_client_id_fkey', 'TYPE_MISMATCH', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('sonhos_cabalisticos_client_id_fkey', 'TARGET_NOT_UNIQUE', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('sonhos_cabalisticos_client_id_fkey', 'READY_TO_CREATE', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing station_progress_station_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'station_progress_station_id_fkey') THEN
        INSERT INTO results VALUES ('station_progress_station_id_fkey', 'EXISTS', 'station_progress', 'station_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'station_progress') THEN
        INSERT INTO results VALUES ('station_progress_station_id_fkey', 'MISSING_SOURCE_TABLE', 'station_progress', 'station_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'station_progress' AND column_name = 'station_id') THEN
        INSERT INTO results VALUES ('station_progress_station_id_fkey', 'MISSING_SOURCE_COLUMN', 'station_progress', 'station_id', 'clube_estacoes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('clube_estacoes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('station_progress_station_id_fkey', 'MISSING_TARGET_TABLE', 'station_progress', 'station_id', 'clube_estacoes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('station_progress_station_id_fkey', 'MISSING_TARGET_COLUMN', 'station_progress', 'station_id', 'clube_estacoes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'station_progress' AND column_name = 'station_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('station_progress_station_id_fkey', 'TYPE_MISMATCH', 'station_progress', 'station_id', 'clube_estacoes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'clube_estacoes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('clube_estacoes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('station_progress_station_id_fkey', 'TARGET_NOT_UNIQUE', 'station_progress', 'station_id', 'clube_estacoes', 'id');
                ELSE
                    INSERT INTO results VALUES ('station_progress_station_id_fkey', 'READY_TO_CREATE', 'station_progress', 'station_id', 'clube_estacoes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing studio_episodes_eixo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_episodes_eixo_id_fkey') THEN
        INSERT INTO results VALUES ('studio_episodes_eixo_id_fkey', 'EXISTS', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'studio_episodes') THEN
        INSERT INTO results VALUES ('studio_episodes_eixo_id_fkey', 'MISSING_SOURCE_TABLE', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_episodes' AND column_name = 'eixo_id') THEN
        INSERT INTO results VALUES ('studio_episodes_eixo_id_fkey', 'MISSING_SOURCE_COLUMN', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'studio_method_axes') 
          AND NOT ('studio_method_axes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('studio_episodes_eixo_id_fkey', 'MISSING_TARGET_TABLE', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_method_axes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('studio_episodes_eixo_id_fkey', 'MISSING_TARGET_COLUMN', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_episodes' AND column_name = 'eixo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_method_axes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('studio_episodes_eixo_id_fkey', 'TYPE_MISMATCH', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'studio_method_axes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('studio_method_axes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('studio_episodes_eixo_id_fkey', 'TARGET_NOT_UNIQUE', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id');
                ELSE
                    INSERT INTO results VALUES ('studio_episodes_eixo_id_fkey', 'READY_TO_CREATE', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing symbolic_template_sessions_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'symbolic_template_sessions_case_id_fkey') THEN
        INSERT INTO results VALUES ('symbolic_template_sessions_case_id_fkey', 'EXISTS', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions') THEN
        INSERT INTO results VALUES ('symbolic_template_sessions_case_id_fkey', 'MISSING_SOURCE_TABLE', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'case_id') THEN
        INSERT INTO results VALUES ('symbolic_template_sessions_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('session_cases' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('symbolic_template_sessions_case_id_fkey', 'MISSING_TARGET_TABLE', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('symbolic_template_sessions_case_id_fkey', 'MISSING_TARGET_COLUMN', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('symbolic_template_sessions_case_id_fkey', 'TYPE_MISMATCH', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id');
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
                    INSERT INTO results VALUES ('symbolic_template_sessions_case_id_fkey', 'TARGET_NOT_UNIQUE', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id');
                ELSE
                    INSERT INTO results VALUES ('symbolic_template_sessions_case_id_fkey', 'READY_TO_CREATE', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing symbolic_template_sessions_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'symbolic_template_sessions_cliente_id_fkey') THEN
        INSERT INTO results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'EXISTS', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions') THEN
        INSERT INTO results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'cliente_id') THEN
        INSERT INTO results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'TYPE_MISMATCH', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'READY_TO_CREATE', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing syntheia_conversations_mode_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_mode_id_fkey') THEN
        INSERT INTO results VALUES ('syntheia_conversations_mode_id_fkey', 'EXISTS', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') THEN
        INSERT INTO results VALUES ('syntheia_conversations_mode_id_fkey', 'MISSING_SOURCE_TABLE', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'mode_id') THEN
        INSERT INTO results VALUES ('syntheia_conversations_mode_id_fkey', 'MISSING_SOURCE_COLUMN', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_modes') 
          AND NOT ('syntheia_modes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('syntheia_conversations_mode_id_fkey', 'MISSING_TARGET_TABLE', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_modes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('syntheia_conversations_mode_id_fkey', 'MISSING_TARGET_COLUMN', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'mode_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_modes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('syntheia_conversations_mode_id_fkey', 'TYPE_MISMATCH', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'syntheia_modes' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('syntheia_modes') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('syntheia_conversations_mode_id_fkey', 'TARGET_NOT_UNIQUE', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id');
                ELSE
                    INSERT INTO results VALUES ('syntheia_conversations_mode_id_fkey', 'READY_TO_CREATE', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing syntheia_conversations_voice_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_voice_id_fkey') THEN
        INSERT INTO results VALUES ('syntheia_conversations_voice_id_fkey', 'EXISTS', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') THEN
        INSERT INTO results VALUES ('syntheia_conversations_voice_id_fkey', 'MISSING_SOURCE_TABLE', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'voice_id') THEN
        INSERT INTO results VALUES ('syntheia_conversations_voice_id_fkey', 'MISSING_SOURCE_COLUMN', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_voices') 
          AND NOT ('syntheia_voices' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('syntheia_conversations_voice_id_fkey', 'MISSING_TARGET_TABLE', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_voices' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('syntheia_conversations_voice_id_fkey', 'MISSING_TARGET_COLUMN', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'voice_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_voices' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('syntheia_conversations_voice_id_fkey', 'TYPE_MISMATCH', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'syntheia_voices' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('syntheia_voices') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('syntheia_conversations_voice_id_fkey', 'TARGET_NOT_UNIQUE', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id');
                ELSE
                    INSERT INTO results VALUES ('syntheia_conversations_voice_id_fkey', 'READY_TO_CREATE', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing syntheia_messages_conversation_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_messages_conversation_id_fkey') THEN
        INSERT INTO results VALUES ('syntheia_messages_conversation_id_fkey', 'EXISTS', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_messages') THEN
        INSERT INTO results VALUES ('syntheia_messages_conversation_id_fkey', 'MISSING_SOURCE_TABLE', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_messages' AND column_name = 'conversation_id') THEN
        INSERT INTO results VALUES ('syntheia_messages_conversation_id_fkey', 'MISSING_SOURCE_COLUMN', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') 
          AND NOT ('syntheia_conversations' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('syntheia_messages_conversation_id_fkey', 'MISSING_TARGET_TABLE', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('syntheia_messages_conversation_id_fkey', 'MISSING_TARGET_COLUMN', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_messages' AND column_name = 'conversation_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('syntheia_messages_conversation_id_fkey', 'TYPE_MISMATCH', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'syntheia_conversations' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('syntheia_conversations') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('syntheia_messages_conversation_id_fkey', 'TARGET_NOT_UNIQUE', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id');
                ELSE
                    INSERT INTO results VALUES ('syntheia_messages_conversation_id_fkey', 'READY_TO_CREATE', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tecela_conselho_respostas_conselho_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_conselho_respostas_conselho_id_fkey') THEN
        INSERT INTO results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'EXISTS', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_conselho_respostas') THEN
        INSERT INTO results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'MISSING_SOURCE_TABLE', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho_respostas' AND column_name = 'conselho_id') THEN
        INSERT INTO results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'MISSING_SOURCE_COLUMN', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_conselho') 
          AND NOT ('tecela_conselho' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'MISSING_TARGET_TABLE', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'MISSING_TARGET_COLUMN', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho_respostas' AND column_name = 'conselho_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'TYPE_MISMATCH', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tecela_conselho' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tecela_conselho') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'TARGET_NOT_UNIQUE', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id');
                ELSE
                    INSERT INTO results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'READY_TO_CREATE', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tecela_ressonancias_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_ressonancias_registro_id_fkey') THEN
        INSERT INTO results VALUES ('tecela_ressonancias_registro_id_fkey', 'EXISTS', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias') THEN
        INSERT INTO results VALUES ('tecela_ressonancias_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias' AND column_name = 'registro_id') THEN
        INSERT INTO results VALUES ('tecela_ressonancias_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_registros_campo') 
          AND NOT ('tecela_registros_campo' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('tecela_ressonancias_registro_id_fkey', 'MISSING_TARGET_TABLE', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_registros_campo' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('tecela_ressonancias_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias' AND column_name = 'registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_registros_campo' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('tecela_ressonancias_registro_id_fkey', 'TYPE_MISMATCH', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tecela_registros_campo' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tecela_registros_campo') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('tecela_ressonancias_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id');
                ELSE
                    INSERT INTO results VALUES ('tecela_ressonancias_registro_id_fkey', 'READY_TO_CREATE', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tecela_supervisoes_caso_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_supervisoes_caso_id_fkey') THEN
        INSERT INTO results VALUES ('tecela_supervisoes_caso_id_fkey', 'EXISTS', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes') THEN
        INSERT INTO results VALUES ('tecela_supervisoes_caso_id_fkey', 'MISSING_SOURCE_TABLE', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes' AND column_name = 'caso_id') THEN
        INSERT INTO results VALUES ('tecela_supervisoes_caso_id_fkey', 'MISSING_SOURCE_COLUMN', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho') 
          AND NOT ('tecela_casos_espelho' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('tecela_supervisoes_caso_id_fkey', 'MISSING_TARGET_TABLE', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('tecela_supervisoes_caso_id_fkey', 'MISSING_TARGET_COLUMN', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes' AND column_name = 'caso_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('tecela_supervisoes_caso_id_fkey', 'TYPE_MISMATCH', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'tecela_casos_espelho' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('tecela_casos_espelho') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('tecela_supervisoes_caso_id_fkey', 'TARGET_NOT_UNIQUE', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id');
                ELSE
                    INSERT INTO results VALUES ('tecela_supervisoes_caso_id_fkey', 'READY_TO_CREATE', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tool_districts_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tool_districts_district_id_fkey') THEN
        INSERT INTO results VALUES ('tool_districts_district_id_fkey', 'EXISTS', 'tool_districts', 'district_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_districts') THEN
        INSERT INTO results VALUES ('tool_districts_district_id_fkey', 'MISSING_SOURCE_TABLE', 'tool_districts', 'district_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'district_id') THEN
        INSERT INTO results VALUES ('tool_districts_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'tool_districts', 'district_id', 'city_districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('city_districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('tool_districts_district_id_fkey', 'MISSING_TARGET_TABLE', 'tool_districts', 'district_id', 'city_districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('tool_districts_district_id_fkey', 'MISSING_TARGET_COLUMN', 'tool_districts', 'district_id', 'city_districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('tool_districts_district_id_fkey', 'TYPE_MISMATCH', 'tool_districts', 'district_id', 'city_districts', 'id');
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
                    INSERT INTO results VALUES ('tool_districts_district_id_fkey', 'TARGET_NOT_UNIQUE', 'tool_districts', 'district_id', 'city_districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('tool_districts_district_id_fkey', 'READY_TO_CREATE', 'tool_districts', 'district_id', 'city_districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tool_districts_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tool_districts_tool_id_fkey') THEN
        INSERT INTO results VALUES ('tool_districts_tool_id_fkey', 'EXISTS', 'tool_districts', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_districts') THEN
        INSERT INTO results VALUES ('tool_districts_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'tool_districts', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'tool_id') THEN
        INSERT INTO results VALUES ('tool_districts_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'tool_districts', 'tool_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('tool_districts_tool_id_fkey', 'MISSING_TARGET_TABLE', 'tool_districts', 'tool_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('tool_districts_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'tool_districts', 'tool_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('tool_districts_tool_id_fkey', 'TYPE_MISMATCH', 'tool_districts', 'tool_id', 'tools', 'id');
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
                    INSERT INTO results VALUES ('tool_districts_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'tool_districts', 'tool_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('tool_districts_tool_id_fkey', 'READY_TO_CREATE', 'tool_districts', 'tool_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tools_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_district_id_fkey') THEN
        INSERT INTO results VALUES ('tools_district_id_fkey', 'EXISTS', 'tools', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        INSERT INTO results VALUES ('tools_district_id_fkey', 'MISSING_SOURCE_TABLE', 'tools', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'district_id') THEN
        INSERT INTO results VALUES ('tools_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'tools', 'district_id', 'districts', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('districts' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('tools_district_id_fkey', 'MISSING_TARGET_TABLE', 'tools', 'district_id', 'districts', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('tools_district_id_fkey', 'MISSING_TARGET_COLUMN', 'tools', 'district_id', 'districts', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('tools_district_id_fkey', 'TYPE_MISMATCH', 'tools', 'district_id', 'districts', 'id');
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
                    INSERT INTO results VALUES ('tools_district_id_fkey', 'TARGET_NOT_UNIQUE', 'tools', 'district_id', 'districts', 'id');
                ELSE
                    INSERT INTO results VALUES ('tools_district_id_fkey', 'READY_TO_CREATE', 'tools', 'district_id', 'districts', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tools_ferramenta_pai_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_ferramenta_pai_id_fkey') THEN
        INSERT INTO results VALUES ('tools_ferramenta_pai_id_fkey', 'EXISTS', 'tools', 'ferramenta_pai_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        INSERT INTO results VALUES ('tools_ferramenta_pai_id_fkey', 'MISSING_SOURCE_TABLE', 'tools', 'ferramenta_pai_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'ferramenta_pai_id') THEN
        INSERT INTO results VALUES ('tools_ferramenta_pai_id_fkey', 'MISSING_SOURCE_COLUMN', 'tools', 'ferramenta_pai_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('tools_ferramenta_pai_id_fkey', 'MISSING_TARGET_TABLE', 'tools', 'ferramenta_pai_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('tools_ferramenta_pai_id_fkey', 'MISSING_TARGET_COLUMN', 'tools', 'ferramenta_pai_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'ferramenta_pai_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('tools_ferramenta_pai_id_fkey', 'TYPE_MISMATCH', 'tools', 'ferramenta_pai_id', 'tools', 'id');
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
                    INSERT INTO results VALUES ('tools_ferramenta_pai_id_fkey', 'TARGET_NOT_UNIQUE', 'tools', 'ferramenta_pai_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('tools_ferramenta_pai_id_fkey', 'READY_TO_CREATE', 'tools', 'ferramenta_pai_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tools_proximo_passo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_proximo_passo_id_fkey') THEN
        INSERT INTO results VALUES ('tools_proximo_passo_id_fkey', 'EXISTS', 'tools', 'proximo_passo_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        INSERT INTO results VALUES ('tools_proximo_passo_id_fkey', 'MISSING_SOURCE_TABLE', 'tools', 'proximo_passo_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'proximo_passo_id') THEN
        INSERT INTO results VALUES ('tools_proximo_passo_id_fkey', 'MISSING_SOURCE_COLUMN', 'tools', 'proximo_passo_id', 'tools', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('tools' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('tools_proximo_passo_id_fkey', 'MISSING_TARGET_TABLE', 'tools', 'proximo_passo_id', 'tools', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('tools_proximo_passo_id_fkey', 'MISSING_TARGET_COLUMN', 'tools', 'proximo_passo_id', 'tools', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'proximo_passo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('tools_proximo_passo_id_fkey', 'TYPE_MISMATCH', 'tools', 'proximo_passo_id', 'tools', 'id');
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
                    INSERT INTO results VALUES ('tools_proximo_passo_id_fkey', 'TARGET_NOT_UNIQUE', 'tools', 'proximo_passo_id', 'tools', 'id');
                ELSE
                    INSERT INTO results VALUES ('tools_proximo_passo_id_fkey', 'READY_TO_CREATE', 'tools', 'proximo_passo_id', 'tools', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing torre_arquetipo_sugestao_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_arquetipo_sugestao_arquetipo_id_fkey') THEN
        INSERT INTO results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'EXISTS', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao') THEN
        INSERT INTO results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao' AND column_name = 'arquetipo_id') THEN
        INSERT INTO results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos') 
          AND NOT ('atlas_arquetipos_femininos' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'TYPE_MISMATCH', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'atlas_arquetipos_femininos' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('atlas_arquetipos_femininos') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id');
                ELSE
                    INSERT INTO results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'READY_TO_CREATE', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing torre_porta_relacao_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_porta_relacao_porta_id_fkey') THEN
        INSERT INTO results VALUES ('torre_porta_relacao_porta_id_fkey', 'EXISTS', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao') THEN
        INSERT INTO results VALUES ('torre_porta_relacao_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao' AND column_name = 'porta_id') THEN
        INSERT INTO results VALUES ('torre_porta_relacao_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('labirinto_portas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('torre_porta_relacao_porta_id_fkey', 'MISSING_TARGET_TABLE', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('torre_porta_relacao_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('torre_porta_relacao_porta_id_fkey', 'TYPE_MISMATCH', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id');
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
                    INSERT INTO results VALUES ('torre_porta_relacao_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id');
                ELSE
                    INSERT INTO results VALUES ('torre_porta_relacao_porta_id_fkey', 'READY_TO_CREATE', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing towers_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_client_id_fkey') THEN
        INSERT INTO results VALUES ('towers_client_id_fkey', 'EXISTS', 'towers', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'towers') THEN
        INSERT INTO results VALUES ('towers_client_id_fkey', 'MISSING_SOURCE_TABLE', 'towers', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'client_id') THEN
        INSERT INTO results VALUES ('towers_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'towers', 'client_id', 'clientes', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('clientes' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('towers_client_id_fkey', 'MISSING_TARGET_TABLE', 'towers', 'client_id', 'clientes', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('towers_client_id_fkey', 'MISSING_TARGET_COLUMN', 'towers', 'client_id', 'clientes', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('towers_client_id_fkey', 'TYPE_MISMATCH', 'towers', 'client_id', 'clientes', 'id');
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
                    INSERT INTO results VALUES ('towers_client_id_fkey', 'TARGET_NOT_UNIQUE', 'towers', 'client_id', 'clientes', 'id');
                ELSE
                    INSERT INTO results VALUES ('towers_client_id_fkey', 'READY_TO_CREATE', 'towers', 'client_id', 'clientes', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing towers_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_session_id_fkey') THEN
        INSERT INTO results VALUES ('towers_session_id_fkey', 'EXISTS', 'towers', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'towers') THEN
        INSERT INTO results VALUES ('towers_session_id_fkey', 'MISSING_SOURCE_TABLE', 'towers', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'session_id') THEN
        INSERT INTO results VALUES ('towers_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'towers', 'session_id', 'sessions', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('sessions' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('towers_session_id_fkey', 'MISSING_TARGET_TABLE', 'towers', 'session_id', 'sessions', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('towers_session_id_fkey', 'MISSING_TARGET_COLUMN', 'towers', 'session_id', 'sessions', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('towers_session_id_fkey', 'TYPE_MISMATCH', 'towers', 'session_id', 'sessions', 'id');
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
                    INSERT INTO results VALUES ('towers_session_id_fkey', 'TARGET_NOT_UNIQUE', 'towers', 'session_id', 'sessions', 'id');
                ELSE
                    INSERT INTO results VALUES ('towers_session_id_fkey', 'READY_TO_CREATE', 'towers', 'session_id', 'sessions', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing travessia_comentarios_user_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_comentarios_user_id_fkey') THEN
        INSERT INTO results VALUES ('travessia_comentarios_user_id_fkey', 'EXISTS', 'travessia_comentarios', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_comentarios') THEN
        INSERT INTO results VALUES ('travessia_comentarios_user_id_fkey', 'MISSING_SOURCE_TABLE', 'travessia_comentarios', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_comentarios' AND column_name = 'user_id') THEN
        INSERT INTO results VALUES ('travessia_comentarios_user_id_fkey', 'MISSING_SOURCE_COLUMN', 'travessia_comentarios', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('travessia_comentarios_user_id_fkey', 'MISSING_TARGET_TABLE', 'travessia_comentarios', 'user_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('travessia_comentarios_user_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_comentarios', 'user_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_comentarios' AND column_name = 'user_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('travessia_comentarios_user_id_fkey', 'TYPE_MISMATCH', 'travessia_comentarios', 'user_id', 'profiles', 'id');
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
                    INSERT INTO results VALUES ('travessia_comentarios_user_id_fkey', 'TARGET_NOT_UNIQUE', 'travessia_comentarios', 'user_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('travessia_comentarios_user_id_fkey', 'READY_TO_CREATE', 'travessia_comentarios', 'user_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing travessia_day_unlocks_aula_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_day_unlocks_aula_id_fkey') THEN
        INSERT INTO results VALUES ('travessia_day_unlocks_aula_id_fkey', 'EXISTS', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks') THEN
        INSERT INTO results VALUES ('travessia_day_unlocks_aula_id_fkey', 'MISSING_SOURCE_TABLE', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks' AND column_name = 'aula_id') THEN
        INSERT INTO results VALUES ('travessia_day_unlocks_aula_id_fkey', 'MISSING_SOURCE_COLUMN', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') 
          AND NOT ('conteudo_aulas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('travessia_day_unlocks_aula_id_fkey', 'MISSING_TARGET_TABLE', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('travessia_day_unlocks_aula_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks' AND column_name = 'aula_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('travessia_day_unlocks_aula_id_fkey', 'TYPE_MISMATCH', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'conteudo_aulas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('conteudo_aulas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('travessia_day_unlocks_aula_id_fkey', 'TARGET_NOT_UNIQUE', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id');
                ELSE
                    INSERT INTO results VALUES ('travessia_day_unlocks_aula_id_fkey', 'READY_TO_CREATE', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing travessia_library_items_familia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_items_familia_id_fkey') THEN
        INSERT INTO results VALUES ('travessia_library_items_familia_id_fkey', 'EXISTS', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') THEN
        INSERT INTO results VALUES ('travessia_library_items_familia_id_fkey', 'MISSING_SOURCE_TABLE', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'familia_id') THEN
        INSERT INTO results VALUES ('travessia_library_items_familia_id_fkey', 'MISSING_SOURCE_COLUMN', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_familias') 
          AND NOT ('travessia_familias' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('travessia_library_items_familia_id_fkey', 'MISSING_TARGET_TABLE', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('travessia_library_items_familia_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'familia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('travessia_library_items_familia_id_fkey', 'TYPE_MISMATCH', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'travessia_familias' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('travessia_familias') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('travessia_library_items_familia_id_fkey', 'TARGET_NOT_UNIQUE', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id');
                ELSE
                    INSERT INTO results VALUES ('travessia_library_items_familia_id_fkey', 'READY_TO_CREATE', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing travessia_library_media_item_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_media_item_id_fkey') THEN
        INSERT INTO results VALUES ('travessia_library_media_item_id_fkey', 'EXISTS', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_media') THEN
        INSERT INTO results VALUES ('travessia_library_media_item_id_fkey', 'MISSING_SOURCE_TABLE', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_media' AND column_name = 'item_id') THEN
        INSERT INTO results VALUES ('travessia_library_media_item_id_fkey', 'MISSING_SOURCE_COLUMN', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') 
          AND NOT ('travessia_library_items' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('travessia_library_media_item_id_fkey', 'MISSING_TARGET_TABLE', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('travessia_library_media_item_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_media' AND column_name = 'item_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('travessia_library_media_item_id_fkey', 'TYPE_MISMATCH', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'travessia_library_items' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('travessia_library_items') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('travessia_library_media_item_id_fkey', 'TARGET_NOT_UNIQUE', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id');
                ELSE
                    INSERT INTO results VALUES ('travessia_library_media_item_id_fkey', 'READY_TO_CREATE', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing travessia_library_tags_item_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_tags_item_id_fkey') THEN
        INSERT INTO results VALUES ('travessia_library_tags_item_id_fkey', 'EXISTS', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_tags') THEN
        INSERT INTO results VALUES ('travessia_library_tags_item_id_fkey', 'MISSING_SOURCE_TABLE', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_tags' AND column_name = 'item_id') THEN
        INSERT INTO results VALUES ('travessia_library_tags_item_id_fkey', 'MISSING_SOURCE_COLUMN', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') 
          AND NOT ('travessia_library_items' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('travessia_library_tags_item_id_fkey', 'MISSING_TARGET_TABLE', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('travessia_library_tags_item_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_tags' AND column_name = 'item_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('travessia_library_tags_item_id_fkey', 'TYPE_MISMATCH', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'travessia_library_items' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('travessia_library_items') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('travessia_library_tags_item_id_fkey', 'TARGET_NOT_UNIQUE', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id');
                ELSE
                    INSERT INTO results VALUES ('travessia_library_tags_item_id_fkey', 'READY_TO_CREATE', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing treinamento_respostas_caso_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treinamento_respostas_caso_id_fkey') THEN
        INSERT INTO results VALUES ('treinamento_respostas_caso_id_fkey', 'EXISTS', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'treinamento_respostas') THEN
        INSERT INTO results VALUES ('treinamento_respostas_caso_id_fkey', 'MISSING_SOURCE_TABLE', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_respostas' AND column_name = 'caso_id') THEN
        INSERT INTO results VALUES ('treinamento_respostas_caso_id_fkey', 'MISSING_SOURCE_COLUMN', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'treinamento_casos_simulados') 
          AND NOT ('treinamento_casos_simulados' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('treinamento_respostas_caso_id_fkey', 'MISSING_TARGET_TABLE', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_casos_simulados' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('treinamento_respostas_caso_id_fkey', 'MISSING_TARGET_COLUMN', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_respostas' AND column_name = 'caso_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_casos_simulados' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('treinamento_respostas_caso_id_fkey', 'TYPE_MISMATCH', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'treinamento_casos_simulados' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('treinamento_casos_simulados') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('treinamento_respostas_caso_id_fkey', 'TARGET_NOT_UNIQUE', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id');
                ELSE
                    INSERT INTO results VALUES ('treinamento_respostas_caso_id_fkey', 'READY_TO_CREATE', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing upsell_opportunities_rule_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'upsell_opportunities_rule_id_fkey') THEN
        INSERT INTO results VALUES ('upsell_opportunities_rule_id_fkey', 'EXISTS', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'upsell_opportunities') THEN
        INSERT INTO results VALUES ('upsell_opportunities_rule_id_fkey', 'MISSING_SOURCE_TABLE', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_opportunities' AND column_name = 'rule_id') THEN
        INSERT INTO results VALUES ('upsell_opportunities_rule_id_fkey', 'MISSING_SOURCE_COLUMN', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'upsell_rules') 
          AND NOT ('upsell_rules' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('upsell_opportunities_rule_id_fkey', 'MISSING_TARGET_TABLE', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_rules' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('upsell_opportunities_rule_id_fkey', 'MISSING_TARGET_COLUMN', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_opportunities' AND column_name = 'rule_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_rules' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('upsell_opportunities_rule_id_fkey', 'TYPE_MISMATCH', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'upsell_rules' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('upsell_rules') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('upsell_opportunities_rule_id_fkey', 'TARGET_NOT_UNIQUE', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id');
                ELSE
                    INSERT INTO results VALUES ('upsell_opportunities_rule_id_fkey', 'READY_TO_CREATE', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing user_aula_progress_aula_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_aula_progress_aula_id_fkey') THEN
        INSERT INTO results VALUES ('user_aula_progress_aula_id_fkey', 'EXISTS', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_aula_progress') THEN
        INSERT INTO results VALUES ('user_aula_progress_aula_id_fkey', 'MISSING_SOURCE_TABLE', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_aula_progress' AND column_name = 'aula_id') THEN
        INSERT INTO results VALUES ('user_aula_progress_aula_id_fkey', 'MISSING_SOURCE_COLUMN', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') 
          AND NOT ('conteudo_aulas' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('user_aula_progress_aula_id_fkey', 'MISSING_TARGET_TABLE', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('user_aula_progress_aula_id_fkey', 'MISSING_TARGET_COLUMN', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_aula_progress' AND column_name = 'aula_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('user_aula_progress_aula_id_fkey', 'TYPE_MISMATCH', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'conteudo_aulas' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('conteudo_aulas') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('user_aula_progress_aula_id_fkey', 'TARGET_NOT_UNIQUE', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id');
                ELSE
                    INSERT INTO results VALUES ('user_aula_progress_aula_id_fkey', 'READY_TO_CREATE', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing user_cidadela_estado_user_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_cidadela_estado_user_id_fkey') THEN
        INSERT INTO results VALUES ('user_cidadela_estado_user_id_fkey', 'EXISTS', 'user_cidadela_estado', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado') THEN
        INSERT INTO results VALUES ('user_cidadela_estado_user_id_fkey', 'MISSING_SOURCE_TABLE', 'user_cidadela_estado', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado' AND column_name = 'user_id') THEN
        INSERT INTO results VALUES ('user_cidadela_estado_user_id_fkey', 'MISSING_SOURCE_COLUMN', 'user_cidadela_estado', 'user_id', 'profiles', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('profiles' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('user_cidadela_estado_user_id_fkey', 'MISSING_TARGET_TABLE', 'user_cidadela_estado', 'user_id', 'profiles', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('user_cidadela_estado_user_id_fkey', 'MISSING_TARGET_COLUMN', 'user_cidadela_estado', 'user_id', 'profiles', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado' AND column_name = 'user_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('user_cidadela_estado_user_id_fkey', 'TYPE_MISMATCH', 'user_cidadela_estado', 'user_id', 'profiles', 'id');
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
                    INSERT INTO results VALUES ('user_cidadela_estado_user_id_fkey', 'TARGET_NOT_UNIQUE', 'user_cidadela_estado', 'user_id', 'profiles', 'id');
                ELSE
                    INSERT INTO results VALUES ('user_cidadela_estado_user_id_fkey', 'READY_TO_CREATE', 'user_cidadela_estado', 'user_id', 'profiles', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing user_favorites_library_item_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_favorites_library_item_id_fkey') THEN
        INSERT INTO results VALUES ('user_favorites_library_item_id_fkey', 'EXISTS', 'user_favorites', 'library_item_id', 'library_items', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_favorites') THEN
        INSERT INTO results VALUES ('user_favorites_library_item_id_fkey', 'MISSING_SOURCE_TABLE', 'user_favorites', 'library_item_id', 'library_items', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'library_item_id') THEN
        INSERT INTO results VALUES ('user_favorites_library_item_id_fkey', 'MISSING_SOURCE_COLUMN', 'user_favorites', 'library_item_id', 'library_items', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'library_items') 
          AND NOT ('library_items' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('user_favorites_library_item_id_fkey', 'MISSING_TARGET_TABLE', 'user_favorites', 'library_item_id', 'library_items', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'library_items' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('user_favorites_library_item_id_fkey', 'MISSING_TARGET_COLUMN', 'user_favorites', 'library_item_id', 'library_items', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'library_item_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'library_items' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('user_favorites_library_item_id_fkey', 'TYPE_MISMATCH', 'user_favorites', 'library_item_id', 'library_items', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'library_items' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('library_items') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('user_favorites_library_item_id_fkey', 'TARGET_NOT_UNIQUE', 'user_favorites', 'library_item_id', 'library_items', 'id');
                ELSE
                    INSERT INTO results VALUES ('user_favorites_library_item_id_fkey', 'READY_TO_CREATE', 'user_favorites', 'library_item_id', 'library_items', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing user_progress_lesson_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_lesson_id_fkey') THEN
        INSERT INTO results VALUES ('user_progress_lesson_id_fkey', 'EXISTS', 'user_progress', 'lesson_id', 'lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
        INSERT INTO results VALUES ('user_progress_lesson_id_fkey', 'MISSING_SOURCE_TABLE', 'user_progress', 'lesson_id', 'lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'lesson_id') THEN
        INSERT INTO results VALUES ('user_progress_lesson_id_fkey', 'MISSING_SOURCE_COLUMN', 'user_progress', 'lesson_id', 'lessons', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') 
          AND NOT ('lessons' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('user_progress_lesson_id_fkey', 'MISSING_TARGET_TABLE', 'user_progress', 'lesson_id', 'lessons', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('user_progress_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'user_progress', 'lesson_id', 'lessons', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'lesson_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('user_progress_lesson_id_fkey', 'TYPE_MISMATCH', 'user_progress', 'lesson_id', 'lessons', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'lessons' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('lessons') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('user_progress_lesson_id_fkey', 'TARGET_NOT_UNIQUE', 'user_progress', 'lesson_id', 'lessons', 'id');
                ELSE
                    INSERT INTO results VALUES ('user_progress_lesson_id_fkey', 'READY_TO_CREATE', 'user_progress', 'lesson_id', 'lessons', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing user_unlocked_rewards_reward_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_unlocked_rewards_reward_id_fkey') THEN
        INSERT INTO results VALUES ('user_unlocked_rewards_reward_id_fkey', 'EXISTS', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_unlocked_rewards') THEN
        INSERT INTO results VALUES ('user_unlocked_rewards_reward_id_fkey', 'MISSING_SOURCE_TABLE', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_unlocked_rewards' AND column_name = 'reward_id') THEN
        INSERT INTO results VALUES ('user_unlocked_rewards_reward_id_fkey', 'MISSING_SOURCE_COLUMN', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_rewards') 
          AND NOT ('symbolic_rewards' = 'profiles' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO results VALUES ('user_unlocked_rewards_reward_id_fkey', 'MISSING_TARGET_TABLE', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id');
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_rewards' AND column_name = 'id') THEN
             INSERT INTO results VALUES ('user_unlocked_rewards_reward_id_fkey', 'MISSING_TARGET_COLUMN', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id');
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_unlocked_rewards' AND column_name = 'reward_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_rewards' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                INSERT INTO results VALUES ('user_unlocked_rewards_reward_id_fkey', 'TYPE_MISMATCH', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id');
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = (CASE WHEN 'symbolic_rewards' = 'profiles' AND NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'auth.users' ELSE 'public.' || quote_ident('symbolic_rewards') END)::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    INSERT INTO results VALUES ('user_unlocked_rewards_reward_id_fkey', 'TARGET_NOT_UNIQUE', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id');
                ELSE
                    INSERT INTO results VALUES ('user_unlocked_rewards_reward_id_fkey', 'READY_TO_CREATE', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id');
                END IF;
            END IF;
        END IF;
    END IF;

END $$;
SELECT * FROM results;
