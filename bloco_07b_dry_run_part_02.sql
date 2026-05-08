-- BLOCO 07B - FOREIGN KEYS DIAGNOSTIC (PARTE 2 de 8)
-- Diagnóstico de FKs 49 a 96 (Total: 48)

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

    -- Analyzing client_cidadela_map_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_cidadela_map_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'EXISTS', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_cidadela_map') THEN
        INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Table client_cidadela_map not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_cidadela_map' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Column client_cidadela_map.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_cidadela_map' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'TYPE_MISMATCH', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'READY_TO_CREATE', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_cidadela_map' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'TYPE_MISMATCH', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_cidadela_map_client_id_fkey', 'READY_TO_CREATE', 'client_cidadela_map', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_city_state_arquetipo_ativo_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_arquetipo_ativo_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'EXISTS', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'MISSING_SOURCE_TABLE', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Table client_city_state not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'arquetipo_ativo') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'MISSING_SOURCE_COLUMN', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Column client_city_state.arquetipo_ativo not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'founding_archetypes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'MISSING_TARGET_TABLE', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Table founding_archetypes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'founding_archetypes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'arquetipo_ativo';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'TYPE_MISMATCH', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'founding_archetypes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'READY_TO_CREATE', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Column founding_archetypes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'arquetipo_ativo';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'founding_archetypes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'TYPE_MISMATCH', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.founding_archetypes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'TARGET_NOT_UNIQUE', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_city_state_arquetipo_ativo_fkey', 'READY_TO_CREATE', 'client_city_state', 'arquetipo_ativo', 'founding_archetypes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_city_state_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'EXISTS', 'client_city_state', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_city_state', 'client_id', 'clientes', 'id', 'Table client_city_state not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_city_state', 'client_id', 'clientes', 'id', 'Column client_city_state.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_city_state', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_city_state', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_city_state_client_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_city_state_distrito_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_distrito_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'EXISTS', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'MISSING_SOURCE_TABLE', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Table client_city_state not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'distrito_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Column client_city_state.distrito_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'city_districts') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'MISSING_TARGET_TABLE', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Table city_districts not found');
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
                INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Column city_districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'distrito_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'city_districts');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Column city_districts.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'distrito_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'city_districts' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'TARGET_NOT_UNIQUE', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_city_state_distrito_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'distrito_id', 'city_districts', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_city_state_ultima_ferramenta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_ferramenta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'EXISTS', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'MISSING_SOURCE_TABLE', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Table client_city_state not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_ferramenta_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Column client_city_state.ultima_ferramenta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'MISSING_TARGET_TABLE', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Table tools not found');
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
                INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_ferramenta_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'tools');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Column tools.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_ferramenta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tools' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'TARGET_NOT_UNIQUE', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_ferramenta_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'ultima_ferramenta_id', 'tools', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_city_state_ultima_sessao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_city_state_ultima_sessao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'EXISTS', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_city_state') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'MISSING_SOURCE_TABLE', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Table client_city_state not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_sessao_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Column client_city_state.ultima_sessao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'MISSING_TARGET_TABLE', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Table sessions not found');
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
                INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_sessao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'MISSING_TARGET_COLUMN', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_city_state' AND column_name = 'ultima_sessao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'TYPE_MISMATCH', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'TARGET_NOT_UNIQUE', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_city_state_ultima_sessao_id_fkey', 'READY_TO_CREATE', 'client_city_state', 'ultima_sessao_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_labyrinths_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_labyrinths_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'EXISTS', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_labyrinths') THEN
        INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Table client_labyrinths not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_labyrinths' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Column client_labyrinths.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_labyrinths' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'TYPE_MISMATCH', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'READY_TO_CREATE', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_labyrinths' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'TYPE_MISMATCH', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_labyrinths_client_id_fkey', 'READY_TO_CREATE', 'client_labyrinths', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_live_map_entries_session_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_live_map_entries_session_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'EXISTS', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_live_map_entries') THEN
        INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'MISSING_SOURCE_TABLE', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Table client_live_map_entries not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_live_map_entries' AND column_name = 'session_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Column client_live_map_entries.session_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sessions') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'MISSING_TARGET_TABLE', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Table sessions not found');
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
                INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'MISSING_TARGET_COLUMN', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_live_map_entries' AND column_name = 'session_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'TYPE_MISMATCH', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sessions');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'READY_TO_CREATE', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'MISSING_TARGET_COLUMN', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Column sessions.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_live_map_entries' AND column_name = 'session_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sessions' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'TYPE_MISMATCH', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'TARGET_NOT_UNIQUE', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_live_map_entries_session_id_fkey', 'READY_TO_CREATE', 'client_live_map_entries', 'session_id', 'sessions', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_pattern_stats_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_pattern_stats_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'EXISTS', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_pattern_stats') THEN
        INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Table client_pattern_stats not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_pattern_stats' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Column client_pattern_stats.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_pattern_stats' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'TYPE_MISMATCH', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'READY_TO_CREATE', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_pattern_stats' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'TYPE_MISMATCH', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_pattern_stats_client_id_fkey', 'READY_TO_CREATE', 'client_pattern_stats', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing client_seasons_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'client_seasons_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'EXISTS', 'client_seasons', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_seasons') THEN
        INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'MISSING_SOURCE_TABLE', 'client_seasons', 'client_id', 'clientes', 'id', 'Table client_seasons not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_seasons' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'client_seasons', 'client_id', 'clientes', 'id', 'Column client_seasons.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'MISSING_TARGET_TABLE', 'client_seasons', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_seasons', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_seasons' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'TYPE_MISMATCH', 'client_seasons', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'READY_TO_CREATE', 'client_seasons', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'MISSING_TARGET_COLUMN', 'client_seasons', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'client_seasons' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'TYPE_MISMATCH', 'client_seasons', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'TARGET_NOT_UNIQUE', 'client_seasons', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('client_seasons_client_id_fkey', 'READY_TO_CREATE', 'client_seasons', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing club_books_cycle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_books_cycle_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'EXISTS', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_books') THEN
        INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'MISSING_SOURCE_TABLE', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Table _deprecated_club_books not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_books' AND column_name = 'cycle_id') THEN
        INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'MISSING_SOURCE_COLUMN', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Column _deprecated_club_books.cycle_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'MISSING_TARGET_TABLE', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Table _deprecated_club_cycles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = '_deprecated_club_cycles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Column _deprecated_club_cycles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_books' AND column_name = 'cycle_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || '_deprecated_club_cycles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'READY_TO_CREATE', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Column _deprecated_club_cycles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_books' AND column_name = 'cycle_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public._deprecated_club_cycles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'TARGET_NOT_UNIQUE', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('club_books_cycle_id_fkey', 'READY_TO_CREATE', '_deprecated_club_books', 'cycle_id', '_deprecated_club_cycles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing club_knowledge_entries_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_knowledge_entries_book_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'EXISTS', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries') THEN
        INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'MISSING_SOURCE_TABLE', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Table _deprecated_club_knowledge_entries not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries' AND column_name = 'book_id') THEN
        INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'MISSING_SOURCE_COLUMN', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Column _deprecated_club_knowledge_entries.book_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'MISSING_TARGET_TABLE', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Table books not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'books' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries' AND column_name = 'book_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'books');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'READY_TO_CREATE', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_knowledge_entries' AND column_name = 'book_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.books')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'TARGET_NOT_UNIQUE', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('club_knowledge_entries_book_id_fkey', 'READY_TO_CREATE', '_deprecated_club_knowledge_entries', 'book_id', 'books', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing club_meetings_cycle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_meetings_cycle_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'EXISTS', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings') THEN
        INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'MISSING_SOURCE_TABLE', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Table _deprecated_club_meetings not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings' AND column_name = 'cycle_id') THEN
        INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'MISSING_SOURCE_COLUMN', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Column _deprecated_club_meetings.cycle_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'MISSING_TARGET_TABLE', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Table _deprecated_club_cycles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = '_deprecated_club_cycles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Column _deprecated_club_cycles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings' AND column_name = 'cycle_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || '_deprecated_club_cycles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'READY_TO_CREATE', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Column _deprecated_club_cycles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_meetings' AND column_name = 'cycle_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public._deprecated_club_cycles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'TARGET_NOT_UNIQUE', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('club_meetings_cycle_id_fkey', 'READY_TO_CREATE', '_deprecated_club_meetings', 'cycle_id', '_deprecated_club_cycles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing club_user_cycles_cycle_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'club_user_cycles_cycle_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'EXISTS', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles') THEN
        INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'MISSING_SOURCE_TABLE', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Table _deprecated_club_user_cycles not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles' AND column_name = 'cycle_id') THEN
        INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'MISSING_SOURCE_COLUMN', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Column _deprecated_club_user_cycles.cycle_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'MISSING_TARGET_TABLE', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Table _deprecated_club_cycles not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = '_deprecated_club_cycles' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Column _deprecated_club_cycles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles' AND column_name = 'cycle_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Source type ' || v_source_type || ' might not match auth.' || '_deprecated_club_cycles');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'READY_TO_CREATE', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'MISSING_TARGET_COLUMN', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Column _deprecated_club_cycles.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_user_cycles' AND column_name = 'cycle_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '_deprecated_club_cycles' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'TYPE_MISMATCH', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public._deprecated_club_cycles')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'TARGET_NOT_UNIQUE', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('club_user_cycles_cycle_id_fkey', 'READY_TO_CREATE', '_deprecated_club_user_cycles', 'cycle_id', '_deprecated_club_cycles', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_audio_albums_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_albums_estacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'EXISTS', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_albums') THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_audio_albums not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'estacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_audio_albums.estacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_estacoes not found');
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
                INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'estacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_estacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'READY_TO_CREATE', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'estacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_audio_albums_estacao_id_fkey', 'READY_TO_CREATE', 'clube_audio_albums', 'estacao_id', 'clube_estacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_audio_progress_track_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_progress_track_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'EXISTS', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_progress') THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Table clube_audio_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_progress' AND column_name = 'track_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Column clube_audio_progress.track_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'MISSING_TARGET_TABLE', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Table clube_audio_tracks not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_audio_tracks' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Column clube_audio_tracks.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_progress' AND column_name = 'track_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'TYPE_MISMATCH', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_audio_tracks');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'READY_TO_CREATE', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Column clube_audio_tracks.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_progress' AND column_name = 'track_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'TYPE_MISMATCH', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_audio_tracks')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_audio_progress_track_id_fkey', 'READY_TO_CREATE', 'clube_audio_progress', 'track_id', 'clube_audio_tracks', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_audio_tracks_album_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_audio_tracks_album_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'EXISTS', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks') THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Table clube_audio_tracks not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'album_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Column clube_audio_tracks.album_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_audio_albums') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'MISSING_TARGET_TABLE', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Table clube_audio_albums not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_audio_albums' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Column clube_audio_albums.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'album_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'TYPE_MISMATCH', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_audio_albums');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'READY_TO_CREATE', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Column clube_audio_albums.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_tracks' AND column_name = 'album_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_audio_albums' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'TYPE_MISMATCH', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_audio_albums')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_audio_tracks_album_id_fkey', 'READY_TO_CREATE', 'clube_audio_tracks', 'album_id', 'clube_audio_albums', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_carrossel_slides_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_carrossel_slides_estacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'EXISTS', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides') THEN
        INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Table clube_carrossel_slides not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides' AND column_name = 'estacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Column clube_carrossel_slides.estacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Table oracular_seasons not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracular_seasons' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides' AND column_name = 'estacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'oracular_seasons');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'READY_TO_CREATE', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_carrossel_slides' AND column_name = 'estacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oracular_seasons')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_carrossel_slides_estacao_id_fkey', 'READY_TO_CREATE', 'clube_carrossel_slides', 'estacao_id', 'oracular_seasons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_engajamento_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_engajamento_estacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'EXISTS', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_engajamento') THEN
        INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_engajamento not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_engajamento' AND column_name = 'estacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_engajamento.estacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_estacoes not found');
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
                INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_engajamento' AND column_name = 'estacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_estacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'READY_TO_CREATE', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_engajamento' AND column_name = 'estacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_engajamento_estacao_id_fkey', 'READY_TO_CREATE', 'clube_engajamento', 'estacao_id', 'clube_estacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_estacao_registros_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacao_registros_estacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'EXISTS', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros') THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_estacao_registros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros' AND column_name = 'estacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacao_registros.estacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_estacoes not found');
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
                INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros' AND column_name = 'estacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_estacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'READY_TO_CREATE', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacao_registros' AND column_name = 'estacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_estacao_registros_estacao_id_fkey', 'READY_TO_CREATE', 'clube_estacao_registros', 'estacao_id', 'clube_estacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_estacoes_cartografia_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_cartografia_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'EXISTS', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Table clube_estacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'cartografia_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Column clube_estacoes.cartografia_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cartographies') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'MISSING_TARGET_TABLE', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Table cartographies not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'cartographies' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Column cartographies.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'cartografia_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'TYPE_MISMATCH', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'cartographies');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'READY_TO_CREATE', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Column cartographies.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'cartografia_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cartographies' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'TYPE_MISMATCH', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.cartographies')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_estacoes_cartografia_id_fkey', 'READY_TO_CREATE', 'clube_estacoes', 'cartografia_id', 'cartographies', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_estacoes_quiz_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_estacoes_quiz_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'EXISTS', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Table clube_estacoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'quiz_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Column clube_estacoes.quiz_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quizzes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'MISSING_TARGET_TABLE', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Table quizzes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'quizzes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Column quizzes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'quiz_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'TYPE_MISMATCH', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'quizzes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'READY_TO_CREATE', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Column quizzes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'quiz_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'quizzes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'TYPE_MISMATCH', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.quizzes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_estacoes_quiz_id_fkey', 'READY_TO_CREATE', 'clube_estacoes', 'quiz_id', 'quizzes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_jornadas_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_jornadas_estacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'EXISTS', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') THEN
        INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_jornadas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'estacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_jornadas.estacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_estacoes not found');
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
                INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'estacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_estacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'READY_TO_CREATE', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'estacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_jornadas_estacao_id_fkey', 'READY_TO_CREATE', 'clube_jornadas', 'estacao_id', 'clube_estacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_livro_aulas_porta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_aulas_porta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'EXISTS', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Table clube_livro_aulas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas' AND column_name = 'porta_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Column clube_livro_aulas.porta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_portas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'MISSING_TARGET_TABLE', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Table clube_livro_portas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_livro_portas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Column clube_livro_portas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas' AND column_name = 'porta_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'TYPE_MISMATCH', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_livro_portas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'READY_TO_CREATE', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_portas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Column clube_livro_portas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_aulas' AND column_name = 'porta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_portas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'TYPE_MISMATCH', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_livro_portas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_livro_aulas_porta_id_fkey', 'READY_TO_CREATE', 'clube_livro_aulas', 'porta_id', 'clube_livro_portas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_livro_chat_interactions_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_chat_interactions_book_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'EXISTS', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Table clube_livro_chat_interactions not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions' AND column_name = 'book_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Column clube_livro_chat_interactions.book_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'MISSING_TARGET_TABLE', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Table books not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'books' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions' AND column_name = 'book_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'TYPE_MISMATCH', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'books');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'READY_TO_CREATE', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_chat_interactions' AND column_name = 'book_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'TYPE_MISMATCH', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.books')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_livro_chat_interactions_book_id_fkey', 'READY_TO_CREATE', 'clube_livro_chat_interactions', 'book_id', 'books', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_livro_encontros_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_encontros_estacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'EXISTS', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_livro_encontros not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros' AND column_name = 'estacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_livro_encontros.estacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_estacoes not found');
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
                INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros' AND column_name = 'estacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_estacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'READY_TO_CREATE', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_encontros' AND column_name = 'estacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_livro_encontros_estacao_id_fkey', 'READY_TO_CREATE', 'clube_livro_encontros', 'estacao_id', 'clube_estacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_livro_respostas_pergunta_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_livro_respostas_pergunta_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'EXISTS', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Table clube_livro_respostas not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas' AND column_name = 'pergunta_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Column clube_livro_respostas.pergunta_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'MISSING_TARGET_TABLE', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Table clube_livro_perguntas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_livro_perguntas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Column clube_livro_perguntas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas' AND column_name = 'pergunta_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'TYPE_MISMATCH', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_livro_perguntas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'READY_TO_CREATE', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Column clube_livro_perguntas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_respostas' AND column_name = 'pergunta_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_livro_perguntas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'TYPE_MISMATCH', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_livro_perguntas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_livro_respostas_pergunta_id_fkey', 'READY_TO_CREATE', 'clube_livro_respostas', 'pergunta_id', 'clube_livro_perguntas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_obras_essencia_8020_book_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_obras_essencia_8020_book_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'EXISTS', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020') THEN
        INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Table clube_obras_essencia_8020 not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020' AND column_name = 'book_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Column clube_obras_essencia_8020.book_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'books') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'MISSING_TARGET_TABLE', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Table books not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'books' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020' AND column_name = 'book_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'TYPE_MISMATCH', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'books');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'READY_TO_CREATE', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Column books.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_obras_essencia_8020' AND column_name = 'book_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'TYPE_MISMATCH', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.books')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_obras_essencia_8020_book_id_fkey', 'READY_TO_CREATE', 'clube_obras_essencia_8020', 'book_id', 'books', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_portais_jornada_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portais_jornada_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'EXISTS', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Table clube_portais not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'jornada_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Column clube_portais.jornada_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_jornadas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'MISSING_TARGET_TABLE', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Table clube_jornadas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_jornadas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Column clube_jornadas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'jornada_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'TYPE_MISMATCH', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_jornadas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'READY_TO_CREATE', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Column clube_jornadas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'jornada_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_jornadas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'TYPE_MISMATCH', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_jornadas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_portais_jornada_id_fkey', 'READY_TO_CREATE', 'clube_portais', 'jornada_id', 'clube_jornadas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_portal_audios_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_audios_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'EXISTS', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_audios') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Table clube_portal_audios not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_audios' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Column clube_portal_audios.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'MISSING_TARGET_TABLE', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Table clube_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Column clube_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_audios' AND column_name = 'portal_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'TYPE_MISMATCH', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_portais');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'READY_TO_CREATE', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Column clube_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_audios' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'TYPE_MISMATCH', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_portal_audios_portal_id_fkey', 'READY_TO_CREATE', 'clube_portal_audios', 'portal_id', 'clube_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_portal_insights_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_insights_estacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'EXISTS', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_insights') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Table clube_portal_insights not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_insights' AND column_name = 'estacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Column clube_portal_insights.estacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'oracular_seasons') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Table oracular_seasons not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'oracular_seasons' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_insights' AND column_name = 'estacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'oracular_seasons');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'READY_TO_CREATE', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Column oracular_seasons.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_insights' AND column_name = 'estacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'oracular_seasons' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.oracular_seasons')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_portal_insights_estacao_id_fkey', 'READY_TO_CREATE', 'clube_portal_insights', 'estacao_id', 'oracular_seasons', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_portal_materiais_portal_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_portal_materiais_portal_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'EXISTS', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Table clube_portal_materiais not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais' AND column_name = 'portal_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Column clube_portal_materiais.portal_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_portais') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'MISSING_TARGET_TABLE', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Table clube_portais not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_portais' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Column clube_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais' AND column_name = 'portal_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'TYPE_MISMATCH', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_portais');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'READY_TO_CREATE', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Column clube_portais.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portal_materiais' AND column_name = 'portal_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_portais' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'TYPE_MISMATCH', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_portais')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_portal_materiais_portal_id_fkey', 'READY_TO_CREATE', 'clube_portal_materiais', 'portal_id', 'clube_portais', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_progresso_passos_passo_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_progresso_passos_passo_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'EXISTS', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos') THEN
        INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Table clube_progresso_passos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos' AND column_name = 'passo_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Column clube_progresso_passos.passo_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'MISSING_TARGET_TABLE', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Table clube_rota_itens not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_rota_itens' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Column clube_rota_itens.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos' AND column_name = 'passo_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'TYPE_MISMATCH', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_rota_itens');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'READY_TO_CREATE', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Column clube_rota_itens.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_progresso_passos' AND column_name = 'passo_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'TYPE_MISMATCH', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_rota_itens')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_progresso_passos_passo_id_fkey', 'READY_TO_CREATE', 'clube_progresso_passos', 'passo_id', 'clube_rota_itens', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_reflexoes_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_reflexoes_estacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'EXISTS', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_reflexoes') THEN
        INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_reflexoes not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_reflexoes' AND column_name = 'estacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_reflexoes.estacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_estacoes not found');
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
                INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_reflexoes' AND column_name = 'estacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_estacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'READY_TO_CREATE', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_reflexoes' AND column_name = 'estacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_reflexoes_estacao_id_fkey', 'READY_TO_CREATE', 'clube_reflexoes', 'estacao_id', 'clube_estacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_rota_itens_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_itens_estacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'EXISTS', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_rota_itens not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'estacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_rota_itens.estacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_estacoes not found');
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
                INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'estacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_estacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'READY_TO_CREATE', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'estacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_rota_itens_estacao_id_fkey', 'READY_TO_CREATE', 'clube_rota_itens', 'estacao_id', 'clube_estacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_rota_progresso_estacao_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_estacao_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'EXISTS', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_rota_progresso not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'estacao_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_rota_progresso.estacao_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_estacoes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'MISSING_TARGET_TABLE', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Table clube_estacoes not found');
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
                INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'estacao_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_estacoes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'READY_TO_CREATE', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Column clube_estacoes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'estacao_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_estacoes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'TYPE_MISMATCH', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_estacao_id_fkey', 'READY_TO_CREATE', 'clube_rota_progresso', 'estacao_id', 'clube_estacoes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_rota_progresso_rota_item_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_rota_progresso_rota_item_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'EXISTS', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso') THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Table clube_rota_progresso not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'rota_item_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Column clube_rota_progresso.rota_item_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_rota_itens') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'MISSING_TARGET_TABLE', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Table clube_rota_itens not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_rota_itens' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Column clube_rota_itens.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'rota_item_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'TYPE_MISMATCH', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_rota_itens');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'READY_TO_CREATE', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Column clube_rota_itens.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_progresso' AND column_name = 'rota_item_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_rota_itens' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'TYPE_MISMATCH', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_rota_itens')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_rota_progresso_rota_item_id_fkey', 'READY_TO_CREATE', 'clube_rota_progresso', 'rota_item_id', 'clube_rota_itens', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_v3_station_audios_station_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_audios_station_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'EXISTS', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Table clube_v3_station_audios not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios' AND column_name = 'station_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Column clube_v3_station_audios.station_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'MISSING_TARGET_TABLE', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Table clube_v3_stations not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_v3_stations' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Column clube_v3_stations.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios' AND column_name = 'station_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'TYPE_MISMATCH', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_v3_stations');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'READY_TO_CREATE', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Column clube_v3_stations.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_audios' AND column_name = 'station_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'TYPE_MISMATCH', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_v3_stations')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_v3_station_audios_station_id_fkey', 'READY_TO_CREATE', 'clube_v3_station_audios', 'station_id', 'clube_v3_stations', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_v3_station_content_station_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_station_content_station_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'EXISTS', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Table clube_v3_station_content not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content' AND column_name = 'station_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Column clube_v3_station_content.station_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'MISSING_TARGET_TABLE', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Table clube_v3_stations not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_v3_stations' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Column clube_v3_stations.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content' AND column_name = 'station_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'TYPE_MISMATCH', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_v3_stations');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'READY_TO_CREATE', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Column clube_v3_stations.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_station_content' AND column_name = 'station_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'TYPE_MISMATCH', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_v3_stations')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_v3_station_content_station_id_fkey', 'READY_TO_CREATE', 'clube_v3_station_content', 'station_id', 'clube_v3_stations', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_v3_stations_route_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_stations_route_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'EXISTS', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Table clube_v3_stations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'route_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Column clube_v3_stations.route_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_routes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'MISSING_TARGET_TABLE', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Table clube_v3_routes not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_v3_routes' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Column clube_v3_routes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'route_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'TYPE_MISMATCH', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_v3_routes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'READY_TO_CREATE', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_routes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Column clube_v3_routes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'route_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_routes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'TYPE_MISMATCH', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_v3_routes')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_v3_stations_route_id_fkey', 'READY_TO_CREATE', 'clube_v3_stations', 'route_id', 'clube_v3_routes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing clube_v3_user_progress_station_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'clube_v3_user_progress_station_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'EXISTS', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'MISSING_SOURCE_TABLE', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Table clube_v3_user_progress not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress' AND column_name = 'station_id') THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'MISSING_SOURCE_COLUMN', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Column clube_v3_user_progress.station_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clube_v3_stations') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'MISSING_TARGET_TABLE', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Table clube_v3_stations not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'clube_v3_stations' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Column clube_v3_stations.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress' AND column_name = 'station_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'TYPE_MISMATCH', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clube_v3_stations');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'READY_TO_CREATE', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'MISSING_TARGET_COLUMN', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Column clube_v3_stations.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_user_progress' AND column_name = 'station_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clube_v3_stations' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'TYPE_MISMATCH', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.clube_v3_stations')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'TARGET_NOT_UNIQUE', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('clube_v3_user_progress_station_id_fkey', 'READY_TO_CREATE', 'clube_v3_user_progress', 'station_id', 'clube_v3_stations', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_ai_recommendations_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'EXISTS', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Table co_ai_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Column co_ai_recommendations.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'TYPE_MISMATCH', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'READY_TO_CREATE', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'TYPE_MISMATCH', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_client_id_fkey', 'READY_TO_CREATE', 'co_ai_recommendations', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_ai_recommendations_tool_complementar_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_complementar_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'EXISTS', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'MISSING_SOURCE_TABLE', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Table co_ai_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_complementar_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Column co_ai_recommendations.tool_complementar_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'MISSING_TARGET_TABLE', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Table sala_ferramentas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sala_ferramentas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'MISSING_TARGET_COLUMN', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_complementar_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'TYPE_MISMATCH', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sala_ferramentas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'READY_TO_CREATE', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'MISSING_TARGET_COLUMN', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_complementar_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'TYPE_MISMATCH', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.sala_ferramentas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'TARGET_NOT_UNIQUE', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_complementar_id_fkey', 'READY_TO_CREATE', 'co_ai_recommendations', 'tool_complementar_id', 'sala_ferramentas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_ai_recommendations_tool_sugerida_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_ai_recommendations_tool_sugerida_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'EXISTS', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations') THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'MISSING_SOURCE_TABLE', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Table co_ai_recommendations not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_sugerida_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Column co_ai_recommendations.tool_sugerida_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'sala_ferramentas') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'MISSING_TARGET_TABLE', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Table sala_ferramentas not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'sala_ferramentas' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'MISSING_TARGET_COLUMN', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_sugerida_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'TYPE_MISMATCH', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'sala_ferramentas');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'READY_TO_CREATE', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'MISSING_TARGET_COLUMN', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Column sala_ferramentas.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_ai_recommendations' AND column_name = 'tool_sugerida_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sala_ferramentas' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'TYPE_MISMATCH', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.sala_ferramentas')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'TARGET_NOT_UNIQUE', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_ai_recommendations_tool_sugerida_id_fkey', 'READY_TO_CREATE', 'co_ai_recommendations', 'tool_sugerida_id', 'sala_ferramentas', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_appointments_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'EXISTS', 'co_appointments', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_appointments') THEN
        INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_appointments', 'client_id', 'clientes', 'id', 'Table co_appointments not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_appointments', 'client_id', 'clientes', 'id', 'Column co_appointments.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_appointments', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_appointments', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'TYPE_MISMATCH', 'co_appointments', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'READY_TO_CREATE', 'co_appointments', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_appointments', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'TYPE_MISMATCH', 'co_appointments', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_appointments', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_appointments_client_id_fkey', 'READY_TO_CREATE', 'co_appointments', 'client_id', 'clientes', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_appointments_workspace_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_appointments_workspace_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'EXISTS', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_appointments') THEN
        INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'MISSING_SOURCE_TABLE', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Table co_appointments not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'workspace_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Column co_appointments.workspace_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_workspaces') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'MISSING_TARGET_TABLE', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Table co_workspaces not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'co_workspaces' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'MISSING_TARGET_COLUMN', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Column co_workspaces.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'workspace_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'TYPE_MISMATCH', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'co_workspaces');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'READY_TO_CREATE', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'MISSING_TARGET_COLUMN', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Column co_workspaces.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_appointments' AND column_name = 'workspace_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_workspaces' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'TYPE_MISMATCH', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_workspaces')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'TARGET_NOT_UNIQUE', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_appointments_workspace_id_fkey', 'READY_TO_CREATE', 'co_appointments', 'workspace_id', 'co_workspaces', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_camara_sussurro_casos_proximo_treino_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_camara_sussurro_casos_proximo_treino_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'EXISTS', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos') THEN
        INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'MISSING_SOURCE_TABLE', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Table co_camara_sussurro_casos not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'proximo_treino_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Column co_camara_sussurro_casos.proximo_treino_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'MISSING_TARGET_TABLE', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Table co_camara_sussurro_casos not found');
    ELSE
        IF 'public' = 'auth' THEN
            -- Simplified check for auth schema columns
            v_target_type := 'uuid'; 
            v_is_unique := TRUE;
            
            IF NOT EXISTS (
                SELECT 1 FROM pg_attribute a 
                JOIN pg_class c ON a.attrelid = c.oid 
                JOIN pg_namespace n ON c.relnamespace = n.oid 
                WHERE n.nspname = 'auth' AND c.relname = 'co_camara_sussurro_casos' AND a.attname = 'id'
            ) THEN
                INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'MISSING_TARGET_COLUMN', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Column co_camara_sussurro_casos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'proximo_treino_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'TYPE_MISMATCH', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'co_camara_sussurro_casos');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'READY_TO_CREATE', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'MISSING_TARGET_COLUMN', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Column co_camara_sussurro_casos.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'proximo_treino_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_camara_sussurro_casos' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'TYPE_MISMATCH', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
                ELSE
                    -- Check for uniqueness on target column
                    SELECT EXISTS (
                        SELECT 1 
                        FROM pg_index i
                        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
                        WHERE i.indrelid = ('public.co_camara_sussurro_casos')::regclass
                        AND a.attname = 'id'
                        AND i.indisunique
                    ) INTO v_is_unique;
                    
                    IF NOT v_is_unique THEN
                        INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'TARGET_NOT_UNIQUE', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_camara_sussurro_casos_proximo_treino_id_fkey', 'READY_TO_CREATE', 'co_camara_sussurro_casos', 'proximo_treino_id', 'co_camara_sussurro_casos', 'id', 'Ready to create');
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- Analyzing co_city_history_client_id_fkey
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'co_city_history_client_id_fkey') THEN
        INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'EXISTS', 'co_city_history', 'client_id', 'clientes', 'id', 'Constraint already exists');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'co_city_history') THEN
        INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'MISSING_SOURCE_TABLE', 'co_city_history', 'client_id', 'clientes', 'id', 'Table co_city_history not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'client_id') THEN
        INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'MISSING_SOURCE_COLUMN', 'co_city_history', 'client_id', 'clientes', 'id', 'Column co_city_history.client_id not found');
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') 
          AND NOT ('public' = 'auth' AND EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')) THEN
        INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'MISSING_TARGET_TABLE', 'co_city_history', 'client_id', 'clientes', 'id', 'Table clientes not found');
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
                INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_city_history', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'client_id';
                IF v_source_type NOT IN ('uuid', 'text', 'character varying') THEN
                     INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'TYPE_MISMATCH', 'co_city_history', 'client_id', 'clientes', 'id', 'Source type ' || v_source_type || ' might not match auth.' || 'clientes');
                ELSE
                     INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'READY_TO_CREATE', 'co_city_history', 'client_id', 'clientes', 'id', 'Ready (to auth schema)');
                END IF;
            END IF;
        ELSE
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id') THEN
                 INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'MISSING_TARGET_COLUMN', 'co_city_history', 'client_id', 'clientes', 'id', 'Column clientes.id not found');
            ELSE
                SELECT data_type INTO v_source_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'co_city_history' AND column_name = 'client_id';
                SELECT data_type INTO v_target_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'clientes' AND column_name = 'id';
                
                IF v_source_type <> v_target_type THEN
                    INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'TYPE_MISMATCH', 'co_city_history', 'client_id', 'clientes', 'id', 'Type mismatch: ' || v_source_type || ' vs ' || v_target_type);
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
                        INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'TARGET_NOT_UNIQUE', 'co_city_history', 'client_id', 'clientes', 'id', 'Target column is not unique');
                    ELSE
                        INSERT INTO diagnostic_results VALUES ('co_city_history_client_id_fkey', 'READY_TO_CREATE', 'co_city_history', 'client_id', 'clientes', 'id', 'Ready to create');
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
