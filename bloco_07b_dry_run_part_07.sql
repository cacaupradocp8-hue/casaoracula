-- BLOCO 07B - FOREIGN KEYS DIAGNOSTIC (PARTE 7 de 8)
-- Diagnóstico de FKs 289 a 336 (Total: 48)

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

    -- Analyzing oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'EXISTS', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Table oraculo_portal_narroterapia_perguntas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas' AND column_name = 'narroterapia_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Column oraculo_portal_narroterapia_perguntas.narroterapia_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Table oraculo_portal_narroterapia not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portal_narroterapia' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Column oraculo_portal_narroterapia.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas' AND column_name = 'narroterapia_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Column oraculo_portal_narroterapia.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia_perguntas' AND column_name = 'narroterapia_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portal_narroterapia')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_perguntas_narroterapia_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_narroterapia_perguntas', 'narroterapia_id', 'oraculo_portal_narroterapia', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_narroterapia_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_narroterapia_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'EXISTS', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portal_narroterapia not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portal_narroterapia.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_narroterapia' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_narroterapia_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_narroterapia', 'portal_id', 'oraculo_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing oraculo_portal_riscos_eticos_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'oraculo_portal_riscos_eticos_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'EXISTS', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portal_riscos_eticos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portal_riscos_eticos.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oraculo_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'MISSING_TARGET_TABLE', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Table oraculo_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oraculo_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Column oraculo_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portal_riscos_eticos' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oraculo_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'TYPE_MISMATCH', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oraculo_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('oraculo_portal_riscos_eticos_portal_id_fkey', 'READY_TO_CREATE', 'oraculo_portal_riscos_eticos', 'portal_id', 'oraculo_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portais_jornada_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_jornada_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'EXISTS', 'portais', 'jornada_id', 'jornadas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') THEN
        INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'MISSING_SOURCE_TABLE', 'portais', 'jornada_id', 'jornadas', 'id', 'Table portais not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'jornada_id') THEN
        INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'MISSING_SOURCE_COLUMN', 'portais', 'jornada_id', 'jornadas', 'id', 'Column portais.jornada_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornadas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'MISSING_TARGET_TABLE', 'portais', 'jornada_id', 'jornadas', 'id', 'Table jornadas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'jornadas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'MISSING_TARGET_COLUMN', 'portais', 'jornada_id', 'jornadas', 'id', 'Column jornadas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'jornada_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'TYPE_MISMATCH', 'portais', 'jornada_id', 'jornadas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'READY_TO_CREATE', 'portais', 'jornada_id', 'jornadas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornadas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'MISSING_TARGET_COLUMN', 'portais', 'jornada_id', 'jornadas', 'id', 'Column jornadas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'jornada_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornadas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'TYPE_MISMATCH', 'portais', 'jornada_id', 'jornadas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.jornadas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'TARGET_NOT_UNIQUE', 'portais', 'jornada_id', 'jornadas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('portais_jornada_id_fkey', 'READY_TO_CREATE', 'portais', 'jornada_id', 'jornadas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portais_modulo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portais_modulo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'EXISTS', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portais') THEN
        INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'MISSING_SOURCE_TABLE', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Table portais not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'modulo_id') THEN
        INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'MISSING_SOURCE_COLUMN', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Column portais.modulo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'modulos_formativos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'MISSING_TARGET_TABLE', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Table modulos_formativos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'modulos_formativos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'MISSING_TARGET_COLUMN', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Column modulos_formativos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'modulo_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'TYPE_MISMATCH', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'READY_TO_CREATE', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'modulos_formativos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'MISSING_TARGET_COLUMN', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Column modulos_formativos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portais' AND column_name = 'modulo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'modulos_formativos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'TYPE_MISMATCH', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.modulos_formativos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'TARGET_NOT_UNIQUE', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('portais_modulo_id_fkey', 'READY_TO_CREATE', 'portais', 'modulo_id', 'modulos_formativos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_junguiano_modulos_config_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_modulos_config_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'EXISTS', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Table portal_junguiano_modulos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'config_id') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Column portal_junguiano_modulos.config_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'MISSING_TARGET_TABLE', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Table portal_junguiano_config not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'portal_junguiano_config' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Column portal_junguiano_config.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'config_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Column portal_junguiano_config.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'config_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.portal_junguiano_config')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('portal_junguiano_modulos_config_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_modulos', 'config_id', 'portal_junguiano_config', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_junguiano_portais_modulo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_portais_modulo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'EXISTS', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Table portal_junguiano_portais not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'modulo_id') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Column portal_junguiano_portais.modulo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'MISSING_TARGET_TABLE', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Table portal_junguiano_modulos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'portal_junguiano_modulos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Column portal_junguiano_modulos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'modulo_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Column portal_junguiano_modulos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'modulo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_modulos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.portal_junguiano_modulos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('portal_junguiano_portais_modulo_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_portais', 'modulo_id', 'portal_junguiano_modulos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_junguiano_progresso_config_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_progresso_config_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'EXISTS', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Table portal_junguiano_progresso not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso' AND column_name = 'config_id') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Column portal_junguiano_progresso.config_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'MISSING_TARGET_TABLE', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Table portal_junguiano_config not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'portal_junguiano_config' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Column portal_junguiano_config.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso' AND column_name = 'config_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Column portal_junguiano_config.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_progresso' AND column_name = 'config_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_config' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.portal_junguiano_config')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('portal_junguiano_progresso_config_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_progresso', 'config_id', 'portal_junguiano_config', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_junguiano_registros_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_junguiano_registros_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'EXISTS', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Table portal_junguiano_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Column portal_junguiano_registros.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'MISSING_TARGET_TABLE', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Table portal_junguiano_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'portal_junguiano_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Column portal_junguiano_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Column portal_junguiano_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_registros' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_junguiano_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'TYPE_MISMATCH', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.portal_junguiano_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('portal_junguiano_registros_portal_id_fkey', 'READY_TO_CREATE', 'portal_junguiano_registros', 'portal_id', 'portal_junguiano_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_progress_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_progress_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'EXISTS', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_progress') THEN
        INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Table portal_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_progress' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Column portal_progress.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'MISSING_TARGET_TABLE', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Table clube_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Column clube_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_progress' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'TYPE_MISMATCH', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'READY_TO_CREATE', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Column clube_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_progress' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'TYPE_MISMATCH', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('portal_progress_portal_id_fkey', 'READY_TO_CREATE', 'portal_progress', 'portal_id', 'clube_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing portal_salas_sala_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portal_salas_sala_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'EXISTS', 'portal_salas', 'sala_id', 'salas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'portal_salas') THEN
        INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'MISSING_SOURCE_TABLE', 'portal_salas', 'sala_id', 'salas', 'id', 'Table portal_salas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_salas' AND column_name = 'sala_id') THEN
        INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'MISSING_SOURCE_COLUMN', 'portal_salas', 'sala_id', 'salas', 'id', 'Column portal_salas.sala_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'MISSING_TARGET_TABLE', 'portal_salas', 'sala_id', 'salas', 'id', 'Table salas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'salas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_salas', 'sala_id', 'salas', 'id', 'Column salas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_salas' AND column_name = 'sala_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'TYPE_MISMATCH', 'portal_salas', 'sala_id', 'salas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'READY_TO_CREATE', 'portal_salas', 'sala_id', 'salas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'portal_salas', 'sala_id', 'salas', 'id', 'Column salas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'portal_salas' AND column_name = 'sala_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'TYPE_MISMATCH', 'portal_salas', 'sala_id', 'salas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'TARGET_NOT_UNIQUE', 'portal_salas', 'sala_id', 'salas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('portal_salas_sala_id_fkey', 'READY_TO_CREATE', 'portal_salas', 'sala_id', 'salas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing post_session_closures_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'EXISTS', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'MISSING_SOURCE_TABLE', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Table post_session_closures not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Column post_session_closures.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'MISSING_TARGET_TABLE', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'MISSING_TARGET_COLUMN', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'TYPE_MISMATCH', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'READY_TO_CREATE', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'MISSING_TARGET_COLUMN', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'TYPE_MISMATCH', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'TARGET_NOT_UNIQUE', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('post_session_closures_case_id_fkey', 'READY_TO_CREATE', 'post_session_closures', 'case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing post_session_closures_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'EXISTS', 'post_session_closures', 'client_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'MISSING_SOURCE_TABLE', 'post_session_closures', 'client_id', 'profiles', 'id', 'Table post_session_closures not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'post_session_closures', 'client_id', 'profiles', 'id', 'Column post_session_closures.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'MISSING_TARGET_TABLE', 'post_session_closures', 'client_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'MISSING_TARGET_COLUMN', 'post_session_closures', 'client_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'TYPE_MISMATCH', 'post_session_closures', 'client_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'READY_TO_CREATE', 'post_session_closures', 'client_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'MISSING_TARGET_COLUMN', 'post_session_closures', 'client_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'TYPE_MISMATCH', 'post_session_closures', 'client_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'TARGET_NOT_UNIQUE', 'post_session_closures', 'client_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('post_session_closures_client_id_fkey', 'READY_TO_CREATE', 'post_session_closures', 'client_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing post_session_closures_therapist_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'post_session_closures_therapist_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'EXISTS', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'post_session_closures') THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'MISSING_SOURCE_TABLE', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Table post_session_closures not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'therapist_id') THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'MISSING_SOURCE_COLUMN', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Column post_session_closures.therapist_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'MISSING_TARGET_TABLE', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'therapist_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'TYPE_MISMATCH', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'READY_TO_CREATE', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'post_session_closures' AND column_name = 'therapist_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'TYPE_MISMATCH', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'TARGET_NOT_UNIQUE', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('post_session_closures_therapist_id_fkey', 'READY_TO_CREATE', 'post_session_closures', 'therapist_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing praticas_mudra_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'praticas_mudra_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'EXISTS', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'praticas_mudra') THEN
        INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'MISSING_SOURCE_TABLE', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Table praticas_mudra not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'praticas_mudra' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Column praticas_mudra.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'MISSING_TARGET_TABLE', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'MISSING_TARGET_COLUMN', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'praticas_mudra' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'TYPE_MISMATCH', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'READY_TO_CREATE', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'MISSING_TARGET_COLUMN', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'praticas_mudra' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'TYPE_MISMATCH', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'TARGET_NOT_UNIQUE', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('praticas_mudra_client_id_fkey', 'READY_TO_CREATE', 'praticas_mudra', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing progresso_aluna_formacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progresso_aluna_formacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'EXISTS', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'progresso_aluna') THEN
        INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'MISSING_SOURCE_TABLE', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Table progresso_aluna not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'formacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Column progresso_aluna.formacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'MISSING_TARGET_TABLE', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Table formacoes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'formacoes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'MISSING_TARGET_COLUMN', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Column formacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'formacao_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'TYPE_MISMATCH', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'READY_TO_CREATE', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'MISSING_TARGET_COLUMN', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Column formacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'formacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'TYPE_MISMATCH', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'TARGET_NOT_UNIQUE', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('progresso_aluna_formacao_id_fkey', 'READY_TO_CREATE', 'progresso_aluna', 'formacao_id', 'formacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing progresso_aluna_modulo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'progresso_aluna_modulo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'EXISTS', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'progresso_aluna') THEN
        INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'MISSING_SOURCE_TABLE', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Table progresso_aluna not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'modulo_id') THEN
        INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'MISSING_SOURCE_COLUMN', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Column progresso_aluna.modulo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'formacao_modulos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'MISSING_TARGET_TABLE', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Table formacao_modulos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'formacao_modulos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'MISSING_TARGET_COLUMN', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Column formacao_modulos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'modulo_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'TYPE_MISMATCH', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'READY_TO_CREATE', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'MISSING_TARGET_COLUMN', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Column formacao_modulos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'progresso_aluna' AND column_name = 'modulo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'formacao_modulos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'TYPE_MISMATCH', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'TARGET_NOT_UNIQUE', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('progresso_aluna_modulo_id_fkey', 'READY_TO_CREATE', 'progresso_aluna', 'modulo_id', 'formacao_modulos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing projetos_mestria_course_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projetos_mestria_course_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'EXISTS', 'projetos_mestria', 'course_id', 'courses', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projetos_mestria') THEN
        INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'MISSING_SOURCE_TABLE', 'projetos_mestria', 'course_id', 'courses', 'id', 'Table projetos_mestria not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projetos_mestria' AND column_name = 'course_id') THEN
        INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'MISSING_SOURCE_COLUMN', 'projetos_mestria', 'course_id', 'courses', 'id', 'Column projetos_mestria.course_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'MISSING_TARGET_TABLE', 'projetos_mestria', 'course_id', 'courses', 'id', 'Table courses not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'courses' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'MISSING_TARGET_COLUMN', 'projetos_mestria', 'course_id', 'courses', 'id', 'Column courses.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projetos_mestria' AND column_name = 'course_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'TYPE_MISMATCH', 'projetos_mestria', 'course_id', 'courses', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'READY_TO_CREATE', 'projetos_mestria', 'course_id', 'courses', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'MISSING_TARGET_COLUMN', 'projetos_mestria', 'course_id', 'courses', 'id', 'Column courses.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'projetos_mestria' AND column_name = 'course_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'TYPE_MISMATCH', 'projetos_mestria', 'course_id', 'courses', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'TARGET_NOT_UNIQUE', 'projetos_mestria', 'course_id', 'courses', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('projetos_mestria_course_id_fkey', 'READY_TO_CREATE', 'projetos_mestria', 'course_id', 'courses', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing protocolo_oracula_caminho_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_caminho_registro_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'EXISTS', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Table protocolo_oracula not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'caminho_registro_id') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Column protocolo_oracula.caminho_registro_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'MISSING_TARGET_TABLE', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Table jornada_heroina_registros not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'jornada_heroina_registros' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Column jornada_heroina_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'caminho_registro_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Column jornada_heroina_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'caminho_registro_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jornada_heroina_registros' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_caminho_registro_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'caminho_registro_id', 'jornada_heroina_registros', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing protocolo_oracula_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'EXISTS', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Table protocolo_oracula not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Column protocolo_oracula.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'cliente_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_cliente_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing protocolo_oracula_mapa_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_mapa_registro_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'EXISTS', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Table protocolo_oracula not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'mapa_registro_id') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Column protocolo_oracula.mapa_registro_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'MISSING_TARGET_TABLE', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Table big5_symbolic_registros not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'big5_symbolic_registros' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Column big5_symbolic_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'mapa_registro_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Column big5_symbolic_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'mapa_registro_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'big5_symbolic_registros' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_mapa_registro_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'mapa_registro_id', 'big5_symbolic_registros', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing protocolo_oracula_oraculo_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_oraculo_registro_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'EXISTS', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Table protocolo_oracula not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'oraculo_registro_id') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Column protocolo_oracula.oraculo_registro_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'MISSING_TARGET_TABLE', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Table eneagrama_feminino_registros not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'eneagrama_feminino_registros' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Column eneagrama_feminino_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'oraculo_registro_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Column eneagrama_feminino_registros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'oraculo_registro_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'eneagrama_feminino_registros' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_oraculo_registro_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'oraculo_registro_id', 'eneagrama_feminino_registros', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing protocolo_oracula_session_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'protocolo_oracula_session_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'EXISTS', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'protocolo_oracula') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'MISSING_SOURCE_TABLE', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Table protocolo_oracula not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'session_case_id') THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Column protocolo_oracula.session_case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'MISSING_TARGET_TABLE', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Table session_cases not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'session_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'session_case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'MISSING_TARGET_COLUMN', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Column session_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'protocolo_oracula' AND column_name = 'session_case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'TYPE_MISMATCH', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'TARGET_NOT_UNIQUE', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('protocolo_oracula_session_case_id_fkey', 'READY_TO_CREATE', 'protocolo_oracula', 'session_case_id', 'session_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_opcoes_pergunta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_opcoes_pergunta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'EXISTS', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_opcoes') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Table quiz_opcoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_opcoes' AND column_name = 'pergunta_id') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Column quiz_opcoes.pergunta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_perguntas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Table quiz_perguntas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'quiz_perguntas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Column quiz_perguntas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_opcoes' AND column_name = 'pergunta_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'TYPE_MISMATCH', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'READY_TO_CREATE', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Column quiz_perguntas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_opcoes' AND column_name = 'pergunta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'TYPE_MISMATCH', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('quiz_opcoes_pergunta_id_fkey', 'READY_TO_CREATE', 'quiz_opcoes', 'pergunta_id', 'quiz_perguntas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_perguntas_quiz_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_perguntas_quiz_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'EXISTS', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_perguntas') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Table quiz_perguntas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'quiz_id') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Column quiz_perguntas.quiz_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Table quizzes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'quizzes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Column quizzes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'quiz_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'TYPE_MISMATCH', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'READY_TO_CREATE', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Column quizzes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_perguntas' AND column_name = 'quiz_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'TYPE_MISMATCH', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('quiz_perguntas_quiz_id_fkey', 'READY_TO_CREATE', 'quiz_perguntas', 'quiz_id', 'quizzes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_respostas_usuario_quiz_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_quiz_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'EXISTS', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Table quiz_respostas_usuario not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'quiz_id') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Column quiz_respostas_usuario.quiz_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Table quizzes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'quizzes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Column quizzes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'quiz_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'TYPE_MISMATCH', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'READY_TO_CREATE', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Column quizzes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'quiz_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'TYPE_MISMATCH', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_quiz_id_fkey', 'READY_TO_CREATE', 'quiz_respostas_usuario', 'quiz_id', 'quizzes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_respostas_usuario_resultado_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_respostas_usuario_resultado_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'EXISTS', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Table quiz_respostas_usuario not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'resultado_id') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Column quiz_respostas_usuario.resultado_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Table quiz_resultados not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'quiz_resultados' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Column quiz_resultados.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'resultado_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'TYPE_MISMATCH', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'READY_TO_CREATE', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Column quiz_resultados.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_respostas_usuario' AND column_name = 'resultado_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'TYPE_MISMATCH', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('quiz_respostas_usuario_resultado_id_fkey', 'READY_TO_CREATE', 'quiz_respostas_usuario', 'resultado_id', 'quiz_resultados', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_resultados_agente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_agente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'EXISTS', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Table quiz_resultados not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'agente_id') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Column quiz_resultados.agente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'agentes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Table agentes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'agentes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Column agentes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'agente_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'TYPE_MISMATCH', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'READY_TO_CREATE', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Column agentes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'agente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agentes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'TYPE_MISMATCH', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('quiz_resultados_agente_id_fkey', 'READY_TO_CREATE', 'quiz_resultados', 'agente_id', 'agentes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quiz_resultados_quiz_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quiz_resultados_quiz_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'EXISTS', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_resultados') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'MISSING_SOURCE_TABLE', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Table quiz_resultados not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'quiz_id') THEN
        INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'MISSING_SOURCE_COLUMN', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Column quiz_resultados.quiz_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'MISSING_TARGET_TABLE', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Table quizzes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'quizzes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Column quizzes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'quiz_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'TYPE_MISMATCH', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'READY_TO_CREATE', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Column quizzes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quiz_resultados' AND column_name = 'quiz_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'TYPE_MISMATCH', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'TARGET_NOT_UNIQUE', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('quiz_resultados_quiz_id_fkey', 'READY_TO_CREATE', 'quiz_resultados', 'quiz_id', 'quizzes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quizzes_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'EXISTS', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') THEN
        INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Table quizzes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Column quizzes.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'MISSING_TARGET_TABLE', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Table conteudo_travessias not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'conteudo_travessias' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Column conteudo_travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'TYPE_MISMATCH', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'READY_TO_CREATE', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Column conteudo_travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'TYPE_MISMATCH', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('quizzes_portal_id_fkey', 'READY_TO_CREATE', 'quizzes', 'portal_id', 'conteudo_travessias', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing quizzes_sala_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_sala_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'EXISTS', 'quizzes', 'sala_id', 'salas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') THEN
        INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'MISSING_SOURCE_TABLE', 'quizzes', 'sala_id', 'salas', 'id', 'Table quizzes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'sala_id') THEN
        INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'MISSING_SOURCE_COLUMN', 'quizzes', 'sala_id', 'salas', 'id', 'Column quizzes.sala_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'MISSING_TARGET_TABLE', 'quizzes', 'sala_id', 'salas', 'id', 'Table salas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'salas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'quizzes', 'sala_id', 'salas', 'id', 'Column salas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'sala_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'TYPE_MISMATCH', 'quizzes', 'sala_id', 'salas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'READY_TO_CREATE', 'quizzes', 'sala_id', 'salas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'quizzes', 'sala_id', 'salas', 'id', 'Column salas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'sala_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'TYPE_MISMATCH', 'quizzes', 'sala_id', 'salas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'TARGET_NOT_UNIQUE', 'quizzes', 'sala_id', 'salas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('quizzes_sala_id_fkey', 'READY_TO_CREATE', 'quizzes', 'sala_id', 'salas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing reflexoes_jornada_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reflexoes_jornada_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'EXISTS', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada') THEN
        INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'MISSING_SOURCE_TABLE', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Table reflexoes_jornada not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Column reflexoes_jornada.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'MISSING_TARGET_TABLE', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'MISSING_TARGET_COLUMN', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'TYPE_MISMATCH', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'READY_TO_CREATE', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'MISSING_TARGET_COLUMN', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'reflexoes_jornada' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'TYPE_MISMATCH', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'TARGET_NOT_UNIQUE', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('reflexoes_jornada_client_id_fkey', 'READY_TO_CREATE', 'reflexoes_jornada', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing relacionamentos_espelho_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'relacionamentos_espelho_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'EXISTS', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho') THEN
        INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'MISSING_SOURCE_TABLE', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Table relacionamentos_espelho not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Column relacionamentos_espelho.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'MISSING_TARGET_TABLE', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'MISSING_TARGET_COLUMN', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'TYPE_MISMATCH', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'READY_TO_CREATE', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'MISSING_TARGET_COLUMN', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'relacionamentos_espelho' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'TYPE_MISMATCH', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'TARGET_NOT_UNIQUE', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('relacionamentos_espelho_client_id_fkey', 'READY_TO_CREATE', 'relacionamentos_espelho', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing respostas_exercicios_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'respostas_exercicios_sessao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'EXISTS', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'respostas_exercicios') THEN
        INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Table respostas_exercicios not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'respostas_exercicios' AND column_name = 'sessao_id') THEN
        INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Column respostas_exercicios.sessao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Table sessoes_labirinto not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessoes_labirinto' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Column sessoes_labirinto.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'respostas_exercicios' AND column_name = 'sessao_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'TYPE_MISMATCH', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'READY_TO_CREATE', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Column sessoes_labirinto.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'respostas_exercicios' AND column_name = 'sessao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessoes_labirinto' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'TYPE_MISMATCH', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('respostas_exercicios_sessao_id_fkey', 'READY_TO_CREATE', 'respostas_exercicios', 'sessao_id', 'sessoes_labirinto', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing rituais_integracao_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rituais_integracao_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'EXISTS', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rituais_integracao') THEN
        INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'MISSING_SOURCE_TABLE', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Table rituais_integracao not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_integracao' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Column rituais_integracao.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'MISSING_TARGET_TABLE', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'MISSING_TARGET_COLUMN', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_integracao' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'TYPE_MISMATCH', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'READY_TO_CREATE', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'MISSING_TARGET_COLUMN', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rituais_integracao' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'TYPE_MISMATCH', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'TARGET_NOT_UNIQUE', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('rituais_integracao_client_id_fkey', 'READY_TO_CREATE', 'rituais_integracao', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing ritual_passages_ritual_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ritual_passages_ritual_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'EXISTS', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ritual_passages') THEN
        INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'MISSING_SOURCE_TABLE', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Table ritual_passages not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_passages' AND column_name = 'ritual_id') THEN
        INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'MISSING_SOURCE_COLUMN', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Column ritual_passages.ritual_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ritual_definitions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'MISSING_TARGET_TABLE', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Table ritual_definitions not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'ritual_definitions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Column ritual_definitions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_passages' AND column_name = 'ritual_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'TYPE_MISMATCH', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'READY_TO_CREATE', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_definitions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'MISSING_TARGET_COLUMN', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Column ritual_definitions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_passages' AND column_name = 'ritual_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ritual_definitions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'TYPE_MISMATCH', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'TARGET_NOT_UNIQUE', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('ritual_passages_ritual_id_fkey', 'READY_TO_CREATE', 'ritual_passages', 'ritual_id', 'ritual_definitions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sala_ferramentas_familia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_familia_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'EXISTS', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'MISSING_SOURCE_TABLE', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Table sala_ferramentas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'familia_id') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'MISSING_SOURCE_COLUMN', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Column sala_ferramentas.familia_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'travessia_familias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'MISSING_TARGET_TABLE', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Table travessia_familias not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'travessia_familias' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Column travessia_familias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'familia_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Column travessia_familias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'familia_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'travessia_familias' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'TARGET_NOT_UNIQUE', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_familia_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'familia_id', 'travessia_familias', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sala_ferramentas_ferramenta_pai_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_ferramenta_pai_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'EXISTS', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'MISSING_SOURCE_TABLE', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Table sala_ferramentas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'ferramenta_pai_id') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'MISSING_SOURCE_COLUMN', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.ferramenta_pai_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'MISSING_TARGET_TABLE', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Table sala_ferramentas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sala_ferramentas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'ferramenta_pai_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'ferramenta_pai_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'TARGET_NOT_UNIQUE', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_ferramenta_pai_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'ferramenta_pai_id', 'sala_ferramentas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sala_ferramentas_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'EXISTS', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Table sala_ferramentas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Column sala_ferramentas.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conteudo_travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'MISSING_TARGET_TABLE', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Table conteudo_travessias not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'conteudo_travessias' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Column conteudo_travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'portal_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Column conteudo_travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conteudo_travessias' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_portal_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'portal_id', 'conteudo_travessias', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing sala_ferramentas_sala_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'sala_ferramentas_sala_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'EXISTS', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'MISSING_SOURCE_TABLE', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Table sala_ferramentas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'sala_id') THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'MISSING_SOURCE_COLUMN', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Column sala_ferramentas.sala_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'salas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'MISSING_TARGET_TABLE', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Table salas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'salas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Column salas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'sala_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'MISSING_TARGET_COLUMN', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Column salas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'sala_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'salas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'TYPE_MISMATCH', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'TARGET_NOT_UNIQUE', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('sala_ferramentas_sala_id_fkey', 'READY_TO_CREATE', 'sala_ferramentas', 'sala_id', 'salas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing season_books_season_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_books_season_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'EXISTS', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'season_books') THEN
        INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'MISSING_SOURCE_TABLE', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Table season_books not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_books' AND column_name = 'season_id') THEN
        INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'MISSING_SOURCE_COLUMN', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Column season_books.season_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'MISSING_TARGET_TABLE', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Table oracular_seasons not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracular_seasons' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'MISSING_TARGET_COLUMN', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_books' AND column_name = 'season_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'TYPE_MISMATCH', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'READY_TO_CREATE', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'MISSING_TARGET_COLUMN', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_books' AND column_name = 'season_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'TYPE_MISMATCH', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'TARGET_NOT_UNIQUE', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('season_books_season_id_fkey', 'READY_TO_CREATE', 'season_books', 'season_id', 'oracular_seasons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing season_labs_season_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'season_labs_season_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'EXISTS', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'season_labs') THEN
        INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'MISSING_SOURCE_TABLE', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Table season_labs not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_labs' AND column_name = 'season_id') THEN
        INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'MISSING_SOURCE_COLUMN', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Column season_labs.season_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'MISSING_TARGET_TABLE', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Table oracular_seasons not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracular_seasons' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'MISSING_TARGET_COLUMN', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_labs' AND column_name = 'season_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'TYPE_MISMATCH', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'READY_TO_CREATE', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'MISSING_TARGET_COLUMN', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'season_labs' AND column_name = 'season_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'TYPE_MISMATCH', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'TARGET_NOT_UNIQUE', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('season_labs_season_id_fkey', 'READY_TO_CREATE', 'season_labs', 'season_id', 'oracular_seasons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_archetypes_archetype_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_archetype_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'EXISTS', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'MISSING_SOURCE_TABLE', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Table session_archetypes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'archetype_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Column session_archetypes.archetype_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'MISSING_TARGET_TABLE', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Table atlas_arquetipos_femininos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'atlas_arquetipos_femininos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'MISSING_TARGET_COLUMN', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Column atlas_arquetipos_femininos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'archetype_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'TYPE_MISMATCH', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'READY_TO_CREATE', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'MISSING_TARGET_COLUMN', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Column atlas_arquetipos_femininos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'archetype_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'atlas_arquetipos_femininos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'TYPE_MISMATCH', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'TARGET_NOT_UNIQUE', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_archetypes_archetype_id_fkey', 'READY_TO_CREATE', 'session_archetypes', 'archetype_id', 'atlas_arquetipos_femininos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_archetypes_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'EXISTS', 'session_archetypes', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'MISSING_SOURCE_TABLE', 'session_archetypes', 'client_id', 'clientes', 'id', 'Table session_archetypes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_archetypes', 'client_id', 'clientes', 'id', 'Column session_archetypes.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'MISSING_TARGET_TABLE', 'session_archetypes', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_archetypes', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'TYPE_MISMATCH', 'session_archetypes', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'READY_TO_CREATE', 'session_archetypes', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_archetypes', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'TYPE_MISMATCH', 'session_archetypes', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'TARGET_NOT_UNIQUE', 'session_archetypes', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_archetypes_client_id_fkey', 'READY_TO_CREATE', 'session_archetypes', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_archetypes_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_archetypes_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'EXISTS', 'session_archetypes', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_archetypes') THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'MISSING_SOURCE_TABLE', 'session_archetypes', 'session_id', 'sessions', 'id', 'Table session_archetypes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_archetypes', 'session_id', 'sessions', 'id', 'Column session_archetypes.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'MISSING_TARGET_TABLE', 'session_archetypes', 'session_id', 'sessions', 'id', 'Table sessions not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sessions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'MISSING_TARGET_COLUMN', 'session_archetypes', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'session_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'TYPE_MISMATCH', 'session_archetypes', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'READY_TO_CREATE', 'session_archetypes', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'MISSING_TARGET_COLUMN', 'session_archetypes', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_archetypes' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'TYPE_MISMATCH', 'session_archetypes', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'TARGET_NOT_UNIQUE', 'session_archetypes', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_archetypes_session_id_fkey', 'READY_TO_CREATE', 'session_archetypes', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_cases_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'EXISTS', 'session_cases', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') THEN
        INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'MISSING_SOURCE_TABLE', 'session_cases', 'client_id', 'clientes', 'id', 'Table session_cases not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_cases', 'client_id', 'clientes', 'id', 'Column session_cases.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'MISSING_TARGET_TABLE', 'session_cases', 'client_id', 'clientes', 'id', 'Table clientes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clientes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_cases', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'TYPE_MISMATCH', 'session_cases', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'READY_TO_CREATE', 'session_cases', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'MISSING_TARGET_COLUMN', 'session_cases', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'TYPE_MISMATCH', 'session_cases', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'TARGET_NOT_UNIQUE', 'session_cases', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_cases_client_id_fkey', 'READY_TO_CREATE', 'session_cases', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_cases_therapist_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_cases_therapist_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'EXISTS', 'session_cases', 'therapist_id', 'profiles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_cases') THEN
        INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'MISSING_SOURCE_TABLE', 'session_cases', 'therapist_id', 'profiles', 'id', 'Table session_cases not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'therapist_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_cases', 'therapist_id', 'profiles', 'id', 'Column session_cases.therapist_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'MISSING_TARGET_TABLE', 'session_cases', 'therapist_id', 'profiles', 'id', 'Table profiles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'profiles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'session_cases', 'therapist_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'therapist_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'TYPE_MISMATCH', 'session_cases', 'therapist_id', 'profiles', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'READY_TO_CREATE', 'session_cases', 'therapist_id', 'profiles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'MISSING_TARGET_COLUMN', 'session_cases', 'therapist_id', 'profiles', 'id', 'Column profiles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_cases' AND column_name = 'therapist_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'TYPE_MISMATCH', 'session_cases', 'therapist_id', 'profiles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'TARGET_NOT_UNIQUE', 'session_cases', 'therapist_id', 'profiles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_cases_therapist_id_fkey', 'READY_TO_CREATE', 'session_cases', 'therapist_id', 'profiles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing session_interventions_intervention_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_interventions_intervention_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'EXISTS', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'session_interventions') THEN
        INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'MISSING_SOURCE_TABLE', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Table session_interventions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'intervention_id') THEN
        INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'MISSING_SOURCE_COLUMN', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Column session_interventions.intervention_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interventions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'MISSING_TARGET_TABLE', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Table interventions not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns as information_schema might not have full visibility or different structures
            -- But we usually expect 'id' or 'email' in auth.users
            v_target_type := 'uuid'; -- Assume uuid for auth.users.id
            v_is_unique := TRUE;
            
            -- Basic existence check via pg_attribute for auth tables if possible
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'interventions' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'MISSING_TARGET_COLUMN', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Column interventions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'intervention_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'TYPE_MISMATCH', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'READY_TO_CREATE', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'MISSING_TARGET_COLUMN', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Column interventions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'session_interventions' AND column_name = 'intervention_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'interventions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'TYPE_MISMATCH', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'TARGET_NOT_UNIQUE', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('session_interventions_intervention_id_fkey', 'READY_TO_CREATE', 'session_interventions', 'intervention_id', 'interventions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

END $$;

SELECT * FROM diagnostic_results ORDER BY status, constraint_name;

-- Summary for this part
SELECT 
    status, 
    count(*) as total
FROM diagnostic_results
GROUP BY status
ORDER BY total DESC;

DROP TABLE diagnostic_results;
