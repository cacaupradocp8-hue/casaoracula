-- BLOCO 07B - FOREIGN KEYS DIAGNOSTIC (PARTE 8 de 8)
-- Diagnóstico de FKs 337 a 384 (Total: 48)

-- Limpar tabela anterior se existir na sessão
DROP TABLE IF EXISTS diagnostic_results;

-- Criar tabela temporária de diagnóstico
CREATE TEMP TABLE diagnostic_results (
    constraint_name TEXT,
    status TEXT,
    source_table TEXT,
    source_column TEXT,
    target_table TEXT,
    target_column TEXT,
    reason TEXT
);

DO $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
    v_is_unique BOOLEAN;
BEGIN

    -- Analyzing session_interventions_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'EXISTS', 'session_interventions', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_interventions') THEN
        INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'MISSING_SOURCE_TABLE', 'session_interventions', 'session_id', 'sessions', 'id', 'Table session_interventions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_interventions', 'session_id', 'sessions', 'id', 'Column session_interventions.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'MISSING_TARGET_TABLE', 'session_interventions', 'session_id', 'sessions', 'id', 'Table sessions not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'MISSING_TARGET_COLUMN', 'session_interventions', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'session_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'TYPE_MISMATCH', 'session_interventions', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'READY_TO_CREATE', 'session_interventions', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'MISSING_TARGET_COLUMN', 'session_interventions', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'TYPE_MISMATCH', 'session_interventions', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.sessions')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'TARGET_NOT_UNIQUE', 'session_interventions', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_interventions_session_id_fkey', 'READY_TO_CREATE', 'session_interventions', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_oracle_draws_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'EXISTS', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'MISSING_SOURCE_TABLE', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Table session_oracle_draws not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Column session_oracle_draws.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'MISSING_TARGET_TABLE', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'MISSING_TARGET_COLUMN', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'TYPE_MISMATCH', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'READY_TO_CREATE', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'MISSING_TARGET_COLUMN', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'TYPE_MISMATCH', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.session_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'TARGET_NOT_UNIQUE', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_case_id_fkey', 'READY_TO_CREATE', 'session_oracle_draws', 'case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_oracle_draws_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'EXISTS', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'MISSING_SOURCE_TABLE', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Table session_oracle_draws not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Column session_oracle_draws.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'MISSING_TARGET_TABLE', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'TYPE_MISMATCH', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'profiles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'READY_TO_CREATE', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'TYPE_MISMATCH', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.profiles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'TARGET_NOT_UNIQUE', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_client_id_fkey', 'READY_TO_CREATE', 'session_oracle_draws', 'client_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_oracle_draws_therapist_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_oracle_draws_therapist_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'EXISTS', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_oracle_draws') THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'MISSING_SOURCE_TABLE', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Table session_oracle_draws not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'therapist_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Column session_oracle_draws.therapist_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'MISSING_TARGET_TABLE', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'therapist_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'TYPE_MISMATCH', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'profiles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'READY_TO_CREATE', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_oracle_draws' AND column_name = 'therapist_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'TYPE_MISMATCH', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.profiles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'TARGET_NOT_UNIQUE', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_oracle_draws_therapist_id_fkey', 'READY_TO_CREATE', 'session_oracle_draws', 'therapist_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_scripts_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'EXISTS', 'session_scripts', 'case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'MISSING_SOURCE_TABLE', 'session_scripts', 'case_id', 'session_cases', 'id', 'Table session_scripts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_scripts', 'case_id', 'session_cases', 'id', 'Column session_scripts.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'MISSING_TARGET_TABLE', 'session_scripts', 'case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.session_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'TARGET_NOT_UNIQUE', 'session_scripts', 'case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_scripts_case_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_scripts_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'EXISTS', 'session_scripts', 'client_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'MISSING_SOURCE_TABLE', 'session_scripts', 'client_id', 'profiles', 'id', 'Table session_scripts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_scripts', 'client_id', 'profiles', 'id', 'Column session_scripts.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'MISSING_TARGET_TABLE', 'session_scripts', 'client_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'client_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'client_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'profiles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'client_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'client_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'client_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.profiles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'TARGET_NOT_UNIQUE', 'session_scripts', 'client_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_scripts_client_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'client_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_scripts_narrative_map_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_narrative_map_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'EXISTS', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'MISSING_SOURCE_TABLE', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Table session_scripts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'narrative_map_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Column session_scripts.narrative_map_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'narrative_maps') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'MISSING_TARGET_TABLE', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Table narrative_maps not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'narrative_maps' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Column narrative_maps.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'narrative_map_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'narrative_maps');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Column narrative_maps.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'narrative_map_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'narrative_maps' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.narrative_maps')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'TARGET_NOT_UNIQUE', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_scripts_narrative_map_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'narrative_map_id', 'narrative_maps', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_scripts_therapist_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_scripts_therapist_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'EXISTS', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_scripts') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'MISSING_SOURCE_TABLE', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Table session_scripts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'therapist_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Column session_scripts.therapist_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'MISSING_TARGET_TABLE', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'therapist_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'profiles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_scripts' AND column_name = 'therapist_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'TYPE_MISMATCH', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.profiles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'TARGET_NOT_UNIQUE', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_scripts_therapist_id_fkey', 'READY_TO_CREATE', 'session_scripts', 'therapist_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessions_cidadela_card_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_cidadela_card_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'EXISTS', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'MISSING_SOURCE_TABLE', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Table sessions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'cidadela_card_id') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Column sessions.cidadela_card_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'MISSING_TARGET_TABLE', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Table cidadela_oracle_cards not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'cidadela_oracle_cards' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Column cidadela_oracle_cards.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'cidadela_card_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'TYPE_MISMATCH', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'cidadela_oracle_cards');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'READY_TO_CREATE', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Column cidadela_oracle_cards.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'cidadela_card_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cidadela_oracle_cards' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'TYPE_MISMATCH', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.cidadela_oracle_cards')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'TARGET_NOT_UNIQUE', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sessions_cidadela_card_id_fkey', 'READY_TO_CREATE', 'sessions', 'cidadela_card_id', 'cidadela_oracle_cards', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessions_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'EXISTS', 'sessions', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'MISSING_SOURCE_TABLE', 'sessions', 'client_id', 'clientes', 'id', 'Table sessions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessions', 'client_id', 'clientes', 'id', 'Column sessions.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'MISSING_TARGET_TABLE', 'sessions', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'TYPE_MISMATCH', 'sessions', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'READY_TO_CREATE', 'sessions', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'TYPE_MISMATCH', 'sessions', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'TARGET_NOT_UNIQUE', 'sessions', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sessions_client_id_fkey', 'READY_TO_CREATE', 'sessions', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessions_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_district_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'EXISTS', 'sessions', 'district_id', 'districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'MISSING_SOURCE_TABLE', 'sessions', 'district_id', 'districts', 'id', 'Table sessions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'district_id') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessions', 'district_id', 'districts', 'id', 'Column sessions.district_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'MISSING_TARGET_TABLE', 'sessions', 'district_id', 'districts', 'id', 'Table districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'district_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'TYPE_MISMATCH', 'sessions', 'district_id', 'districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'READY_TO_CREATE', 'sessions', 'district_id', 'districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'district_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'TYPE_MISMATCH', 'sessions', 'district_id', 'districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.districts')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'TARGET_NOT_UNIQUE', 'sessions', 'district_id', 'districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sessions_district_id_fkey', 'READY_TO_CREATE', 'sessions', 'district_id', 'districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessions_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessions_tool_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'EXISTS', 'sessions', 'tool_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'sessions', 'tool_id', 'tools', 'id', 'Table sessions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'tool_id') THEN
        INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessions', 'tool_id', 'tools', 'id', 'Column sessions.tool_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'MISSING_TARGET_TABLE', 'sessions', 'tool_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'tool_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'tool_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'TYPE_MISMATCH', 'sessions', 'tool_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'READY_TO_CREATE', 'sessions', 'tool_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'sessions', 'tool_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'tool_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'TYPE_MISMATCH', 'sessions', 'tool_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tools')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'sessions', 'tool_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sessions_tool_id_fkey', 'READY_TO_CREATE', 'sessions', 'tool_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessoes_casa_maquinas_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_casa_maquinas_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'EXISTS', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas') THEN
        INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Table sessoes_casa_maquinas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Column sessoes_casa_maquinas.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'TYPE_MISMATCH', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'READY_TO_CREATE', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_casa_maquinas' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'TYPE_MISMATCH', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sessoes_casa_maquinas_cliente_id_fkey', 'READY_TO_CREATE', 'sessoes_casa_maquinas', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sessoes_labirinto_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sessoes_labirinto_porta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'EXISTS', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto') THEN
        INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Table sessoes_labirinto not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'porta_id') THEN
        INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Column sessoes_labirinto.porta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_fases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'MISSING_TARGET_TABLE', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Table labirinto_fases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_fases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Column labirinto_fases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'porta_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'TYPE_MISMATCH', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_fases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'READY_TO_CREATE', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Column labirinto_fases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'porta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_fases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'TYPE_MISMATCH', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.labirinto_fases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sessoes_labirinto_porta_id_fkey', 'READY_TO_CREATE', 'sessoes_labirinto', 'porta_id', 'labirinto_fases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing simulador_progresso_cenario_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'simulador_progresso_cenario_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'EXISTS', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'simulador_progresso') THEN
        INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'MISSING_SOURCE_TABLE', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Table simulador_progresso not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_progresso' AND column_name = 'cenario_id') THEN
        INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'MISSING_SOURCE_COLUMN', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Column simulador_progresso.cenario_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'simulador_cenarios') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'MISSING_TARGET_TABLE', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Table simulador_cenarios not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'simulador_cenarios' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'MISSING_TARGET_COLUMN', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Column simulador_cenarios.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_progresso' AND column_name = 'cenario_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'TYPE_MISMATCH', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'simulador_cenarios');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'READY_TO_CREATE', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_cenarios' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'MISSING_TARGET_COLUMN', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Column simulador_cenarios.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_progresso' AND column_name = 'cenario_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'simulador_cenarios' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'TYPE_MISMATCH', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.simulador_cenarios')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'TARGET_NOT_UNIQUE', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('simulador_progresso_cenario_id_fkey', 'READY_TO_CREATE', 'simulador_progresso', 'cenario_id', 'simulador_cenarios', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sonho_estruturado_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sonho_estruturado_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'EXISTS', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sonho_estruturado') THEN
        INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Table sonho_estruturado not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonho_estruturado' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Column sonho_estruturado.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonho_estruturado' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'TYPE_MISMATCH', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'READY_TO_CREATE', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonho_estruturado' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'TYPE_MISMATCH', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sonho_estruturado_cliente_id_fkey', 'READY_TO_CREATE', 'sonho_estruturado', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sonhos_cabalisticos_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sonhos_cabalisticos_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'EXISTS', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos') THEN
        INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'MISSING_SOURCE_TABLE', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Table sonhos_cabalisticos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Column sonhos_cabalisticos.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'MISSING_TARGET_TABLE', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'MISSING_TARGET_COLUMN', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'TYPE_MISMATCH', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'READY_TO_CREATE', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'MISSING_TARGET_COLUMN', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sonhos_cabalisticos' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'TYPE_MISMATCH', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'TARGET_NOT_UNIQUE', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sonhos_cabalisticos_client_id_fkey', 'READY_TO_CREATE', 'sonhos_cabalisticos', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing station_progress_station_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'station_progress_station_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'EXISTS', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'station_progress') THEN
        INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'MISSING_SOURCE_TABLE', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Table station_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'station_progress' AND column_name = 'station_id') THEN
        INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'MISSING_SOURCE_COLUMN', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Column station_progress.station_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'MISSING_TARGET_TABLE', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Table clube_estacoes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_estacoes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'MISSING_TARGET_COLUMN', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'station_progress' AND column_name = 'station_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'TYPE_MISMATCH', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_estacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'READY_TO_CREATE', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'MISSING_TARGET_COLUMN', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'station_progress' AND column_name = 'station_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'TYPE_MISMATCH', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_estacoes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'TARGET_NOT_UNIQUE', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('station_progress_station_id_fkey', 'READY_TO_CREATE', 'station_progress', 'station_id', 'clube_estacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing studio_episodes_eixo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'studio_episodes_eixo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'EXISTS', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'studio_episodes') THEN
        INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'MISSING_SOURCE_TABLE', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Table studio_episodes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_episodes' AND column_name = 'eixo_id') THEN
        INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'MISSING_SOURCE_COLUMN', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Column studio_episodes.eixo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'studio_method_axes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'MISSING_TARGET_TABLE', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Table studio_method_axes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'studio_method_axes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'MISSING_TARGET_COLUMN', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Column studio_method_axes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_episodes' AND column_name = 'eixo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'TYPE_MISMATCH', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'studio_method_axes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'READY_TO_CREATE', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_method_axes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'MISSING_TARGET_COLUMN', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Column studio_method_axes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_episodes' AND column_name = 'eixo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'studio_method_axes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'TYPE_MISMATCH', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.studio_method_axes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'TARGET_NOT_UNIQUE', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('studio_episodes_eixo_id_fkey', 'READY_TO_CREATE', 'studio_episodes', 'eixo_id', 'studio_method_axes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing symbolic_template_sessions_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'symbolic_template_sessions_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'EXISTS', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions') THEN
        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'MISSING_SOURCE_TABLE', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Table symbolic_template_sessions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Column symbolic_template_sessions.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'MISSING_TARGET_TABLE', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'MISSING_TARGET_COLUMN', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'case_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'TYPE_MISMATCH', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'session_cases');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'READY_TO_CREATE', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'MISSING_TARGET_COLUMN', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'TYPE_MISMATCH', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.session_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'TARGET_NOT_UNIQUE', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_case_id_fkey', 'READY_TO_CREATE', 'symbolic_template_sessions', 'case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing symbolic_template_sessions_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'symbolic_template_sessions_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'EXISTS', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions') THEN
        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Table symbolic_template_sessions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Column symbolic_template_sessions.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'cliente_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'TYPE_MISMATCH', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'READY_TO_CREATE', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_template_sessions' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'TYPE_MISMATCH', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('symbolic_template_sessions_cliente_id_fkey', 'READY_TO_CREATE', 'symbolic_template_sessions', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing syntheia_conversations_mode_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_mode_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'EXISTS', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'MISSING_SOURCE_TABLE', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Table syntheia_conversations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'mode_id') THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'MISSING_SOURCE_COLUMN', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Column syntheia_conversations.mode_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_modes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'MISSING_TARGET_TABLE', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Table syntheia_modes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'syntheia_modes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'MISSING_TARGET_COLUMN', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Column syntheia_modes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'mode_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'TYPE_MISMATCH', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'syntheia_modes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'READY_TO_CREATE', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_modes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'MISSING_TARGET_COLUMN', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Column syntheia_modes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'mode_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_modes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'TYPE_MISMATCH', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.syntheia_modes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'TARGET_NOT_UNIQUE', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_mode_id_fkey', 'READY_TO_CREATE', 'syntheia_conversations', 'mode_id', 'syntheia_modes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing syntheia_conversations_voice_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_conversations_voice_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'EXISTS', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'MISSING_SOURCE_TABLE', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Table syntheia_conversations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'voice_id') THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'MISSING_SOURCE_COLUMN', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Column syntheia_conversations.voice_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_voices') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'MISSING_TARGET_TABLE', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Table syntheia_voices not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'syntheia_voices' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'MISSING_TARGET_COLUMN', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Column syntheia_voices.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'voice_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'TYPE_MISMATCH', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'syntheia_voices');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'READY_TO_CREATE', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_voices' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'MISSING_TARGET_COLUMN', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Column syntheia_voices.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'voice_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_voices' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'TYPE_MISMATCH', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.syntheia_voices')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'TARGET_NOT_UNIQUE', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('syntheia_conversations_voice_id_fkey', 'READY_TO_CREATE', 'syntheia_conversations', 'voice_id', 'syntheia_voices', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing syntheia_messages_conversation_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'syntheia_messages_conversation_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'EXISTS', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_messages') THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'MISSING_SOURCE_TABLE', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Table syntheia_messages not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_messages' AND column_name = 'conversation_id') THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'MISSING_SOURCE_COLUMN', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Column syntheia_messages.conversation_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'syntheia_conversations') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'MISSING_TARGET_TABLE', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Table syntheia_conversations not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'syntheia_conversations' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'MISSING_TARGET_COLUMN', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Column syntheia_conversations.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_messages' AND column_name = 'conversation_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'TYPE_MISMATCH', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'syntheia_conversations');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'READY_TO_CREATE', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'MISSING_TARGET_COLUMN', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Column syntheia_conversations.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_messages' AND column_name = 'conversation_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'syntheia_conversations' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'TYPE_MISMATCH', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.syntheia_conversations')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'TARGET_NOT_UNIQUE', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('syntheia_messages_conversation_id_fkey', 'READY_TO_CREATE', 'syntheia_messages', 'conversation_id', 'syntheia_conversations', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tecela_conselho_respostas_conselho_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_conselho_respostas_conselho_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'EXISTS', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_conselho_respostas') THEN
        INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'MISSING_SOURCE_TABLE', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Table tecela_conselho_respostas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho_respostas' AND column_name = 'conselho_id') THEN
        INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'MISSING_SOURCE_COLUMN', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Column tecela_conselho_respostas.conselho_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_conselho') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'MISSING_TARGET_TABLE', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Table tecela_conselho not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tecela_conselho' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'MISSING_TARGET_COLUMN', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Column tecela_conselho.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho_respostas' AND column_name = 'conselho_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'TYPE_MISMATCH', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tecela_conselho');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'READY_TO_CREATE', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'MISSING_TARGET_COLUMN', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Column tecela_conselho.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho_respostas' AND column_name = 'conselho_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_conselho' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'TYPE_MISMATCH', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tecela_conselho')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'TARGET_NOT_UNIQUE', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('tecela_conselho_respostas_conselho_id_fkey', 'READY_TO_CREATE', 'tecela_conselho_respostas', 'conselho_id', 'tecela_conselho', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tecela_ressonancias_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_ressonancias_registro_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'EXISTS', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias') THEN
        INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Table tecela_ressonancias not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias' AND column_name = 'registro_id') THEN
        INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Column tecela_ressonancias.registro_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_registros_campo') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'MISSING_TARGET_TABLE', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Table tecela_registros_campo not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tecela_registros_campo' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Column tecela_registros_campo.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias' AND column_name = 'registro_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'TYPE_MISMATCH', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tecela_registros_campo');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'READY_TO_CREATE', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_registros_campo' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Column tecela_registros_campo.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_ressonancias' AND column_name = 'registro_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_registros_campo' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'TYPE_MISMATCH', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tecela_registros_campo')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('tecela_ressonancias_registro_id_fkey', 'READY_TO_CREATE', 'tecela_ressonancias', 'registro_id', 'tecela_registros_campo', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tecela_supervisoes_caso_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tecela_supervisoes_caso_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'EXISTS', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes') THEN
        INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'MISSING_SOURCE_TABLE', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Table tecela_supervisoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes' AND column_name = 'caso_id') THEN
        INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'MISSING_SOURCE_COLUMN', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Column tecela_supervisoes.caso_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'MISSING_TARGET_TABLE', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Table tecela_casos_espelho not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tecela_casos_espelho' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'MISSING_TARGET_COLUMN', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Column tecela_casos_espelho.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes' AND column_name = 'caso_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'TYPE_MISMATCH', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tecela_casos_espelho');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'READY_TO_CREATE', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'MISSING_TARGET_COLUMN', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Column tecela_casos_espelho.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_supervisoes' AND column_name = 'caso_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tecela_casos_espelho' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'TYPE_MISMATCH', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tecela_casos_espelho')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'TARGET_NOT_UNIQUE', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('tecela_supervisoes_caso_id_fkey', 'READY_TO_CREATE', 'tecela_supervisoes', 'caso_id', 'tecela_casos_espelho', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tool_districts_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tool_districts_district_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'EXISTS', 'tool_districts', 'district_id', 'city_districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_districts') THEN
        INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'MISSING_SOURCE_TABLE', 'tool_districts', 'district_id', 'city_districts', 'id', 'Table tool_districts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'district_id') THEN
        INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'tool_districts', 'district_id', 'city_districts', 'id', 'Column tool_districts.district_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'MISSING_TARGET_TABLE', 'tool_districts', 'district_id', 'city_districts', 'id', 'Table city_districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'city_districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'MISSING_TARGET_COLUMN', 'tool_districts', 'district_id', 'city_districts', 'id', 'Column city_districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'district_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'TYPE_MISMATCH', 'tool_districts', 'district_id', 'city_districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'city_districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'READY_TO_CREATE', 'tool_districts', 'district_id', 'city_districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'MISSING_TARGET_COLUMN', 'tool_districts', 'district_id', 'city_districts', 'id', 'Column city_districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'district_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'TYPE_MISMATCH', 'tool_districts', 'district_id', 'city_districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.city_districts')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'TARGET_NOT_UNIQUE', 'tool_districts', 'district_id', 'city_districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('tool_districts_district_id_fkey', 'READY_TO_CREATE', 'tool_districts', 'district_id', 'city_districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tool_districts_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tool_districts_tool_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'EXISTS', 'tool_districts', 'tool_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_districts') THEN
        INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'tool_districts', 'tool_id', 'tools', 'id', 'Table tool_districts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'tool_id') THEN
        INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'tool_districts', 'tool_id', 'tools', 'id', 'Column tool_districts.tool_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'MISSING_TARGET_TABLE', 'tool_districts', 'tool_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'tool_districts', 'tool_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'tool_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'TYPE_MISMATCH', 'tool_districts', 'tool_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'READY_TO_CREATE', 'tool_districts', 'tool_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'tool_districts', 'tool_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tool_districts' AND column_name = 'tool_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'TYPE_MISMATCH', 'tool_districts', 'tool_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tools')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'tool_districts', 'tool_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('tool_districts_tool_id_fkey', 'READY_TO_CREATE', 'tool_districts', 'tool_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tools_district_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_district_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'EXISTS', 'tools', 'district_id', 'districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'MISSING_SOURCE_TABLE', 'tools', 'district_id', 'districts', 'id', 'Table tools not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'district_id') THEN
        INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'MISSING_SOURCE_COLUMN', 'tools', 'district_id', 'districts', 'id', 'Column tools.district_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'MISSING_TARGET_TABLE', 'tools', 'district_id', 'districts', 'id', 'Table districts not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'districts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'MISSING_TARGET_COLUMN', 'tools', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'district_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'TYPE_MISMATCH', 'tools', 'district_id', 'districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'READY_TO_CREATE', 'tools', 'district_id', 'districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'MISSING_TARGET_COLUMN', 'tools', 'district_id', 'districts', 'id', 'Column districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'district_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'TYPE_MISMATCH', 'tools', 'district_id', 'districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.districts')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'TARGET_NOT_UNIQUE', 'tools', 'district_id', 'districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('tools_district_id_fkey', 'READY_TO_CREATE', 'tools', 'district_id', 'districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tools_ferramenta_pai_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_ferramenta_pai_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'EXISTS', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'MISSING_SOURCE_TABLE', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Table tools not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'ferramenta_pai_id') THEN
        INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'MISSING_SOURCE_COLUMN', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Column tools.ferramenta_pai_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'MISSING_TARGET_TABLE', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'MISSING_TARGET_COLUMN', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'ferramenta_pai_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'TYPE_MISMATCH', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'READY_TO_CREATE', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'MISSING_TARGET_COLUMN', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'ferramenta_pai_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'TYPE_MISMATCH', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tools')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'TARGET_NOT_UNIQUE', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('tools_ferramenta_pai_id_fkey', 'READY_TO_CREATE', 'tools', 'ferramenta_pai_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing tools_proximo_passo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'tools_proximo_passo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'EXISTS', 'tools', 'proximo_passo_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'MISSING_SOURCE_TABLE', 'tools', 'proximo_passo_id', 'tools', 'id', 'Table tools not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'proximo_passo_id') THEN
        INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'MISSING_SOURCE_COLUMN', 'tools', 'proximo_passo_id', 'tools', 'id', 'Column tools.proximo_passo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'MISSING_TARGET_TABLE', 'tools', 'proximo_passo_id', 'tools', 'id', 'Table tools not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'MISSING_TARGET_COLUMN', 'tools', 'proximo_passo_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'proximo_passo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'TYPE_MISMATCH', 'tools', 'proximo_passo_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'READY_TO_CREATE', 'tools', 'proximo_passo_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'MISSING_TARGET_COLUMN', 'tools', 'proximo_passo_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'proximo_passo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'TYPE_MISMATCH', 'tools', 'proximo_passo_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.tools')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'TARGET_NOT_UNIQUE', 'tools', 'proximo_passo_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('tools_proximo_passo_id_fkey', 'READY_TO_CREATE', 'tools', 'proximo_passo_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing torre_arquetipo_sugestao_arquetipo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_arquetipo_sugestao_arquetipo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'EXISTS', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao') THEN
        INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'MISSING_SOURCE_TABLE', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Table torre_arquetipo_sugestao not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao' AND column_name = 'arquetipo_id') THEN
        INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'MISSING_SOURCE_COLUMN', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Column torre_arquetipo_sugestao.arquetipo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'MISSING_TARGET_TABLE', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Table atlas_arquetipos_femininos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'atlas_arquetipos_femininos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Column atlas_arquetipos_femininos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao' AND column_name = 'arquetipo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'TYPE_MISMATCH', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'atlas_arquetipos_femininos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'READY_TO_CREATE', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'MISSING_TARGET_COLUMN', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Column atlas_arquetipos_femininos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_arquetipo_sugestao' AND column_name = 'arquetipo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'TYPE_MISMATCH', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.atlas_arquetipos_femininos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'TARGET_NOT_UNIQUE', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('torre_arquetipo_sugestao_arquetipo_id_fkey', 'READY_TO_CREATE', 'torre_arquetipo_sugestao', 'arquetipo_id', 'atlas_arquetipos_femininos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing torre_porta_relacao_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'torre_porta_relacao_porta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'EXISTS', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao') THEN
        INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Table torre_porta_relacao not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao' AND column_name = 'porta_id') THEN
        INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Column torre_porta_relacao.porta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'labirinto_portas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'MISSING_TARGET_TABLE', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Table labirinto_portas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'labirinto_portas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Column labirinto_portas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao' AND column_name = 'porta_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'TYPE_MISMATCH', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'labirinto_portas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'READY_TO_CREATE', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Column labirinto_portas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'torre_porta_relacao' AND column_name = 'porta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'labirinto_portas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'TYPE_MISMATCH', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.labirinto_portas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('torre_porta_relacao_porta_id_fkey', 'READY_TO_CREATE', 'torre_porta_relacao', 'porta_id', 'labirinto_portas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing towers_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'EXISTS', 'towers', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'towers') THEN
        INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'MISSING_SOURCE_TABLE', 'towers', 'client_id', 'clientes', 'id', 'Table towers not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'towers', 'client_id', 'clientes', 'id', 'Column towers.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'MISSING_TARGET_TABLE', 'towers', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'MISSING_TARGET_COLUMN', 'towers', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'TYPE_MISMATCH', 'towers', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'READY_TO_CREATE', 'towers', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'MISSING_TARGET_COLUMN', 'towers', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'TYPE_MISMATCH', 'towers', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clientes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'TARGET_NOT_UNIQUE', 'towers', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('towers_client_id_fkey', 'READY_TO_CREATE', 'towers', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing towers_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'towers_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'EXISTS', 'towers', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'towers') THEN
        INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'MISSING_SOURCE_TABLE', 'towers', 'session_id', 'sessions', 'id', 'Table towers not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'towers', 'session_id', 'sessions', 'id', 'Column towers.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'MISSING_TARGET_TABLE', 'towers', 'session_id', 'sessions', 'id', 'Table sessions not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'MISSING_TARGET_COLUMN', 'towers', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'session_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'TYPE_MISMATCH', 'towers', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'READY_TO_CREATE', 'towers', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'MISSING_TARGET_COLUMN', 'towers', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'towers' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'TYPE_MISMATCH', 'towers', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.sessions')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'TARGET_NOT_UNIQUE', 'towers', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('towers_session_id_fkey', 'READY_TO_CREATE', 'towers', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing travessia_comentarios_user_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_comentarios_user_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'EXISTS', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_comentarios') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'MISSING_SOURCE_TABLE', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Table travessia_comentarios not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_comentarios' AND column_name = 'user_id') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'MISSING_SOURCE_COLUMN', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Column travessia_comentarios.user_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'MISSING_TARGET_TABLE', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_comentarios' AND column_name = 'user_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'TYPE_MISMATCH', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'profiles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'READY_TO_CREATE', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_comentarios' AND column_name = 'user_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'TYPE_MISMATCH', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.profiles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'TARGET_NOT_UNIQUE', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('travessia_comentarios_user_id_fkey', 'READY_TO_CREATE', 'travessia_comentarios', 'user_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing travessia_day_unlocks_aula_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_day_unlocks_aula_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'EXISTS', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'MISSING_SOURCE_TABLE', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Table travessia_day_unlocks not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks' AND column_name = 'aula_id') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'MISSING_SOURCE_COLUMN', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Column travessia_day_unlocks.aula_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'MISSING_TARGET_TABLE', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Table conteudo_aulas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'conteudo_aulas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Column conteudo_aulas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks' AND column_name = 'aula_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'TYPE_MISMATCH', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'conteudo_aulas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'READY_TO_CREATE', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Column conteudo_aulas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_day_unlocks' AND column_name = 'aula_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'TYPE_MISMATCH', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.conteudo_aulas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'TARGET_NOT_UNIQUE', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('travessia_day_unlocks_aula_id_fkey', 'READY_TO_CREATE', 'travessia_day_unlocks', 'aula_id', 'conteudo_aulas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing travessia_library_items_familia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_items_familia_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'EXISTS', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'MISSING_SOURCE_TABLE', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Table travessia_library_items not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'familia_id') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'MISSING_SOURCE_COLUMN', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Column travessia_library_items.familia_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_familias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'MISSING_TARGET_TABLE', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Table travessia_familias not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'travessia_familias' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Column travessia_familias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'familia_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'TYPE_MISMATCH', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'travessia_familias');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'READY_TO_CREATE', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Column travessia_familias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'familia_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'TYPE_MISMATCH', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.travessia_familias')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'TARGET_NOT_UNIQUE', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('travessia_library_items_familia_id_fkey', 'READY_TO_CREATE', 'travessia_library_items', 'familia_id', 'travessia_familias', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing travessia_library_media_item_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_media_item_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'EXISTS', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_media') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'MISSING_SOURCE_TABLE', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Table travessia_library_media not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_media' AND column_name = 'item_id') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'MISSING_SOURCE_COLUMN', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Column travessia_library_media.item_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'MISSING_TARGET_TABLE', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Table travessia_library_items not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'travessia_library_items' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Column travessia_library_items.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_media' AND column_name = 'item_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'TYPE_MISMATCH', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'travessia_library_items');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'READY_TO_CREATE', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Column travessia_library_items.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_media' AND column_name = 'item_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'TYPE_MISMATCH', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.travessia_library_items')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'TARGET_NOT_UNIQUE', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('travessia_library_media_item_id_fkey', 'READY_TO_CREATE', 'travessia_library_media', 'item_id', 'travessia_library_items', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing travessia_library_tags_item_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'travessia_library_tags_item_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'EXISTS', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_tags') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'MISSING_SOURCE_TABLE', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Table travessia_library_tags not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_tags' AND column_name = 'item_id') THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'MISSING_SOURCE_COLUMN', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Column travessia_library_tags.item_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_library_items') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'MISSING_TARGET_TABLE', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Table travessia_library_items not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'travessia_library_items' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Column travessia_library_items.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_tags' AND column_name = 'item_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'TYPE_MISMATCH', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'travessia_library_items');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'READY_TO_CREATE', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'MISSING_TARGET_COLUMN', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Column travessia_library_items.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_tags' AND column_name = 'item_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_library_items' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'TYPE_MISMATCH', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.travessia_library_items')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'TARGET_NOT_UNIQUE', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('travessia_library_tags_item_id_fkey', 'READY_TO_CREATE', 'travessia_library_tags', 'item_id', 'travessia_library_items', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing treinamento_respostas_caso_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'treinamento_respostas_caso_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'EXISTS', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'treinamento_respostas') THEN
        INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'MISSING_SOURCE_TABLE', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Table treinamento_respostas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_respostas' AND column_name = 'caso_id') THEN
        INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'MISSING_SOURCE_COLUMN', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Column treinamento_respostas.caso_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'treinamento_casos_simulados') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'MISSING_TARGET_TABLE', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Table treinamento_casos_simulados not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'treinamento_casos_simulados' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'MISSING_TARGET_COLUMN', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Column treinamento_casos_simulados.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_respostas' AND column_name = 'caso_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'TYPE_MISMATCH', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'treinamento_casos_simulados');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'READY_TO_CREATE', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_casos_simulados' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'MISSING_TARGET_COLUMN', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Column treinamento_casos_simulados.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_respostas' AND column_name = 'caso_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'treinamento_casos_simulados' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'TYPE_MISMATCH', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.treinamento_casos_simulados')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'TARGET_NOT_UNIQUE', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('treinamento_respostas_caso_id_fkey', 'READY_TO_CREATE', 'treinamento_respostas', 'caso_id', 'treinamento_casos_simulados', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing upsell_opportunities_rule_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'upsell_opportunities_rule_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'EXISTS', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'upsell_opportunities') THEN
        INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'MISSING_SOURCE_TABLE', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Table upsell_opportunities not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_opportunities' AND column_name = 'rule_id') THEN
        INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'MISSING_SOURCE_COLUMN', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Column upsell_opportunities.rule_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'upsell_rules') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'MISSING_TARGET_TABLE', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Table upsell_rules not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'upsell_rules' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'MISSING_TARGET_COLUMN', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Column upsell_rules.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_opportunities' AND column_name = 'rule_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'TYPE_MISMATCH', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'upsell_rules');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'READY_TO_CREATE', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_rules' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'MISSING_TARGET_COLUMN', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Column upsell_rules.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_opportunities' AND column_name = 'rule_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'upsell_rules' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'TYPE_MISMATCH', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.upsell_rules')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'TARGET_NOT_UNIQUE', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('upsell_opportunities_rule_id_fkey', 'READY_TO_CREATE', 'upsell_opportunities', 'rule_id', 'upsell_rules', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing user_aula_progress_aula_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_aula_progress_aula_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'EXISTS', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_aula_progress') THEN
        INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'MISSING_SOURCE_TABLE', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Table user_aula_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_aula_progress' AND column_name = 'aula_id') THEN
        INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'MISSING_SOURCE_COLUMN', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Column user_aula_progress.aula_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_aulas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'MISSING_TARGET_TABLE', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Table conteudo_aulas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'conteudo_aulas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'MISSING_TARGET_COLUMN', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Column conteudo_aulas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_aula_progress' AND column_name = 'aula_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'TYPE_MISMATCH', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'conteudo_aulas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'READY_TO_CREATE', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'MISSING_TARGET_COLUMN', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Column conteudo_aulas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_aula_progress' AND column_name = 'aula_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_aulas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'TYPE_MISMATCH', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.conteudo_aulas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'TARGET_NOT_UNIQUE', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('user_aula_progress_aula_id_fkey', 'READY_TO_CREATE', 'user_aula_progress', 'aula_id', 'conteudo_aulas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing user_cidadela_estado_user_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_cidadela_estado_user_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'EXISTS', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado') THEN
        INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'MISSING_SOURCE_TABLE', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Table user_cidadela_estado not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado' AND column_name = 'user_id') THEN
        INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'MISSING_SOURCE_COLUMN', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Column user_cidadela_estado.user_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'MISSING_TARGET_TABLE', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'MISSING_TARGET_COLUMN', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado' AND column_name = 'user_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'TYPE_MISMATCH', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'profiles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'READY_TO_CREATE', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'MISSING_TARGET_COLUMN', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_cidadela_estado' AND column_name = 'user_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'TYPE_MISMATCH', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.profiles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'TARGET_NOT_UNIQUE', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('user_cidadela_estado_user_id_fkey', 'READY_TO_CREATE', 'user_cidadela_estado', 'user_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing user_favorites_library_item_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_favorites_library_item_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'EXISTS', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_favorites') THEN
        INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'MISSING_SOURCE_TABLE', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Table user_favorites not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'library_item_id') THEN
        INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'MISSING_SOURCE_COLUMN', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Column user_favorites.library_item_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'library_items') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'MISSING_TARGET_TABLE', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Table library_items not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'library_items' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'MISSING_TARGET_COLUMN', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Column library_items.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'library_item_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'TYPE_MISMATCH', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'library_items');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'READY_TO_CREATE', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'library_items' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'MISSING_TARGET_COLUMN', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Column library_items.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_favorites' AND column_name = 'library_item_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'library_items' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'TYPE_MISMATCH', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.library_items')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'TARGET_NOT_UNIQUE', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('user_favorites_library_item_id_fkey', 'READY_TO_CREATE', 'user_favorites', 'library_item_id', 'library_items', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing user_progress_lesson_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_lesson_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'EXISTS', 'user_progress', 'lesson_id', 'lessons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_progress') THEN
        INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'MISSING_SOURCE_TABLE', 'user_progress', 'lesson_id', 'lessons', 'id', 'Table user_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'lesson_id') THEN
        INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'MISSING_SOURCE_COLUMN', 'user_progress', 'lesson_id', 'lessons', 'id', 'Column user_progress.lesson_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'lessons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'MISSING_TARGET_TABLE', 'user_progress', 'lesson_id', 'lessons', 'id', 'Table lessons not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'lessons' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'user_progress', 'lesson_id', 'lessons', 'id', 'Column lessons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'lesson_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'TYPE_MISMATCH', 'user_progress', 'lesson_id', 'lessons', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'lessons');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'READY_TO_CREATE', 'user_progress', 'lesson_id', 'lessons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'MISSING_TARGET_COLUMN', 'user_progress', 'lesson_id', 'lessons', 'id', 'Column lessons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'lesson_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'TYPE_MISMATCH', 'user_progress', 'lesson_id', 'lessons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.lessons')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'TARGET_NOT_UNIQUE', 'user_progress', 'lesson_id', 'lessons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('user_progress_lesson_id_fkey', 'READY_TO_CREATE', 'user_progress', 'lesson_id', 'lessons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing user_unlocked_rewards_reward_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_unlocked_rewards_reward_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'EXISTS', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_unlocked_rewards') THEN
        INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'MISSING_SOURCE_TABLE', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Table user_unlocked_rewards not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_unlocked_rewards' AND column_name = 'reward_id') THEN
        INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'MISSING_SOURCE_COLUMN', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Column user_unlocked_rewards.reward_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symbolic_rewards') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'MISSING_TARGET_TABLE', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Table symbolic_rewards not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'symbolic_rewards' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'MISSING_TARGET_COLUMN', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Column symbolic_rewards.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_unlocked_rewards' AND column_name = 'reward_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'TYPE_MISMATCH', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'symbolic_rewards');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'READY_TO_CREATE', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_rewards' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'MISSING_TARGET_COLUMN', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Column symbolic_rewards.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_unlocked_rewards' AND column_name = 'reward_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'symbolic_rewards' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'TYPE_MISMATCH', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.symbolic_rewards')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'TARGET_NOT_UNIQUE', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('user_unlocked_rewards_reward_id_fkey', 'READY_TO_CREATE', 'user_unlocked_rewards', 'reward_id', 'symbolic_rewards', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

END $$;

-- Retornar resultados tabulares
SELECT * FROM diagnostic_results ORDER BY constraint_name;

-- Retornar resumo por status
SELECT status, COUNT(*) AS total
FROM diagnostic_results
GROUP BY status
ORDER BY status;
