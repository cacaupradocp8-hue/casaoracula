-- BLOCO 07B - FOREIGN KEYS DRY RUN (PARTE 2 de 8)
-- Diagnóstico de FKs 51 a 100 (Total: 50)

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
    RAISE NOTICE 'Iniciando diagnóstico PARTE 2...';

    -- Analisando client_city_state_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_client_id_fkey') THEN
        RAISE NOTICE 'FK: client_city_state_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        RAISE NOTICE 'FK: client_city_state_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: client_city_state';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: client_city_state_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: client_city_state.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: client_city_state_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: client_city_state_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: client_city_state_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'client_city_state.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: client_city_state_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: client_city_state_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando client_city_state_distrito_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_distrito_id_fkey') THEN
        RAISE NOTICE 'FK: client_city_state_distrito_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        RAISE NOTICE 'FK: client_city_state_distrito_id_fkey | Status: MISSING_SOURCE_TABLE | Table: client_city_state';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'distrito_id') THEN
        RAISE NOTICE 'FK: client_city_state_distrito_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: client_city_state.distrito_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: client_city_state_distrito_id_fkey | Status: MISSING_TARGET_TABLE | Table: city_districts';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: client_city_state_distrito_id_fkey | Status: MISSING_TARGET_COLUMN | Column: city_districts.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'distrito_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: client_city_state_distrito_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'client_city_state.distrito_id', v_source_type, 'city_districts.id', v_target_type;
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
                    RAISE NOTICE 'FK: client_city_state_distrito_id_fkey | Status: TARGET_NOT_UNIQUE | Column: city_districts.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: client_city_state_distrito_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando client_city_state_ultima_ferramenta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_ferramenta_id_fkey') THEN
        RAISE NOTICE 'FK: client_city_state_ultima_ferramenta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        RAISE NOTICE 'FK: client_city_state_ultima_ferramenta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: client_city_state';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_ferramenta_id') THEN
        RAISE NOTICE 'FK: client_city_state_ultima_ferramenta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: client_city_state.ultima_ferramenta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: client_city_state_ultima_ferramenta_id_fkey | Status: MISSING_TARGET_TABLE | Table: tools';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: client_city_state_ultima_ferramenta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: tools.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_ferramenta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: client_city_state_ultima_ferramenta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'client_city_state.ultima_ferramenta_id', v_source_type, 'tools.id', v_target_type;
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
                    RAISE NOTICE 'FK: client_city_state_ultima_ferramenta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: tools.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: client_city_state_ultima_ferramenta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando client_city_state_ultima_sessao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_sessao_id_fkey') THEN
        RAISE NOTICE 'FK: client_city_state_ultima_sessao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        RAISE NOTICE 'FK: client_city_state_ultima_sessao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: client_city_state';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_sessao_id') THEN
        RAISE NOTICE 'FK: client_city_state_ultima_sessao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: client_city_state.ultima_sessao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: client_city_state_ultima_sessao_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: client_city_state_ultima_sessao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_sessao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: client_city_state_ultima_sessao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'client_city_state.ultima_sessao_id', v_source_type, 'sessions.id', v_target_type;
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
                    RAISE NOTICE 'FK: client_city_state_ultima_sessao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: client_city_state_ultima_sessao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando client_labyrinths_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_labyrinths_client_id_fkey') THEN
        RAISE NOTICE 'FK: client_labyrinths_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_labyrinths') THEN
        RAISE NOTICE 'FK: client_labyrinths_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: client_labyrinths';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_labyrinths' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: client_labyrinths_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: client_labyrinths.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: client_labyrinths_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: client_labyrinths_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_labyrinths' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: client_labyrinths_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'client_labyrinths.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: client_labyrinths_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: client_labyrinths_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando client_live_map_entries_session_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_live_map_entries_session_id_fkey') THEN
        RAISE NOTICE 'FK: client_live_map_entries_session_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_live_map_entries') THEN
        RAISE NOTICE 'FK: client_live_map_entries_session_id_fkey | Status: MISSING_SOURCE_TABLE | Table: client_live_map_entries';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_live_map_entries' AND column_name = 'session_id') THEN
        RAISE NOTICE 'FK: client_live_map_entries_session_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: client_live_map_entries.session_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: client_live_map_entries_session_id_fkey | Status: MISSING_TARGET_TABLE | Table: sessions';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: client_live_map_entries_session_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sessions.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_live_map_entries' AND column_name = 'session_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: client_live_map_entries_session_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'client_live_map_entries.session_id', v_source_type, 'sessions.id', v_target_type;
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
                    RAISE NOTICE 'FK: client_live_map_entries_session_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sessions.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: client_live_map_entries_session_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando client_pattern_stats_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_pattern_stats_client_id_fkey') THEN
        RAISE NOTICE 'FK: client_pattern_stats_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_pattern_stats') THEN
        RAISE NOTICE 'FK: client_pattern_stats_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: client_pattern_stats';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_pattern_stats' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: client_pattern_stats_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: client_pattern_stats.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: client_pattern_stats_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: client_pattern_stats_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_pattern_stats' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: client_pattern_stats_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'client_pattern_stats.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: client_pattern_stats_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: client_pattern_stats_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando client_seasons_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_seasons_client_id_fkey') THEN
        RAISE NOTICE 'FK: client_seasons_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_seasons') THEN
        RAISE NOTICE 'FK: client_seasons_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: client_seasons';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_seasons' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: client_seasons_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: client_seasons.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: client_seasons_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: client_seasons_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_seasons' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: client_seasons_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'client_seasons.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: client_seasons_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: client_seasons_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando club_books_cycle_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_books_cycle_id_fkey') THEN
        RAISE NOTICE 'FK: club_books_cycle_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_books') THEN
        RAISE NOTICE 'FK: club_books_cycle_id_fkey | Status: MISSING_SOURCE_TABLE | Table: _deprecated_club_books';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_books' AND column_name = 'cycle_id') THEN
        RAISE NOTICE 'FK: club_books_cycle_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: _deprecated_club_books.cycle_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: club_books_cycle_id_fkey | Status: MISSING_TARGET_TABLE | Table: _deprecated_club_cycles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: club_books_cycle_id_fkey | Status: MISSING_TARGET_COLUMN | Column: _deprecated_club_cycles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_books' AND column_name = 'cycle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: club_books_cycle_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', '_deprecated_club_books.cycle_id', v_source_type, '_deprecated_club_cycles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public._deprecated_club_cycles')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: club_books_cycle_id_fkey | Status: TARGET_NOT_UNIQUE | Column: _deprecated_club_cycles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: club_books_cycle_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando club_knowledge_entries_book_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_knowledge_entries_book_id_fkey') THEN
        RAISE NOTICE 'FK: club_knowledge_entries_book_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries') THEN
        RAISE NOTICE 'FK: club_knowledge_entries_book_id_fkey | Status: MISSING_SOURCE_TABLE | Table: _deprecated_club_knowledge_entries';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries' AND column_name = 'book_id') THEN
        RAISE NOTICE 'FK: club_knowledge_entries_book_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: _deprecated_club_knowledge_entries.book_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: club_knowledge_entries_book_id_fkey | Status: MISSING_TARGET_TABLE | Table: books';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: club_knowledge_entries_book_id_fkey | Status: MISSING_TARGET_COLUMN | Column: books.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: club_knowledge_entries_book_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', '_deprecated_club_knowledge_entries.book_id', v_source_type, 'books.id', v_target_type;
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
                    RAISE NOTICE 'FK: club_knowledge_entries_book_id_fkey | Status: TARGET_NOT_UNIQUE | Column: books.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: club_knowledge_entries_book_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando club_meetings_cycle_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_meetings_cycle_id_fkey') THEN
        RAISE NOTICE 'FK: club_meetings_cycle_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings') THEN
        RAISE NOTICE 'FK: club_meetings_cycle_id_fkey | Status: MISSING_SOURCE_TABLE | Table: _deprecated_club_meetings';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings' AND column_name = 'cycle_id') THEN
        RAISE NOTICE 'FK: club_meetings_cycle_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: _deprecated_club_meetings.cycle_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: club_meetings_cycle_id_fkey | Status: MISSING_TARGET_TABLE | Table: _deprecated_club_cycles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: club_meetings_cycle_id_fkey | Status: MISSING_TARGET_COLUMN | Column: _deprecated_club_cycles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings' AND column_name = 'cycle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: club_meetings_cycle_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', '_deprecated_club_meetings.cycle_id', v_source_type, '_deprecated_club_cycles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public._deprecated_club_cycles')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: club_meetings_cycle_id_fkey | Status: TARGET_NOT_UNIQUE | Column: _deprecated_club_cycles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: club_meetings_cycle_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando club_user_cycles_cycle_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_user_cycles_cycle_id_fkey') THEN
        RAISE NOTICE 'FK: club_user_cycles_cycle_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles') THEN
        RAISE NOTICE 'FK: club_user_cycles_cycle_id_fkey | Status: MISSING_SOURCE_TABLE | Table: _deprecated_club_user_cycles';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles' AND column_name = 'cycle_id') THEN
        RAISE NOTICE 'FK: club_user_cycles_cycle_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: _deprecated_club_user_cycles.cycle_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: club_user_cycles_cycle_id_fkey | Status: MISSING_TARGET_TABLE | Table: _deprecated_club_cycles';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: club_user_cycles_cycle_id_fkey | Status: MISSING_TARGET_COLUMN | Column: _deprecated_club_cycles.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles' AND column_name = 'cycle_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: club_user_cycles_cycle_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', '_deprecated_club_user_cycles.cycle_id', v_source_type, '_deprecated_club_cycles.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public._deprecated_club_cycles')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: club_user_cycles_cycle_id_fkey | Status: TARGET_NOT_UNIQUE | Column: _deprecated_club_cycles.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: club_user_cycles_cycle_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_audio_albums_estacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_albums_estacao_id_fkey') THEN
        RAISE NOTICE 'FK: clube_audio_albums_estacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_albums') THEN
        RAISE NOTICE 'FK: clube_audio_albums_estacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_audio_albums';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'estacao_id') THEN
        RAISE NOTICE 'FK: clube_audio_albums_estacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_audio_albums.estacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_audio_albums_estacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_estacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_audio_albums_estacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_estacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_audio_albums_estacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_audio_albums.estacao_id', v_source_type, 'clube_estacoes.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_audio_albums_estacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_estacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_audio_albums_estacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_audio_progress_track_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_progress_track_id_fkey') THEN
        RAISE NOTICE 'FK: clube_audio_progress_track_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_progress') THEN
        RAISE NOTICE 'FK: clube_audio_progress_track_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_audio_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_progress' AND column_name = 'track_id') THEN
        RAISE NOTICE 'FK: clube_audio_progress_track_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_audio_progress.track_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_audio_progress_track_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_audio_tracks';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_audio_progress_track_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_audio_tracks.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_progress' AND column_name = 'track_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_audio_progress_track_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_audio_progress.track_id', v_source_type, 'clube_audio_tracks.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_audio_tracks')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_audio_progress_track_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_audio_tracks.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_audio_progress_track_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_audio_tracks_album_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_tracks_album_id_fkey') THEN
        RAISE NOTICE 'FK: clube_audio_tracks_album_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks') THEN
        RAISE NOTICE 'FK: clube_audio_tracks_album_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_audio_tracks';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'album_id') THEN
        RAISE NOTICE 'FK: clube_audio_tracks_album_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_audio_tracks.album_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_albums') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_audio_tracks_album_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_audio_albums';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_audio_tracks_album_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_audio_albums.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'album_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_audio_tracks_album_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_audio_tracks.album_id', v_source_type, 'clube_audio_albums.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_audio_albums')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_audio_tracks_album_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_audio_albums.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_audio_tracks_album_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_carrossel_slides_estacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_carrossel_slides_estacao_id_fkey') THEN
        RAISE NOTICE 'FK: clube_carrossel_slides_estacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides') THEN
        RAISE NOTICE 'FK: clube_carrossel_slides_estacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_carrossel_slides';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides' AND column_name = 'estacao_id') THEN
        RAISE NOTICE 'FK: clube_carrossel_slides_estacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_carrossel_slides.estacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_carrossel_slides_estacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracular_seasons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_carrossel_slides_estacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracular_seasons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_carrossel_slides_estacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_carrossel_slides.estacao_id', v_source_type, 'oracular_seasons.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_carrossel_slides_estacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracular_seasons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_carrossel_slides_estacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_engajamento_estacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_engajamento_estacao_id_fkey') THEN
        RAISE NOTICE 'FK: clube_engajamento_estacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_engajamento') THEN
        RAISE NOTICE 'FK: clube_engajamento_estacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_engajamento';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_engajamento' AND column_name = 'estacao_id') THEN
        RAISE NOTICE 'FK: clube_engajamento_estacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_engajamento.estacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_engajamento_estacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_estacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_engajamento_estacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_estacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_engajamento' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_engajamento_estacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_engajamento.estacao_id', v_source_type, 'clube_estacoes.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_engajamento_estacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_estacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_engajamento_estacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_estacao_registros_estacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacao_registros_estacao_id_fkey') THEN
        RAISE NOTICE 'FK: clube_estacao_registros_estacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros') THEN
        RAISE NOTICE 'FK: clube_estacao_registros_estacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_estacao_registros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros' AND column_name = 'estacao_id') THEN
        RAISE NOTICE 'FK: clube_estacao_registros_estacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_estacao_registros.estacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_estacao_registros_estacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_estacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_estacao_registros_estacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_estacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_estacao_registros_estacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_estacao_registros.estacao_id', v_source_type, 'clube_estacoes.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_estacao_registros_estacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_estacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_estacao_registros_estacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_estacoes_cartografia_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_cartografia_id_fkey') THEN
        RAISE NOTICE 'FK: clube_estacoes_cartografia_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') THEN
        RAISE NOTICE 'FK: clube_estacoes_cartografia_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_estacoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'cartografia_id') THEN
        RAISE NOTICE 'FK: clube_estacoes_cartografia_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_estacoes.cartografia_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_estacoes_cartografia_id_fkey | Status: MISSING_TARGET_TABLE | Table: cartographies';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_estacoes_cartografia_id_fkey | Status: MISSING_TARGET_COLUMN | Column: cartographies.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'cartografia_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_estacoes_cartografia_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_estacoes.cartografia_id', v_source_type, 'cartographies.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.cartographies')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_estacoes_cartografia_id_fkey | Status: TARGET_NOT_UNIQUE | Column: cartographies.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_estacoes_cartografia_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_estacoes_quiz_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_quiz_id_fkey') THEN
        RAISE NOTICE 'FK: clube_estacoes_quiz_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') THEN
        RAISE NOTICE 'FK: clube_estacoes_quiz_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_estacoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'quiz_id') THEN
        RAISE NOTICE 'FK: clube_estacoes_quiz_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_estacoes.quiz_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_estacoes_quiz_id_fkey | Status: MISSING_TARGET_TABLE | Table: quizzes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_estacoes_quiz_id_fkey | Status: MISSING_TARGET_COLUMN | Column: quizzes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'quiz_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_estacoes_quiz_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_estacoes.quiz_id', v_source_type, 'quizzes.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_estacoes_quiz_id_fkey | Status: TARGET_NOT_UNIQUE | Column: quizzes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_estacoes_quiz_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_jornadas_estacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_jornadas_estacao_id_fkey') THEN
        RAISE NOTICE 'FK: clube_jornadas_estacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') THEN
        RAISE NOTICE 'FK: clube_jornadas_estacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_jornadas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'estacao_id') THEN
        RAISE NOTICE 'FK: clube_jornadas_estacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_jornadas.estacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_jornadas_estacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_estacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_jornadas_estacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_estacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_jornadas_estacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_jornadas.estacao_id', v_source_type, 'clube_estacoes.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_jornadas_estacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_estacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_jornadas_estacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_livro_aulas_porta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_aulas_porta_id_fkey') THEN
        RAISE NOTICE 'FK: clube_livro_aulas_porta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas') THEN
        RAISE NOTICE 'FK: clube_livro_aulas_porta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_livro_aulas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas' AND column_name = 'porta_id') THEN
        RAISE NOTICE 'FK: clube_livro_aulas_porta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_livro_aulas.porta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_portas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_livro_aulas_porta_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_livro_portas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_portas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_livro_aulas_porta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_livro_portas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas' AND column_name = 'porta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_portas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_livro_aulas_porta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_livro_aulas.porta_id', v_source_type, 'clube_livro_portas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_livro_portas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_livro_aulas_porta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_livro_portas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_livro_aulas_porta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_livro_chat_interactions_book_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_chat_interactions_book_id_fkey') THEN
        RAISE NOTICE 'FK: clube_livro_chat_interactions_book_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions') THEN
        RAISE NOTICE 'FK: clube_livro_chat_interactions_book_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_livro_chat_interactions';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions' AND column_name = 'book_id') THEN
        RAISE NOTICE 'FK: clube_livro_chat_interactions_book_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_livro_chat_interactions.book_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_livro_chat_interactions_book_id_fkey | Status: MISSING_TARGET_TABLE | Table: books';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_livro_chat_interactions_book_id_fkey | Status: MISSING_TARGET_COLUMN | Column: books.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_livro_chat_interactions_book_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_livro_chat_interactions.book_id', v_source_type, 'books.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_livro_chat_interactions_book_id_fkey | Status: TARGET_NOT_UNIQUE | Column: books.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_livro_chat_interactions_book_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_livro_encontros_estacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_encontros_estacao_id_fkey') THEN
        RAISE NOTICE 'FK: clube_livro_encontros_estacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros') THEN
        RAISE NOTICE 'FK: clube_livro_encontros_estacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_livro_encontros';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros' AND column_name = 'estacao_id') THEN
        RAISE NOTICE 'FK: clube_livro_encontros_estacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_livro_encontros.estacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_livro_encontros_estacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_estacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_livro_encontros_estacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_estacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_livro_encontros_estacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_livro_encontros.estacao_id', v_source_type, 'clube_estacoes.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_livro_encontros_estacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_estacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_livro_encontros_estacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_livro_respostas_pergunta_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_respostas_pergunta_id_fkey') THEN
        RAISE NOTICE 'FK: clube_livro_respostas_pergunta_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas') THEN
        RAISE NOTICE 'FK: clube_livro_respostas_pergunta_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_livro_respostas';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas' AND column_name = 'pergunta_id') THEN
        RAISE NOTICE 'FK: clube_livro_respostas_pergunta_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_livro_respostas.pergunta_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_livro_respostas_pergunta_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_livro_perguntas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_livro_respostas_pergunta_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_livro_perguntas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas' AND column_name = 'pergunta_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_livro_respostas_pergunta_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_livro_respostas.pergunta_id', v_source_type, 'clube_livro_perguntas.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_livro_perguntas')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_livro_respostas_pergunta_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_livro_perguntas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_livro_respostas_pergunta_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_obras_essencia_8020_book_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_obras_essencia_8020_book_id_fkey') THEN
        RAISE NOTICE 'FK: clube_obras_essencia_8020_book_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020') THEN
        RAISE NOTICE 'FK: clube_obras_essencia_8020_book_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_obras_essencia_8020';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020' AND column_name = 'book_id') THEN
        RAISE NOTICE 'FK: clube_obras_essencia_8020_book_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_obras_essencia_8020.book_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_obras_essencia_8020_book_id_fkey | Status: MISSING_TARGET_TABLE | Table: books';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_obras_essencia_8020_book_id_fkey | Status: MISSING_TARGET_COLUMN | Column: books.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020' AND column_name = 'book_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_obras_essencia_8020_book_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_obras_essencia_8020.book_id', v_source_type, 'books.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_obras_essencia_8020_book_id_fkey | Status: TARGET_NOT_UNIQUE | Column: books.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_obras_essencia_8020_book_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_portais_jornada_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portais_jornada_id_fkey') THEN
        RAISE NOTICE 'FK: clube_portais_jornada_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') THEN
        RAISE NOTICE 'FK: clube_portais_jornada_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_portais';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'jornada_id') THEN
        RAISE NOTICE 'FK: clube_portais_jornada_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_portais.jornada_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_portais_jornada_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_jornadas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_portais_jornada_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_jornadas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'jornada_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_portais_jornada_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_portais.jornada_id', v_source_type, 'clube_jornadas.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_portais_jornada_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_jornadas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_portais_jornada_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_portal_audios_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_audios_portal_id_fkey') THEN
        RAISE NOTICE 'FK: clube_portal_audios_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_audios') THEN
        RAISE NOTICE 'FK: clube_portal_audios_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_portal_audios';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_audios' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: clube_portal_audios_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_portal_audios.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_portal_audios_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_portal_audios_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_audios' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_portal_audios_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_portal_audios.portal_id', v_source_type, 'clube_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_portais')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_portal_audios_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_portal_audios_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_portal_insights_estacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_insights_estacao_id_fkey') THEN
        RAISE NOTICE 'FK: clube_portal_insights_estacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_insights') THEN
        RAISE NOTICE 'FK: clube_portal_insights_estacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_portal_insights';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_insights' AND column_name = 'estacao_id') THEN
        RAISE NOTICE 'FK: clube_portal_insights_estacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_portal_insights.estacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_portal_insights_estacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: oracular_seasons';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_portal_insights_estacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: oracular_seasons.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_insights' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_portal_insights_estacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_portal_insights.estacao_id', v_source_type, 'oracular_seasons.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_portal_insights_estacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: oracular_seasons.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_portal_insights_estacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_portal_materiais_portal_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_materiais_portal_id_fkey') THEN
        RAISE NOTICE 'FK: clube_portal_materiais_portal_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais') THEN
        RAISE NOTICE 'FK: clube_portal_materiais_portal_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_portal_materiais';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais' AND column_name = 'portal_id') THEN
        RAISE NOTICE 'FK: clube_portal_materiais_portal_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_portal_materiais.portal_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_portal_materiais_portal_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_portais';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_portal_materiais_portal_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_portais.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais' AND column_name = 'portal_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_portal_materiais_portal_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_portal_materiais.portal_id', v_source_type, 'clube_portais.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_portais')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_portal_materiais_portal_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_portais.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_portal_materiais_portal_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_progresso_passos_passo_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_progresso_passos_passo_id_fkey') THEN
        RAISE NOTICE 'FK: clube_progresso_passos_passo_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos') THEN
        RAISE NOTICE 'FK: clube_progresso_passos_passo_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_progresso_passos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos' AND column_name = 'passo_id') THEN
        RAISE NOTICE 'FK: clube_progresso_passos_passo_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_progresso_passos.passo_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_progresso_passos_passo_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_rota_itens';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_progresso_passos_passo_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_rota_itens.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos' AND column_name = 'passo_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_progresso_passos_passo_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_progresso_passos.passo_id', v_source_type, 'clube_rota_itens.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_rota_itens')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_progresso_passos_passo_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_rota_itens.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_progresso_passos_passo_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_reflexoes_estacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_reflexoes_estacao_id_fkey') THEN
        RAISE NOTICE 'FK: clube_reflexoes_estacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_reflexoes') THEN
        RAISE NOTICE 'FK: clube_reflexoes_estacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_reflexoes';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_reflexoes' AND column_name = 'estacao_id') THEN
        RAISE NOTICE 'FK: clube_reflexoes_estacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_reflexoes.estacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_reflexoes_estacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_estacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_reflexoes_estacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_estacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_reflexoes' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_reflexoes_estacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_reflexoes.estacao_id', v_source_type, 'clube_estacoes.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_reflexoes_estacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_estacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_reflexoes_estacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_rota_itens_estacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_itens_estacao_id_fkey') THEN
        RAISE NOTICE 'FK: clube_rota_itens_estacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') THEN
        RAISE NOTICE 'FK: clube_rota_itens_estacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_rota_itens';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'estacao_id') THEN
        RAISE NOTICE 'FK: clube_rota_itens_estacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_rota_itens.estacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_rota_itens_estacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_estacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_rota_itens_estacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_estacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_rota_itens_estacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_rota_itens.estacao_id', v_source_type, 'clube_estacoes.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_rota_itens_estacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_estacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_rota_itens_estacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_rota_progresso_estacao_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_estacao_id_fkey') THEN
        RAISE NOTICE 'FK: clube_rota_progresso_estacao_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') THEN
        RAISE NOTICE 'FK: clube_rota_progresso_estacao_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_rota_progresso';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'estacao_id') THEN
        RAISE NOTICE 'FK: clube_rota_progresso_estacao_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_rota_progresso.estacao_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_rota_progresso_estacao_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_estacoes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_rota_progresso_estacao_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_estacoes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'estacao_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_rota_progresso_estacao_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_rota_progresso.estacao_id', v_source_type, 'clube_estacoes.id', v_target_type;
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
                    RAISE NOTICE 'FK: clube_rota_progresso_estacao_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_estacoes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_rota_progresso_estacao_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_rota_progresso_rota_item_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_rota_item_id_fkey') THEN
        RAISE NOTICE 'FK: clube_rota_progresso_rota_item_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') THEN
        RAISE NOTICE 'FK: clube_rota_progresso_rota_item_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_rota_progresso';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'rota_item_id') THEN
        RAISE NOTICE 'FK: clube_rota_progresso_rota_item_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_rota_progresso.rota_item_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_rota_progresso_rota_item_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_rota_itens';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_rota_progresso_rota_item_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_rota_itens.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'rota_item_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_rota_progresso_rota_item_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_rota_progresso.rota_item_id', v_source_type, 'clube_rota_itens.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_rota_itens')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_rota_progresso_rota_item_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_rota_itens.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_rota_progresso_rota_item_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_v3_station_audios_station_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_audios_station_id_fkey') THEN
        RAISE NOTICE 'FK: clube_v3_station_audios_station_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios') THEN
        RAISE NOTICE 'FK: clube_v3_station_audios_station_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_v3_station_audios';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios' AND column_name = 'station_id') THEN
        RAISE NOTICE 'FK: clube_v3_station_audios_station_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_v3_station_audios.station_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_v3_station_audios_station_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_v3_stations';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_v3_station_audios_station_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_v3_stations.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios' AND column_name = 'station_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_v3_station_audios_station_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_v3_station_audios.station_id', v_source_type, 'clube_v3_stations.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_v3_stations')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_v3_station_audios_station_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_v3_stations.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_v3_station_audios_station_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_v3_station_content_station_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_content_station_id_fkey') THEN
        RAISE NOTICE 'FK: clube_v3_station_content_station_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content') THEN
        RAISE NOTICE 'FK: clube_v3_station_content_station_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_v3_station_content';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content' AND column_name = 'station_id') THEN
        RAISE NOTICE 'FK: clube_v3_station_content_station_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_v3_station_content.station_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_v3_station_content_station_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_v3_stations';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_v3_station_content_station_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_v3_stations.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content' AND column_name = 'station_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_v3_station_content_station_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_v3_station_content.station_id', v_source_type, 'clube_v3_stations.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_v3_stations')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_v3_station_content_station_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_v3_stations.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_v3_station_content_station_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_v3_stations_route_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_stations_route_id_fkey') THEN
        RAISE NOTICE 'FK: clube_v3_stations_route_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') THEN
        RAISE NOTICE 'FK: clube_v3_stations_route_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_v3_stations';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'route_id') THEN
        RAISE NOTICE 'FK: clube_v3_stations_route_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_v3_stations.route_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_routes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_v3_stations_route_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_v3_routes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_routes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_v3_stations_route_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_v3_routes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'route_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_routes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_v3_stations_route_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_v3_stations.route_id', v_source_type, 'clube_v3_routes.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_v3_routes')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_v3_stations_route_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_v3_routes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_v3_stations_route_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando clube_v3_user_progress_station_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_user_progress_station_id_fkey') THEN
        RAISE NOTICE 'FK: clube_v3_user_progress_station_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress') THEN
        RAISE NOTICE 'FK: clube_v3_user_progress_station_id_fkey | Status: MISSING_SOURCE_TABLE | Table: clube_v3_user_progress';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress' AND column_name = 'station_id') THEN
        RAISE NOTICE 'FK: clube_v3_user_progress_station_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: clube_v3_user_progress.station_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: clube_v3_user_progress_station_id_fkey | Status: MISSING_TARGET_TABLE | Table: clube_v3_stations';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: clube_v3_user_progress_station_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clube_v3_stations.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress' AND column_name = 'station_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: clube_v3_user_progress_station_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'clube_v3_user_progress.station_id', v_source_type, 'clube_v3_stations.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.clube_v3_stations')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: clube_v3_user_progress_station_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clube_v3_stations.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: clube_v3_user_progress_station_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_ai_recommendations_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_client_id_fkey') THEN
        RAISE NOTICE 'FK: co_ai_recommendations_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN
        RAISE NOTICE 'FK: co_ai_recommendations_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_ai_recommendations';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: co_ai_recommendations_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_ai_recommendations.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_ai_recommendations_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_ai_recommendations_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_ai_recommendations_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_ai_recommendations.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: co_ai_recommendations_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_ai_recommendations_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_ai_recommendations_tool_complementar_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_complementar_id_fkey') THEN
        RAISE NOTICE 'FK: co_ai_recommendations_tool_complementar_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN
        RAISE NOTICE 'FK: co_ai_recommendations_tool_complementar_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_ai_recommendations';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_complementar_id') THEN
        RAISE NOTICE 'FK: co_ai_recommendations_tool_complementar_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_ai_recommendations.tool_complementar_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_ai_recommendations_tool_complementar_id_fkey | Status: MISSING_TARGET_TABLE | Table: sala_ferramentas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_ai_recommendations_tool_complementar_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sala_ferramentas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_complementar_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_ai_recommendations_tool_complementar_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_ai_recommendations.tool_complementar_id', v_source_type, 'sala_ferramentas.id', v_target_type;
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
                    RAISE NOTICE 'FK: co_ai_recommendations_tool_complementar_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sala_ferramentas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_ai_recommendations_tool_complementar_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_ai_recommendations_tool_sugerida_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_sugerida_id_fkey') THEN
        RAISE NOTICE 'FK: co_ai_recommendations_tool_sugerida_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN
        RAISE NOTICE 'FK: co_ai_recommendations_tool_sugerida_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_ai_recommendations';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_sugerida_id') THEN
        RAISE NOTICE 'FK: co_ai_recommendations_tool_sugerida_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_ai_recommendations.tool_sugerida_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_ai_recommendations_tool_sugerida_id_fkey | Status: MISSING_TARGET_TABLE | Table: sala_ferramentas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_ai_recommendations_tool_sugerida_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sala_ferramentas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_sugerida_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_ai_recommendations_tool_sugerida_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_ai_recommendations.tool_sugerida_id', v_source_type, 'sala_ferramentas.id', v_target_type;
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
                    RAISE NOTICE 'FK: co_ai_recommendations_tool_sugerida_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sala_ferramentas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_ai_recommendations_tool_sugerida_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_appointments_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_client_id_fkey') THEN
        RAISE NOTICE 'FK: co_appointments_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_appointments') THEN
        RAISE NOTICE 'FK: co_appointments_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_appointments';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: co_appointments_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_appointments.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_appointments_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_appointments_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_appointments_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_appointments.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: co_appointments_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_appointments_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_appointments_workspace_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_workspace_id_fkey') THEN
        RAISE NOTICE 'FK: co_appointments_workspace_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_appointments') THEN
        RAISE NOTICE 'FK: co_appointments_workspace_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_appointments';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'workspace_id') THEN
        RAISE NOTICE 'FK: co_appointments_workspace_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_appointments.workspace_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_appointments_workspace_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_workspaces';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_appointments_workspace_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_workspaces.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'workspace_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_appointments_workspace_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_appointments.workspace_id', v_source_type, 'co_workspaces.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_workspaces')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_appointments_workspace_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_workspaces.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_appointments_workspace_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_camara_sussurro_casos_proximo_treino_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_camara_sussurro_casos_proximo_treino_id_fkey') THEN
        RAISE NOTICE 'FK: co_camara_sussurro_casos_proximo_treino_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos') THEN
        RAISE NOTICE 'FK: co_camara_sussurro_casos_proximo_treino_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_camara_sussurro_casos';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'proximo_treino_id') THEN
        RAISE NOTICE 'FK: co_camara_sussurro_casos_proximo_treino_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_camara_sussurro_casos.proximo_treino_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_camara_sussurro_casos_proximo_treino_id_fkey | Status: MISSING_TARGET_TABLE | Table: co_camara_sussurro_casos';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_camara_sussurro_casos_proximo_treino_id_fkey | Status: MISSING_TARGET_COLUMN | Column: co_camara_sussurro_casos.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'proximo_treino_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_camara_sussurro_casos_proximo_treino_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_camara_sussurro_casos.proximo_treino_id', v_source_type, 'co_camara_sussurro_casos.id', v_target_type;
                v_total_type_mismatch := v_total_type_mismatch + 1;
            ELSE
                SELECT EXISTS (
                    SELECT 1 
                    FROM pg_index i
                    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                    WHERE i.indrelid = ('public.co_camara_sussurro_casos')::regclass
                    AND a.attname = 'id'
                    AND i.indisunique
                ) INTO v_is_unique;
                
                IF NOT v_is_unique THEN
                    RAISE NOTICE 'FK: co_camara_sussurro_casos_proximo_treino_id_fkey | Status: TARGET_NOT_UNIQUE | Column: co_camara_sussurro_casos.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_camara_sussurro_casos_proximo_treino_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_city_history_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_client_id_fkey') THEN
        RAISE NOTICE 'FK: co_city_history_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_city_history') THEN
        RAISE NOTICE 'FK: co_city_history_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_city_history';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: co_city_history_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_city_history.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_city_history_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_city_history_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_city_history_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_city_history.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: co_city_history_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_city_history_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_city_history_tool_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_tool_id_fkey') THEN
        RAISE NOTICE 'FK: co_city_history_tool_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_city_history') THEN
        RAISE NOTICE 'FK: co_city_history_tool_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_city_history';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'tool_id') THEN
        RAISE NOTICE 'FK: co_city_history_tool_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_city_history.tool_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_city_history_tool_id_fkey | Status: MISSING_TARGET_TABLE | Table: sala_ferramentas';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_city_history_tool_id_fkey | Status: MISSING_TARGET_COLUMN | Column: sala_ferramentas.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'tool_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_city_history_tool_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_city_history.tool_id', v_source_type, 'sala_ferramentas.id', v_target_type;
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
                    RAISE NOTICE 'FK: co_city_history_tool_id_fkey | Status: TARGET_NOT_UNIQUE | Column: sala_ferramentas.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_city_history_tool_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_client_profile_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profile_client_id_fkey') THEN
        RAISE NOTICE 'FK: co_client_profile_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_client_profile') THEN
        RAISE NOTICE 'FK: co_client_profile_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_client_profile';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profile' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: co_client_profile_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_client_profile.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_client_profile_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_client_profile_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profile' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_client_profile_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_client_profile.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: co_client_profile_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_client_profile_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_client_profiles_client_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profiles_client_id_fkey') THEN
        RAISE NOTICE 'FK: co_client_profiles_client_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_client_profiles') THEN
        RAISE NOTICE 'FK: co_client_profiles_client_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_client_profiles';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profiles' AND column_name = 'client_id') THEN
        RAISE NOTICE 'FK: co_client_profiles_client_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_client_profiles.client_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_client_profiles_client_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_client_profiles_client_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profiles' AND column_name = 'client_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_client_profiles_client_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_client_profiles.client_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: co_client_profiles_client_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_client_profiles_client_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analisando co_convites_cliente_id_fkey
    v_total_analyzed := v_total_analyzed + 1;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_convites_cliente_id_fkey') THEN
        RAISE NOTICE 'FK: co_convites_cliente_id_fkey | Status: EXISTS';
        v_total_exists := v_total_exists + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_convites') THEN
        RAISE NOTICE 'FK: co_convites_cliente_id_fkey | Status: MISSING_SOURCE_TABLE | Table: co_convites';
        v_total_missing_source_table := v_total_missing_source_table + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_convites' AND column_name = 'cliente_id') THEN
        RAISE NOTICE 'FK: co_convites_cliente_id_fkey | Status: MISSING_SOURCE_COLUMN | Column: co_convites.cliente_id';
        v_total_missing_source_column := v_total_missing_source_column + 1;
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        RAISE NOTICE 'FK: co_convites_cliente_id_fkey | Status: MISSING_TARGET_TABLE | Table: clientes';
        v_total_missing_target_table := v_total_missing_target_table + 1;
    ELSE
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
             RAISE NOTICE 'FK: co_convites_cliente_id_fkey | Status: MISSING_TARGET_COLUMN | Column: clientes.id';
             v_total_missing_target_column := v_total_missing_target_column + 1;
        ELSE
            SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_convites' AND column_name = 'cliente_id';
            SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
            
            IF v_source_type <> v_target_type THEN
                RAISE NOTICE 'FK: co_convites_cliente_id_fkey | Status: TYPE_MISMATCH | % (%) vs % (%)', 'co_convites.cliente_id', v_source_type, 'clientes.id', v_target_type;
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
                    RAISE NOTICE 'FK: co_convites_cliente_id_fkey | Status: TARGET_NOT_UNIQUE | Column: clientes.id';
                    v_total_target_not_unique := v_total_target_not_unique + 1;
                ELSE
                    RAISE NOTICE 'FK: co_convites_cliente_id_fkey | Status: READY_TO_CREATE';
                    v_total_ready := v_total_ready + 1;
                END IF;
            END IF;
        END IF;
    END IF;

    RAISE NOTICE '--------------------------------------------------';
    RAISE NOTICE 'RESUMO PARCIAL (PARTE 2):';
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
