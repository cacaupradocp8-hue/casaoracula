-- BLOCO 07B - FOREIGN KEYS DIAGNOSTIC TABULAR (PARTE 5 de 8)
-- Diagnóstico de FKs 193 a 240 (Total: 48)

-- 1. Criar tabela temporária de diagnóstico
CREATE TEMP TABLE diagnostic_results (
    constraint_name TEXT,
    status TEXT,
    source_table TEXT,
    source_column TEXT,
    target_table TEXT,
    target_column TEXT,
    reason TEXT
) ON COMMIT DROP;

-- 2. Lógica de análise e preenchimento da tabela
DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN

    -- Analyzing group_sessions_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'group_sessions_group_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'EXISTS', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_sessions') THEN
        INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'MISSING_SOURCE_TABLE', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Table group_sessions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'group_id') THEN
        INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Column group_sessions.group_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'MISSING_TARGET_TABLE', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Table therapeutic_groups not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'therapeutic_groups' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Column therapeutic_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'group_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'TYPE_MISMATCH', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'therapeutic_groups');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'READY_TO_CREATE', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'MISSING_TARGET_COLUMN', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Column therapeutic_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'group_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'TYPE_MISMATCH', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'TARGET_NOT_UNIQUE', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('group_sessions_group_id_fkey', 'READY_TO_CREATE', 'group_sessions', 'group_id', 'therapeutic_groups', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing heroina_arquetipo_registros_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_arquetipo_registros_arquetipo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'EXISTS', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Table heroina_arquetipo_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros' AND column_name = 'arquetipo_id') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Column heroina_arquetipo_registros.arquetipo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Table labirinto_arquetipos not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_arquetipos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Column labirinto_arquetipos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros' AND column_name = 'arquetipo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'TYPE_MISMATCH', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_arquetipos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'READY_TO_CREATE', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Column labirinto_arquetipos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_arquetipo_registros' AND column_name = 'arquetipo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'TYPE_MISMATCH', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('heroina_arquetipo_registros_arquetipo_id_fkey', 'READY_TO_CREATE', 'heroina_arquetipo_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing heroina_cenario_registros_metafora_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_cenario_registros_metafora_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'EXISTS', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'MISSING_SOURCE_TABLE', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Table heroina_cenario_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros' AND column_name = 'metafora_id') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'MISSING_SOURCE_COLUMN', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Column heroina_cenario_registros.metafora_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'MISSING_TARGET_TABLE', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Table labirinto_metaforas not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_metaforas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Column labirinto_metaforas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros' AND column_name = 'metafora_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'TYPE_MISMATCH', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_metaforas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'READY_TO_CREATE', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Column labirinto_metaforas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_cenario_registros' AND column_name = 'metafora_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'TYPE_MISMATCH', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'TARGET_NOT_UNIQUE', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('heroina_cenario_registros_metafora_id_fkey', 'READY_TO_CREATE', 'heroina_cenario_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing heroina_fase_ativa_fase_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_fase_ativa_fase_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'EXISTS', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'MISSING_SOURCE_TABLE', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Table heroina_fase_ativa not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa' AND column_name = 'fase_id') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'MISSING_SOURCE_COLUMN', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Column heroina_fase_ativa.fase_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'MISSING_TARGET_TABLE', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Table labirinto_fases not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_fases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Column labirinto_fases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa' AND column_name = 'fase_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'TYPE_MISMATCH', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_fases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'READY_TO_CREATE', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Column labirinto_fases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_fase_ativa' AND column_name = 'fase_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'TYPE_MISMATCH', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'TARGET_NOT_UNIQUE', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('heroina_fase_ativa_fase_id_fkey', 'READY_TO_CREATE', 'heroina_fase_ativa', 'fase_id', 'labirinto_fases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing heroina_ritual_registros_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'heroina_ritual_registros_ritual_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'EXISTS', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'heroina_ritual_registros') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Table heroina_ritual_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_ritual_registros' AND column_name = 'ritual_id') THEN
        INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Column heroina_ritual_registros.ritual_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Table labirinto_rituais not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_rituais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Column labirinto_rituais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_ritual_registros' AND column_name = 'ritual_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'TYPE_MISMATCH', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_rituais');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'READY_TO_CREATE', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Column labirinto_rituais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'heroina_ritual_registros' AND column_name = 'ritual_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'TYPE_MISMATCH', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('heroina_ritual_registros_ritual_id_fkey', 'READY_TO_CREATE', 'heroina_ritual_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing imaginacao_ativa_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'imaginacao_ativa_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'EXISTS', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa') THEN
        INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Table imaginacao_ativa not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Column imaginacao_ativa.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'TYPE_MISMATCH', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'READY_TO_CREATE', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'imaginacao_ativa' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'TYPE_MISMATCH', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('imaginacao_ativa_cliente_id_fkey', 'READY_TO_CREATE', 'imaginacao_ativa', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing intervention_favorites_intervention_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'intervention_favorites_intervention_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'EXISTS', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'intervention_favorites') THEN
        INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'MISSING_SOURCE_TABLE', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Table intervention_favorites not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'intervention_favorites' AND column_name = 'intervention_id') THEN
        INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'MISSING_SOURCE_COLUMN', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Column intervention_favorites.intervention_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'MISSING_TARGET_TABLE', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Table interventions not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'interventions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'MISSING_TARGET_COLUMN', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Column interventions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'intervention_favorites' AND column_name = 'intervention_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'TYPE_MISMATCH', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'interventions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'READY_TO_CREATE', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'MISSING_TARGET_COLUMN', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Column interventions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'intervention_favorites' AND column_name = 'intervention_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'TYPE_MISMATCH', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'TARGET_NOT_UNIQUE', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('intervention_favorites_intervention_id_fkey', 'READY_TO_CREATE', 'intervention_favorites', 'intervention_id', 'interventions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing interventions_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'interventions_district_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'EXISTS', 'interventions', 'district_id', 'districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') THEN
        INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'MISSING_SOURCE_TABLE', 'interventions', 'district_id', 'districts', 'id', 'Table interventions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'district_id') THEN
        INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'interventions', 'district_id', 'districts', 'id', 'Column interventions.district_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'MISSING_TARGET_TABLE', 'interventions', 'district_id', 'districts', 'id', 'Table districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'MISSING_TARGET_COLUMN', 'interventions', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'district_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'TYPE_MISMATCH', 'interventions', 'district_id', 'districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'READY_TO_CREATE', 'interventions', 'district_id', 'districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'MISSING_TARGET_COLUMN', 'interventions', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'district_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'TYPE_MISMATCH', 'interventions', 'district_id', 'districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'TARGET_NOT_UNIQUE', 'interventions', 'district_id', 'districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('interventions_district_id_fkey', 'READY_TO_CREATE', 'interventions', 'district_id', 'districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing inventario_personas_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'inventario_personas_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'EXISTS', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inventario_personas') THEN
        INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Table inventario_personas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'inventario_personas' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Column inventario_personas.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'inventario_personas' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'TYPE_MISMATCH', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'READY_TO_CREATE', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'inventario_personas' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'TYPE_MISMATCH', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('inventario_personas_cliente_id_fkey', 'READY_TO_CREATE', 'inventario_personas', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_do_oficio_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'EXISTS', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Table jardim_do_oficio not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Column jardim_do_oficio.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'TYPE_MISMATCH', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'READY_TO_CREATE', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'TYPE_MISMATCH', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_cliente_id_fkey', 'READY_TO_CREATE', 'jardim_do_oficio', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_do_oficio_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_do_oficio_sessao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'EXISTS', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Table jardim_do_oficio not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'sessao_id') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Column jardim_do_oficio.sessao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Table sessoes_casa_maquinas not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessoes_casa_maquinas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Column sessoes_casa_maquinas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'sessao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'TYPE_MISMATCH', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessoes_casa_maquinas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'READY_TO_CREATE', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Column sessoes_casa_maquinas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_do_oficio' AND column_name = 'sessao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'TYPE_MISMATCH', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jardim_do_oficio_sessao_id_fkey', 'READY_TO_CREATE', 'jardim_do_oficio', 'sessao_id', 'sessoes_casa_maquinas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_grupo_registros_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_group_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'EXISTS', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Table jardim_grupo_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'group_id') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Column jardim_grupo_registros.group_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'therapeutic_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Table therapeutic_groups not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'therapeutic_groups' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Column therapeutic_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'group_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'TYPE_MISMATCH', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'therapeutic_groups');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'READY_TO_CREATE', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Column therapeutic_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'group_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'therapeutic_groups' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'TYPE_MISMATCH', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_group_id_fkey', 'READY_TO_CREATE', 'jardim_grupo_registros', 'group_id', 'therapeutic_groups', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_grupo_registros_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_grupo_registros_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'EXISTS', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Table jardim_grupo_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Column jardim_grupo_registros.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'group_sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Table group_sessions not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'group_sessions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Column group_sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'session_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'TYPE_MISMATCH', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'group_sessions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'READY_TO_CREATE', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Column group_sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_grupo_registros' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'group_sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'TYPE_MISMATCH', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jardim_grupo_registros_session_id_fkey', 'READY_TO_CREATE', 'jardim_grupo_registros', 'session_id', 'group_sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_heroina_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'EXISTS', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Table jardim_heroina not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Column jardim_heroina.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'READY_TO_CREATE', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jardim_heroina_case_id_fkey', 'READY_TO_CREATE', 'jardim_heroina', 'case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_heroina_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'EXISTS', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Table jardim_heroina not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Column jardim_heroina.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'READY_TO_CREATE', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jardim_heroina_client_id_fkey', 'READY_TO_CREATE', 'jardim_heroina', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_heroina_registros_mapa_vivo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'EXISTS', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Table jardim_heroina_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_id') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Column jardim_heroina_registros.mapa_vivo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Table mapa_vivo_heroina not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'mapa_vivo_heroina' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Column mapa_vivo_heroina.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'mapa_vivo_heroina');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'READY_TO_CREATE', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Column mapa_vivo_heroina.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_id_fkey', 'READY_TO_CREATE', 'jardim_heroina_registros', 'mapa_vivo_id', 'mapa_vivo_heroina', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_heroina_registros_mapa_vivo_origem_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_mapa_vivo_origem_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'EXISTS', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Table jardim_heroina_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_origem_id') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Column jardim_heroina_registros.mapa_vivo_origem_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Table mapa_vivo_heroina not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'mapa_vivo_heroina' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Column mapa_vivo_heroina.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_origem_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'mapa_vivo_heroina');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'READY_TO_CREATE', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Column mapa_vivo_heroina.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'mapa_vivo_origem_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'mapa_vivo_heroina' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_mapa_vivo_origem_id_fkey', 'READY_TO_CREATE', 'jardim_heroina_registros', 'mapa_vivo_origem_id', 'mapa_vivo_heroina', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jardim_heroina_registros_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jardim_heroina_registros_session_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'EXISTS', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Table jardim_heroina_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'session_case_id') THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Column jardim_heroina_registros.session_case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'session_case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'READY_TO_CREATE', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jardim_heroina_registros' AND column_name = 'session_case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jardim_heroina_registros_session_case_id_fkey', 'READY_TO_CREATE', 'jardim_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jornada_heroina_notas_profissionais_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_notas_profissionais_registro_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'EXISTS', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_notas_profissionais') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Table jornada_heroina_notas_profissionais not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_notas_profissionais' AND column_name = 'registro_id') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Column jornada_heroina_notas_profissionais.registro_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'MISSING_TARGET_TABLE', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Table jornada_heroina_registros not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'jornada_heroina_registros' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Column jornada_heroina_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_notas_profissionais' AND column_name = 'registro_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'jornada_heroina_registros');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Column jornada_heroina_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_notas_profissionais' AND column_name = 'registro_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jornada_heroina_notas_profissionais_registro_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_notas_profissionais', 'registro_id', 'jornada_heroina_registros', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jornada_heroina_registros_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'EXISTS', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Table jornada_heroina_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Column jornada_heroina_registros.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_cliente_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_registros', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jornada_heroina_registros_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_registros_session_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'EXISTS', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Table jornada_heroina_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'session_case_id') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Column jornada_heroina_registros.session_case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'session_case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'session_case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jornada_heroina_registros_session_case_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_registros', 'session_case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jornada_heroina_respostas_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_heroina_respostas_registro_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'EXISTS', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Table jornada_heroina_respostas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas' AND column_name = 'registro_id') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Column jornada_heroina_respostas.registro_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'MISSING_TARGET_TABLE', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Table jornada_heroina_registros not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'jornada_heroina_registros' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Column jornada_heroina_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas' AND column_name = 'registro_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'jornada_heroina_registros');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Column jornada_heroina_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_respostas' AND column_name = 'registro_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'TYPE_MISMATCH', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jornada_heroina_respostas_registro_id_fkey', 'READY_TO_CREATE', 'jornada_heroina_respostas', 'registro_id', 'jornada_heroina_registros', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing jornada_individuacao_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'jornada_individuacao_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'EXISTS', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_individuacao') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'MISSING_SOURCE_TABLE', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Table jornada_individuacao not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_individuacao' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Column jornada_individuacao.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'MISSING_TARGET_TABLE', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_individuacao' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'TYPE_MISMATCH', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'READY_TO_CREATE', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'MISSING_TARGET_COLUMN', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_individuacao' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'TYPE_MISMATCH', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'TARGET_NOT_UNIQUE', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('jornada_individuacao_client_id_fkey', 'READY_TO_CREATE', 'jornada_individuacao', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_districts_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_districts_district_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'EXISTS', 'journey_districts', 'district_id', 'districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_districts') THEN
        INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_districts', 'district_id', 'districts', 'id', 'Table journey_districts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'district_id') THEN
        INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_districts', 'district_id', 'districts', 'id', 'Column journey_districts.district_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'MISSING_TARGET_TABLE', 'journey_districts', 'district_id', 'districts', 'id', 'Table districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_districts', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'district_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'TYPE_MISMATCH', 'journey_districts', 'district_id', 'districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'READY_TO_CREATE', 'journey_districts', 'district_id', 'districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_districts', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'district_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'TYPE_MISMATCH', 'journey_districts', 'district_id', 'districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_districts', 'district_id', 'districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('journey_districts_district_id_fkey', 'READY_TO_CREATE', 'journey_districts', 'district_id', 'districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_districts_journey_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_districts_journey_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'EXISTS', 'journey_districts', 'journey_id', 'journeys', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_districts') THEN
        INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_districts', 'journey_id', 'journeys', 'id', 'Table journey_districts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'journey_id') THEN
        INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_districts', 'journey_id', 'journeys', 'id', 'Column journey_districts.journey_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'MISSING_TARGET_TABLE', 'journey_districts', 'journey_id', 'journeys', 'id', 'Table journeys not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'journeys' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_districts', 'journey_id', 'journeys', 'id', 'Column journeys.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'journey_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'TYPE_MISMATCH', 'journey_districts', 'journey_id', 'journeys', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'journeys');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'READY_TO_CREATE', 'journey_districts', 'journey_id', 'journeys', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_districts', 'journey_id', 'journeys', 'id', 'Column journeys.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_districts' AND column_name = 'journey_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'TYPE_MISMATCH', 'journey_districts', 'journey_id', 'journeys', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_districts', 'journey_id', 'journeys', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('journey_districts_journey_id_fkey', 'READY_TO_CREATE', 'journey_districts', 'journey_id', 'journeys', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_events_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'EXISTS', 'journey_events', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_events') THEN
        INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_events', 'client_id', 'clientes', 'id', 'Table journey_events not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_events', 'client_id', 'clientes', 'id', 'Column journey_events.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'MISSING_TARGET_TABLE', 'journey_events', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_events', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'TYPE_MISMATCH', 'journey_events', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'READY_TO_CREATE', 'journey_events', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_events', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'TYPE_MISMATCH', 'journey_events', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_events', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('journey_events_client_id_fkey', 'READY_TO_CREATE', 'journey_events', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_events_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_events_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'EXISTS', 'journey_events', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_events') THEN
        INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_events', 'session_id', 'sessions', 'id', 'Table journey_events not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_events', 'session_id', 'sessions', 'id', 'Column journey_events.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'MISSING_TARGET_TABLE', 'journey_events', 'session_id', 'sessions', 'id', 'Table sessions not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_events', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'session_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'TYPE_MISMATCH', 'journey_events', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'READY_TO_CREATE', 'journey_events', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_events', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_events' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'TYPE_MISMATCH', 'journey_events', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_events', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('journey_events_session_id_fkey', 'READY_TO_CREATE', 'journey_events', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_media_journey_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_media_journey_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'EXISTS', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_media') THEN
        INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Table journey_media not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_media' AND column_name = 'journey_id') THEN
        INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Column journey_media.journey_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'MISSING_TARGET_TABLE', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Table clube_jornadas not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_jornadas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Column clube_jornadas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_media' AND column_name = 'journey_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'TYPE_MISMATCH', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_jornadas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'READY_TO_CREATE', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Column clube_jornadas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_media' AND column_name = 'journey_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'TYPE_MISMATCH', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('journey_media_journey_id_fkey', 'READY_TO_CREATE', 'journey_media', 'journey_id', 'clube_jornadas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journey_reflections_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journey_reflections_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'EXISTS', 'journey_reflections', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journey_reflections') THEN
        INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'MISSING_SOURCE_TABLE', 'journey_reflections', 'client_id', 'clientes', 'id', 'Table journey_reflections not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_reflections' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'journey_reflections', 'client_id', 'clientes', 'id', 'Column journey_reflections.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'MISSING_TARGET_TABLE', 'journey_reflections', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_reflections', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_reflections' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'TYPE_MISMATCH', 'journey_reflections', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'READY_TO_CREATE', 'journey_reflections', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'MISSING_TARGET_COLUMN', 'journey_reflections', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journey_reflections' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'TYPE_MISMATCH', 'journey_reflections', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'TARGET_NOT_UNIQUE', 'journey_reflections', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('journey_reflections_client_id_fkey', 'READY_TO_CREATE', 'journey_reflections', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journeys_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'EXISTS', 'journeys', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') THEN
        INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'MISSING_SOURCE_TABLE', 'journeys', 'client_id', 'clientes', 'id', 'Table journeys not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'journeys', 'client_id', 'clientes', 'id', 'Column journeys.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'MISSING_TARGET_TABLE', 'journeys', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'MISSING_TARGET_COLUMN', 'journeys', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'TYPE_MISMATCH', 'journeys', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'READY_TO_CREATE', 'journeys', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'MISSING_TARGET_COLUMN', 'journeys', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'TYPE_MISMATCH', 'journeys', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'TARGET_NOT_UNIQUE', 'journeys', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('journeys_client_id_fkey', 'READY_TO_CREATE', 'journeys', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing journeys_current_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'journeys_current_district_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'EXISTS', 'journeys', 'current_district_id', 'districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journeys') THEN
        INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'MISSING_SOURCE_TABLE', 'journeys', 'current_district_id', 'districts', 'id', 'Table journeys not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'current_district_id') THEN
        INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'journeys', 'current_district_id', 'districts', 'id', 'Column journeys.current_district_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'MISSING_TARGET_TABLE', 'journeys', 'current_district_id', 'districts', 'id', 'Table districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'MISSING_TARGET_COLUMN', 'journeys', 'current_district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'current_district_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'TYPE_MISMATCH', 'journeys', 'current_district_id', 'districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'READY_TO_CREATE', 'journeys', 'current_district_id', 'districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'MISSING_TARGET_COLUMN', 'journeys', 'current_district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'journeys' AND column_name = 'current_district_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'TYPE_MISMATCH', 'journeys', 'current_district_id', 'districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'TARGET_NOT_UNIQUE', 'journeys', 'current_district_id', 'districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('journeys_current_district_id_fkey', 'READY_TO_CREATE', 'journeys', 'current_district_id', 'districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing lab_8020_progress_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_book_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'EXISTS', 'lab_8020_progress', 'book_id', 'books', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_8020_progress') THEN
        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'MISSING_SOURCE_TABLE', 'lab_8020_progress', 'book_id', 'books', 'id', 'Table lab_8020_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'book_id') THEN
        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'lab_8020_progress', 'book_id', 'books', 'id', 'Column lab_8020_progress.book_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'MISSING_TARGET_TABLE', 'lab_8020_progress', 'book_id', 'books', 'id', 'Table books not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'books' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'MISSING_TARGET_COLUMN', 'lab_8020_progress', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'book_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'TYPE_MISMATCH', 'lab_8020_progress', 'book_id', 'books', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'books');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'READY_TO_CREATE', 'lab_8020_progress', 'book_id', 'books', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'MISSING_TARGET_COLUMN', 'lab_8020_progress', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'book_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'TYPE_MISMATCH', 'lab_8020_progress', 'book_id', 'books', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'TARGET_NOT_UNIQUE', 'lab_8020_progress', 'book_id', 'books', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_book_id_fkey', 'READY_TO_CREATE', 'lab_8020_progress', 'book_id', 'books', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing lab_8020_progress_season_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_8020_progress_season_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'EXISTS', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lab_8020_progress') THEN
        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'MISSING_SOURCE_TABLE', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Table lab_8020_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'season_id') THEN
        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'MISSING_SOURCE_COLUMN', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Column lab_8020_progress.season_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'MISSING_TARGET_TABLE', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Table oracular_seasons not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracular_seasons' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'MISSING_TARGET_COLUMN', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'season_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'TYPE_MISMATCH', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'oracular_seasons');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'READY_TO_CREATE', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'MISSING_TARGET_COLUMN', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lab_8020_progress' AND column_name = 'season_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'TYPE_MISMATCH', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'TARGET_NOT_UNIQUE', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('lab_8020_progress_season_id_fkey', 'READY_TO_CREATE', 'lab_8020_progress', 'season_id', 'oracular_seasons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_39_portas_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_39_portas_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'EXISTS', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Table labirinto_39_portas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Column labirinto_39_portas.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'TYPE_MISMATCH', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'READY_TO_CREATE', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_39_portas' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'TYPE_MISMATCH', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_39_portas_client_id_fkey', 'READY_TO_CREATE', 'labirinto_39_portas', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_anotacoes_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'EXISTS', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Table labirinto_anotacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Column labirinto_anotacoes.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'TYPE_MISMATCH', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'READY_TO_CREATE', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'TYPE_MISMATCH', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_cliente_id_fkey', 'READY_TO_CREATE', 'labirinto_anotacoes', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_anotacoes_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_anotacoes_porta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'EXISTS', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Table labirinto_anotacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'porta_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Column labirinto_anotacoes.porta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Table labirinto_portas not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_portas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Column labirinto_portas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'porta_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'TYPE_MISMATCH', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_portas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'READY_TO_CREATE', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Column labirinto_portas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_anotacoes' AND column_name = 'porta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'TYPE_MISMATCH', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_anotacoes_porta_id_fkey', 'READY_TO_CREATE', 'labirinto_anotacoes', 'porta_id', 'labirinto_portas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_leituras_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'EXISTS', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_leituras') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Table labirinto_leituras not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Column labirinto_leituras.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'TYPE_MISMATCH', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'READY_TO_CREATE', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'TYPE_MISMATCH', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_cliente_id_fkey', 'READY_TO_CREATE', 'labirinto_leituras', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_leituras_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_leituras_porta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'EXISTS', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_leituras') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Table labirinto_leituras not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'porta_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Column labirinto_leituras.porta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Table labirinto_portas not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_portas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Column labirinto_portas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'porta_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'TYPE_MISMATCH', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_portas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'READY_TO_CREATE', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Column labirinto_portas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_leituras' AND column_name = 'porta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'TYPE_MISMATCH', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_leituras_porta_id_fkey', 'READY_TO_CREATE', 'labirinto_leituras', 'porta_id', 'labirinto_portas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_registros_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_arquetipo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'EXISTS', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Table labirinto_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'arquetipo_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Column labirinto_registros.arquetipo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Table labirinto_arquetipos not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_arquetipos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Column labirinto_arquetipos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'arquetipo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_arquetipos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Column labirinto_arquetipos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'arquetipo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_registros_arquetipo_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_registros_fase_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_fase_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'EXISTS', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Table labirinto_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'fase_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Column labirinto_registros.fase_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Table labirinto_fases not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_fases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Column labirinto_fases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'fase_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_fases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Column labirinto_fases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'fase_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_registros_fase_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'fase_id', 'labirinto_fases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_registros_metafora_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_metafora_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'EXISTS', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Table labirinto_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'metafora_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Column labirinto_registros.metafora_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Table labirinto_metaforas not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_metaforas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Column labirinto_metaforas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'metafora_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_metaforas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Column labirinto_metaforas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'metafora_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_registros_metafora_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'metafora_id', 'labirinto_metaforas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_registros_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_ritual_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'EXISTS', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Table labirinto_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'ritual_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Column labirinto_registros.ritual_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Table labirinto_rituais not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_rituais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Column labirinto_rituais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'ritual_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_rituais');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Column labirinto_rituais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'ritual_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_registros_ritual_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'ritual_id', 'labirinto_rituais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_registros_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_registros_session_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'EXISTS', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_registros') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Table labirinto_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'session_case_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Column labirinto_registros.session_case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'session_case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_registros' AND column_name = 'session_case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'TYPE_MISMATCH', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_registros_session_case_id_fkey', 'READY_TO_CREATE', 'labirinto_registros', 'session_case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_roteiros_gerados_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_arquetipo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'EXISTS', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Table labirinto_roteiros_gerados not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'arquetipo_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Column labirinto_roteiros_gerados.arquetipo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Table labirinto_arquetipos not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_arquetipos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Column labirinto_arquetipos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'arquetipo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_arquetipos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Column labirinto_arquetipos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'arquetipo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_arquetipos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_arquetipo_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'arquetipo_id', 'labirinto_arquetipos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_roteiros_gerados_fase_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_fase_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'EXISTS', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Table labirinto_roteiros_gerados not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'fase_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Column labirinto_roteiros_gerados.fase_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Table labirinto_fases not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_fases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Column labirinto_fases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'fase_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_fases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Column labirinto_fases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'fase_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_fase_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'fase_id', 'labirinto_fases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_roteiros_gerados_metafora_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_metafora_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'EXISTS', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Table labirinto_roteiros_gerados not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'metafora_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Column labirinto_roteiros_gerados.metafora_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Table labirinto_metaforas not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_metaforas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Column labirinto_metaforas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'metafora_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_metaforas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Column labirinto_metaforas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'metafora_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_metaforas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_metafora_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'metafora_id', 'labirinto_metaforas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_roteiros_gerados_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_ritual_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'EXISTS', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Table labirinto_roteiros_gerados not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'ritual_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Column labirinto_roteiros_gerados.ritual_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_rituais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Table labirinto_rituais not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_rituais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Column labirinto_rituais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'ritual_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_rituais');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Column labirinto_rituais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'ritual_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_rituais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_ritual_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'ritual_id', 'labirinto_rituais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing labirinto_roteiros_gerados_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'labirinto_roteiros_gerados_session_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'EXISTS', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Table labirinto_roteiros_gerados not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'session_case_id') THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Column labirinto_roteiros_gerados.session_case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'session_case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_roteiros_gerados' AND column_name = 'session_case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'TYPE_MISMATCH', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('labirinto_roteiros_gerados_session_case_id_fkey', 'READY_TO_CREATE', 'labirinto_roteiros_gerados', 'session_case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

END $$;

-- 3. Retornar resultados tabulares (obrigatório fora do DO)
SELECT *
FROM diagnostic_results
ORDER BY constraint_name;

SELECT status, COUNT(*) AS total
FROM diagnostic_results
GROUP BY status
ORDER BY status;
