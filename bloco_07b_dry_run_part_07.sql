-- BLOCO 07B - FOREIGN KEYS DRY RUN (PARTE 7 de 8)
-- Diagnóstico de FKs 301 a 350 (Total: 50)

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
    RAISE NOTICE 'Iniciando diagnóstico PARTE 7...';

    -- Analisando post_session_closures_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_client_id_fkey') THEN
        RAISE NOTICE 'FK: post_session_closures_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') THEN
        RAISE NOTICE 'FK: post_session_closures_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: post_session_closures';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: post_session_closures_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: post_session_closures.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: post_session_closures_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: post_session_closures_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: post_session_closures_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'post_session_closures.client_id', v_source_type, 'profiles.id', v_target_type;
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
                    RAISE NOTICE 'FK: post_session_closures_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: post_session_closures_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando post_session_closures_therapist_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_therapist_id_fkey') THEN
        RAISE NOTICE 'FK: post_session_closures_therapist_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') THEN
        RAISE NOTICE 'FK: post_session_closures_therapist_id_fkey | Status: MISSING_SOURCE_TABLE | Table: post_session_closures';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'therapist_id') THEN
        RAISE NOTICE 'FK: post_session_closures_therapist_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: post_session_closures.therapist_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: post_session_closures_therapist_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: post_session_closures_therapist_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'therapist_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: post_session_closures_therapist_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'post_session_closures.therapist_id', v_source_type, 'profiles.id', v_target_type;
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
                    RAISE NOTICE 'FK: post_session_closures_therapist_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: post_session_closures_therapist_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando praticas_mudra_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'praticas_mudra_client_id_fkey') THEN
        RAISE NOTICE 'FK: praticas_mudra_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'praticas_mudra') THEN
        RAISE NOTICE 'FK: praticas_mudra_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: praticas_mudra';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'praticas_mudra' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: praticas_mudra_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: praticas_mudra.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: praticas_mudra_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: praticas_mudra_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'praticas_mudra' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: praticas_mudra_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'praticas_mudra.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: praticas_mudra_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: praticas_mudra_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando progresso_aluna_formacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progresso_aluna_formacao_id_fkey') THEN
        RAISE NOTICE 'FK: progresso_aluna_formacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'progresso_aluna') THEN
        RAISE NOTICE 'FK: progresso_aluna_formacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: progresso_aluna';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'formacao_id') THEN
        RAISE NOTICE 'FK: progresso_aluna_formacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: progresso_aluna.formacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: progresso_aluna_formacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: formacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: progresso_aluna_formacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: formacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'formacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: progresso_aluna_formacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'progresso_aluna.formacao_id', v_source_type, 'formacoes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.formacoes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: progresso_aluna_formacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: formacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: progresso_aluna_formacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando progresso_aluna_modulo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progresso_aluna_modulo_id_fkey') THEN
        RAISE NOTICE 'FK: progresso_aluna_modulo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'progresso_aluna') THEN
        RAISE NOTICE 'FK: progresso_aluna_modulo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: progresso_aluna';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'modulo_id') THEN
        RAISE NOTICE 'FK: progresso_aluna_modulo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: progresso_aluna.modulo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacao_modulos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: progresso_aluna_modulo_id_fkey | Status: MISSING_TARGET_TABLE | Table: formacao_modulos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: progresso_aluna_modulo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: formacao_modulos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'modulo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: progresso_aluna_modulo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'progresso_aluna.modulo_id', v_source_type, 'formacao_modulos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.formacao_modulos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: progresso_aluna_modulo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: formacao_modulos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: progresso_aluna_modulo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando projetos_mestria_course_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projetos_mestria_course_id_fkey') THEN
        RAISE NOTICE 'FK: projetos_mestria_course_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projetos_mestria') THEN
        RAISE NOTICE 'FK: projetos_mestria_course_id_fkey | Status: MISSING_SOURCE_TABLE | Table: projetos_mestria';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projetos_mestria' AND column_name = 'course_id') THEN
        RAISE NOTICE 'FK: projetos_mestria_course_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: projetos_mestria.course_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: projetos_mestria_course_id_fkey | Status: MISSING_TARGET_TABLE | Table: courses';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: projetos_mestria_course_id_fkey | Status: MISSING_TARGET_COLUMN | Column: courses.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projetos_mestria' AND column_name = 'course_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: projetos_mestria_course_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'projetos_mestria.course_id', v_source_type, 'courses.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.courses')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: projetos_mestria_course_id_fkey | Status: TARGET_NOT_UNIQUE | Column: courses.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: projetos_mestria_course_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando protocolo_oracula_caminho_registro_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_caminho_registro_id_fkey') THEN
        RAISE NOTICE 'FK: protocolo_oracula_caminho_registro_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        RAISE NOTICE 'FK: protocolo_oracula_caminho_registro_id_fkey | Status: MISSING_SOURCE_TABLE | Table: protocolo_oracula';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'caminho_registro_id') THEN
        RAISE NOTICE 'FK: protocolo_oracula_caminho_registro_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: protocolo_oracula.caminho_registro_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: protocolo_oracula_caminho_registro_id_fkey | Status: MISSING_TARGET_TABLE | Table: jornada_heroina_registros';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: protocolo_oracula_caminho_registro_id_fkey | Status: MISSING_TARGET_COLUMN | Column: jornada_heroina_registros.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'caminho_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: protocolo_oracula_caminho_registro_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'protocolo_oracula.caminho_registro_id', v_source_type, 'jornada_heroina_registros.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.jornada_heroina_registros')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: protocolo_oracula_caminho_registro_id_fkey | Status: TARGET_NOT_UNIQUE | Column: jornada_heroina_registros.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: protocolo_oracula_caminho_registro_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando protocolo_oracula_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: protocolo_oracula_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        RAISE NOTICE 'FK: protocolo_oracula_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: protocolo_oracula';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: protocolo_oracula_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: protocolo_oracula.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: protocolo_oracula_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: protocolo_oracula_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: protocolo_oracula_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'protocolo_oracula.cliente_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: protocolo_oracula_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: protocolo_oracula_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando protocolo_oracula_mapa_registro_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_mapa_registro_id_fkey') THEN
        RAISE NOTICE 'FK: protocolo_oracula_mapa_registro_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        RAISE NOTICE 'FK: protocolo_oracula_mapa_registro_id_fkey | Status: MISSING_SOURCE_TABLE | Table: protocolo_oracula';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'mapa_registro_id') THEN
        RAISE NOTICE 'FK: protocolo_oracula_mapa_registro_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: protocolo_oracula.mapa_registro_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: protocolo_oracula_mapa_registro_id_fkey | Status: MISSING_TARGET_TABLE | Table: big5_symbolic_registros';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: protocolo_oracula_mapa_registro_id_fkey | Status: MISSING_TARGET_COLUMN | Column: big5_symbolic_registros.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'mapa_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: protocolo_oracula_mapa_registro_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'protocolo_oracula.mapa_registro_id', v_source_type, 'big5_symbolic_registros.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.big5_symbolic_registros')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: protocolo_oracula_mapa_registro_id_fkey | Status: TARGET_NOT_UNIQUE | Column: big5_symbolic_registros.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: protocolo_oracula_mapa_registro_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando protocolo_oracula_oraculo_registro_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_oraculo_registro_id_fkey') THEN
        RAISE NOTICE 'FK: protocolo_oracula_oraculo_registro_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        RAISE NOTICE 'FK: protocolo_oracula_oraculo_registro_id_fkey | Status: MISSING_SOURCE_TABLE | Table: protocolo_oracula';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'oraculo_registro_id') THEN
        RAISE NOTICE 'FK: protocolo_oracula_oraculo_registro_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: protocolo_oracula.oraculo_registro_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: protocolo_oracula_oraculo_registro_id_fkey | Status: MISSING_TARGET_TABLE | Table: eneagrama_feminino_registros';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: protocolo_oracula_oraculo_registro_id_fkey | Status: MISSING_TARGET_COLUMN | Column: eneagrama_feminino_registros.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'oraculo_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: protocolo_oracula_oraculo_registro_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'protocolo_oracula.oraculo_registro_id', v_source_type, 'eneagrama_feminino_registros.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.eneagrama_feminino_registros')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: protocolo_oracula_oraculo_registro_id_fkey | Status: TARGET_NOT_UNIQUE | Column: eneagrama_feminino_registros.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: protocolo_oracula_oraculo_registro_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando protocolo_oracula_session_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_session_case_id_fkey') THEN
        RAISE NOTICE 'FK: protocolo_oracula_session_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        RAISE NOTICE 'FK: protocolo_oracula_session_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: protocolo_oracula';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'session_case_id') THEN
        RAISE NOTICE 'FK: protocolo_oracula_session_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: protocolo_oracula.session_case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: protocolo_oracula_session_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: protocolo_oracula_session_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: protocolo_oracula_session_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'protocolo_oracula.session_case_id', v_source_type, 'session_cases.id', v_target_type;
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
                    RAISE NOTICE 'FK: protocolo_oracula_session_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: protocolo_oracula_session_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando quiz_opcoes_pergunta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_opcoes_pergunta_id_fkey') THEN
        RAISE NOTICE 'FK: quiz_opcoes_pergunta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_opcoes') THEN
        RAISE NOTICE 'FK: quiz_opcoes_pergunta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: quiz_opcoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_opcoes' AND column_name = 'pergunta_id') THEN
        RAISE NOTICE 'FK: quiz_opcoes_pergunta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: quiz_opcoes.pergunta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_perguntas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: quiz_opcoes_pergunta_id_fkey | Status: MISSING_TARGET_TABLE | Table: quiz_perguntas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: quiz_opcoes_pergunta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: quiz_perguntas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_opcoes' AND column_name = 'pergunta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: quiz_opcoes_pergunta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'quiz_opcoes.pergunta_id', v_source_type, 'quiz_perguntas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.quiz_perguntas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: quiz_opcoes_pergunta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: quiz_perguntas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: quiz_opcoes_pergunta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando quiz_perguntas_quiz_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_perguntas_quiz_id_fkey') THEN
        RAISE NOTICE 'FK: quiz_perguntas_quiz_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_perguntas') THEN
        RAISE NOTICE 'FK: quiz_perguntas_quiz_id_fkey | Status: MISSING_SOURCE_TABLE | Table: quiz_perguntas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'quiz_id') THEN
        RAISE NOTICE 'FK: quiz_perguntas_quiz_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: quiz_perguntas.quiz_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: quiz_perguntas_quiz_id_fkey | Status: MISSING_TARGET_TABLE | Table: quizzes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: quiz_perguntas_quiz_id_fkey | Status: MISSING_TARGET_COLUMN | Column: quizzes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'quiz_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: quiz_perguntas_quiz_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'quiz_perguntas.quiz_id', v_source_type, 'quizzes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.quizzes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: quiz_perguntas_quiz_id_fkey | Status: TARGET_NOT_UNIQUE | Column: quizzes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: quiz_perguntas_quiz_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando quiz_respostas_usuario_quiz_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_quiz_id_fkey') THEN
        RAISE NOTICE 'FK: quiz_respostas_usuario_quiz_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario') THEN
        RAISE NOTICE 'FK: quiz_respostas_usuario_quiz_id_fkey | Status: MISSING_SOURCE_TABLE | Table: quiz_respostas_usuario';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'quiz_id') THEN
        RAISE NOTICE 'FK: quiz_respostas_usuario_quiz_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: quiz_respostas_usuario.quiz_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: quiz_respostas_usuario_quiz_id_fkey | Status: MISSING_TARGET_TABLE | Table: quizzes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: quiz_respostas_usuario_quiz_id_fkey | Status: MISSING_TARGET_COLUMN | Column: quizzes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'quiz_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: quiz_respostas_usuario_quiz_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'quiz_respostas_usuario.quiz_id', v_source_type, 'quizzes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.quizzes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: quiz_respostas_usuario_quiz_id_fkey | Status: TARGET_NOT_UNIQUE | Column: quizzes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: quiz_respostas_usuario_quiz_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando quiz_respostas_usuario_resultado_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_resultado_id_fkey') THEN
        RAISE NOTICE 'FK: quiz_respostas_usuario_resultado_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario') THEN
        RAISE NOTICE 'FK: quiz_respostas_usuario_resultado_id_fkey | Status: MISSING_SOURCE_TABLE | Table: quiz_respostas_usuario';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'resultado_id') THEN
        RAISE NOTICE 'FK: quiz_respostas_usuario_resultado_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: quiz_respostas_usuario.resultado_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: quiz_respostas_usuario_resultado_id_fkey | Status: MISSING_TARGET_TABLE | Table: quiz_resultados';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: quiz_respostas_usuario_resultado_id_fkey | Status: MISSING_TARGET_COLUMN | Column: quiz_resultados.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'resultado_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: quiz_respostas_usuario_resultado_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'quiz_respostas_usuario.resultado_id', v_source_type, 'quiz_resultados.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.quiz_resultados')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: quiz_respostas_usuario_resultado_id_fkey | Status: TARGET_NOT_UNIQUE | Column: quiz_resultados.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: quiz_respostas_usuario_resultado_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando quiz_resultados_agente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_agente_id_fkey') THEN
        RAISE NOTICE 'FK: quiz_resultados_agente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') THEN
        RAISE NOTICE 'FK: quiz_resultados_agente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: quiz_resultados';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'agente_id') THEN
        RAISE NOTICE 'FK: quiz_resultados_agente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: quiz_resultados.agente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: quiz_resultados_agente_id_fkey | Status: MISSING_TARGET_TABLE | Table: agentes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: quiz_resultados_agente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: agentes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'agente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: quiz_resultados_agente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'quiz_resultados.agente_id', v_source_type, 'agentes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.agentes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: quiz_resultados_agente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: agentes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: quiz_resultados_agente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando quiz_resultados_quiz_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_quiz_id_fkey') THEN
        RAISE NOTICE 'FK: quiz_resultados_quiz_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') THEN
        RAISE NOTICE 'FK: quiz_resultados_quiz_id_fkey | Status: MISSING_SOURCE_TABLE | Table: quiz_resultados';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'quiz_id') THEN
        RAISE NOTICE 'FK: quiz_resultados_quiz_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: quiz_resultados.quiz_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: quiz_resultados_quiz_id_fkey | Status: MISSING_TARGET_TABLE | Table: quizzes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: quiz_resultados_quiz_id_fkey | Status: MISSING_TARGET_COLUMN | Column: quizzes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'quiz_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: quiz_resultados_quiz_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'quiz_resultados.quiz_id', v_source_type, 'quizzes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.quizzes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: quiz_resultados_quiz_id_fkey | Status: TARGET_NOT_UNIQUE | Column: quizzes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: quiz_resultados_quiz_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando quizzes_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_portal_id_fkey') THEN
        RAISE NOTICE 'FK: quizzes_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') THEN
        RAISE NOTICE 'FK: quizzes_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: quizzes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: quizzes_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: quizzes.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: quizzes_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: conteudo_travessias';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: quizzes_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: conteudo_travessias.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: quizzes_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'quizzes.portal_id', v_source_type, 'conteudo_travessias.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.conteudo_travessias')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: quizzes_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: conteudo_travessias.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: quizzes_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando quizzes_sala_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_sala_id_fkey') THEN
        RAISE NOTICE 'FK: quizzes_sala_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') THEN
        RAISE NOTICE 'FK: quizzes_sala_id_fkey | Status: MISSING_SOURCE_TABLE | Table: quizzes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'sala_id') THEN
        RAISE NOTICE 'FK: quizzes_sala_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: quizzes.sala_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: quizzes_sala_id_fkey | Status: MISSING_TARGET_TABLE | Table: salas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: quizzes_sala_id_fkey | Status: MISSING_TARGET_COLUMN | Column: salas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'sala_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: quizzes_sala_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'quizzes.sala_id', v_source_type, 'salas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.salas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: quizzes_sala_id_fkey | Status: TARGET_NOT_UNIQUE | Column: salas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: quizzes_sala_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando reflexoes_jornada_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reflexoes_jornada_client_id_fkey') THEN
        RAISE NOTICE 'FK: reflexoes_jornada_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada') THEN
        RAISE NOTICE 'FK: reflexoes_jornada_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: reflexoes_jornada';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: reflexoes_jornada_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: reflexoes_jornada.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: reflexoes_jornada_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: reflexoes_jornada_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: reflexoes_jornada_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'reflexoes_jornada.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: reflexoes_jornada_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: reflexoes_jornada_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando relacionamentos_espelho_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'relacionamentos_espelho_client_id_fkey') THEN
        RAISE NOTICE 'FK: relacionamentos_espelho_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho') THEN
        RAISE NOTICE 'FK: relacionamentos_espelho_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: relacionamentos_espelho';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: relacionamentos_espelho_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: relacionamentos_espelho.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: relacionamentos_espelho_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: relacionamentos_espelho_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: relacionamentos_espelho_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'relacionamentos_espelho.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: relacionamentos_espelho_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: relacionamentos_espelho_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando respostas_exercicios_sessao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'respostas_exercicios_sessao_id_fkey') THEN
        RAISE NOTICE 'FK: respostas_exercicios_sessao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'respostas_exercicios') THEN
        RAISE NOTICE 'FK: respostas_exercicios_sessao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: respostas_exercicios';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'respostas_exercicios' AND column_name = 'sessao_id') THEN
        RAISE NOTICE 'FK: respostas_exercicios_sessao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: respostas_exercicios.sessao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: respostas_exercicios_sessao_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessoes_labirinto';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: respostas_exercicios_sessao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessoes_labirinto.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'respostas_exercicios' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: respostas_exercicios_sessao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'respostas_exercicios.sessao_id', v_source_type, 'sessoes_labirinto.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.sessoes_labirinto')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: respostas_exercicios_sessao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessoes_labirinto.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: respostas_exercicios_sessao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando rituais_integracao_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rituais_integracao_client_id_fkey') THEN
        RAISE NOTICE 'FK: rituais_integracao_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_integracao') THEN
        RAISE NOTICE 'FK: rituais_integracao_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: rituais_integracao';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_integracao' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: rituais_integracao_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: rituais_integracao.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: rituais_integracao_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: rituais_integracao_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_integracao' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: rituais_integracao_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'rituais_integracao.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: rituais_integracao_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: rituais_integracao_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando ritual_passages_ritual_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ritual_passages_ritual_id_fkey') THEN
        RAISE NOTICE 'FK: ritual_passages_ritual_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ritual_passages') THEN
        RAISE NOTICE 'FK: ritual_passages_ritual_id_fkey | Status: MISSING_SOURCE_TABLE | Table: ritual_passages';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_passages' AND column_name = 'ritual_id') THEN
        RAISE NOTICE 'FK: ritual_passages_ritual_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: ritual_passages.ritual_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ritual_definitions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: ritual_passages_ritual_id_fkey | Status: MISSING_TARGET_TABLE | Table: ritual_definitions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_definitions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: ritual_passages_ritual_id_fkey | Status: MISSING_TARGET_COLUMN | Column: ritual_definitions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_passages' AND column_name = 'ritual_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_definitions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: ritual_passages_ritual_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'ritual_passages.ritual_id', v_source_type, 'ritual_definitions.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.ritual_definitions')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: ritual_passages_ritual_id_fkey | Status: TARGET_NOT_UNIQUE | Column: ritual_definitions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: ritual_passages_ritual_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sala_ferramentas_familia_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_familia_id_fkey') THEN
        RAISE NOTICE 'FK: sala_ferramentas_familia_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        RAISE NOTICE 'FK: sala_ferramentas_familia_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sala_ferramentas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'familia_id') THEN
        RAISE NOTICE 'FK: sala_ferramentas_familia_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sala_ferramentas.familia_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_familias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sala_ferramentas_familia_id_fkey | Status: MISSING_TARGET_TABLE | Table: travessia_familias';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sala_ferramentas_familia_id_fkey | Status: MISSING_TARGET_COLUMN | Column: travessia_familias.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'familia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sala_ferramentas_familia_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sala_ferramentas.familia_id', v_source_type, 'travessia_familias.id', v_target_type;
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
                    RAISE NOTICE 'FK: sala_ferramentas_familia_id_fkey | Status: TARGET_NOT_UNIQUE | Column: travessia_familias.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sala_ferramentas_familia_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sala_ferramentas_ferramenta_pai_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_ferramenta_pai_id_fkey') THEN
        RAISE NOTICE 'FK: sala_ferramentas_ferramenta_pai_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        RAISE NOTICE 'FK: sala_ferramentas_ferramenta_pai_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sala_ferramentas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'ferramenta_pai_id') THEN
        RAISE NOTICE 'FK: sala_ferramentas_ferramenta_pai_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sala_ferramentas.ferramenta_pai_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sala_ferramentas_ferramenta_pai_id_fkey | Status: MISSING_TARGET_TABLE | Table: sala_ferramentas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sala_ferramentas_ferramenta_pai_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sala_ferramentas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'ferramenta_pai_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sala_ferramentas_ferramenta_pai_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sala_ferramentas.ferramenta_pai_id', v_source_type, 'sala_ferramentas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.sala_ferramentas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: sala_ferramentas_ferramenta_pai_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sala_ferramentas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sala_ferramentas_ferramenta_pai_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sala_ferramentas_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_portal_id_fkey') THEN
        RAISE NOTICE 'FK: sala_ferramentas_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        RAISE NOTICE 'FK: sala_ferramentas_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sala_ferramentas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: sala_ferramentas_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sala_ferramentas.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sala_ferramentas_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: conteudo_travessias';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sala_ferramentas_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: conteudo_travessias.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sala_ferramentas_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sala_ferramentas.portal_id', v_source_type, 'conteudo_travessias.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.conteudo_travessias')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: sala_ferramentas_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: conteudo_travessias.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sala_ferramentas_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sala_ferramentas_sala_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_sala_id_fkey') THEN
        RAISE NOTICE 'FK: sala_ferramentas_sala_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        RAISE NOTICE 'FK: sala_ferramentas_sala_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sala_ferramentas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'sala_id') THEN
        RAISE NOTICE 'FK: sala_ferramentas_sala_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sala_ferramentas.sala_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sala_ferramentas_sala_id_fkey | Status: MISSING_TARGET_TABLE | Table: salas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sala_ferramentas_sala_id_fkey | Status: MISSING_TARGET_COLUMN | Column: salas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'sala_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sala_ferramentas_sala_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sala_ferramentas.sala_id', v_source_type, 'salas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.salas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: sala_ferramentas_sala_id_fkey | Status: TARGET_NOT_UNIQUE | Column: salas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sala_ferramentas_sala_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando season_books_season_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_books_season_id_fkey') THEN
        RAISE NOTICE 'FK: season_books_season_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'season_books') THEN
        RAISE NOTICE 'FK: season_books_season_id_fkey | Status: MISSING_SOURCE_TABLE | Table: season_books';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_books' AND column_name = 'season_id') THEN
        RAISE NOTICE 'FK: season_books_season_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: season_books.season_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: season_books_season_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracular_seasons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: season_books_season_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracular_seasons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_books' AND column_name = 'season_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: season_books_season_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'season_books.season_id', v_source_type, 'oracular_seasons.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.oracular_seasons')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: season_books_season_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracular_seasons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: season_books_season_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando season_labs_season_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_labs_season_id_fkey') THEN
        RAISE NOTICE 'FK: season_labs_season_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'season_labs') THEN
        RAISE NOTICE 'FK: season_labs_season_id_fkey | Status: MISSING_SOURCE_TABLE | Table: season_labs';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_labs' AND column_name = 'season_id') THEN
        RAISE NOTICE 'FK: season_labs_season_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: season_labs.season_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: season_labs_season_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracular_seasons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: season_labs_season_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracular_seasons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_labs' AND column_name = 'season_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: season_labs_season_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'season_labs.season_id', v_source_type, 'oracular_seasons.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.oracular_seasons')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: season_labs_season_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracular_seasons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: season_labs_season_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_archetypes_archetype_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_archetype_id_fkey') THEN
        RAISE NOTICE 'FK: session_archetypes_archetype_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') THEN
        RAISE NOTICE 'FK: session_archetypes_archetype_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_archetypes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'archetype_id') THEN
        RAISE NOTICE 'FK: session_archetypes_archetype_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_archetypes.archetype_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_archetypes_archetype_id_fkey | Status: MISSING_TARGET_TABLE | Table: atlas_arquetipos_femininos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_archetypes_archetype_id_fkey | Status: MISSING_TARGET_COLUMN | Column: atlas_arquetipos_femininos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'archetype_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_archetypes_archetype_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_archetypes.archetype_id', v_source_type, 'atlas_arquetipos_femininos.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_archetypes_archetype_id_fkey | Status: TARGET_NOT_UNIQUE | Column: atlas_arquetipos_femininos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_archetypes_archetype_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_archetypes_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_client_id_fkey') THEN
        RAISE NOTICE 'FK: session_archetypes_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') THEN
        RAISE NOTICE 'FK: session_archetypes_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_archetypes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: session_archetypes_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_archetypes.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_archetypes_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_archetypes_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_archetypes_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_archetypes.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_archetypes_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_archetypes_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_archetypes_session_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_session_id_fkey') THEN
        RAISE NOTICE 'FK: session_archetypes_session_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') THEN
        RAISE NOTICE 'FK: session_archetypes_session_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_archetypes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'session_id') THEN
        RAISE NOTICE 'FK: session_archetypes_session_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_archetypes.session_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_archetypes_session_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_archetypes_session_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_archetypes_session_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_archetypes.session_id', v_source_type, 'sessions.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_archetypes_session_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_archetypes_session_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_cases_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_client_id_fkey') THEN
        RAISE NOTICE 'FK: session_cases_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') THEN
        RAISE NOTICE 'FK: session_cases_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_cases';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: session_cases_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_cases.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_cases_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_cases_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_cases_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_cases.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_cases_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_cases_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_cases_therapist_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_therapist_id_fkey') THEN
        RAISE NOTICE 'FK: session_cases_therapist_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') THEN
        RAISE NOTICE 'FK: session_cases_therapist_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_cases';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'therapist_id') THEN
        RAISE NOTICE 'FK: session_cases_therapist_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_cases.therapist_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_cases_therapist_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_cases_therapist_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'therapist_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_cases_therapist_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_cases.therapist_id', v_source_type, 'profiles.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_cases_therapist_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_cases_therapist_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_interventions_intervention_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_intervention_id_fkey') THEN
        RAISE NOTICE 'FK: session_interventions_intervention_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_interventions') THEN
        RAISE NOTICE 'FK: session_interventions_intervention_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_interventions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'intervention_id') THEN
        RAISE NOTICE 'FK: session_interventions_intervention_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_interventions.intervention_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_interventions_intervention_id_fkey | Status: MISSING_TARGET_TABLE | Table: interventions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_interventions_intervention_id_fkey | Status: MISSING_TARGET_COLUMN | Column: interventions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'intervention_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_interventions_intervention_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_interventions.intervention_id', v_source_type, 'interventions.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.interventions')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: session_interventions_intervention_id_fkey | Status: TARGET_NOT_UNIQUE | Column: interventions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_interventions_intervention_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_interventions_session_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_session_id_fkey') THEN
        RAISE NOTICE 'FK: session_interventions_session_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_interventions') THEN
        RAISE NOTICE 'FK: session_interventions_session_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_interventions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'session_id') THEN
        RAISE NOTICE 'FK: session_interventions_session_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_interventions.session_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_interventions_session_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_interventions_session_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_interventions_session_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_interventions.session_id', v_source_type, 'sessions.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_interventions_session_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_interventions_session_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_oracle_draws_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_case_id_fkey') THEN
        RAISE NOTICE 'FK: session_oracle_draws_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') THEN
        RAISE NOTICE 'FK: session_oracle_draws_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_oracle_draws';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: session_oracle_draws_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_oracle_draws.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_oracle_draws_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_oracle_draws_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_oracle_draws_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_oracle_draws.case_id', v_source_type, 'session_cases.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_oracle_draws_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_oracle_draws_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_oracle_draws_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_client_id_fkey') THEN
        RAISE NOTICE 'FK: session_oracle_draws_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') THEN
        RAISE NOTICE 'FK: session_oracle_draws_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_oracle_draws';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: session_oracle_draws_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_oracle_draws.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_oracle_draws_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_oracle_draws_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_oracle_draws_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_oracle_draws.client_id', v_source_type, 'profiles.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_oracle_draws_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_oracle_draws_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_oracle_draws_therapist_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_therapist_id_fkey') THEN
        RAISE NOTICE 'FK: session_oracle_draws_therapist_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') THEN
        RAISE NOTICE 'FK: session_oracle_draws_therapist_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_oracle_draws';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'therapist_id') THEN
        RAISE NOTICE 'FK: session_oracle_draws_therapist_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_oracle_draws.therapist_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_oracle_draws_therapist_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_oracle_draws_therapist_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'therapist_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_oracle_draws_therapist_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_oracle_draws.therapist_id', v_source_type, 'profiles.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_oracle_draws_therapist_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_oracle_draws_therapist_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_scripts_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_case_id_fkey') THEN
        RAISE NOTICE 'FK: session_scripts_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        RAISE NOTICE 'FK: session_scripts_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_scripts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: session_scripts_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_scripts.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_scripts_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_scripts_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_scripts_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_scripts.case_id', v_source_type, 'session_cases.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_scripts_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_scripts_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_scripts_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_client_id_fkey') THEN
        RAISE NOTICE 'FK: session_scripts_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        RAISE NOTICE 'FK: session_scripts_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_scripts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: session_scripts_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_scripts.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_scripts_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_scripts_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_scripts_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_scripts.client_id', v_source_type, 'profiles.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_scripts_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_scripts_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_scripts_narrative_map_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_narrative_map_id_fkey') THEN
        RAISE NOTICE 'FK: session_scripts_narrative_map_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        RAISE NOTICE 'FK: session_scripts_narrative_map_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_scripts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'narrative_map_id') THEN
        RAISE NOTICE 'FK: session_scripts_narrative_map_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_scripts.narrative_map_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_scripts_narrative_map_id_fkey | Status: MISSING_TARGET_TABLE | Table: narrative_maps';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_scripts_narrative_map_id_fkey | Status: MISSING_TARGET_COLUMN | Column: narrative_maps.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'narrative_map_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_scripts_narrative_map_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_scripts.narrative_map_id', v_source_type, 'narrative_maps.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.narrative_maps')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: session_scripts_narrative_map_id_fkey | Status: TARGET_NOT_UNIQUE | Column: narrative_maps.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_scripts_narrative_map_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando session_scripts_therapist_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_therapist_id_fkey') THEN
        RAISE NOTICE 'FK: session_scripts_therapist_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        RAISE NOTICE 'FK: session_scripts_therapist_id_fkey | Status: MISSING_SOURCE_TABLE | Table: session_scripts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'therapist_id') THEN
        RAISE NOTICE 'FK: session_scripts_therapist_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: session_scripts.therapist_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: session_scripts_therapist_id_fkey | Status: MISSING_TARGET_TABLE | Table: profiles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: session_scripts_therapist_id_fkey | Status: MISSING_TARGET_COLUMN | Column: profiles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'therapist_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: session_scripts_therapist_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'session_scripts.therapist_id', v_source_type, 'profiles.id', v_target_type;
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
                    RAISE NOTICE 'FK: session_scripts_therapist_id_fkey | Status: TARGET_NOT_UNIQUE | Column: profiles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: session_scripts_therapist_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sessions_cidadela_card_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_cidadela_card_id_fkey') THEN
        RAISE NOTICE 'FK: sessions_cidadela_card_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        RAISE NOTICE 'FK: sessions_cidadela_card_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sessions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'cidadela_card_id') THEN
        RAISE NOTICE 'FK: sessions_cidadela_card_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sessions.cidadela_card_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sessions_cidadela_card_id_fkey | Status: MISSING_TARGET_TABLE | Table: cidadela_oracle_cards';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sessions_cidadela_card_id_fkey | Status: MISSING_TARGET_COLUMN | Column: cidadela_oracle_cards.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'cidadela_card_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sessions_cidadela_card_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sessions.cidadela_card_id', v_source_type, 'cidadela_oracle_cards.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.cidadela_oracle_cards')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: sessions_cidadela_card_id_fkey | Status: TARGET_NOT_UNIQUE | Column: cidadela_oracle_cards.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sessions_cidadela_card_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sessions_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_client_id_fkey') THEN
        RAISE NOTICE 'FK: sessions_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        RAISE NOTICE 'FK: sessions_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sessions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: sessions_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sessions.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sessions_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sessions_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sessions_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sessions.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: sessions_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sessions_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sessions_district_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_district_id_fkey') THEN
        RAISE NOTICE 'FK: sessions_district_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        RAISE NOTICE 'FK: sessions_district_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sessions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'district_id') THEN
        RAISE NOTICE 'FK: sessions_district_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sessions.district_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sessions_district_id_fkey | Status: MISSING_TARGET_TABLE | Table: districts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sessions_district_id_fkey | Status: MISSING_TARGET_COLUMN | Column: districts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sessions_district_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sessions.district_id', v_source_type, 'districts.id', v_target_type;
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
                    RAISE NOTICE 'FK: sessions_district_id_fkey | Status: TARGET_NOT_UNIQUE | Column: districts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sessions_district_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sessions_tool_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_tool_id_fkey') THEN
        RAISE NOTICE 'FK: sessions_tool_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        RAISE NOTICE 'FK: sessions_tool_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sessions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'tool_id') THEN
        RAISE NOTICE 'FK: sessions_tool_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sessions.tool_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sessions_tool_id_fkey | Status: MISSING_TARGET_TABLE | Table: tools';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sessions_tool_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tools.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sessions_tool_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sessions.tool_id', v_source_type, 'tools.id', v_target_type;
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
                    RAISE NOTICE 'FK: sessions_tool_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tools.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sessions_tool_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sessoes_casa_maquinas_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_casa_maquinas_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: sessoes_casa_maquinas_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') THEN
        RAISE NOTICE 'FK: sessoes_casa_maquinas_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sessoes_casa_maquinas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: sessoes_casa_maquinas_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sessoes_casa_maquinas.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sessoes_casa_maquinas_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sessoes_casa_maquinas_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sessoes_casa_maquinas_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sessoes_casa_maquinas.cliente_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: sessoes_casa_maquinas_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sessoes_casa_maquinas_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando sessoes_labirinto_porta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_labirinto_porta_id_fkey') THEN
        RAISE NOTICE 'FK: sessoes_labirinto_porta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto') THEN
        RAISE NOTICE 'FK: sessoes_labirinto_porta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: sessoes_labirinto';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'porta_id') THEN
        RAISE NOTICE 'FK: sessoes_labirinto_porta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: sessoes_labirinto.porta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: sessoes_labirinto_porta_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_fases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: sessoes_labirinto_porta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_fases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: sessoes_labirinto_porta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'sessoes_labirinto.porta_id', v_source_type, 'labirinto_fases.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_fases')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: sessoes_labirinto_porta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_fases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: sessoes_labirinto_porta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    RAISE NOTICE '--------------------------------------------------';
    RAISE NOTICE 'RESUMO PARCIAL (PARTE 7):';
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
