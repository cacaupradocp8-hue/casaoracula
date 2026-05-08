-- BLOCO 07B - FOREIGN KEYS DIAGNOSTIC (PARTE 3 de 8)
-- Diagnóstico de FKs 97 a 144 (Total: 48)

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

    -- Analyzing co_city_history_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_tool_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'EXISTS', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_city_history') THEN
        INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Table co_city_history not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'tool_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Column co_city_history.tool_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'MISSING_TARGET_TABLE', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Table sala_ferramentas not found');
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
                INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'tool_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'TYPE_MISMATCH', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'READY_TO_CREATE', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'tool_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'TYPE_MISMATCH', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_city_history_tool_id_fkey', 'READY_TO_CREATE', 'co_city_history', 'tool_id', 'sala_ferramentas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_client_profile_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profile_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'EXISTS', 'co_client_profile', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_client_profile') THEN
        INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_client_profile', 'client_id', 'clientes', 'id', 'Table co_client_profile not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profile' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_client_profile', 'client_id', 'clientes', 'id', 'Column co_client_profile.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_client_profile', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_client_profile', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profile' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'TYPE_MISMATCH', 'co_client_profile', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'READY_TO_CREATE', 'co_client_profile', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_client_profile', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profile' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'TYPE_MISMATCH', 'co_client_profile', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_client_profile', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_client_profile_client_id_fkey', 'READY_TO_CREATE', 'co_client_profile', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_client_profiles_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_client_profiles_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'EXISTS', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_client_profiles') THEN
        INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Table co_client_profiles not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profiles' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Column co_client_profiles.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profiles' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'TYPE_MISMATCH', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'READY_TO_CREATE', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_client_profiles' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'TYPE_MISMATCH', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_client_profiles_client_id_fkey', 'READY_TO_CREATE', 'co_client_profiles', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_convites_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_convites_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'EXISTS', 'co_convites', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_convites') THEN
        INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'co_convites', 'cliente_id', 'clientes', 'id', 'Table co_convites not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_convites' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_convites', 'cliente_id', 'clientes', 'id', 'Column co_convites.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'co_convites', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'co_convites', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_convites' AND column_name = 'cliente_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'TYPE_MISMATCH', 'co_convites', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'READY_TO_CREATE', 'co_convites', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'co_convites', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_convites' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'TYPE_MISMATCH', 'co_convites', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'co_convites', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_convites_cliente_id_fkey', 'READY_TO_CREATE', 'co_convites', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_escutas_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_escutas_sessao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'EXISTS', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_escutas') THEN
        INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Table co_escutas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_escutas' AND column_name = 'sessao_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Column co_escutas.sessao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Table co_sessoes not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_sessoes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Column co_sessoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_escutas' AND column_name = 'sessao_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'TYPE_MISMATCH', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'READY_TO_CREATE', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Column co_sessoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_escutas' AND column_name = 'sessao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'TYPE_MISMATCH', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_sessoes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_escutas_sessao_id_fkey', 'READY_TO_CREATE', 'co_escutas', 'sessao_id', 'co_sessoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_garden_flowers_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'EXISTS', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_garden_flowers') THEN
        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Table co_garden_flowers not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Column co_garden_flowers.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'TYPE_MISMATCH', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'READY_TO_CREATE', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'TYPE_MISMATCH', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_client_id_fkey', 'READY_TO_CREATE', 'co_garden_flowers', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_garden_flowers_origem_registro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_garden_flowers_origem_registro_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'EXISTS', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_garden_flowers') THEN
        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'MISSING_SOURCE_TABLE', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Table co_garden_flowers not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'origem_registro_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Column co_garden_flowers.origem_registro_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'MISSING_TARGET_TABLE', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Table co_journey_records not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_journey_records' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Column co_journey_records.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'origem_registro_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'TYPE_MISMATCH', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'READY_TO_CREATE', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'MISSING_TARGET_COLUMN', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Column co_journey_records.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_garden_flowers' AND column_name = 'origem_registro_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'TYPE_MISMATCH', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_journey_records')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'TARGET_NOT_UNIQUE', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_garden_flowers_origem_registro_id_fkey', 'READY_TO_CREATE', 'co_garden_flowers', 'origem_registro_id', 'co_journey_records', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_jardim_entries_jardim_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_jardim_entries_jardim_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'EXISTS', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardim_entries') THEN
        INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'MISSING_SOURCE_TABLE', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Table co_jardim_entries not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardim_entries' AND column_name = 'jardim_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Column co_jardim_entries.jardim_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'MISSING_TARGET_TABLE', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Table co_jardins not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_jardins' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'MISSING_TARGET_COLUMN', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Column co_jardins.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardim_entries' AND column_name = 'jardim_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'TYPE_MISMATCH', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'READY_TO_CREATE', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'MISSING_TARGET_COLUMN', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Column co_jardins.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardim_entries' AND column_name = 'jardim_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'TYPE_MISMATCH', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_jardins')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'TARGET_NOT_UNIQUE', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_jardim_entries_jardim_id_fkey', 'READY_TO_CREATE', 'co_jardim_entries', 'jardim_id', 'co_jardins', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_journey_records_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'EXISTS', 'co_journey_records', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') THEN
        INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_journey_records', 'client_id', 'clientes', 'id', 'Table co_journey_records not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_journey_records', 'client_id', 'clientes', 'id', 'Column co_journey_records.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_journey_records', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_journey_records', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'TYPE_MISMATCH', 'co_journey_records', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'READY_TO_CREATE', 'co_journey_records', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_journey_records', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'TYPE_MISMATCH', 'co_journey_records', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_journey_records', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_journey_records_client_id_fkey', 'READY_TO_CREATE', 'co_journey_records', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_journey_records_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_journey_records_tool_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'EXISTS', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_journey_records') THEN
        INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Table co_journey_records not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'tool_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Column co_journey_records.tool_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'MISSING_TARGET_TABLE', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Table sala_ferramentas not found');
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
                INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'tool_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'TYPE_MISMATCH', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'READY_TO_CREATE', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_journey_records' AND column_name = 'tool_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'TYPE_MISMATCH', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_journey_records_tool_id_fkey', 'READY_TO_CREATE', 'co_journey_records', 'tool_id', 'sala_ferramentas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_orientacao_sugestoes_ia_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'EXISTS', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Table co_orientacao_sugestoes_ia not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Column co_orientacao_sugestoes_ia.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'cliente_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'TYPE_MISMATCH', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'READY_TO_CREATE', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'TYPE_MISMATCH', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_cliente_id_fkey', 'READY_TO_CREATE', 'co_orientacao_sugestoes_ia', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_orientacao_sugestoes_ia_orientacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_orientacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'EXISTS', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'MISSING_SOURCE_TABLE', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Table co_orientacao_sugestoes_ia not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'orientacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Column co_orientacao_sugestoes_ia.orientacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'MISSING_TARGET_TABLE', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Table co_orientacoes not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_orientacoes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Column co_orientacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'orientacao_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'TYPE_MISMATCH', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'READY_TO_CREATE', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Column co_orientacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'orientacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'TYPE_MISMATCH', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_orientacoes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'TARGET_NOT_UNIQUE', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_orientacao_id_fkey', 'READY_TO_CREATE', 'co_orientacao_sugestoes_ia', 'orientacao_id', 'co_orientacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_orientacao_sugestoes_ia_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacao_sugestoes_ia_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'EXISTS', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'MISSING_SOURCE_TABLE', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Table co_orientacao_sugestoes_ia not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Column co_orientacao_sugestoes_ia.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'MISSING_TARGET_TABLE', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Table sessions not found');
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
                INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'session_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'TYPE_MISMATCH', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'READY_TO_CREATE', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacao_sugestoes_ia' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'TYPE_MISMATCH', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'TARGET_NOT_UNIQUE', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_orientacao_sugestoes_ia_session_id_fkey', 'READY_TO_CREATE', 'co_orientacao_sugestoes_ia', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_orientacoes_cliente_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_cliente_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'EXISTS', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'MISSING_SOURCE_TABLE', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Table co_orientacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'cliente_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Column co_orientacoes.cliente_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'MISSING_TARGET_TABLE', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'cliente_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'TYPE_MISMATCH', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'READY_TO_CREATE', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'cliente_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'TYPE_MISMATCH', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'TARGET_NOT_UNIQUE', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_orientacoes_cliente_id_fkey', 'READY_TO_CREATE', 'co_orientacoes', 'cliente_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_orientacoes_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_orientacoes_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'EXISTS', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_orientacoes') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'MISSING_SOURCE_TABLE', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Table co_orientacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Column co_orientacoes.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'MISSING_TARGET_TABLE', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Table sessions not found');
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
                INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'session_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'TYPE_MISMATCH', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'READY_TO_CREATE', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'MISSING_TARGET_COLUMN', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_orientacoes' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'TYPE_MISMATCH', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'TARGET_NOT_UNIQUE', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_orientacoes_session_id_fkey', 'READY_TO_CREATE', 'co_orientacoes', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_passport_entries_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_passport_entries_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'EXISTS', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_passport_entries') THEN
        INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Table co_passport_entries not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_passport_entries' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Column co_passport_entries.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_passport_entries' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'TYPE_MISMATCH', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'READY_TO_CREATE', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_passport_entries' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'TYPE_MISMATCH', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_passport_entries_client_id_fkey', 'READY_TO_CREATE', 'co_passport_entries', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_praticas_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_praticas_sessao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'EXISTS', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_praticas') THEN
        INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Table co_praticas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_praticas' AND column_name = 'sessao_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Column co_praticas.sessao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Table co_sessoes not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_sessoes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Column co_sessoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_praticas' AND column_name = 'sessao_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'TYPE_MISMATCH', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'READY_TO_CREATE', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Column co_sessoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_praticas' AND column_name = 'sessao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'TYPE_MISMATCH', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_sessoes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_praticas_sessao_id_fkey', 'READY_TO_CREATE', 'co_praticas', 'sessao_id', 'co_sessoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_registros_simbolicos_jardim_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_jardim_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'EXISTS', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos') THEN
        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'MISSING_SOURCE_TABLE', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Table co_registros_simbolicos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'jardim_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Column co_registros_simbolicos.jardim_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'MISSING_TARGET_TABLE', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Table co_jardins not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_jardins' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'MISSING_TARGET_COLUMN', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Column co_jardins.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'jardim_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'TYPE_MISMATCH', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'READY_TO_CREATE', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'MISSING_TARGET_COLUMN', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Column co_jardins.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'jardim_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'TYPE_MISMATCH', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_jardins')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'TARGET_NOT_UNIQUE', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_jardim_id_fkey', 'READY_TO_CREATE', 'co_registros_simbolicos', 'jardim_id', 'co_jardins', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_registros_simbolicos_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_registros_simbolicos_sessao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'EXISTS', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos') THEN
        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Table co_registros_simbolicos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'sessao_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Column co_registros_simbolicos.sessao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Table co_sessoes not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_sessoes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Column co_sessoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'sessao_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'TYPE_MISMATCH', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'READY_TO_CREATE', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Column co_sessoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_registros_simbolicos' AND column_name = 'sessao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'TYPE_MISMATCH', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_sessoes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_registros_simbolicos_sessao_id_fkey', 'READY_TO_CREATE', 'co_registros_simbolicos', 'sessao_id', 'co_sessoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sessoes_jardim_ref_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sessoes_jardim_ref_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'EXISTS', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sessoes') THEN
        INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Table co_sessoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'jardim_ref_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Column co_sessoes.jardim_ref_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_jardins') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'MISSING_TARGET_TABLE', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Table co_jardins not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_jardins' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Column co_jardins.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'jardim_ref_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'TYPE_MISMATCH', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'READY_TO_CREATE', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Column co_jardins.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sessoes' AND column_name = 'jardim_ref_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_jardins' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'TYPE_MISMATCH', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_jardins')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_sessoes_jardim_ref_id_fkey', 'READY_TO_CREATE', 'co_sessoes', 'jardim_ref_id', 'co_jardins', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_options_proximo_step_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_proximo_step_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'EXISTS', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Table co_sim_options not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'proximo_step_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Column co_sim_options.proximo_step_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Table co_sim_steps not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_sim_steps' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Column co_sim_steps.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'proximo_step_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'TYPE_MISMATCH', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'READY_TO_CREATE', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Column co_sim_steps.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'proximo_step_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'TYPE_MISMATCH', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_sim_steps')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_sim_options_proximo_step_id_fkey', 'READY_TO_CREATE', 'co_sim_options', 'proximo_step_id', 'co_sim_steps', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_options_step_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_options_step_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'EXISTS', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Table co_sim_options not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'step_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Column co_sim_options.step_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Table co_sim_steps not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_sim_steps' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Column co_sim_steps.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'step_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'TYPE_MISMATCH', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'READY_TO_CREATE', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Column co_sim_steps.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'step_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'TYPE_MISMATCH', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_sim_steps')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_sim_options_step_id_fkey', 'READY_TO_CREATE', 'co_sim_options', 'step_id', 'co_sim_steps', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_progress_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'EXISTS', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Table co_sim_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Column co_sim_progress.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Table co_sim_cases not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_sim_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Column co_sim_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'TYPE_MISMATCH', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'READY_TO_CREATE', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Column co_sim_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'TYPE_MISMATCH', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_sim_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_sim_progress_case_id_fkey', 'READY_TO_CREATE', 'co_sim_progress', 'case_id', 'co_sim_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_progress_escolha_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_escolha_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'EXISTS', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Table co_sim_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'escolha_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Column co_sim_progress.escolha_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_options') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Table co_sim_options not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_sim_options' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Column co_sim_options.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'escolha_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'TYPE_MISMATCH', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'READY_TO_CREATE', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Column co_sim_options.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'escolha_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_options' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'TYPE_MISMATCH', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_sim_options')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_sim_progress_escolha_id_fkey', 'READY_TO_CREATE', 'co_sim_progress', 'escolha_id', 'co_sim_options', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_progress_step_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_progress_step_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'EXISTS', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_progress') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Table co_sim_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'step_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Column co_sim_progress.step_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Table co_sim_steps not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_sim_steps' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Column co_sim_steps.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'step_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'TYPE_MISMATCH', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'READY_TO_CREATE', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Column co_sim_steps.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_progress' AND column_name = 'step_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'TYPE_MISMATCH', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_sim_steps')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_sim_progress_step_id_fkey', 'READY_TO_CREATE', 'co_sim_progress', 'step_id', 'co_sim_steps', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_sim_steps_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_sim_steps_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'EXISTS', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_steps') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Table co_sim_steps not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Column co_sim_steps.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_sim_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Table co_sim_cases not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_sim_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Column co_sim_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'TYPE_MISMATCH', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'READY_TO_CREATE', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Column co_sim_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_steps' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_sim_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'TYPE_MISMATCH', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_sim_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_sim_steps_case_id_fkey', 'READY_TO_CREATE', 'co_sim_steps', 'case_id', 'co_sim_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_tool_flows_tool_destino_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_destino_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'EXISTS', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_flows') THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'MISSING_SOURCE_TABLE', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Table co_tool_flows not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_destino_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Column co_tool_flows.tool_destino_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'MISSING_TARGET_TABLE', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Table tools not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'MISSING_TARGET_COLUMN', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_destino_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'TYPE_MISMATCH', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'READY_TO_CREATE', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'MISSING_TARGET_COLUMN', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_destino_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'TYPE_MISMATCH', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'TARGET_NOT_UNIQUE', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_destino_id_fkey', 'READY_TO_CREATE', 'co_tool_flows', 'tool_destino_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_tool_flows_tool_origem_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_flows_tool_origem_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'EXISTS', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_flows') THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'MISSING_SOURCE_TABLE', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Table co_tool_flows not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_origem_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Column co_tool_flows.tool_origem_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'MISSING_TARGET_TABLE', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Table tools not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'tools' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'MISSING_TARGET_COLUMN', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_origem_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'TYPE_MISMATCH', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'READY_TO_CREATE', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'MISSING_TARGET_COLUMN', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_flows' AND column_name = 'tool_origem_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'TYPE_MISMATCH', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'TARGET_NOT_UNIQUE', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_tool_flows_tool_origem_id_fkey', 'READY_TO_CREATE', 'co_tool_flows', 'tool_origem_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_tool_usage_tool_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_tool_usage_tool_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'EXISTS', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_tool_usage') THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'MISSING_SOURCE_TABLE', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Table co_tool_usage not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_usage' AND column_name = 'tool_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Column co_tool_usage.tool_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'MISSING_TARGET_TABLE', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Table sala_ferramentas not found');
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
                INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_usage' AND column_name = 'tool_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'TYPE_MISMATCH', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'READY_TO_CREATE', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'MISSING_TARGET_COLUMN', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_tool_usage' AND column_name = 'tool_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'TYPE_MISMATCH', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'TARGET_NOT_UNIQUE', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_tool_usage_tool_id_fkey', 'READY_TO_CREATE', 'co_tool_usage', 'tool_id', 'sala_ferramentas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_training_attempts_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_attempts_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'EXISTS', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_attempts') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Table co_training_attempts not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_attempts' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Column co_training_attempts.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Table co_training_cases not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_training_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Column co_training_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_attempts' AND column_name = 'case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'TYPE_MISMATCH', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'READY_TO_CREATE', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Column co_training_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_attempts' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'TYPE_MISMATCH', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_training_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_training_attempts_case_id_fkey', 'READY_TO_CREATE', 'co_training_attempts', 'case_id', 'co_training_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_training_case_feedbacks_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_feedbacks_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'EXISTS', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Table co_training_case_feedbacks not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Column co_training_case_feedbacks.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Table co_training_cases not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_training_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Column co_training_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks' AND column_name = 'case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'TYPE_MISMATCH', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'READY_TO_CREATE', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Column co_training_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_feedbacks' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'TYPE_MISMATCH', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_training_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_training_case_feedbacks_case_id_fkey', 'READY_TO_CREATE', 'co_training_case_feedbacks', 'case_id', 'co_training_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_training_case_possible_readings_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_possible_readings_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'EXISTS', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Table co_training_case_possible_readings not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Column co_training_case_possible_readings.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Table co_training_cases not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_training_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Column co_training_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings' AND column_name = 'case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'TYPE_MISMATCH', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'READY_TO_CREATE', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Column co_training_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_possible_readings' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'TYPE_MISMATCH', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_training_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_training_case_possible_readings_case_id_fkey', 'READY_TO_CREATE', 'co_training_case_possible_readings', 'case_id', 'co_training_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_training_case_signals_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_case_signals_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'EXISTS', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_case_signals') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Table co_training_case_signals not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_signals' AND column_name = 'case_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Column co_training_case_signals.case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Table co_training_cases not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_training_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Column co_training_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_signals' AND column_name = 'case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'TYPE_MISMATCH', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'READY_TO_CREATE', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Column co_training_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_case_signals' AND column_name = 'case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'TYPE_MISMATCH', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_training_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_training_case_signals_case_id_fkey', 'READY_TO_CREATE', 'co_training_case_signals', 'case_id', 'co_training_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_training_progress_ultimo_case_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_training_progress_ultimo_case_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'EXISTS', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_progress') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'MISSING_SOURCE_TABLE', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Table co_training_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_progress' AND column_name = 'ultimo_case_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Column co_training_progress.ultimo_case_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_training_cases') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'MISSING_TARGET_TABLE', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Table co_training_cases not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_training_cases' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Column co_training_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_progress' AND column_name = 'ultimo_case_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'TYPE_MISMATCH', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'READY_TO_CREATE', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'MISSING_TARGET_COLUMN', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Column co_training_cases.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_progress' AND column_name = 'ultimo_case_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_training_cases' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'TYPE_MISMATCH', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_training_cases')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'TARGET_NOT_UNIQUE', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_training_progress_ultimo_case_id_fkey', 'READY_TO_CREATE', 'co_training_progress', 'ultimo_case_id', 'co_training_cases', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_travessia_encontros_travessia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_encontros_travessia_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'EXISTS', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros') THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'MISSING_SOURCE_TABLE', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Table co_travessia_encontros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'travessia_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Column co_travessia_encontros.travessia_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'MISSING_TARGET_TABLE', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Table co_travessias not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_travessias' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Column co_travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'travessia_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'TYPE_MISMATCH', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'READY_TO_CREATE', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Column co_travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'travessia_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'TYPE_MISMATCH', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_travessias')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'TARGET_NOT_UNIQUE', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_travessia_encontros_travessia_id_fkey', 'READY_TO_CREATE', 'co_travessia_encontros', 'travessia_id', 'co_travessias', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_travessia_respostas_encontro_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_encontro_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'EXISTS', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas') THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'MISSING_SOURCE_TABLE', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Table co_travessia_respostas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'encontro_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Column co_travessia_respostas.encontro_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'MISSING_TARGET_TABLE', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Table co_travessia_encontros not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_travessia_encontros' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'MISSING_TARGET_COLUMN', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Column co_travessia_encontros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'encontro_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'TYPE_MISMATCH', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'READY_TO_CREATE', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'MISSING_TARGET_COLUMN', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Column co_travessia_encontros.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'encontro_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_encontros' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'TYPE_MISMATCH', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_travessia_encontros')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'TARGET_NOT_UNIQUE', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_encontro_id_fkey', 'READY_TO_CREATE', 'co_travessia_respostas', 'encontro_id', 'co_travessia_encontros', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_travessia_respostas_travessia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_travessia_respostas_travessia_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'EXISTS', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas') THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'MISSING_SOURCE_TABLE', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Table co_travessia_respostas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'travessia_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Column co_travessia_respostas.travessia_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_travessias') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'MISSING_TARGET_TABLE', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Table co_travessias not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_travessias' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Column co_travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'travessia_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'TYPE_MISMATCH', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'READY_TO_CREATE', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'MISSING_TARGET_COLUMN', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Column co_travessias.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessia_respostas' AND column_name = 'travessia_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_travessias' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'TYPE_MISMATCH', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_travessias')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'TARGET_NOT_UNIQUE', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_travessia_respostas_travessia_id_fkey', 'READY_TO_CREATE', 'co_travessia_respostas', 'travessia_id', 'co_travessias', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_workspace_users_workspace_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_workspace_users_workspace_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'EXISTS', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspace_users') THEN
        INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'MISSING_SOURCE_TABLE', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Table co_workspace_users not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspace_users' AND column_name = 'workspace_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Column co_workspace_users.workspace_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'MISSING_TARGET_TABLE', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Table co_workspaces not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'co_workspaces' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'MISSING_TARGET_COLUMN', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Column co_workspaces.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspace_users' AND column_name = 'workspace_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'TYPE_MISMATCH', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'READY_TO_CREATE', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'MISSING_TARGET_COLUMN', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Column co_workspaces.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspace_users' AND column_name = 'workspace_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'TYPE_MISMATCH', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'TARGET_NOT_UNIQUE', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_workspace_users_workspace_id_fkey', 'READY_TO_CREATE', 'co_workspace_users', 'workspace_id', 'co_workspaces', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing collective_bed_entries_bed_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_bed_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'EXISTS', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') THEN
        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'MISSING_SOURCE_TABLE', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Table collective_bed_entries not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'bed_id') THEN
        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'MISSING_SOURCE_COLUMN', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Column collective_bed_entries.bed_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_beds') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'MISSING_TARGET_TABLE', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Table collective_beds not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'collective_beds' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'MISSING_TARGET_COLUMN', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Column collective_beds.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'bed_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'TYPE_MISMATCH', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'READY_TO_CREATE', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'MISSING_TARGET_COLUMN', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Column collective_beds.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'bed_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'TYPE_MISMATCH', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.collective_beds')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'TARGET_NOT_UNIQUE', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_bed_id_fkey', 'READY_TO_CREATE', 'collective_bed_entries', 'bed_id', 'collective_beds', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing collective_bed_entries_season_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_bed_entries_season_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'EXISTS', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_bed_entries') THEN
        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'MISSING_SOURCE_TABLE', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Table collective_bed_entries not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'season_id') THEN
        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'MISSING_SOURCE_COLUMN', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Column collective_bed_entries.season_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'MISSING_TARGET_TABLE', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Table oracular_seasons not found');
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
                INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'MISSING_TARGET_COLUMN', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'season_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'TYPE_MISMATCH', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'READY_TO_CREATE', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'MISSING_TARGET_COLUMN', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_bed_entries' AND column_name = 'season_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'TYPE_MISMATCH', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'TARGET_NOT_UNIQUE', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('collective_bed_entries_season_id_fkey', 'READY_TO_CREATE', 'collective_bed_entries', 'season_id', 'oracular_seasons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing collective_beds_season_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'collective_beds_season_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'EXISTS', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collective_beds') THEN
        INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'MISSING_SOURCE_TABLE', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Table collective_beds not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'season_id') THEN
        INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'MISSING_SOURCE_COLUMN', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Column collective_beds.season_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'MISSING_TARGET_TABLE', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Table oracular_seasons not found');
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
                INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'MISSING_TARGET_COLUMN', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'season_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'TYPE_MISMATCH', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'READY_TO_CREATE', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'MISSING_TARGET_COLUMN', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'collective_beds' AND column_name = 'season_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'TYPE_MISMATCH', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'TARGET_NOT_UNIQUE', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('collective_beds_season_id_fkey', 'READY_TO_CREATE', 'collective_beds', 'season_id', 'oracular_seasons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_comments_post_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_comments_post_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'EXISTS', 'community_comments', 'post_id', 'community_posts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_comments') THEN
        INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'MISSING_SOURCE_TABLE', 'community_comments', 'post_id', 'community_posts', 'id', 'Table community_comments not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'post_id') THEN
        INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_comments', 'post_id', 'community_posts', 'id', 'Column community_comments.post_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'MISSING_TARGET_TABLE', 'community_comments', 'post_id', 'community_posts', 'id', 'Table community_posts not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'community_posts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'MISSING_TARGET_COLUMN', 'community_comments', 'post_id', 'community_posts', 'id', 'Column community_posts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'post_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'TYPE_MISMATCH', 'community_comments', 'post_id', 'community_posts', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'READY_TO_CREATE', 'community_comments', 'post_id', 'community_posts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'MISSING_TARGET_COLUMN', 'community_comments', 'post_id', 'community_posts', 'id', 'Column community_posts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_comments' AND column_name = 'post_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'TYPE_MISMATCH', 'community_comments', 'post_id', 'community_posts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.community_posts')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'TARGET_NOT_UNIQUE', 'community_comments', 'post_id', 'community_posts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('community_comments_post_id_fkey', 'READY_TO_CREATE', 'community_comments', 'post_id', 'community_posts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_event_participants_event_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_event_participants_event_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'EXISTS', 'community_event_participants', 'event_id', 'community_events', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_event_participants') THEN
        INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'MISSING_SOURCE_TABLE', 'community_event_participants', 'event_id', 'community_events', 'id', 'Table community_event_participants not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_event_participants' AND column_name = 'event_id') THEN
        INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_event_participants', 'event_id', 'community_events', 'id', 'Column community_event_participants.event_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_events') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'MISSING_TARGET_TABLE', 'community_event_participants', 'event_id', 'community_events', 'id', 'Table community_events not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'community_events' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'MISSING_TARGET_COLUMN', 'community_event_participants', 'event_id', 'community_events', 'id', 'Column community_events.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_event_participants' AND column_name = 'event_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'TYPE_MISMATCH', 'community_event_participants', 'event_id', 'community_events', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'READY_TO_CREATE', 'community_event_participants', 'event_id', 'community_events', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_events' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'MISSING_TARGET_COLUMN', 'community_event_participants', 'event_id', 'community_events', 'id', 'Column community_events.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_event_participants' AND column_name = 'event_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_events' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'TYPE_MISMATCH', 'community_event_participants', 'event_id', 'community_events', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.community_events')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'TARGET_NOT_UNIQUE', 'community_event_participants', 'event_id', 'community_events', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('community_event_participants_event_id_fkey', 'READY_TO_CREATE', 'community_event_participants', 'event_id', 'community_events', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_group_members_group_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_group_members_group_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'EXISTS', 'community_group_members', 'group_id', 'community_groups', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_group_members') THEN
        INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'MISSING_SOURCE_TABLE', 'community_group_members', 'group_id', 'community_groups', 'id', 'Table community_group_members not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_group_members' AND column_name = 'group_id') THEN
        INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_group_members', 'group_id', 'community_groups', 'id', 'Column community_group_members.group_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_groups') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'MISSING_TARGET_TABLE', 'community_group_members', 'group_id', 'community_groups', 'id', 'Table community_groups not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'community_groups' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'MISSING_TARGET_COLUMN', 'community_group_members', 'group_id', 'community_groups', 'id', 'Column community_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_group_members' AND column_name = 'group_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'TYPE_MISMATCH', 'community_group_members', 'group_id', 'community_groups', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'READY_TO_CREATE', 'community_group_members', 'group_id', 'community_groups', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_groups' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'MISSING_TARGET_COLUMN', 'community_group_members', 'group_id', 'community_groups', 'id', 'Column community_groups.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_group_members' AND column_name = 'group_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_groups' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'TYPE_MISMATCH', 'community_group_members', 'group_id', 'community_groups', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.community_groups')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'TARGET_NOT_UNIQUE', 'community_group_members', 'group_id', 'community_groups', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('community_group_members_group_id_fkey', 'READY_TO_CREATE', 'community_group_members', 'group_id', 'community_groups', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_likes_post_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_likes_post_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'EXISTS', 'community_likes', 'post_id', 'community_posts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_likes') THEN
        INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'MISSING_SOURCE_TABLE', 'community_likes', 'post_id', 'community_posts', 'id', 'Table community_likes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'post_id') THEN
        INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_likes', 'post_id', 'community_posts', 'id', 'Column community_likes.post_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'MISSING_TARGET_TABLE', 'community_likes', 'post_id', 'community_posts', 'id', 'Table community_posts not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'community_posts' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'MISSING_TARGET_COLUMN', 'community_likes', 'post_id', 'community_posts', 'id', 'Column community_posts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'post_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'TYPE_MISMATCH', 'community_likes', 'post_id', 'community_posts', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'READY_TO_CREATE', 'community_likes', 'post_id', 'community_posts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'MISSING_TARGET_COLUMN', 'community_likes', 'post_id', 'community_posts', 'id', 'Column community_posts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_likes' AND column_name = 'post_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'TYPE_MISMATCH', 'community_likes', 'post_id', 'community_posts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.community_posts')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'TARGET_NOT_UNIQUE', 'community_likes', 'post_id', 'community_posts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('community_likes_post_id_fkey', 'READY_TO_CREATE', 'community_likes', 'post_id', 'community_posts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_topic_replies_topic_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topic_replies_topic_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'EXISTS', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topic_replies') THEN
        INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'MISSING_SOURCE_TABLE', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Table community_topic_replies not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topic_replies' AND column_name = 'topic_id') THEN
        INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Column community_topic_replies.topic_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topics') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'MISSING_TARGET_TABLE', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Table community_topics not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'community_topics' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'MISSING_TARGET_COLUMN', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Column community_topics.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topic_replies' AND column_name = 'topic_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'TYPE_MISMATCH', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'READY_TO_CREATE', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'MISSING_TARGET_COLUMN', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Column community_topics.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topic_replies' AND column_name = 'topic_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'TYPE_MISMATCH', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.community_topics')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'TARGET_NOT_UNIQUE', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('community_topic_replies_topic_id_fkey', 'READY_TO_CREATE', 'community_topic_replies', 'topic_id', 'community_topics', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing community_topics_forum_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'community_topics_forum_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'EXISTS', 'community_topics', 'forum_id', 'community_forums', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_topics') THEN
        INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'MISSING_SOURCE_TABLE', 'community_topics', 'forum_id', 'community_forums', 'id', 'Table community_topics not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'forum_id') THEN
        INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'MISSING_SOURCE_COLUMN', 'community_topics', 'forum_id', 'community_forums', 'id', 'Column community_topics.forum_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_forums') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'MISSING_TARGET_TABLE', 'community_topics', 'forum_id', 'community_forums', 'id', 'Table community_forums not found');
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
                WHERE n.nspname = 'auth' AND c.relname = 'community_forums' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'MISSING_TARGET_COLUMN', 'community_topics', 'forum_id', 'community_forums', 'id', 'Column community_forums.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'forum_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'TYPE_MISMATCH', 'community_topics', 'forum_id', 'community_forums', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'READY_TO_CREATE', 'community_topics', 'forum_id', 'community_forums', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_forums' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'MISSING_TARGET_COLUMN', 'community_topics', 'forum_id', 'community_forums', 'id', 'Column community_forums.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_topics' AND column_name = 'forum_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_forums' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'TYPE_MISMATCH', 'community_topics', 'forum_id', 'community_forums', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.community_forums')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'TARGET_NOT_UNIQUE', 'community_topics', 'forum_id', 'community_forums', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('community_topics_forum_id_fkey', 'READY_TO_CREATE', 'community_topics', 'forum_id', 'community_forums', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing conselho_partes_internas_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'conselho_partes_internas_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'EXISTS', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas') THEN
        INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'MISSING_SOURCE_TABLE', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Table conselho_partes_internas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Column conselho_partes_internas.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'MISSING_TARGET_TABLE', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'MISSING_TARGET_COLUMN', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas' AND column_name = 'client_id';
                -- Check compatibility (uuid is common)
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'TYPE_MISMATCH', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.users');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'READY_TO_CREATE', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'MISSING_TARGET_COLUMN', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'conselho_partes_internas' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'TYPE_MISMATCH', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'TARGET_NOT_UNIQUE', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('conselho_partes_internas_client_id_fkey', 'READY_TO_CREATE', 'conselho_partes_internas', 'client_id', 'clientes', 'id', 'Ready to create');
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
