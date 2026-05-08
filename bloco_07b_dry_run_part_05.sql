-- BLOCO 07B - FOREIGN KEYS DRY RUN (PARTE 5 de 8)
-- Diagnóstico de FKs 201 a 250 (Total: 50)

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
    RAISE NOTICE 'Iniciando diagnóstico PARTE 5...';

    -- Analisando inventario_personas_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventario_personas_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: inventario_personas_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inventario_personas') THEN
        RAISE NOTICE 'FK: inventario_personas_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: inventario_personas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'inventario_personas' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: inventario_personas_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: inventario_personas.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: inventario_personas_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: inventario_personas_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'inventario_personas' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: inventario_personas_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'inventario_personas.cliente_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: inventario_personas_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: inventario_personas_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jardim_do_oficio_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: jardim_do_oficio_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio') THEN
        RAISE NOTICE 'FK: jardim_do_oficio_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jardim_do_oficio';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: jardim_do_oficio_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jardim_do_oficio.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jardim_do_oficio_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jardim_do_oficio_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jardim_do_oficio_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jardim_do_oficio.cliente_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: jardim_do_oficio_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jardim_do_oficio_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jardim_do_oficio_sessao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_sessao_id_fkey') THEN
        RAISE NOTICE 'FK: jardim_do_oficio_sessao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio') THEN
        RAISE NOTICE 'FK: jardim_do_oficio_sessao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jardim_do_oficio';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'sessao_id') THEN
        RAISE NOTICE 'FK: jardim_do_oficio_sessao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jardim_do_oficio.sessao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jardim_do_oficio_sessao_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessoes_casa_maquinas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jardim_do_oficio_sessao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessoes_casa_maquinas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jardim_do_oficio_sessao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jardim_do_oficio.sessao_id', v_source_type, 'sessoes_casa_maquinas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.sessoes_casa_maquinas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: jardim_do_oficio_sessao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessoes_casa_maquinas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jardim_do_oficio_sessao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jardim_grupo_registros_group_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_group_id_fkey') THEN
        RAISE NOTICE 'FK: jardim_grupo_registros_group_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros') THEN
        RAISE NOTICE 'FK: jardim_grupo_registros_group_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jardim_grupo_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'group_id') THEN
        RAISE NOTICE 'FK: jardim_grupo_registros_group_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jardim_grupo_registros.group_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jardim_grupo_registros_group_id_fkey | Status: MISSING_TARGET_TABLE | Table: therapeutic_groups';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jardim_grupo_registros_group_id_fkey | Status: MISSING_TARGET_COLUMN | Column: therapeutic_groups.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'group_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jardim_grupo_registros_group_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jardim_grupo_registros.group_id', v_source_type, 'therapeutic_groups.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.therapeutic_groups')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: jardim_grupo_registros_group_id_fkey | Status: TARGET_NOT_UNIQUE | Column: therapeutic_groups.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jardim_grupo_registros_group_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jardim_grupo_registros_session_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_session_id_fkey') THEN
        RAISE NOTICE 'FK: jardim_grupo_registros_session_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros') THEN
        RAISE NOTICE 'FK: jardim_grupo_registros_session_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jardim_grupo_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'session_id') THEN
        RAISE NOTICE 'FK: jardim_grupo_registros_session_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jardim_grupo_registros.session_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jardim_grupo_registros_session_id_fkey | Status: MISSING_TARGET_TABLE | Table: group_sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jardim_grupo_registros_session_id_fkey | Status: MISSING_TARGET_COLUMN | Column: group_sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jardim_grupo_registros_session_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jardim_grupo_registros.session_id', v_source_type, 'group_sessions.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.group_sessions')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: jardim_grupo_registros_session_id_fkey | Status: TARGET_NOT_UNIQUE | Column: group_sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jardim_grupo_registros_session_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jardim_heroina_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_case_id_fkey') THEN
        RAISE NOTICE 'FK: jardim_heroina_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina') THEN
        RAISE NOTICE 'FK: jardim_heroina_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jardim_heroina';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'case_id') THEN
        RAISE NOTICE 'FK: jardim_heroina_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jardim_heroina.case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jardim_heroina_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jardim_heroina_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jardim_heroina_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jardim_heroina.case_id', v_source_type, 'session_cases.id', v_target_type;
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
                    RAISE NOTICE 'FK: jardim_heroina_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jardim_heroina_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jardim_heroina_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_client_id_fkey') THEN
        RAISE NOTICE 'FK: jardim_heroina_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina') THEN
        RAISE NOTICE 'FK: jardim_heroina_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jardim_heroina';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: jardim_heroina_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jardim_heroina.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jardim_heroina_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jardim_heroina_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jardim_heroina_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jardim_heroina.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: jardim_heroina_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jardim_heroina_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jardim_heroina_registros_mapa_vivo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_id_fkey') THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jardim_heroina_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_id') THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jardim_heroina_registros.mapa_vivo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_id_fkey | Status: MISSING_TARGET_TABLE | Table: mapa_vivo_heroina';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: mapa_vivo_heroina.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jardim_heroina_registros.mapa_vivo_id', v_source_type, 'mapa_vivo_heroina.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.mapa_vivo_heroina')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: mapa_vivo_heroina.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jardim_heroina_registros_mapa_vivo_origem_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_origem_id_fkey') THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_origem_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_origem_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jardim_heroina_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_origem_id') THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_origem_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jardim_heroina_registros.mapa_vivo_origem_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_origem_id_fkey | Status: MISSING_TARGET_TABLE | Table: mapa_vivo_heroina';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_origem_id_fkey | Status: MISSING_TARGET_COLUMN | Column: mapa_vivo_heroina.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_origem_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_origem_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jardim_heroina_registros.mapa_vivo_origem_id', v_source_type, 'mapa_vivo_heroina.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.mapa_vivo_heroina')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_origem_id_fkey | Status: TARGET_NOT_UNIQUE | Column: mapa_vivo_heroina.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jardim_heroina_registros_mapa_vivo_origem_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jardim_heroina_registros_session_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_session_case_id_fkey') THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_session_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_session_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jardim_heroina_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'session_case_id') THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_session_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jardim_heroina_registros.session_case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jardim_heroina_registros_session_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jardim_heroina_registros_session_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jardim_heroina_registros_session_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jardim_heroina_registros.session_case_id', v_source_type, 'session_cases.id', v_target_type;
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
                    RAISE NOTICE 'FK: jardim_heroina_registros_session_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jardim_heroina_registros_session_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jornada_heroina_notas_profissionais_registro_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_notas_profissionais_registro_id_fkey') THEN
        RAISE NOTICE 'FK: jornada_heroina_notas_profissionais_registro_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_notas_profissionais') THEN
        RAISE NOTICE 'FK: jornada_heroina_notas_profissionais_registro_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jornada_heroina_notas_profissionais';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_notas_profissionais' AND column_name = 'registro_id') THEN
        RAISE NOTICE 'FK: jornada_heroina_notas_profissionais_registro_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jornada_heroina_notas_profissionais.registro_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jornada_heroina_notas_profissionais_registro_id_fkey | Status: MISSING_TARGET_TABLE | Table: jornada_heroina_registros';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jornada_heroina_notas_profissionais_registro_id_fkey | Status: MISSING_TARGET_COLUMN | Column: jornada_heroina_registros.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_notas_profissionais' AND column_name = 'registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jornada_heroina_notas_profissionais_registro_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jornada_heroina_notas_profissionais.registro_id', v_source_type, 'jornada_heroina_registros.id', v_target_type;
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
                    RAISE NOTICE 'FK: jornada_heroina_notas_profissionais_registro_id_fkey | Status: TARGET_NOT_UNIQUE | Column: jornada_heroina_registros.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jornada_heroina_notas_profissionais_registro_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jornada_heroina_registros_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: jornada_heroina_registros_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') THEN
        RAISE NOTICE 'FK: jornada_heroina_registros_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jornada_heroina_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: jornada_heroina_registros_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jornada_heroina_registros.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jornada_heroina_registros_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jornada_heroina_registros_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jornada_heroina_registros_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jornada_heroina_registros.cliente_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: jornada_heroina_registros_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jornada_heroina_registros_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jornada_heroina_registros_session_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_session_case_id_fkey') THEN
        RAISE NOTICE 'FK: jornada_heroina_registros_session_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') THEN
        RAISE NOTICE 'FK: jornada_heroina_registros_session_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jornada_heroina_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'session_case_id') THEN
        RAISE NOTICE 'FK: jornada_heroina_registros_session_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jornada_heroina_registros.session_case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jornada_heroina_registros_session_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jornada_heroina_registros_session_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jornada_heroina_registros_session_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jornada_heroina_registros.session_case_id', v_source_type, 'session_cases.id', v_target_type;
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
                    RAISE NOTICE 'FK: jornada_heroina_registros_session_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jornada_heroina_registros_session_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jornada_heroina_respostas_registro_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_respostas_registro_id_fkey') THEN
        RAISE NOTICE 'FK: jornada_heroina_respostas_registro_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas') THEN
        RAISE NOTICE 'FK: jornada_heroina_respostas_registro_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jornada_heroina_respostas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas' AND column_name = 'registro_id') THEN
        RAISE NOTICE 'FK: jornada_heroina_respostas_registro_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jornada_heroina_respostas.registro_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jornada_heroina_respostas_registro_id_fkey | Status: MISSING_TARGET_TABLE | Table: jornada_heroina_registros';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jornada_heroina_respostas_registro_id_fkey | Status: MISSING_TARGET_COLUMN | Column: jornada_heroina_registros.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas' AND column_name = 'registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jornada_heroina_respostas_registro_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jornada_heroina_respostas.registro_id', v_source_type, 'jornada_heroina_registros.id', v_target_type;
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
                    RAISE NOTICE 'FK: jornada_heroina_respostas_registro_id_fkey | Status: TARGET_NOT_UNIQUE | Column: jornada_heroina_registros.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jornada_heroina_respostas_registro_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando jornada_individuacao_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_individuacao_client_id_fkey') THEN
        RAISE NOTICE 'FK: jornada_individuacao_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_individuacao') THEN
        RAISE NOTICE 'FK: jornada_individuacao_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: jornada_individuacao';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_individuacao' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: jornada_individuacao_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: jornada_individuacao.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: jornada_individuacao_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: jornada_individuacao_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_individuacao' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: jornada_individuacao_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'jornada_individuacao.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: jornada_individuacao_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: jornada_individuacao_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando journey_districts_district_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_districts_district_id_fkey') THEN
        RAISE NOTICE 'FK: journey_districts_district_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_districts') THEN
        RAISE NOTICE 'FK: journey_districts_district_id_fkey | Status: MISSING_SOURCE_TABLE | Table: journey_districts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'district_id') THEN
        RAISE NOTICE 'FK: journey_districts_district_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: journey_districts.district_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: journey_districts_district_id_fkey | Status: MISSING_TARGET_TABLE | Table: districts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: journey_districts_district_id_fkey | Status: MISSING_TARGET_COLUMN | Column: districts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: journey_districts_district_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'journey_districts.district_id', v_source_type, 'districts.id', v_target_type;
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
                    RAISE NOTICE 'FK: journey_districts_district_id_fkey | Status: TARGET_NOT_UNIQUE | Column: districts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: journey_districts_district_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando journey_districts_journey_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_districts_journey_id_fkey') THEN
        RAISE NOTICE 'FK: journey_districts_journey_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_districts') THEN
        RAISE NOTICE 'FK: journey_districts_journey_id_fkey | Status: MISSING_SOURCE_TABLE | Table: journey_districts';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'journey_id') THEN
        RAISE NOTICE 'FK: journey_districts_journey_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: journey_districts.journey_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: journey_districts_journey_id_fkey | Status: MISSING_TARGET_TABLE | Table: journeys';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: journey_districts_journey_id_fkey | Status: MISSING_TARGET_COLUMN | Column: journeys.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'journey_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: journey_districts_journey_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'journey_districts.journey_id', v_source_type, 'journeys.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.journeys')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: journey_districts_journey_id_fkey | Status: TARGET_NOT_UNIQUE | Column: journeys.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: journey_districts_journey_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando journey_events_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_client_id_fkey') THEN
        RAISE NOTICE 'FK: journey_events_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_events') THEN
        RAISE NOTICE 'FK: journey_events_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: journey_events';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: journey_events_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: journey_events.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: journey_events_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: journey_events_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: journey_events_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'journey_events.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: journey_events_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: journey_events_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando journey_events_session_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_session_id_fkey') THEN
        RAISE NOTICE 'FK: journey_events_session_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_events') THEN
        RAISE NOTICE 'FK: journey_events_session_id_fkey | Status: MISSING_SOURCE_TABLE | Table: journey_events';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'session_id') THEN
        RAISE NOTICE 'FK: journey_events_session_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: journey_events.session_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: journey_events_session_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: journey_events_session_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: journey_events_session_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'journey_events.session_id', v_source_type, 'sessions.id', v_target_type;
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
                    RAISE NOTICE 'FK: journey_events_session_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: journey_events_session_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando journey_media_journey_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_media_journey_id_fkey') THEN
        RAISE NOTICE 'FK: journey_media_journey_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_media') THEN
        RAISE NOTICE 'FK: journey_media_journey_id_fkey | Status: MISSING_SOURCE_TABLE | Table: journey_media';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_media' AND column_name = 'journey_id') THEN
        RAISE NOTICE 'FK: journey_media_journey_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: journey_media.journey_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: journey_media_journey_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_jornadas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: journey_media_journey_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_jornadas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_media' AND column_name = 'journey_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: journey_media_journey_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'journey_media.journey_id', v_source_type, 'clube_jornadas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_jornadas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: journey_media_journey_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_jornadas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: journey_media_journey_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando journey_reflections_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_reflections_client_id_fkey') THEN
        RAISE NOTICE 'FK: journey_reflections_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_reflections') THEN
        RAISE NOTICE 'FK: journey_reflections_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: journey_reflections';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_reflections' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: journey_reflections_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: journey_reflections.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: journey_reflections_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: journey_reflections_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_reflections' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: journey_reflections_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'journey_reflections.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: journey_reflections_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: journey_reflections_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando journeys_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_client_id_fkey') THEN
        RAISE NOTICE 'FK: journeys_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') THEN
        RAISE NOTICE 'FK: journeys_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: journeys';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: journeys_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: journeys.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: journeys_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: journeys_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: journeys_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'journeys.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: journeys_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: journeys_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando journeys_current_district_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_current_district_id_fkey') THEN
        RAISE NOTICE 'FK: journeys_current_district_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') THEN
        RAISE NOTICE 'FK: journeys_current_district_id_fkey | Status: MISSING_SOURCE_TABLE | Table: journeys';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'current_district_id') THEN
        RAISE NOTICE 'FK: journeys_current_district_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: journeys.current_district_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: journeys_current_district_id_fkey | Status: MISSING_TARGET_TABLE | Table: districts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: journeys_current_district_id_fkey | Status: MISSING_TARGET_COLUMN | Column: districts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'current_district_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: journeys_current_district_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'journeys.current_district_id', v_source_type, 'districts.id', v_target_type;
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
                    RAISE NOTICE 'FK: journeys_current_district_id_fkey | Status: TARGET_NOT_UNIQUE | Column: districts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: journeys_current_district_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando lab_8020_progress_book_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_book_id_fkey') THEN
        RAISE NOTICE 'FK: lab_8020_progress_book_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_8020_progress') THEN
        RAISE NOTICE 'FK: lab_8020_progress_book_id_fkey | Status: MISSING_SOURCE_TABLE | Table: lab_8020_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'book_id') THEN
        RAISE NOTICE 'FK: lab_8020_progress_book_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: lab_8020_progress.book_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: lab_8020_progress_book_id_fkey | Status: MISSING_TARGET_TABLE | Table: books';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: lab_8020_progress_book_id_fkey | Status: MISSING_TARGET_COLUMN | Column: books.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: lab_8020_progress_book_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'lab_8020_progress.book_id', v_source_type, 'books.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.books')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: lab_8020_progress_book_id_fkey | Status: TARGET_NOT_UNIQUE | Column: books.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: lab_8020_progress_book_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando lab_8020_progress_season_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_season_id_fkey') THEN
        RAISE NOTICE 'FK: lab_8020_progress_season_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_8020_progress') THEN
        RAISE NOTICE 'FK: lab_8020_progress_season_id_fkey | Status: MISSING_SOURCE_TABLE | Table: lab_8020_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'season_id') THEN
        RAISE NOTICE 'FK: lab_8020_progress_season_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: lab_8020_progress.season_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: lab_8020_progress_season_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracular_seasons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: lab_8020_progress_season_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracular_seasons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'season_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: lab_8020_progress_season_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'lab_8020_progress.season_id', v_source_type, 'oracular_seasons.id', v_target_type;
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
                    RAISE NOTICE 'FK: lab_8020_progress_season_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracular_seasons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: lab_8020_progress_season_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_39_portas_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_39_portas_client_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_39_portas_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas') THEN
        RAISE NOTICE 'FK: labirinto_39_portas_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_39_portas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: labirinto_39_portas_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_39_portas.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_39_portas_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_39_portas_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_39_portas_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_39_portas.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: labirinto_39_portas_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_39_portas_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_anotacoes_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_anotacoes_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes') THEN
        RAISE NOTICE 'FK: labirinto_anotacoes_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_anotacoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: labirinto_anotacoes_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_anotacoes.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_anotacoes_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_anotacoes_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_anotacoes_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_anotacoes.cliente_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: labirinto_anotacoes_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_anotacoes_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_anotacoes_porta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_porta_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_anotacoes_porta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes') THEN
        RAISE NOTICE 'FK: labirinto_anotacoes_porta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_anotacoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'porta_id') THEN
        RAISE NOTICE 'FK: labirinto_anotacoes_porta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_anotacoes.porta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_anotacoes_porta_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_portas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_anotacoes_porta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_portas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_anotacoes_porta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_anotacoes.porta_id', v_source_type, 'labirinto_portas.id', v_target_type;
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
                    RAISE NOTICE 'FK: labirinto_anotacoes_porta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_portas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_anotacoes_porta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_leituras_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_leituras_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_leituras') THEN
        RAISE NOTICE 'FK: labirinto_leituras_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_leituras';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: labirinto_leituras_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_leituras.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_leituras_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_leituras_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_leituras_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_leituras.cliente_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: labirinto_leituras_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_leituras_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_leituras_porta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_porta_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_leituras_porta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_leituras') THEN
        RAISE NOTICE 'FK: labirinto_leituras_porta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_leituras';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'porta_id') THEN
        RAISE NOTICE 'FK: labirinto_leituras_porta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_leituras.porta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_leituras_porta_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_portas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_leituras_porta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_portas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_leituras_porta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_leituras.porta_id', v_source_type, 'labirinto_portas.id', v_target_type;
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
                    RAISE NOTICE 'FK: labirinto_leituras_porta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_portas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_leituras_porta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_registros_arquetipo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_arquetipo_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_registros_arquetipo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        RAISE NOTICE 'FK: labirinto_registros_arquetipo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'arquetipo_id') THEN
        RAISE NOTICE 'FK: labirinto_registros_arquetipo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_registros.arquetipo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_registros_arquetipo_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_arquetipos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_registros_arquetipo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_arquetipos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_registros_arquetipo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_registros.arquetipo_id', v_source_type, 'labirinto_arquetipos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_arquetipos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: labirinto_registros_arquetipo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_arquetipos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_registros_arquetipo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_registros_fase_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_fase_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_registros_fase_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        RAISE NOTICE 'FK: labirinto_registros_fase_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'fase_id') THEN
        RAISE NOTICE 'FK: labirinto_registros_fase_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_registros.fase_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_registros_fase_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_fases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_registros_fase_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_fases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'fase_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_registros_fase_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_registros.fase_id', v_source_type, 'labirinto_fases.id', v_target_type;
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
                    RAISE NOTICE 'FK: labirinto_registros_fase_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_fases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_registros_fase_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_registros_metafora_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_metafora_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_registros_metafora_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        RAISE NOTICE 'FK: labirinto_registros_metafora_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'metafora_id') THEN
        RAISE NOTICE 'FK: labirinto_registros_metafora_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_registros.metafora_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_registros_metafora_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_metaforas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_registros_metafora_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_metaforas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'metafora_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_registros_metafora_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_registros.metafora_id', v_source_type, 'labirinto_metaforas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_metaforas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: labirinto_registros_metafora_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_metaforas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_registros_metafora_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_registros_ritual_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_ritual_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_registros_ritual_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        RAISE NOTICE 'FK: labirinto_registros_ritual_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'ritual_id') THEN
        RAISE NOTICE 'FK: labirinto_registros_ritual_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_registros.ritual_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_registros_ritual_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_rituais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_registros_ritual_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_rituais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'ritual_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_registros_ritual_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_registros.ritual_id', v_source_type, 'labirinto_rituais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_rituais')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: labirinto_registros_ritual_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_rituais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_registros_ritual_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_registros_session_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_session_case_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_registros_session_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        RAISE NOTICE 'FK: labirinto_registros_session_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'session_case_id') THEN
        RAISE NOTICE 'FK: labirinto_registros_session_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_registros.session_case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_registros_session_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_registros_session_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_registros_session_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_registros.session_case_id', v_source_type, 'session_cases.id', v_target_type;
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
                    RAISE NOTICE 'FK: labirinto_registros_session_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_registros_session_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_roteiros_gerados_arquetipo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_arquetipo_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_arquetipo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_arquetipo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_roteiros_gerados';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'arquetipo_id') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_arquetipo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_roteiros_gerados.arquetipo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_arquetipo_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_arquetipos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_roteiros_gerados_arquetipo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_arquetipos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'arquetipo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_roteiros_gerados_arquetipo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_roteiros_gerados.arquetipo_id', v_source_type, 'labirinto_arquetipos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_arquetipos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: labirinto_roteiros_gerados_arquetipo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_arquetipos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_roteiros_gerados_arquetipo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_roteiros_gerados_fase_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_fase_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_fase_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_fase_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_roteiros_gerados';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'fase_id') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_fase_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_roteiros_gerados.fase_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_fase_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_fases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_roteiros_gerados_fase_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_fases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'fase_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_roteiros_gerados_fase_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_roteiros_gerados.fase_id', v_source_type, 'labirinto_fases.id', v_target_type;
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
                    RAISE NOTICE 'FK: labirinto_roteiros_gerados_fase_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_fases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_roteiros_gerados_fase_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_roteiros_gerados_metafora_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_metafora_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_metafora_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_metafora_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_roteiros_gerados';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'metafora_id') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_metafora_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_roteiros_gerados.metafora_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_metafora_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_metaforas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_roteiros_gerados_metafora_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_metaforas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'metafora_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_roteiros_gerados_metafora_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_roteiros_gerados.metafora_id', v_source_type, 'labirinto_metaforas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_metaforas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: labirinto_roteiros_gerados_metafora_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_metaforas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_roteiros_gerados_metafora_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_roteiros_gerados_ritual_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_ritual_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_ritual_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_ritual_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_roteiros_gerados';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'ritual_id') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_ritual_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_roteiros_gerados.ritual_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_ritual_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_rituais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_roteiros_gerados_ritual_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_rituais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'ritual_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_roteiros_gerados_ritual_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_roteiros_gerados.ritual_id', v_source_type, 'labirinto_rituais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.labirinto_rituais')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: labirinto_roteiros_gerados_ritual_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_rituais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_roteiros_gerados_ritual_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labirinto_roteiros_gerados_session_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_session_case_id_fkey') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_session_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_session_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labirinto_roteiros_gerados';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'session_case_id') THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_session_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labirinto_roteiros_gerados.session_case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labirinto_roteiros_gerados_session_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labirinto_roteiros_gerados_session_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labirinto_roteiros_gerados_session_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labirinto_roteiros_gerados.session_case_id', v_source_type, 'session_cases.id', v_target_type;
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
                    RAISE NOTICE 'FK: labirinto_roteiros_gerados_session_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labirinto_roteiros_gerados_session_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labyrinth_records_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_client_id_fkey') THEN
        RAISE NOTICE 'FK: labyrinth_records_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labyrinth_records') THEN
        RAISE NOTICE 'FK: labyrinth_records_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labyrinth_records';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: labyrinth_records_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labyrinth_records.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labyrinth_records_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labyrinth_records_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labyrinth_records_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labyrinth_records.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: labyrinth_records_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labyrinth_records_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando labyrinth_records_session_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labyrinth_records_session_id_fkey') THEN
        RAISE NOTICE 'FK: labyrinth_records_session_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labyrinth_records') THEN
        RAISE NOTICE 'FK: labyrinth_records_session_id_fkey | Status: MISSING_SOURCE_TABLE | Table: labyrinth_records';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'session_id') THEN
        RAISE NOTICE 'FK: labyrinth_records_session_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: labyrinth_records.session_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: labyrinth_records_session_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: labyrinth_records_session_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labyrinth_records' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: labyrinth_records_session_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'labyrinth_records.session_id', v_source_type, 'sessions.id', v_target_type;
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
                    RAISE NOTICE 'FK: labyrinth_records_session_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: labyrinth_records_session_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando lessons_album_book_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_album_book_id_fkey') THEN
        RAISE NOTICE 'FK: lessons_album_book_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons_album') THEN
        RAISE NOTICE 'FK: lessons_album_book_id_fkey | Status: MISSING_SOURCE_TABLE | Table: lessons_album';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons_album' AND column_name = 'book_id') THEN
        RAISE NOTICE 'FK: lessons_album_book_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: lessons_album.book_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: lessons_album_book_id_fkey | Status: MISSING_TARGET_TABLE | Table: books';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: lessons_album_book_id_fkey | Status: MISSING_TARGET_COLUMN | Column: books.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons_album' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: lessons_album_book_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'lessons_album.book_id', v_source_type, 'books.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.books')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: lessons_album_book_id_fkey | Status: TARGET_NOT_UNIQUE | Column: books.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: lessons_album_book_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando lessons_travessia_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_travessia_id_fkey') THEN
        RAISE NOTICE 'FK: lessons_travessia_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') THEN
        RAISE NOTICE 'FK: lessons_travessia_id_fkey | Status: MISSING_SOURCE_TABLE | Table: lessons';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'travessia_id') THEN
        RAISE NOTICE 'FK: lessons_travessia_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: lessons.travessia_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: lessons_travessia_id_fkey | Status: MISSING_TARGET_TABLE | Table: travessias';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessias' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: lessons_travessia_id_fkey | Status: MISSING_TARGET_COLUMN | Column: travessias.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'travessia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessias' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: lessons_travessia_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'lessons.travessia_id', v_source_type, 'travessias.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.travessias')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: lessons_travessia_id_fkey | Status: TARGET_NOT_UNIQUE | Column: travessias.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: lessons_travessia_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando mapa_heroina_porta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_heroina_porta_id_fkey') THEN
        RAISE NOTICE 'FK: mapa_heroina_porta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_heroina') THEN
        RAISE NOTICE 'FK: mapa_heroina_porta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: mapa_heroina';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_heroina' AND column_name = 'porta_id') THEN
        RAISE NOTICE 'FK: mapa_heroina_porta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: mapa_heroina.porta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: mapa_heroina_porta_id_fkey | Status: MISSING_TARGET_TABLE | Table: labirinto_fases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: mapa_heroina_porta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: labirinto_fases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_heroina' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: mapa_heroina_porta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'mapa_heroina.porta_id', v_source_type, 'labirinto_fases.id', v_target_type;
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
                    RAISE NOTICE 'FK: mapa_heroina_porta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: labirinto_fases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: mapa_heroina_porta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando mapa_sombra_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_sombra_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: mapa_sombra_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_sombra') THEN
        RAISE NOTICE 'FK: mapa_sombra_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: mapa_sombra';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_sombra' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: mapa_sombra_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: mapa_sombra.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: mapa_sombra_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: mapa_sombra_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_sombra' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: mapa_sombra_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'mapa_sombra.cliente_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: mapa_sombra_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: mapa_sombra_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando mapa_vivo_heroina_gesto_jardim_registro_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_gesto_jardim_registro_id_fkey') THEN
        RAISE NOTICE 'FK: mapa_vivo_heroina_gesto_jardim_registro_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') THEN
        RAISE NOTICE 'FK: mapa_vivo_heroina_gesto_jardim_registro_id_fkey | Status: MISSING_SOURCE_TABLE | Table: mapa_vivo_heroina';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'gesto_jardim_registro_id') THEN
        RAISE NOTICE 'FK: mapa_vivo_heroina_gesto_jardim_registro_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: mapa_vivo_heroina.gesto_jardim_registro_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: mapa_vivo_heroina_gesto_jardim_registro_id_fkey | Status: MISSING_TARGET_TABLE | Table: jardim_heroina_registros';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: mapa_vivo_heroina_gesto_jardim_registro_id_fkey | Status: MISSING_TARGET_COLUMN | Column: jardim_heroina_registros.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'gesto_jardim_registro_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: mapa_vivo_heroina_gesto_jardim_registro_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'mapa_vivo_heroina.gesto_jardim_registro_id', v_source_type, 'jardim_heroina_registros.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.jardim_heroina_registros')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: mapa_vivo_heroina_gesto_jardim_registro_id_fkey | Status: TARGET_NOT_UNIQUE | Column: jardim_heroina_registros.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: mapa_vivo_heroina_gesto_jardim_registro_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando mapa_vivo_heroina_session_case_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_heroina_session_case_id_fkey') THEN
        RAISE NOTICE 'FK: mapa_vivo_heroina_session_case_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') THEN
        RAISE NOTICE 'FK: mapa_vivo_heroina_session_case_id_fkey | Status: MISSING_SOURCE_TABLE | Table: mapa_vivo_heroina';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'session_case_id') THEN
        RAISE NOTICE 'FK: mapa_vivo_heroina_session_case_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: mapa_vivo_heroina.session_case_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: mapa_vivo_heroina_session_case_id_fkey | Status: MISSING_TARGET_TABLE | Table: session_cases';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: mapa_vivo_heroina_session_case_id_fkey | Status: MISSING_TARGET_COLUMN | Column: session_cases.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'session_case_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: mapa_vivo_heroina_session_case_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'mapa_vivo_heroina.session_case_id', v_source_type, 'session_cases.id', v_target_type;
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
                    RAISE NOTICE 'FK: mapa_vivo_heroina_session_case_id_fkey | Status: TARGET_NOT_UNIQUE | Column: session_cases.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: mapa_vivo_heroina_session_case_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando mapa_vivo_historico_mapa_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapa_vivo_historico_mapa_id_fkey') THEN
        RAISE NOTICE 'FK: mapa_vivo_historico_mapa_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico') THEN
        RAISE NOTICE 'FK: mapa_vivo_historico_mapa_id_fkey | Status: MISSING_SOURCE_TABLE | Table: mapa_vivo_historico';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico' AND column_name = 'mapa_id') THEN
        RAISE NOTICE 'FK: mapa_vivo_historico_mapa_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: mapa_vivo_historico.mapa_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: mapa_vivo_historico_mapa_id_fkey | Status: MISSING_TARGET_TABLE | Table: mapa_vivo_heroina';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: mapa_vivo_historico_mapa_id_fkey | Status: MISSING_TARGET_COLUMN | Column: mapa_vivo_heroina.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_historico' AND column_name = 'mapa_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: mapa_vivo_historico_mapa_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'mapa_vivo_historico.mapa_id', v_source_type, 'mapa_vivo_heroina.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.mapa_vivo_heroina')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: mapa_vivo_historico_mapa_id_fkey | Status: TARGET_NOT_UNIQUE | Column: mapa_vivo_heroina.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: mapa_vivo_historico_mapa_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando mapeamento_complexos_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mapeamento_complexos_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: mapeamento_complexos_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos') THEN
        RAISE NOTICE 'FK: mapeamento_complexos_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: mapeamento_complexos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: mapeamento_complexos_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: mapeamento_complexos.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: mapeamento_complexos_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: mapeamento_complexos_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapeamento_complexos' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: mapeamento_complexos_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'mapeamento_complexos.cliente_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: mapeamento_complexos_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: mapeamento_complexos_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    RAISE NOTICE '--------------------------------------------------';
    RAISE NOTICE 'RESUMO PARCIAL (PARTE 5):';
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
